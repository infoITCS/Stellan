import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { LeadInput, LeadRecord, LeadStore } from "./leads.ts";

const insertStatement = `INSERT INTO leads (id, name, email, company, phone, service, message, consent, source, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export function createSqliteLeadStore(filePath: string): LeadStore {
  mkdirSync(dirname(filePath), { recursive: true });

  const database = new DatabaseSync(filePath);
  database.exec("PRAGMA journal_mode = WAL");
  database.exec(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    consent INTEGER NOT NULL,
    source TEXT NOT NULL,
    created_at TEXT NOT NULL,
    notification TEXT
  )`);
  database.exec("CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at DESC)");

  const insert = database.prepare(insertStatement);
  const markNotified = database.prepare("UPDATE leads SET notification = ? WHERE id = ?");

  return {
    description: `sqlite ${filePath}`,

    async save(lead): Promise<string> {
      const record: LeadRecord = {
        ...lead,
        id: `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        source: "contact-form",
      };

      insert.run(
        record.id,
        record.name,
        record.email,
        record.company,
        record.phone ?? null,
        record.service,
        record.message,
        1,
        record.source,
        record.createdAt,
      );

      return record.id;
    },

    markNotified(id: string, outcome: string): void {
      markNotified.run(outcome, id);
    },

    async close(): Promise<void> {
      database.close();
    },
  };
}

export type StoredLeadRow = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly phone: string | null;
  readonly service: string;
  readonly message: string;
  readonly consent: number;
  readonly source: string;
  readonly created_at: string;
  readonly notification: string | null;
};

export function readSqliteLeads(filePath: string, limit: number): StoredLeadRow[] {
  const database = new DatabaseSync(filePath, { readOnly: true });
  try {
    return database.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT ?").all(limit) as unknown as StoredLeadRow[];
  } finally {
    database.close();
  }
}

export function sqliteLeadCount(filePath: string): number {
  const database = new DatabaseSync(filePath, { readOnly: true });
  try {
    const row = database.prepare("SELECT COUNT(*) AS total FROM leads").get() as unknown as { total: number };
    return row.total;
  } finally {
    database.close();
  }
}

export type { LeadInput, LeadRecord };
