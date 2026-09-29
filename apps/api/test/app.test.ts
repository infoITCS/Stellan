import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, test } from "node:test";
import { createApp, type AppOptions } from "../src/app.ts";
import { defaultNotifyEmail, loadEnv } from "../src/config/env.ts";
import { buildLeadMail, createLeadNotifier, type OutgoingMail } from "../src/lead-notifier.ts";
import { createFileLeadStore, type LeadInput, type LeadStore } from "../src/leads.ts";
import { createSqliteLeadStore, readSqliteLeads, sqliteLeadCount } from "../src/sqlite-lead-store.ts";

const validPayload = {
  name: "Jordan Lee",
  email: "Jordan@Example.com",
  company: "Example Systems",
  phone: "+1 555 555 0100",
  service: "managed-it",
  message: "We need help making our managed IT environment easier to operate.",
  consent: true,
  website: "",
};

const storedLeads: LeadInput[] = [];
const fakeStore: LeadStore = {
  description: "in-memory",
  async save(lead) {
    storedLeads.push(lead);
    return `test_${storedLeads.length}`;
  },
  async close() {},
};

const notified: { leadId: string; outcome: string }[] = [];
const trackingStore: LeadStore = {
  description: "tracking",
  async save(lead) {
    storedLeads.push(lead);
    return `tracked_${storedLeads.length}`;
  },
  markNotified(leadId, outcome) {
    notified.push({ leadId, outcome });
  },
  async close() {},
};

let running: { server: Server; baseUrl: string };

