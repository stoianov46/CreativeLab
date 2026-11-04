# Documentation Index

Start here. Everything below is a link, not a duplicate — if you're
updating something, update it in one place.

## Project

- [Proposals](./Proposals.md) — links to every proposal/brief and its status
- [../README.md](../README.md) — how to run the project locally and in production
- [Translations (i18n)](./i18n.md) — where RU/TH/HE text lives, how to edit it, `npm run i18n:*` commands
- [../AUDIT.md](../AUDIT.md) — generated site audit (476 pages across 4 locales); [../FINAL_QA.md](../FINAL_QA.md) — browser QA results and what was **not** tested; [../DEMO_PORTFOLIO.md](../DEMO_PORTFOLIO.md) — the 8 labelled concept projects and the rules that keep them honest; generated from the crawl by `site:check`: [../URL_INTENT_MAP.md](../URL_INTENT_MAP.md), [../SEO_CONTENT_MAP.md](../SEO_CONTENT_MAP.md), [../INTERNAL_LINKING_MAP.md](../INTERNAL_LINKING_MAP.md), [../SCHEMA_QA.md](../SCHEMA_QA.md); the translation workflow is [i18n.md](./i18n.md) (the brief's `I18N.md`); [../PRICING_MASTER.md](../PRICING_MASTER.md) / [../PRICING_STRATEGY.md](../PRICING_STRATEGY.md) — central pricing and its research
- [../TO-DO_2026-11-03.md](../TO-DO_2026-11-03.md) — the single TODO and progress document: what was done, what is missed or open, and what needs a person

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
| `package.json` | Scripts: `dev`, `build`, `start`, `lint`, `contact:check`, `site:check`, `pricing:check`, `pricing:master`, `i18n:check`, `i18n:sync`, `i18n:pending`, `i18n:accept`, `i18n:export`; `jiti` (dev) lets `scripts/i18n.mjs` load the TS content |
| `scripts/i18n.mjs` | Translation check/sync/export — see [i18n.md](./i18n.md) |
| `scripts/contact-check.mjs` | `npm run contact:check` — runs the real `/api/contact` handler with a mocked Telegram: validation, honeypot, rate limit, option whitelist, escaping, attribution lines (no real lead is sent) |
| `scripts/site-check.mjs` | `npm run site:check` — crawls the production build in all 4 locales (status, title, description, H1, canonical, hreflang, JSON-LD, alt, links, banned phrases, old domains, duplicate content, schema rules, direct answer / description / FAQ / links / keyword / word count on commercial pages); `-- --write-audit` regenerates [AUDIT.md](../AUDIT.md) and the four generated maps listed above |
| `scripts/pricing-check.mjs` | `npm run pricing:check` (verify) / `npm run pricing:master` (regenerate the table in PRICING_MASTER.md) — every row on a priceId, no figures in locale files, numbers identical across locales — see [PRICING_MASTER.md](../PRICING_MASTER.md) |
| `src/content/pricing.ts` | **Single source of truth for prices** (THB min/max, unit, revisions, turnaround); content rows reference it by `priceId` |
| `src/proxy.ts` | Locale routing (EN unprefixed, `/ru` `/th` `/he`); bypass list for `/api`, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` |
| `tsconfig.json` | TypeScript; excludes `bots/` (separate package) |
| `.env.example` | Template for `.env.local` — every env var the site reads |
| `.gitignore` | Ignores `.env*` except `.env.example`; `.i18n-source/` (export output) |
| `Makefile` | `make help` — app + board/workflow shortcuts |
| `.github/workflows/ci.yml` | CI: site (lint → `i18n:check` → `pricing:check` → `contact:check` → build → `tsc --noEmit` → `site:check`) + bots job (`bots/`: typecheck + flow tests) |
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
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | public | `src/app/[locale]/layout.tsx` (`verification.google`) — Search Console ownership tag | No tag emitted |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | public | same (`verification.yandex`) — Yandex Webmaster | No tag emitted |

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
