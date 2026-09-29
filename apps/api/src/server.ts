import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.ts";
import { loadEnv } from "./config/env.ts";
import { outboxFileName, createLeadNotifier } from "./lead-notifier.ts";
import { connectLeadStore, createFileLeadStore, type LeadStore } from "./leads.ts";
import { createSqliteLeadStore } from "./sqlite-lead-store.ts";

const entrypoint = process.argv[1];
const isMain = entrypoint !== undefined && fileURLToPath(import.meta.url) === resolve(entrypoint);

async function start(): Promise<void> {
  const env = loadEnv();
  const dataDir = resolve(env.LEADS_DATA_DIR);

  const sqlitePath = join(dataDir, "leads.db");
  const primary = createSqliteLeadStore(sqlitePath);
  const mirrors: LeadStore[] = [];

  if (env.MONGODB_URI !== undefined) {
    try {
      mirrors.push(await connectLeadStore(env.MONGODB_URI, env.MONGODB_DB, env.LEADS_COLLECTION));
    } catch {
      console.error("MongoDB mirror unavailable; submissions will still be stored in the local database.");
    }
  }

  mirrors.push(createFileLeadStore(dataDir));

  const leadStore: LeadStore = {
    description: `${primary.description}${mirrors.length > 0 ? ` + ${mirrors.length} mirror(s)` : ""}`,
    async save(lead) {
      const id = primary.save(lead);
      for (const mirror of mirrors) {
        try {
          await mirror.save(lead);
        } catch (error) {
          console.error(`Lead mirror write failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      return id;
    },
    markNotified(leadId, outcome) {
      primary.markNotified?.(leadId, outcome);
    },
    async close() {
      primary.close();
      for (const mirror of mirrors) {
        try {
          await mirror.close();
        } catch {
          console.error("Lead mirror close failed during shutdown.");
        }
      }
    },
  };

  const notifier = createLeadNotifier({
    recipient: env.LEADS_NOTIFY_EMAIL,
    outboxPath: join(dataDir, outboxFileName),
    ...(env.SMTP === undefined ? {} : { smtp: env.SMTP }),
    onError: (error) => {
      console.error(`Lead notification failed: ${error instanceof Error ? error.message : String(error)}`);
    },
  });

  const application = createApp({ leadStore, notifier });
  const server = application.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
    console.log(`Leads stored in ${leadStore.description}`);
    for (const mirror of mirrors) console.log(`  mirror: ${mirror.description}`);
    console.log(`Lead notifications: ${notifier.description}`);
    console.log(`Notify address: ${env.LEADS_NOTIFY_EMAIL}`);
  });

  let shuttingDown = false;

  const shutdown = (signal: NodeJS.Signals): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    server.close(async (error) => {
      if (error) {
        console.error(`Server shutdown failed after ${signal}`);
        process.exitCode = 1;
      }

      try {
        await leadStore.close();
        await notifier.close();
      } catch {
        console.error(`Shutdown cleanup failed after ${signal}`);
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

if (isMain) {
  void start().catch(() => {
    console.error("API startup failed.");
    process.exitCode = 1;
  });
}