async function startServer(options: AppOptions = {}): Promise<{ server: Server; baseUrl: string }> {
  const activeServer = createApp(options).listen(0, "127.0.0.1");

  await new Promise<void>((resolve, reject) => {
    activeServer.once("error", reject);
    activeServer.once("listening", () => {
      activeServer.off("error", reject);
      resolve();
    });
  });

  const address = activeServer.address();
  if (address === null || typeof address === "string") {
    throw new Error("Test server did not bind to a TCP port");
  }

  return { server: activeServer, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function stopServer(active: { server: Server }): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    active.server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function postLead(baseUrl: string, payload: unknown, contentType = "application/json"): Promise<Response> {
  return fetch(`${baseUrl}/api/v1/leads`, {
    method: "POST",
    headers: { "Content-Type": contentType, Accept: "application/json" },
    body: JSON.stringify(payload),
  });
}

before(async () => {
  running = await startServer({ leadStore: fakeStore });
});

beforeEach(() => {
  storedLeads.length = 0;
  notified.length = 0;
});

after(async () => {
  await stopServer(running);
});

test("environment configuration supplies safe lead defaults", () => {
  const defaults = loadEnv({ PORT: "4000" });

  assert.equal(defaults.PORT, 4000);
  assert.equal(defaults.MONGODB_DB, "stellan");
  assert.equal(defaults.LEADS_COLLECTION, "leads");
  assert.equal(defaults.LEADS_NOTIFY_EMAIL, defaultNotifyEmail);
  assert.equal(defaults.MONGODB_URI, undefined);
  assert.equal(defaults.SMTP, undefined);
  assert.equal(defaults.LEADS_DATA_DIR.length > 0, true);

  const withUri = loadEnv({ PORT: "4000", MONGODB_URI: " mongodb://127.0.0.1:27017/stellan " });

  assert.equal(withUri.MONGODB_URI, "mongodb://127.0.0.1:27017/stellan");
  assert.equal(withUri.LEADS_NOTIFY_EMAIL, defaultNotifyEmail);
});

test("environment configuration reads the notification address and smtp credentials", () => {
  const configured = loadEnv({
    PORT: "4000",
    LEADS_NOTIFY_EMAIL: "leads@example.com",
    SMTP_HOST: "smtp.example.com",
    SMTP_USER: "mailer@example.com",
    SMTP_PASS: "secret",
  });

  assert.equal(configured.LEADS_NOTIFY_EMAIL, "leads@example.com");
  assert.deepEqual(configured.SMTP, {
    host: "smtp.example.com",
    port: 587,
    secure: false,
    user: "mailer@example.com",
    pass: "secret",
    from: "mailer@example.com",
  });

  assert.throws(() => loadEnv({ PORT: "4000", LEADS_NOTIFY_EMAIL: "not-an-email" }));
  assert.throws(() => loadEnv({ PORT: "not-a-port" }));
  assert.equal(loadEnv({}).PORT, 4000);
});

test("lead mail is addressed to the notify address and carries every field", () => {
  const mail = buildLeadMail(
    {
      name: "Jordan Lee",
      email: "jordan@example.com",
      company: "Example Systems",
      service: "managed-it",
      message: "We need help operating our environment.",
      consent: true,
    },
    defaultNotifyEmail,
    "mailer@example.com",
    new Date("2026-01-02T03:04:05.000Z"),
  );

  assert.equal(mail.to, defaultNotifyEmail);
  assert.equal(mail.from, "mailer@example.com");
  assert.match(mail.subject, /Jordan Lee/);
  assert.match(mail.subject, /Example Systems/);
  assert.match(mail.subject, /Managed IT/);
  assert.match(mail.text, /jordan@example\.com/);
  assert.match(mail.text, /Phone:\s+Not provided/);
  assert.match(mail.text, /We need help operating our environment\./);
});

test("lead mail subject cannot be broken by header injection", () => {
  const mail = buildLeadMail(
    {
      name: "Attacker\r\nBcc: victim@example.com",
      email: "attacker@example.com",
      company: "Example",
      service: "it-consulting",
      message: "Hello there, this is a message body.",
      consent: true,
    },
    defaultNotifyEmail,
    "mailer@example.com",
    new Date("2026-01-02T03:04:05.000Z"),
  );

  assert.equal(mail.subject.includes("\n"), false);
  assert.equal(mail.subject.includes("\r"), false);
});

test("notifier records every enquiry and sends when delivery is available", async () => {
  const outboxPath = join(tmpdir(), `stellan-outbox-${Date.now()}.jsonl`);
  const sent: OutgoingMail[] = [];
  const notifier = createLeadNotifier({
    recipient: defaultNotifyEmail,
    outboxPath,
    deliver: async (mail) => {
      sent.push(mail);
    },
  });

  const result = await notifier.notify({
    name: "Jordan Lee",
    email: "jordan@example.com",
    company: "Example Systems",
    service: "cybersecurity",
    message: "We are reviewing our security posture this quarter.",
    consent: true,
  });

  assert.equal(result.delivered, true);
  assert.equal(result.recorded, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0]?.to, defaultNotifyEmail);

  const lines = (await readFile(outboxPath, "utf8")).trim().split("\n");
  assert.equal(lines.length, 1);
  assert.match(lines[0] ?? "", /Example Systems/);
});

test("notifier still records the enquiry when email delivery fails", async () => {
  const outboxPath = join(tmpdir(), `stellan-outbox-fail-${Date.now()}.jsonl`);
  const errors: unknown[] = [];
  const notifier = createLeadNotifier({
    recipient: defaultNotifyEmail,
    outboxPath,
    deliver: async () => {
      throw new Error("smtp unreachable");
    },
    onError: (error) => errors.push(error),
  });

  const result = await notifier.notify({
    name: "Jordan Lee",
    email: "jordan@example.com",
    company: "Example Systems",
    service: "cybersecurity",
    message: "We are reviewing our security posture this quarter.",
    consent: true,
  });

  assert.equal(result.delivered, false);
  assert.equal(result.recorded, true);
  assert.equal(errors.length, 1);
  assert.equal((await readFile(outboxPath, "utf8")).trim().split("\n").length, 1);
});

test("file lead store appends a durable record", async () => {
  const directory = join(tmpdir(), `stellan-leads-${Date.now()}`);
  const store = createFileLeadStore(directory);

  const id = await store.save({
    name: "Jordan Lee",
    email: "jordan@example.com",
    company: "Example Systems",
    service: "ai-engineering",
    message: "We want to understand where AI can help us.",
    consent: true,
  });
  await store.close();

  const lines = (await readFile(join(directory, "leads.jsonl"), "utf8")).trim().split("\n");
  const record = JSON.parse(lines[0] ?? "{}") as { id?: string; email?: string; createdAt?: string; source?: string };

  assert.equal(lines.length, 1);
  assert.equal(record.id, id);
  assert.equal(record.email, "jordan@example.com");
  assert.equal(record.source, "contact-form");
  assert.equal(typeof record.createdAt, "string");
});

test("sqlite lead store persists a queryable row without any service", async () => {
  const databasePath = join(tmpdir(), `stellan-${Date.now()}`, "leads.db");
  const store = createSqliteLeadStore(databasePath);

  const id = await store.save({
    name: "Jordan Lee",
    email: "jordan@example.com",
    company: "Example Systems",
    phone: "+1 555 555 0100",
    service: "cloud-services",
    message: "We want to understand where AI can help us.",
    consent: true,
  });
  store.markNotified?.(id, "email-sent");
  await store.close();

  assert.equal(sqliteLeadCount(databasePath), 1);

  const rows = readSqliteLeads(databasePath, 10);

  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.id, id);
  assert.equal(rows[0]?.email, "jordan@example.com");
  assert.equal(rows[0]?.phone, "+1 555 555 0100");
  assert.equal(rows[0]?.service, "cloud-services");
  assert.equal(rows[0]?.notification, "email-sent");
});

