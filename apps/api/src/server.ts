import express, { type Express } from "express";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.ts";
import { loadEnv, type Env } from "./config/env.ts";
import { outboxFileName, createLeadNotifier, type LeadNotifier } from "./lead-notifier.ts";
import { connectLeadStore, createFileLeadStore, type LeadStore } from "./leads.ts";
import { createSqliteLeadStore } from "./sqlite-lead-store.ts";

const entrypoint = process.argv[1];
const isMain = entrypoint !== undefined && fileURLToPath(import.meta.url) === resolve(entrypoint);
const isVercel = process.env.VERCEL === "1";

type Bootstrapped = {
  readonly app: Express;
  readonly leadStore: LeadStore;
  readonly notifier: LeadNotifier;
  readonly env: Env;
  readonly mirrors: readonly LeadStore[];
};

function resolveDataDir(env: Env): string {
  if (isVercel) {
    return resolve("/tmp/stellan-leads");
  }
  return resolve(env.LEADS_DATA_DIR);
}

async function createPrimaryStore(env: Env, dataDir: string): Promise<{ primary: LeadStore; mirrors: LeadStore[] }> {
  const mirrors: LeadStore[] = [];

  if (env.MONGODB_URI !== undefined) {
    try {
      const mongo = await connectLeadStore(env.MONGODB_URI, env.MONGODB_DB, env.LEADS_COLLECTION);
      if (isVercel) {
        mirrors.push(createFileLeadStore(dataDir));
        return { primary: mongo, mirrors };
      }
      mirrors.push(mongo);
    } catch {
      if (isVercel) {
        throw new Error("MongoDB is required on Vercel but could not be reached. Set MONGODB_URI in the project environment.");
      }
      console.error("MongoDB mirror unavailable; submissions will still be stored in the local database.");
    }
  }

  if (isVercel) {
    throw new Error("Set MONGODB_URI in the Vercel project environment. SQLite cannot persist on Vercel.");
  }

  const primary = createSqliteLeadStore(join(dataDir, "leads.db"));
  mirrors.push(createFileLeadStore(dataDir));
  return { primary, mirrors };
}

function wrapLeadStore(primary: LeadStore, mirrors: readonly LeadStore[]): LeadStore {
  return {
    description: `${primary.description}${mirrors.length > 0 ? ` + ${mirrors.length} mirror(s)` : ""}`,
    async save(lead) {
      const id = await primary.save(lead);
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
      await primary.close();
      for (const mirror of mirrors) {
        try {
          await mirror.close();
        } catch {
          console.error("Lead mirror close failed during shutdown.");
        }
      }
    },
  };
}

async function bootstrap(): Promise<Bootstrapped> {
  const env = loadEnv();
  const dataDir = resolveDataDir(env);
  const { primary, mirrors } = await createPrimaryStore(env, dataDir);
  const leadStore = wrapLeadStore(primary, mirrors);

  const notifier = createLeadNotifier({
    recipient: env.LEADS_NOTIFY_EMAIL,
    outboxPath: join(dataDir, outboxFileName),
    ...(env.SMTP === undefined ? {} : { smtp: env.SMTP }),
    onError: (error) => {
      console.error(`Lead notification failed: ${error instanceof Error ? error.message : String(error)}`);
    },
  });

  return {
    app: createApp({ leadStore, notifier }),
    leadStore,
    notifier,
    env,
    mirrors,
  };
}

let bootstrapping: Promise<Bootstrapped> | undefined;

function resolveBootstrap(): Promise<Bootstrapped> {
  bootstrapping ??= bootstrap().catch((error) => {
    bootstrapping = undefined;
    throw error;
  });
  return bootstrapping;
}

const gateway = express();
gateway.disable("x-powered-by");
gateway.use((request, response, next) => {
  void resolveBootstrap()
    .then(({ app }) => app(request, response, next))
    .catch(next);
});

export default gateway;

async function listenLocally(): Promise<void> {
  const { app, leadStore, notifier, env, mirrors } = await resolveBootstrap();
  const server = app.listen(env.PORT, () => {
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
  void listenLocally().catch(() => {
    console.error("API startup failed.");
    process.exitCode = 1;
  });
}
