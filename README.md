# CreativeLAB.in.th

Premium creative content & advertising agency website for Koh Phangan,
Thailand. Built with Next.js (App Router) + TypeScript + Tailwind CSS.

See `proposal.md` for the full brief, `TO-DO_2026-11-03.md` for what's built so
far, including its "Open Questions & Blockers" section for placeholder
data / decisions flagged for client follow-up before launch.

## Project docs & team workflow

Start at [`docs/Index.md`](./docs/Index.md). In short: proposals live in
[`docs/Proposals.md`](./docs/Proposals.md), work is broken into Epics and
Tasks as GitHub Issues tracked on the team's GitHub Project board, and
`docs/epics/` / `docs/tasks/` hold specs too long for an issue body.

- **Day-to-day sequence** (add a task, start it, ship it): [`docs/HowTo.md`](./docs/HowTo.md)
- **Why each rule exists** (branch naming, board design, automation): [`docs/WORKFLOW.md`](./docs/WORKFLOW.md)
- **Commands**: `make help` lists every shortcut (`make task-start TASK=42`,
  `make board-epics`, `make check`, etc.) — first-time repo setup is
  `make board-setup` (after `gh auth login`).

## Requirements

- Node.js 20.9+ (Next.js 16 minimum)
- npm 10+ (or another package manager — the project has no
  package-manager-specific config)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server uses
Turbopack and hot-reloads on file changes.

### Environment variables (optional for local dev)

Copy `.env.example` to `.env.local` and fill in values as they become
available. Nothing is required to run the site locally — features that
depend on these fall back gracefully (see `TO-DO_2026-11-03.md`):

| Variable | Purpose | Fallback when unset |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp chat links (`BotEntry`, mobile contact bar) | Falls back to the team number in `SITE.whatsapp` |
| `NEXT_PUBLIC_TELEGRAM_BOT` | Telegram bot handle for chat links (deep links `?start=s_<service>…`) | No Telegram buttons shown |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_YANDEX_VERIFICATION` | Search Console / Yandex Webmaster ownership `<meta>` tags (`src/app/[locale]/layout.tsx`) | No tag emitted |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_YM_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Analytics, loaded only after cookie consent (`src/lib/analytics.ts`) | No analytics and no consent banner |
| `TELEGRAM_BOT_TOKEN` | **Server-only.** Bot that delivers contact-form leads (`/api/contact`). The owner adds it after hosting | Telegram channel skipped |
| `TELEGRAM_CHAT_ID` | **Server-only.** Staff chat the leads go to (`TELEGRAM_STAFF_CHAT_ID` still works). Never the phone number | Telegram channel skipped |
| `RESEND_API_KEY` + `CONTACT_EMAIL_FROM` | **Server-only.** Email delivery through the Resend HTTP API; sender must be verified there | Email channel skipped |
| `CONTACT_EMAIL_TO` | **Server-only.** Lead recipient; defaults to `SITE.email` | Uses `SITE.email` |
| `LEAD_WEBHOOK_URL` | **Server-only.** Optional CRM / automation endpoint; receives each lead as JSON | Webhook skipped |

Tokens and secrets never go in `src/` or in `NEXT_PUBLIC_*` vars — see `SECURITY.md`.

## Build & run in production

```bash
npm run build
npm run start
```

`npm run build` produces an optimized, mostly statically-generated build
(hub and service pages are pre-rendered via `generateStaticParams`).
`npm run start` serves that build on port 3000 (override with `-p`, e.g.
`npm run start -- -p 4000`), or front it with your platform's Node.js
process manager / reverse proxy.

### Type-checking & linting

```bash
npx tsc --noEmit   # type check
npm run lint       # ESLint
```

### Contact form

```bash
npm run contact:check   # runs the real /api/contact handler with MOCKED Telegram, email and webhook (no lead is sent)
npm run nav:check       # mobile menu: exactly the 8 service categories in all 4 languages
```

The enquiry form collects service, island, business type, optional budget and timeline, and sends them with the first-touch UTM parameters and landing page (remembered in the visitor's session only) to `/api/contact`. Delivery uses every configured channel (Telegram, email, webhook); the lead is accepted if at least one succeeds. With none configured the endpoint answers 503 and the form shows its error state with the entered data kept.

### Site audit

```bash
npm run build && npm run site:check                      # crawl the production build, all locales; exit 1 on any ERROR
npm run site:check -- --write-audit                      # also regenerate AUDIT.md plus URL_INTENT_MAP / SEO_CONTENT_MAP / INTERNAL_LINKING_MAP / SCHEMA_QA
npm run site:check -- --show /advertising/google-ads     # print what the crawler parsed for one page
```

It starts `next start` itself (or use `--base http://localhost:3000`). It does not replace manual checks: mobile layout, Hebrew RTL appearance, accessibility and Lighthouse still need a browser (see AUDIT.md).

