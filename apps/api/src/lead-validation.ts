import { supportedServiceSlugs, type LeadInput } from "./leads.ts";

export type LeadFieldErrors = Partial<Record<"name" | "email" | "company" | "phone" | "service" | "message" | "consent" | "website", string>>;

export type LeadValidationResult =
  | { ok: true; isBot: true }
  | { ok: true; isBot: false; value: LeadInput }
  | { ok: false; errors: LeadFieldErrors };

type UnknownRecord = Record<string, unknown>;

const serviceSet = new Set<string>(supportedServiceSlugs);
const unsafeControlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: UnknownRecord, field: string): string | null | undefined {
  const value = record[field];
  if (value === undefined) return undefined;
  return typeof value === "string" ? value.trim() : null;
}

function hasUnsafeCharacters(value: string): boolean {
  return unsafeControlCharacters.test(value);
}

function checkText(
  value: string | null | undefined,
  field: keyof LeadFieldErrors,
  errors: LeadFieldErrors,
  options: { required: boolean; min?: number; max: number },
): void {
  if (value === null) {
    errors[field] = "Invalid request payload.";
    return;
  }

  if (value === undefined || value === "") {
    if (options.required) errors[field] = "This field is required.";
    return;
  }

  if (hasUnsafeCharacters(value)) {
    errors[field] = "This field contains unsupported characters.";
    return;
  }

  if (options.min !== undefined && value.length < options.min) {
    errors[field] = `Use at least ${options.min} characters.`;
    return;
  }

  if (value.length > options.max) {
    errors[field] = `Use no more than ${options.max} characters.`;
  }
}

export function validateLeadPayload(payload: unknown): LeadValidationResult {
  if (!isRecord(payload)) {
    return { ok: false, errors: { website: "Invalid request payload." } };
  }

  const errors: LeadFieldErrors = {};
  const website = readString(payload, "website");
  if (payload.website !== undefined && website === undefined) {
    errors.website = "Invalid request payload.";
  } else if (website !== undefined) {
    checkText(website, "website", errors, { required: false, max: 200 });
  }

  if (errors.website === undefined && website) {
    return { ok: true, isBot: true };
  }

  const name = readString(payload, "name");
  const email = readString(payload, "email");
  const company = readString(payload, "company");
  const phone = readString(payload, "phone");
  const service = readString(payload, "service");
  const message = readString(payload, "message");

  checkText(name, "name", errors, { required: true, min: 2, max: 100 });
  checkText(company, "company", errors, { required: true, max: 160 });
  checkText(phone, "phone", errors, { required: false, max: 40 });
  checkText(service, "service", errors, { required: true, max: 80 });
  checkText(message, "message", errors, { required: true, min: 20, max: 5000 });

  if (email === undefined || email === "") {
    errors.email = "This field is required.";
  } else if (email === null) {
    errors.email = "Invalid request payload.";
  } else if (hasUnsafeCharacters(email) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (service !== undefined && service !== null && service !== "" && !serviceSet.has(service)) {
    errors.service = "Choose a supported service area.";
  }

  if (payload.consent !== true) {
    errors.consent = "Consent is required before submitting.";
  }

  if (Object.keys(errors).length > 0 || name === undefined || name === null || email === undefined || email === null || company === undefined || company === null || service === undefined || service === null || message === undefined || message === null) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    isBot: false,
    value: {
      name,
      email: email.toLowerCase(),
      company,
      ...(phone ? { phone } : {}),
      service,
      message,
      consent: true,
    },
  };
}
