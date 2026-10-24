# Stellan Solutions

Marketing site and lead-capture API for **Stellan Solutions** (https://stellansolutions.com), a cybersecurity-first technology practice based in Ashburn, Virginia. Founded by **Umair Mazhar** (Founder & Principal Consultant). Delivers eight connected service areas with a focus on risk reduction and measurable outcomes.

The project is an npm workspaces monorepo with two apps: a statically generated React site and an Express API that validates, stores, and emails contact-form submissions.

---

## Table of contents

- [What this is](#what-this-is)
- [Stack](#stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [npm scripts](#npm-scripts)
- [Environment variables](#environment-variables)
- [The lead pipeline](#the-lead-pipeline)
- [API reference](#api-reference)
- [Lead storage](#lead-storage)
- [Email notifications](#email-notifications)
- [Routes and content](#routes-and-content)
- [Static generation and SEO](#static-generation-and-seo)
- [Testing](#testing)
- [Linting rules](#linting-rules)
- [Production build](#production-build)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)

---

## What this is

**Stellan Solutions** is a remote technology practice. This repository holds its public website and the small backend that powers the contact form.

The site is fully static — every route is pre-rendered to HTML at build time and can be hosted on any static host. The only dynamic part is the contact form, which posts to a separate API that:

1. Validates the submission
2. Stores it in a local database
3. Emails a notification to the business inbox

Everything runs with zero external services by default. The database is embedded (SQLite, via Node's built-in `node:sqlite`), and email is optional — without SMTP credentials, submissions are still stored and queued.

### Service areas

| # | Service | Slug | Description |
|---|---------|------|-------------|
| 01 | Cybersecurity | `cybersecurity` | Cybersecurity and risk advisory for mid-sized organizations: assessments, prioritized roadmaps, compliance readiness, and fractional CISO support. |
| 02 | IT consulting | `it-consulting` | Strategy and architecture guidance for leaders who need a useful sequence of technology decisions, not a shelf of predictions. |
| 03 | Cloud services | `cloud-services` | Architecture, migration, and optimization work for teams that need a cloud foundation they can change with confidence. |
| 04 | Managed IT | `managed-it` | A practical support layer for teams that need reliable technology without carrying every operational detail in-house. |
| 05 | Network infrastructure | `network-infrastructure` | Network planning, refresh, and documentation for distributed teams that need connectivity to remain understandable and resilient. |
| 06 | Enterprise automation | `enterprise-automation` | Microsoft 365 and Power Platform work that makes recurring processes easier to run, review, and change. |
| 07 | AI engineering | `ai-engineering` | Governed enterprise AI systems with clear data boundaries, evaluation, human review, and an operating plan after launch. |
| 08 | Web development | `web-development` | Secure, accessible web products and integrations built around a clear user need, a maintainable stack, and a responsible launch. |

---

## Stack

### `apps/web`

| Package | Version |
|---------|---------|
| react / react-dom | `^19.1.0` |
| vite | `^7.0.0` |
| @vitejs/plugin-react | `^5.0.0` |
| typescript | `^5.8.3` |
| @fontsource/poppins, @fontsource-variable/outfit | `^5.3.0` |

No router library, no CSS framework, no component library, no analytics, no external asset requests. Routing is hand-rolled in `src/routes.ts`; all styling is one hand-written `src/styles.css`.

### `apps/api`

| Package | Version |
|---------|---------|
| express | `^5.2.1` |
| mongodb | `^7.6.0` |
| nodemailer | `^10.0.12` |
| typescript | `^5.9.3` |

Node's built-in `node:sqlite` provides the primary database — no native modules to compile, no database server to run.

### Requirements

- **Node.js 24+** (the API uses `node:sqlite`; the root declares `>=22`)
- **npm 10+**

---

## Quick start

```bash
git clone https://github.com/infoITCS/Stellan.git
cd Stellan
npm install
```

### 1. Configure the environment

Copy the example file and edit it:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The defaults are already correct for local development, so the site and form both work without any edits.

### 2. Start the API and the site together

```bash
npm run dev
```

This is the command you want. It starts both workspaces with prefixed logs:

```
[api] API listening on port 4000
[api] Leads stored in sqlite ...\apps\api\data\leads.db + 2 mirror(s)
[api] Lead notifications: outbox only (...)
[web] Local: http://localhost:5173/
```

Open **http://localhost:5173**.

> **Do not use `npm run dev:web` alone.** The contact form posts to `/api/v1/leads`, which the Vite dev server proxies to the API. If the API is not running, the proxy returns a `500` and the form appears broken. `npm run dev` exists so this cannot happen by accident.

### 3. Verify the API is reachable

```bash
curl http://127.0.0.1:4000/api/v1/health
```

```json
{
  "status": "ok",
  "store": "sqlite E:\\Stellan\\apps\\api\\data\\leads.db + 2 mirror(s)",
  "notifications": "outbox only (E:\\Stellan\\apps\\api\\data\\lead-notifications.jsonl)"
}
```

`status` is `degraded` with HTTP `503` if no lead store could be opened.

### 4. Check everything still passes

```bash
npm run verify
```

---

## Project structure

```
Stellan/
├── package.json              # root workspace manifest
├── package-lock.json
├── tsconfig.base.json        # shared strict TypeScript config
├── .editorconfig
├── .env.example              # single source of truth for env vars
├── scripts/
│   └── dev.mjs               # runs API + web together with prefixed logs
├── apps/
│   ├── web/                  # @stellan/web — the public site
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── public/           # favicon, OG cover, webmanifest, 8 service SVGs
│   │   ├── scripts/
│   │   │   ├── generate.mjs  # static generation + HTML validation
│   │   │   └── lint.mjs      # custom project linter
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── content.ts    # all service copy, FAQs, page content
│   │   │   ├── entry-server.tsx
│   │   │   ├── head.ts       # <head> / meta / JSON-LD renderer
│   │   │   ├── main.tsx
│   │   │   ├── routes.ts     # hand-rolled router + per-route metadata
│   │   │   ├── site.ts       # site config, URL helpers
│   │   │   ├── styles.css    # the entire design system
│   │   │   ├── components/   # Brand, Footer, Header, Icon, Shared
│   │   │   └── pages/        # Home, Services, Service, About, Contact, Privacy, 404
│   │   └── tests/
│   │       └── routes.test.ts
│   └── api/                  # @stellan/api — the contact form backend
│       ├── src/
│       │   ├── app.ts        # Express app factory, routes, security headers
│       │   ├── server.ts     # bootstrap, store wiring, graceful shutdown
│       │   ├── lead-validation.ts
│       │   ├── lead-notifier.ts
│       │   ├── leads.ts      # LeadStore types, Mongo + JSONL stores
│       │   ├── sqlite-lead-store.ts
│       │   ├── cli/
│       │   │   ├── list-leads.ts   # `npm run leads`
│       │   │   └── test-email.ts   # `npm run email:test`
│       │   └── config/
│       │       └── env.ts
│       ├── test/
│       │   └── app.test.ts
│       └── data/             # local database (gitignored)
└── dist/                     # build output (gitignored)
```

---

## npm scripts

Run from the repository root.

| Script | Command | What it does |
|--------|---------|--------------|
| `npm run dev` | `node scripts/dev.mjs` | **Start API + web together.** The normal dev command. |
| `npm run dev:web` | workspace `@stellan/web` | Vite dev server only. The form will fail without the API. |
| `npm run dev:api` | workspace `@stellan/api` | API only, with `--watch`. |
| `npm run leads` | workspace `@stellan/api` | Print recent leads from the database. Add `--limit=50` to change the count. |
| `npm run email:test` | workspace `@stellan/api` | Send a test email to verify SMTP delivery. |
| `npm run build` | all workspaces | Type-check and build both apps. |
| `npm run lint` | all workspaces | Custom linter (web) and `tsc --noEmit` (api). |
| `npm run typecheck` | all workspaces | `tsc --noEmit`. |
| `npm run test` | all workspaces | Node's built-in test runner. |
| `npm run verify` | all of the above | **Run this before every push.** |

---

## Environment variables

All environment variables live in a single `.env` file at the repository root. Both apps read it — the API via Node's `--env-file-if-exists=../../.env` flag, the web app via Vite's `envDir`.

`apps/api/.env.example` and `apps/web/.env.example` exist for reference.

### Server-only (never reaches the browser)

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `PORT` | no | `4000` | API listen port. Must be 1–65535. |
| `MONGODB_URI` | no | *(unset)* | When set, a MongoDB mirror store is opened. Failure logs a warning and does **not** stop the API. |
| `MONGODB_DB` | no | `stellan` | |
| `LEADS_COLLECTION` | no | `leads` | |
| `LEADS_NOTIFY_EMAIL` | no | `zulqarnainhafeez6590@gmail.com` | Where notifications are sent. Must be a valid address. |
| `LEADS_DATA_DIR` | no | `apps/api/data` | Where the database, mirrors, and outbox live. |
| `SMTP_HOST` | no | *(unset)* | All-or-nothing with `SMTP_USER` and `SMTP_PASS`. |
| `SMTP_PORT` | no | `587` | |
| `SMTP_SECURE` | no | `false` | Set to `true` for implicit TLS (port 465). |
| `SMTP_USER` | no | *(unset)* | |
| `SMTP_PASS` | no | *(unset)* | Use a Gmail **app password**, not the account password. |
| `SMTP_FROM` | no | `SMTP_USER` | Envelope sender. |

### Exposed to the browser

Vite's `envPrefix` is `['VITE_', 'SITE_', 'WEB_']`, so anything with these prefixes is inlined into the client bundle. Never put a secret in a variable with one of these prefixes.

| Variable | Default | Notes |
|----------|---------|-------|
| `VITE_SITE_URL` | `https://stellansolutions.com` | Canonical site origin. Resolved first. |
| `SITE_URL` | `http://localhost:5173` | Second in the origin chain. |
| `WEB_ORIGIN` | `http://localhost:5173` | Third in the origin chain. |
| `VITE_LEADS_ENDPOINT` | `/api/v1/leads` | Path the form posts to. Absolute cross-origin URLs fall back to the default in the browser. |
| `VITE_BOOKING_URL` | `/contact#contact-form` | Booking/scheduling link (external Cal.com/Calendly supported). |

### Build-time only (Node, not bundled)

| Variable | Default | Notes |
|----------|---------|-------|
| `API_ORIGIN` | `http://127.0.0.1:4000` | Dev/preview proxy target for `/api`. |
| `VERCEL` | *(unset)* | Truthy forces the production site origin. |
| `NODE_ENV` | *(unset)* | `production` forces the production site origin. |

The site origin resolves as:

```
VITE_SITE_URL || SITE_URL || WEB_ORIGIN || 'https://stellansolutions.com'
```

`npm run build` uses only `VITE_SITE_URL` (falling back to the production domain), so a local `SITE_URL=http://localhost:5173` in `.env` cannot leak localhost canonicals or an empty sitemap into the build. Sitemap and `robots.txt` are populated only when the resolved origin is `https` and not a local host.

---

## The lead pipeline

```
Browser
  │  POST /api/v1/leads   (application/json, same-origin via Vite proxy)
  ▼
Express
  1. Content-Type must be application/json        → 415
  2. Honeypot empty?                              → 202, silently discarded
  3. Validate every field                         → 400 with per-field messages
  4. Store to SQLite (primary) + mirrors          → 503 if the primary fails
  5. Write the notification to the outbox
  6. Send email if SMTP is configured
  7. Record the delivery outcome on the lead row
  ▼
201 { "ok": true }
```

**The form never fails because email failed.** Steps 5–7 happen after the lead is committed. If SMTP is down or unconfigured, the lead is still stored and marked `email-pending` so it can be sent later.

### Submission fields

| Field | Required | Rules |
|-------|----------|-------|
| `name` | yes | 2–100 characters, trimmed, no control characters |
| `email` | yes | Valid address, max 254 characters, lower-cased before storage |
| `company` | yes | Max 160 characters |
| `phone` | no | Max 40 characters. Omitted entirely when empty. |
| `service` | yes | Must be one of the 8 service slugs |
| `message` | yes | 20–5000 characters |
| `consent` | yes | Must be exactly `true` |
| `website` | no | Honeypot. Any value discards the submission silently. |

Server-side field errors are returned as `error.fields` and rendered next to the matching input, with `aria-invalid` set and focus moved to the first field with a problem.

---

## API reference

Base path: `/api/v1`

### `GET /health`

Reports readiness. Used to confirm the form backend is alive.

```json
{ "status": "ok", "store": "sqlite ...", "notifications": "smtp to you@example.com" }
```

| Status | When |
|--------|------|
| `200` | A lead store is open |
| `503` | `status: "degraded"` — no lead store |

### `POST /leads`

Requires `Content-Type: application/json`. Responds with `Cache-Control: no-store`.

| Status | `error.code` | Meaning |
|--------|--------------|---------|
| `201` | — | Stored. Body: `{ "ok": true }` |
| `202` | — | Honeypot tripped. Discarded, body `{ "ok": true }` |
| `400` | `VALIDATION_ERROR` | Field problems; see `error.fields` |
| `400` | `INVALID_REQUEST` | Body was not parseable JSON |
| `415` | `CONTENT_TYPE_REQUIRED` | Not sent as JSON |
| `503` | `LEAD_SERVICE_UNAVAILABLE` | Store not configured, or the write failed |

Error shape:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Review the submitted fields.",
    "fields": { "name": "Use at least 2 characters." }
  }
}
```

On `201`, the response may carry a diagnostic header:

| `X-Lead-Notification` | Meaning |
|------------------------|---------|
| *(absent)* | Email was sent |
| `recorded` | Stored and logged, but not emailed |
| `failed` | Stored, but the notifier threw |

### Anything else

`404` with `error.code: "NOT_FOUND"`.

---

## Lead storage

The API writes to a **primary store** and any number of **mirrors**. A mirror failure is logged and never fails the request.

| Store | File / target | Role |
|-------|---------------|------|
| SQLite | `${LEADS_DATA_DIR}/leads.db` | **Primary.** Always available, no server needed. |
| MongoDB | `MONGODB_URI` | Optional mirror, only when configured. |
| JSONL | `${LEADS_DATA_DIR}/leads.jsonl` | Always-on mirror. Append-only, easy to read. |

The SQLite schema:

```sql
CREATE TABLE leads (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT NOT NULL,
  phone        TEXT,
  service      TEXT NOT NULL,
  message      TEXT NOT NULL,
  consent      INTEGER NOT NULL,
  source       TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  notification TEXT
);
```

`notification` records the delivery outcome: `email-sent`, `email-pending`, `notification-failed`, or `no-notifier`.

### Viewing leads

```bash
npm run leads
```

```
Stellan leads — most recent 20
Notify email: you@example.com
SMTP: NOT CONFIGURED (entries are stored, email is queued)

Local database (SQLite) — 1 entry

  1. Jane Doe <jane@example.com>
     Company:  Example Systems
     Service:  Managed IT
     Phone:    +1 555 555 0100
     Received: 2026-01-02T03:04:05.562Z
     Email:    email-pending
     Message:  We need help making our managed IT environment easier to operate.
```

```bash
npm run leads -- --limit=100
```

---

## Email notifications

Every submission produces a notification record at `${LEADS_DATA_DIR}/lead-notifications.jsonl`, whether or not SMTP is configured. With SMTP configured, an actual email is sent to `LEADS_NOTIFY_EMAIL`.

The email subject is `New enquiry: <name> — <company> (<service>)`, with the full message body and a reply hint. The subject is sanitized against header injection.

### Enabling SMTP with Gmail

1. Turn on **2-Step Verification** for the Google account
2. Go to Google Account → Security → **App passwords**
3. Choose "Mail" and generate the 16-character password
4. Add to `.env`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=that-16-character-password
SMTP_FROM=you@gmail.com
```

5. Test it:

```bash
npm run email:test
```

```
SMTP host:     smtp.gmail.com
SMTP user:     you@gmail.com
Notify address: you@gmail.com

Delivery succeeded: you@gmail.com
```

`SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are all-or-nothing. If any one is missing, the API runs in outbox-only mode and logs `Lead notifications: outbox only`.

The app password is stored in `.env`, which is gitignored. Never commit it.

---

## Routes and content

Fourteen static routes (including terms):

| Path | Page |
|------|------|
| `/` | Home |
| `/services` | Services index |
| `/services/cybersecurity` | Cybersecurity |
| `/services/it-consulting` | IT consulting |
| `/services/cloud-services` | Cloud services |
| `/services/managed-it` | Managed IT |
| `/services/network-infrastructure` | Network infrastructure |
| `/services/enterprise-automation` | Enterprise automation |
| `/services/ai-engineering` | AI engineering |
| `/services/web-development` | Web development |
| `/about` | About |
| `/contact` | Contact |
| `/privacy` | Privacy |
| `/terms` | Terms |

Plus `/404` written to `404.html`.

All service copy lives in `apps/web/src/content.ts`. Each service carries an overview, capabilities, outcomes, a four-step process, FAQs, related services, and tags. The route table lives in `apps/web/src/routes.ts`.

---

## Static generation and SEO

`apps/web/scripts/generate.mjs` pre-renders every route to static HTML. It runs as the final step of `npm run build` and **fails the build** if anything below is wrong.

Per-page HTML validation:

- Exactly one `<h1>`
- A non-empty `<title>`
- A non-empty `<meta name="description">`
- A non-empty `<link rel="canonical">` whose path matches the route
- At least one `<script type="application/ld+json">`
- No placeholder text (`lorem`, `placeholder`, `TODO`, `TBD`)
- No internal link pointing at an ungenerated path

Pre-flight checks:

- The Vite template and client manifest exist
- Every asset referenced by the manifest exists on disk
- The SSR bundle loads and exports `render`, `getStaticRoutePaths`, and `isIndexableSiteUrl`

Output:

```
dist/web/index.html
dist/web/about/index.html
dist/web/contact/index.html
dist/web/privacy/index.html
dist/web/services/index.html
dist/web/services/<slug>/index.html   (8)
dist/web/404.html
dist/web/sitemap.xml
dist/web/robots.txt
```

Structured data per page: `WebPage` everywhere, `BreadcrumbList` everywhere, `CollectionPage` on `/services`, `FAQPage` on `/services` and `/contact`, `Service` + `FAQPage` on each service page, and `WebSite` + `Organization` on the home page.

`noindex` is forced when the resolved origin is not a public `https` address.

---

## Testing

Node's built-in test runner. No Jest, no Vitest, no Mocha.

```bash
npm test
```

**23 tests, 2 files.**

### `apps/api/test/app.test.ts` — 21 tests

Real HTTP integration tests against a server bound to port `0`. They cover environment parsing, payload validation, honeypot handling, the SQLite and JSONL stores, the notifier (success, failure, and outbox-only), notification status recording, the security headers, and every error status code. They also assert that an email subject cannot be broken by header injection.

### `apps/web/tests/routes.test.ts` — 2 tests

Asserts the service catalogue is unique and structurally complete (per-service capability counts, exactly four outcomes, four process steps, at least four FAQs, three related services with no self-reference), and that route resolution, canonical URLs, `noindex` behaviour, JSON-LD types, and the leads endpoint all behave correctly.

---

## Linting rules

`apps/web` uses a purpose-built linter (`apps/web/scripts/lint.mjs`) instead of ESLint. It enforces three rules across `src`, `scripts`, `tests`, `index.html`, and `vite.config.ts`:

1. **No comments.** A line starting with `//` or `/*` fails. The code is expected to explain itself through naming and structure.
2. **Forbidden dependencies.** `react-router`, `@reach/router`, `next/router`, `lucide-react`, `@heroicons`, `framer-motion`, `bootstrap`, `tailwindcss`, `styled-components`, `react-helmet`, `next-seo`, and `analytics`.
3. **No external asset requests.** Fonts, images, and scripts must be self-hosted.

The API's `lint` and `typecheck` are both `tsc --noEmit`.

---

## Production build

```bash
npm run build
```

- Client bundle → `dist/web`
- SSR bundle → `dist/server`
- Static HTML → `dist/web/**/index.html`

Deploy `dist/web` to any static host. The API is a separate Node process and must be reachable wherever the browser is running.

Set `VITE_SITE_URL` to the real origin before building so canonical URLs, the sitemap, and `robots.txt` are correct.

---

## Security notes

- `.env`, `.env.*`, and `apps/api/data/` are gitignored. Only `.env.example` is committed.
- The SMTP password is a Google app password, revocable without touching the account password.
- The API sends security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy`, `Strict-Transport-Security` on HTTPS, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, etc. via `vercel.json` for static hosting; API also sets headers).
- The JSON body limit is 100 KB.
- `consent` must be exactly `true`; it is stored as a boolean.
- A honeypot field silently discards bot submissions with a `202`.
- The subject line is sanitized so user input cannot inject SMTP headers.
- Email addresses are lower-cased before storage.
- There is no CORS middleware. The endpoint is same-origin only, proxied in development. Do not add permissive CORS headers without a reason.
- There is no authentication on the API. It only accepts writes to one public endpoint. Do not expose the leads database or CLI over a network.
- A `security.txt` is published at `/.well-known/security.txt` (expires 2027-12-31). SPF/DKIM/DMARC should be configured for `stellansolutions.com` in production.

---

## Troubleshooting

**The form shows a 500 error.**
The API is not running. `npm run dev:web` alone is not enough — the form needs `npm run dev`. Confirm with `curl http://127.0.0.1:4000/api/v1/health`.

**`npm run dev` says "Port 5173 is in use".**
A previous Vite process is still running. Stop it, or accept the next free port — but note that `SITE_URL` and `WEB_ORIGIN` should then match the new port.

**`npm run email:test` says "No SMTP credentials found".**
Expected until `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are all set. The form still works; notifications are recorded to the outbox only.

**Leads are stored but no email arrives.**
Check `npm run leads`. An `email-pending` value means SMTP is not configured. Also check the spam folder, and confirm `LEADS_NOTIFY_EMAIL` is the address you are checking.

**`SQLite is an experimental feature` warning.**
Expected on Node 24. It is suppressed by the `--disable-warning=ExperimentalWarning` flag already present in the npm scripts. If you run the source directly, add the flag yourself.

**MongoDB is not running.**
Nothing breaks. The API logs `MongoDB mirror unavailable; submissions will still be stored in the local database.` and continues with SQLite and the JSONL mirror.

**`Generation failed: ... rendered 0 H1 elements`**
A page lost its `<h1>`. The generator refuses to ship it.

---

## License

All rights reserved.

The Stellan name, brand, and site content are the property of Stellan Solutions.