### Pricing

```bash
npm run pricing:check   # every row uses a priceId, no figures in locale files, numbers match across EN/RU/TH/HE, PRICING_MASTER.md table is current
npm run pricing:master  # regenerate the price table in PRICING_MASTER.md after editing pricing.ts
```

Every number in a pricing table comes from `src/content/pricing.ts` (see `PRICING_MASTER.md`); never type a figure into a locale JSON file.

### Translations

```bash
npm run i18n:check                  # validate RU/TH/HE; `-- --verbose` lists what needs translating
npm run i18n:sync                   # after editing English content: add new keys, drop removed ones
npm run i18n:pending -- ru ui.json  # strings still to translate in one file (JSON)
npm run i18n:accept -- ru ui.json   # after translating: mark them as translated
npm run i18n:export                 # English source skeleton → .i18n-source/ (for translators)
```

English is the master copy in `src/content/**`; RU/TH/HE live in
`src/content/locales/<locale>/*.json`. Full workflow: [`docs/i18n.md`](./docs/i18n.md).

### Deploying

The app is a standard Next.js App Router project — deploy it to any
**Node-capable** Next.js host (Vercel, a Node server behind Nginx, a
container platform, etc.). No database is required; content lives in
`src/content/**` as versioned TypeScript data files.

**Do not use `output: "export"` (static export) / GitHub Pages.** The
locale routing (`src/proxy.ts`) and the contact form
(`src/app/api/contact/route.ts`) both need middleware and API routes,
which static export disables entirely. The GitHub Pages workflow
(`.github/workflows/deploy.yml`) was removed from `main` on 2026-09-22
(it failed on every push); the DrAndromeda fork keeps its own Pages
preview. Set `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` (and/or the email or webhook variables) in the
host's env vars, or the contact form can't deliver leads. If you deploy behind a
platform that needs a `Dockerfile` or specific build adapter, that isn't
set up yet — ask before assuming a target platform.

Before a real launch, see the outstanding items in `TO-DO_2026-11-03.md`'s
"Open Questions & Blockers" section (contact details, bot credentials,
email/CRM delivery for the contact form) and its phase checklist.

## Project structure

```
src/
  proxy.ts             Locale routing: EN unprefixed, RU/TH/HE under /ru //th//he/
  app/
    [locale]/           Every page route lives here. [hub]/ and [hub]/[service]/
                         are shared dynamic templates driven by content data.
    api/contact/        Contact form submission endpoint
    sitemap.ts           Per-locale sitemap with reciprocal hreflang alternates
  components/
    ui/                Small presentational primitives (Button, Container,
                       LocalizedLink…)
    layout/             Header (mega-menu), Footer, MobileContactBar,
                        LanguageSuggestion, Analytics (consent banner)
    blocks/             Reusable page sections (Hero, FAQ, Pricing…)
    pages/              Shared page templates (service page, index pages, 404)
  content/
    hubs/               One file per service hub — hub + all its sub-service copy
    services/           /services/* pages (13, proposal §4)
    industries/         /industries/* pages (7)
    locations/          /locations/* pages (Koh Phangan, Samui, Tao)
    locales/<locale>/   RU/TH/HE translations (JSON) — see docs/i18n.md
    homepage.ts, pages.ts, ui.ts, site.ts, types.ts, i18n.ts,
    translations.ts (localized getters), localize.ts (merge rules),
    case-studies.ts, journal.ts
  lib/                  Metadata builder, JSON-LD schema builders, integrations
  assets/images/        Local reference/placeholder imagery
```
