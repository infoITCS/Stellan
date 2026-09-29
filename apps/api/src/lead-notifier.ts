import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import nodemailer from "nodemailer";
import type { SmtpConfig } from "./config/env.ts";
import { serviceLabel, type LeadInput } from "./leads.ts";

export type OutgoingMail = {
  readonly to: string;
  readonly from: string;
  readonly subject: string;
  readonly text: string;
};

export type LeadDelivery = (mail: OutgoingMail) => Promise<unknown>;

export type NotificationResult = {
  readonly delivered: boolean;
  readonly recorded: boolean;
  readonly reason?: string;
};

export type LeadNotifier = {
  notify(lead: LeadInput): Promise<NotificationResult>;
  close(): Promise<void>;
  readonly description: string;
};

export const outboxFileName = "lead-notifications.jsonl";

const headerSafe = (value: string): string => value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 120);

export function buildLeadMail(lead: LeadInput, recipient: string, from: string, receivedAt: Date): OutgoingMail {
  const service = serviceLabel(lead.service);
  const subject = `New enquiry: ${headerSafe(lead.name)} — ${headerSafe(lead.company)} (${service})`;

  const lines = [
    "A new enquiry arrived through the stellansolutions.com contact form.",
    "",
    `Name:      ${lead.name}`,
    `Email:     ${lead.email}`,
    `Company:   ${lead.company}`,
    `Phone:     ${lead.phone && lead.phone.length > 0 ? lead.phone : "Not provided"}`,
    `Service:   ${service}`,
    `Received:  ${receivedAt.toISOString()}`,
    "",
    "Message",
    "-------",
    lead.message,
    "",
    "Consent was confirmed on the form. Reply directly to this address to answer the enquiry.",
  ];

  return { to: recipient, from, subject, text: lines.join("\n") };
}

export function createSmtpDelivery(smtp: SmtpConfig): LeadDelivery {
  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  return async (mail) => transport.sendMail(mail);
}

export function createLeadNotifier(options: {
  readonly recipient: string;
  readonly outboxPath: string;
  readonly smtp?: SmtpConfig;
  readonly deliver?: LeadDelivery;
  readonly onError?: (error: unknown) => void;
}): LeadNotifier {
  const delivery = options.deliver ?? (options.smtp === undefined ? undefined : createSmtpDelivery(options.smtp));
  const from = options.smtp?.from ?? options.recipient;

  return {
    description: delivery === undefined ? `outbox only (${options.outboxPath})` : `smtp to ${options.recipient}`,

    async notify(lead) {
      const receivedAt = new Date();
      const mail = buildLeadMail(lead, options.recipient, from, receivedAt);

      let recorded = false;
      try {
        await mkdir(dirname(options.outboxPath), { recursive: true });
        await appendFile(
          options.outboxPath,
          `${JSON.stringify({ ...mail, receivedAt: receivedAt.toISOString(), delivered: false })}\n`,
          "utf8",
        );
        recorded = true;
      } catch (error) {
        options.onError?.(error);
        return { delivered: false, recorded: false, reason: "The enquiry was saved but the notification log could not be written." };
      }

      if (delivery === undefined) {
        return { delivered: false, recorded: true, reason: "Email delivery is not configured. The enquiry is saved and recorded in the outbox." };
      }

      try {
        await delivery(mail);
        return { delivered: true, recorded: true };
      } catch (error) {
        options.onError?.(error);
        return { delivered: false, recorded: true, reason: "The enquiry was saved but the notification email could not be sent." };
      }
    },

    async close() {
      if (delivery === undefined) return;
      const transport = (delivery as { transport?: { close?: () => void } }).transport;
      transport?.close?.();
    },
  };
}
