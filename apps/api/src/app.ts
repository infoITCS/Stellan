import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { validateLeadPayload } from "./lead-validation.ts";
import type { LeadNotifier } from "./lead-notifier.ts";
import type { LeadStore } from "./leads.ts";

export type AppOptions = {
  readonly leadStore?: LeadStore;
  readonly notifier?: LeadNotifier;
};

type ErrorResponse = {
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly fields?: Record<string, string>;
  };
};

function errorResponse(code: string, message: string, fields?: Record<string, string>): ErrorResponse {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(fields === undefined ? {} : { fields }),
    },
  };
}

function isClientPayloadError(error: unknown): boolean {
  return error instanceof SyntaxError && typeof error === "object" && error !== null && "body" in error;
}

function getErrorStatus(error: unknown): number {
  if (typeof error !== "object" || error === null || !("status" in error)) return 500;
  const status = error.status;
  return typeof status === "number" && status >= 400 && status <= 499 ? status : 500;
}

export function createApp(options: AppOptions = {}): Express {
  const app = express();

  app.disable("x-powered-by");

  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Content-Security-Policy", "default-src 'none'");
    response.setHeader("X-DNS-Prefetch-Control", "off");
    next();
  });

  app.use(express.json({ limit: "100kb" }));

  app.get("/api/v1/health", (_request: Request, response: Response) => {
    const ready = options.leadStore !== undefined;
    response.status(ready ? 200 : 503).json({
      status: ready ? "ok" : "degraded",
      store: options.leadStore?.description ?? "unavailable",
      notifications: options.notifier?.description ?? "unavailable",
    });
  });

  app.post("/api/v1/leads", async (request: Request, response: Response) => {
    response.setHeader("Cache-Control", "no-store");

    if (!request.is("application/json")) {
      response.status(415).json(errorResponse("CONTENT_TYPE_REQUIRED", "Send the request as JSON."));
      return;
    }

    const validation = validateLeadPayload(request.body as unknown);
    if (!validation.ok) {
      response.status(400).json(errorResponse("VALIDATION_ERROR", "Review the submitted fields.", validation.errors));
      return;
    }

    if (validation.isBot) {
      response.status(202).json({ ok: true });
      return;
    }

    if (options.leadStore === undefined) {
      response.status(503).json(errorResponse("LEAD_SERVICE_UNAVAILABLE", "Lead delivery is not configured."));
      return;
    }

    let leadId: string;
    try {
      leadId = await options.leadStore.save(validation.value);
    } catch {
      response.status(503).json(errorResponse("LEAD_SERVICE_UNAVAILABLE", "Lead delivery is temporarily unavailable."));
      return;
    }

    if (options.notifier !== undefined) {
      try {
        const notification = await options.notifier.notify(validation.value);
        options.leadStore.markNotified?.(leadId, notification.delivered ? "email-sent" : "email-pending");
        if (notification.reason !== undefined) {
          response.setHeader("X-Lead-Notification", "recorded");
        }
      } catch {
        response.setHeader("X-Lead-Notification", "failed");
        options.leadStore.markNotified?.(leadId, "notification-failed");
      }
    } else {
      options.leadStore.markNotified?.(leadId, "no-notifier");
    }

    response.status(201).json({ ok: true });
  });

  app.use((_request: Request, response: Response) => {
    response.status(404).json(errorResponse("NOT_FOUND", "Route not found."));
  });

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    const status = isClientPayloadError(error) ? 400 : getErrorStatus(error);
    if (status >= 500) {
      response.status(status).json(errorResponse("INTERNAL_ERROR", "The request could not be processed."));
      return;
    }

    response.status(status).json(errorResponse("INVALID_REQUEST", "The request could not be parsed."));
  });

  return app;
}

export const app = createApp();
