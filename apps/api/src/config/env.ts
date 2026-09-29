import { fileURLToPath } from "node:url";

export type SmtpConfig = {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly user: string;
  readonly pass: string;
  readonly from: string;
};

export type Env = {
  readonly PORT: number;
  readonly MONGODB_URI?: string;
  readonly MONGODB_DB: string;
  readonly LEADS_COLLECTION: string;
  readonly LEADS_NOTIFY_EMAIL: string;
  readonly LEADS_DATA_DIR: string;
  readonly SMTP?: SmtpConfig;
};

export const defaultNotifyEmail = "zulqarnainhafeez6590@gmail.com";

const defaultDataDir = fileURLToPath(new URL("../../data", import.meta.url));

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parsePort = (value: string | undefined, fallback: number): number => {
  const normalizedValue = value?.trim();

  if (normalizedValue === undefined || normalizedValue === "") {
    return fallback;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    throw new Error("PORT must be a valid integer");
  }

  const port = Number(normalizedValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be between 1 and 65535");
  }

  return port;
};

const parseSmtpPort = (value: string | undefined): number => {
  const normalizedValue = value?.trim() || "587";

  if (!/^\d+$/.test(normalizedValue)) {
    throw new Error("SMTP_PORT must be a valid integer");
  }

  return Number(normalizedValue);
};

const parseEmail = (value: string | undefined, fallback: string, label: string): string => {
  const normalizedValue = value?.trim() || fallback;

  if (!emailPattern.test(normalizedValue)) {
    throw new Error(`${label} must be a valid email address`);
  }

  return normalizedValue;
};

export const loadEnv = (source: NodeJS.ProcessEnv = process.env): Env => {
  const PORT = parsePort(source.PORT, 4000);
  const MONGODB_URI = source.MONGODB_URI?.trim();
  const MONGODB_DB = source.MONGODB_DB?.trim() || "stellan";
  const LEADS_COLLECTION = source.LEADS_COLLECTION?.trim() || "leads";
  const LEADS_NOTIFY_EMAIL = parseEmail(source.LEADS_NOTIFY_EMAIL, defaultNotifyEmail, "LEADS_NOTIFY_EMAIL");
  const LEADS_DATA_DIR = source.LEADS_DATA_DIR?.trim() || defaultDataDir;

  const smtpHost = source.SMTP_HOST?.trim();
  const smtpUser = source.SMTP_USER?.trim();
  const smtpPass = source.SMTP_PASS?.trim();

  const base = { PORT, MONGODB_DB, LEADS_COLLECTION, LEADS_NOTIFY_EMAIL, LEADS_DATA_DIR };
  const withUri = MONGODB_URI === undefined || MONGODB_URI === "" ? base : { ...base, MONGODB_URI };

  if (smtpHost === undefined || smtpHost === "" || smtpUser === undefined || smtpUser === "" || smtpPass === undefined || smtpPass === "") {
    return withUri;
  }

  return {
    ...withUri,
    SMTP: {
      host: smtpHost,
      port: parseSmtpPort(source.SMTP_PORT),
      secure: source.SMTP_SECURE?.trim() === "true",
      user: smtpUser,
      pass: smtpPass,
      from: parseEmail(source.SMTP_FROM, smtpUser, "SMTP_FROM"),
    },
  };
};