test("lead endpoint records email delivery status on the stored lead", async () => {
  const tracked = await startServer({
    leadStore: trackingStore,
    notifier: createLeadNotifier({
      recipient: defaultNotifyEmail,
      outboxPath: join(tmpdir(), `stellan-track-${Date.now()}.jsonl`),
      deliver: async () => {},
    }),
  });

  try {
    const response = await postLead(tracked.baseUrl, validPayload);

    assert.equal(response.status, 201);
    assert.equal(notified.length, 1);
    assert.equal(notified[0]?.leadId, "tracked_1");
    assert.equal(notified[0]?.outcome, "email-sent");
  } finally {
    await stopServer(tracked);
  }
});

test("lead endpoint records pending delivery when smtp is not configured", async () => {
  const tracked = await startServer({
    leadStore: trackingStore,
    notifier: createLeadNotifier({
      recipient: defaultNotifyEmail,
      outboxPath: join(tmpdir(), `stellan-pending-${Date.now()}.jsonl`),
    }),
  });

  try {
    const response = await postLead(tracked.baseUrl, validPayload);

    assert.equal(response.status, 201);
    assert.equal(notified[0]?.outcome, "email-pending");
    assert.equal(response.headers.get("x-lead-notification"), "recorded");
  } finally {
    await stopServer(tracked);
  }
});

test("lead endpoint notifies the notifier after storing", async () => {
  const outboxPath = join(tmpdir(), `stellan-endpoint-outbox-${Date.now()}.jsonl`);
  const sent: OutgoingMail[] = [];
  const notified = await startServer({
    leadStore: fakeStore,
    notifier: createLeadNotifier({
      recipient: defaultNotifyEmail,
      outboxPath,
      deliver: async (mail) => {
        sent.push(mail);
      },
    }),
  });

  try {
    const response = await postLead(notified.baseUrl, validPayload);

    assert.equal(response.status, 201);
    assert.equal(storedLeads.length, 1);
    assert.equal(sent.length, 1);
    assert.equal(sent[0]?.to, defaultNotifyEmail);
    assert.equal(response.headers.get("x-lead-notification"), null);
  } finally {
    await stopServer(notified);
  }
});

