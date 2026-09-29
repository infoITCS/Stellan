import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { MongoClient } from "mongodb";
import { loadEnv } from "../config/env.ts";
import { outboxFileName } from "../lead-notifier.ts";
import { serviceLabel, type LeadRecord } from "../leads.ts";
import { readSqliteLeads, type StoredLeadRow } from "../sqlite-lead-store.ts";

const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
const limit = Number(limitArgument?.slice("--limit=".length) ?? "20");
const maxRows = Number.isInteger(limit) && limit > 0 ? limit : 20;

const readJsonLines = async (path: string): Promise<LeadRecord[]> => {
  try {
    const contents = await readFile(path, "utf8");
    return contents
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as LeadRecord)
      .reverse();
  } catch {
    return [];
  }
};

const readMongoLeads = async (uri: string, databaseName: string, collectionName: string): Promise<LeadRecord[]> => {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const documents = await client
      .db(databaseName)
      .collection(collectionName)
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(maxRows)
      .toArray();
    return documents.map((document) => ({
      ...(document as unknown as LeadRecord),
      id: String((document as { _id?: unknown })._id ?? ""),
      createdAt: new Date((document as { createdAt?: Date }).createdAt ?? Date.now()).toISOString(),
    }));
  } finally {
    await client.close();
  }
};

type Row = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly phone: string | null;
  readonly service: string;
  readonly message: string;
  readonly received: string;
  readonly notification: string;
};

const printRows = (rows: readonly Row[], source: string): void => {
  console.log(`\n${source} — ${rows.length} entr${rows.length === 1 ? "y" : "ies"}`);
  if (rows.length === 0) {
    console.log("  (empty)");
    return;
  }

  for (const [index, lead] of rows.entries()) {
    console.log(`\n  ${index + 1}. ${lead.name} <${lead.email}>`);
    console.log(`     Company:  ${lead.company}`);
    console.log(`     Service:  ${serviceLabel(lead.service)}`);
    console.log(`     Phone:    ${lead.phone && lead.phone.length > 0 ? lead.phone : "—"}`);
    console.log(`     Received: ${lead.received}`);
    console.log(`     Email:    ${lead.notification}`);
    console.log(`     Message:  ${lead.message.replace(/\s+/g, " ").slice(0, 220)}`);
  }
};

const fromSqlite = (rows: readonly StoredLeadRow[]): Row[] =>
  rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone,
    service: row.service,
    message: row.message,
    received: row.created_at,
    notification: row.notification ?? "pending",
  }));

const fromRecords = (rows: readonly LeadRecord[]): Row[] =>
  rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone ?? null,
    service: row.service,
    message: row.message,
    received: row.createdAt,
    notification: "mirror",
  }));

const main = async (): Promise<void> => {
  const env = loadEnv();
  const dataDir = resolve(env.LEADS_DATA_DIR);

  console.log(`Stellan leads — most recent ${maxRows}`);
  console.log(`Notify email: ${env.LEADS_NOTIFY_EMAIL}`);
  console.log(`SMTP: ${env.SMTP === undefined ? "NOT CONFIGURED (entries are stored, email is queued)" : `${env.SMTP.host}:${env.SMTP.port} as ${env.SMTP.user}`}`);

  printRows(fromSqlite(readSqliteLeads(join(dataDir, "leads.db"), maxRows)), "Local database (SQLite)");

  if (env.MONGODB_URI !== undefined) {
    try {
      printRows(fromRecords(await readMongoLeads(env.MONGODB_URI, env.MONGODB_DB, env.LEADS_COLLECTION)), `MongoDB mirror ${env.MONGODB_DB}.${env.LEADS_COLLECTION}`);
    } catch (error) {
      console.log(`\nMongoDB mirror unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const outbox = await readJsonLines(join(dataDir, outboxFileName));
  console.log(`\nNotification outbox — ${outbox.length} record(s) at ${join(dataDir, outboxFileName)}`);
};

await main();
