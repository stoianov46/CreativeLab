# Documentation Index

Start here. Everything below is a link, not a duplicate — if you're
updating something, update it in one place.

## Project

- [Proposals](./Proposals.md) — links to every proposal/brief and its status
- [../README.md](../README.md) — how to run the project locally and in production
- [Translations (i18n)](./i18n.md) — where RU/TH/HE text lives, how to edit it, `npm run i18n:*` commands
- [../NOTES.md](../NOTES.md) — short list of everything still pending human review
- [../PROGRESS.md](../PROGRESS.md) — build progress against the current proposal, phase by phase, plus an "Open Questions & Blockers" section for everything that needs a person (client answer, teammate decision, external credentials), not more code

## Setup, configuration & environment

**Rule:** any change to a file below, or to the env vars a setup needs,
must update this section *and* [README.md](../README.md) in the same
change (see [AGENTS.md](../AGENTS.md)).

- [../README.md](../README.md) — requirements (Node 20.9+), run locally, build, deploy (Node host only — **no** `output: "export"` / GitHub Pages; the GitHub Pages workflow was removed from `main` on 2026-09-22)
- [../SECURITY.md](../SECURITY.md) — secrets policy: env vars only, never in `src/` or `NEXT_PUBLIC_*`; what to do if a token leaks
- [../bots/README.md](../bots/README.md) — Telegram/WhatsApp bots: their own setup and env (`bots/.env.example`)

| File | What it controls |
|---|---|
| `next.config.ts` | Next.js config — `allowedDevOrigins` (LAN testing), `experimental.globalNotFound` (localized 404 in `src/app/global-not-found.tsx`), AVIF/WebP images, security headers; must stay without static export |
| `package.json` | Scripts: `dev`, `build`, `start`, `lint`, `i18n:check`, `i18n:sync`, `i18n:pending`, `i18n:accept`, `i18n:export`; `jiti` (dev) lets `scripts/i18n.mjs` load the TS content |
| `scripts/i18n.mjs` | Translation check/sync/export — see [i18n.md](./i18n.md) |
| `src/proxy.ts` | Locale routing (EN unprefixed, `/ru` `/th` `/he`); bypass list for `/api`, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` |
| `tsconfig.json` | TypeScript; excludes `bots/` (separate package) |
| `.env.example` | Template for `.env.local` — every env var the site reads |
| `.gitignore` | Ignores `.env*` except `.env.example`; `.i18n-source/` (export output) |
| `Makefile` | `make help` — app + board/workflow shortcuts |
| `.github/workflows/ci.yml` | CI: site (lint → `i18n:check` → build → `tsc --noEmit`) + bots job (`bots/`: typecheck + flow tests) |
| `.github/workflows/project-status-sync.yml` | Syncs issue status to the GitHub Project board |

### Env vars (site)

| Variable | Scope | Used by | When unset |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | **server-only** | `src/app/api/contact/route.ts` | Contact form returns 503 → form shows error state; lead logged, not delivered |
| `TELEGRAM_STAFF_CHAT_ID` | **server-only** | same | same |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | `BotEntry`, mobile contact bar (`src/lib/integrations.ts`) | Falls back to `SITE.whatsapp` (team number) |
| `NEXT_PUBLIC_TELEGRAM_BOT` | public | same — deep links `?start=s_<service>__l_<location>__u_<source>` | No Telegram buttons |
| `NEXT_PUBLIC_GA4_ID` | public | `src/lib/analytics.ts` (after consent) | Not loaded |
| `NEXT_PUBLIC_YM_ID` | public | same (Yandex Metrica) | Not loaded |
| `NEXT_PUBLIC_META_PIXEL_ID` | public | same (marketing consent) | Not loaded |

### Env vars (bots)

`bots/` reads its own `bots/.env` (full comments in `bots/.env.example`, setup in `bots/README.md`).

| Variable | Purpose | Required? |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token; also posts WhatsApp leads to staff | Yes |
| `TELEGRAM_STAFF_CHAT_ID` | Staff chat that receives every lead | Yes (else users see "couldn't deliver" + direct contacts) |
| `TELEGRAM_MODE` | `polling` (dev, default) or `webhook` (prod) | No |
| `TELEGRAM_WEBHOOK_SECRET` | Checked against `X-Telegram-Bot-Api-Secret-Token` | Yes in webhook mode |
| `TELEGRAM_WEBHOOK_URL` | Public webhook URL, auto-registered on start | No |
| `TELEGRAM_WEBHOOK_PATH` | Webhook path (default `/telegram/webhook`) | No |
| `TELEGRAM_PORT` | Telegram webhook server port (default 3000) | No |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API token | Yes for WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID` | Cloud API phone number id | Yes for WhatsApp |
| `WHATSAPP_VERIFY_TOKEN` | Webhook GET handshake token | Yes for WhatsApp |
| `WHATSAPP_APP_SECRET` | Verifies `X-Hub-Signature-256` on POSTs | Yes for WhatsApp |
| `PORT` | WhatsApp server port (default 3001) | No |
| `SITE_URL` | Website base for links (default `https://creativelab.in.th`) | No |
| `BOT_PHOTO_BASE_URL` | Example-photo base (URL or path on `SITE_URL`); empty = no photos | No |
| `CONTACT_EMAIL` / `CONTACT_WHATSAPP` | Direct-contact fallbacks shown on failures | No |
| `SESSION_STORE` | `file` (default) or `memory` | No |
| `SESSION_STORE_PATH` | Session JSON file (default `./data/sessions.json`) | No |
| `SESSION_TTL_DAYS` | Unfinished-session lifetime (default 14) | No |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | Per-user rate limit (default 20 per 10000 ms) | No |

## Team workflow

- [**How To**](./HowTo.md) — start here for day-to-day use: the exact
  command sequence to add and execute a task
- [Workflow](./WORKFLOW.md) — the reference doc: *why* each rule exists
  (branch naming, board field design, automation options)
- [Epics](./epics/) ([format & how to add one](./epics/README.md)) — written
  specs for larger chunks of work, one file per epic
- [Tasks](./tasks/) — written specs for individual tasks, only when a task
  needs more detail than fits in its GitHub Issue
- `make help` (from the repo root) — every workflow command as a
  shortcut (`make task-start TASK=42`, etc.)

## Where things actually get tracked

- Day-to-day status lives on the **GitHub Project board**, not in this
  folder — see [Workflow](./WORKFLOW.md#the-board-github-projects).
- New epics/tasks/bugs are **GitHub Issues** — use the templates under
  `.github/ISSUE_TEMPLATE/`.