test("lead endpoint still confirms the enquiry when notification fails", async () => {
  const failing = await startServer({
    leadStore: fakeStore,
    notifier: createLeadNotifier({
      recipient: defaultNotifyEmail,
      outboxPath: join(tmpdir(), `stellan-missing-${Date.now()}.jsonl`),
      deliver: async () => {
        throw new Error("smtp unreachable");
      },
    }),
  });

  try {
    const response = await postLead(failing.baseUrl, validPayload);

    assert.equal(response.status, 201);
    assert.equal(storedLeads.length, 1);
    assert.equal(response.headers.get("x-lead-notification"), "recorded");
  } finally {
    await stopServer(failing);
  }
});

test("health endpoint returns a non-sensitive response", async () => {
  const response = await fetch(`${running.baseUrl}/api/v1/health`);
  const body = await response.json() as { status?: string; store?: string; notifications?: string };

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.store, "in-memory");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("health endpoint reports degraded when no lead store is configured", async () => {
  const degraded = await startServer();

  try {
    const response = await fetch(`${degraded.baseUrl}/api/v1/health`);
    const body = await response.json() as { status?: string; store?: string };

    assert.equal(response.status, 503);
    assert.equal(body.status, "degraded");
    assert.equal(body.store, "unavailable");
  } finally {
    await stopServer(degraded);
  }
});

test("lead endpoint rejects invalid submissions", async () => {
  const response = await postLead(running.baseUrl, {
    name: "",
    email: "not-an-email",
    message: "Too short",
    consent: false,
  });
  const body = await response.json() as { error?: { code?: string; fields?: Record<string, string> } };

  assert.equal(response.status, 400);
  assert.equal(body.error?.code, "VALIDATION_ERROR");
  assert.equal(body.error?.fields?.name, "This field is required.");
  assert.equal(body.error?.fields?.email, "Enter a valid email address.");
  assert.equal(storedLeads.length, 0);
});

test("lead endpoint silently accepts honeypot submissions", async () => {
  const response = await postLead(running.baseUrl, { ...validPayload, website: "https://bot.invalid" });
  const body = await response.json() as { ok?: boolean };

  assert.equal(response.status, 202);
  assert.deepEqual(body, { ok: true });
  assert.equal(storedLeads.length, 0);
});

test("lead endpoint persists a valid submission", async () => {
  const response = await postLead(running.baseUrl, validPayload);
  const body = await response.json() as { ok?: boolean };

  assert.equal(response.status, 201);
  assert.deepEqual(body, { ok: true });
  assert.equal(storedLeads.length, 1);
  assert.equal(storedLeads[0]?.email, "jordan@example.com");
  assert.equal(storedLeads[0]?.service, "managed-it");
  assert.equal(storedLeads[0]?.consent, true);
});

test("lead endpoint reports unavailable persistence", async () => {
  const unavailable = await startServer();

  try {
    const response = await postLead(unavailable.baseUrl, validPayload);
    const body = await response.json() as { error?: { code?: string } };

    assert.equal(response.status, 503);
    assert.equal(body.error?.code, "LEAD_SERVICE_UNAVAILABLE");
  } finally {
    await stopServer(unavailable);
  }
});

test("lead endpoint requires JSON", async () => {
  const response = await postLead(running.baseUrl, validPayload, "text/plain");
  const body = await response.json() as { error?: { code?: string } };

  assert.equal(response.status, 415);
  assert.equal(body.error?.code, "CONTENT_TYPE_REQUIRED");
  assert.equal(storedLeads.length, 0);
});

test("malformed JSON returns a JSON error", async () => {
  const response = await fetch(`${running.baseUrl}/api/v1/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  const body = await response.json() as { error?: { code?: string } };

  assert.equal(response.status, 400);
  assert.equal(body.error?.code, "INVALID_REQUEST");
});

test("unknown API routes return JSON", async () => {
  const response = await fetch(`${running.baseUrl}/api/v1/unknown`);
  const body = await response.json() as { error?: { code?: string } };

  assert.equal(response.status, 404);
  assert.equal(body.error?.code, "NOT_FOUND");
});
