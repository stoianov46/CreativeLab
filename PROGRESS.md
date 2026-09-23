# CreativeLAB.in.th — Build Progress

Tracking document for implementing `proposal.md`. Updated as work proceeds.
See "Open Questions & Blockers" below for everything that needs a person —
a client answer, a teammate decision, or external credentials — rather
than more code.

## Stack

- Next.js 16 (App Router, Turbopack, TypeScript, `src/` dir)
- Tailwind CSS v4 (CSS-based theme in `src/app/globals.css`)
- Content is data-driven: `src/content/**` feeds shared page templates in
  `src/app/[locale]/[hub]/page.tsx` and
  `src/app/[locale]/[hub]/[service]/page.tsx`, so adding a service is a
  data change, not a new React file (CMS-ready per proposal
  §14_TECHNICAL_SITE_BUILD).
- Locale routing (`src/proxy.ts`) and the contact form
  (`src/app/api/contact/route.ts`) require a Node-capable host — see
  "Deployment target" below.

## Phase 1 — Brand shell + design system + reusable components — DONE

- [x] Next.js scaffold (App Router, TS, Tailwind v4, ESLint)
- [x] Design tokens in `globals.css` (colors, fonts, spacing extensions)
- [x] Fonts: Fraunces (display) + Inter (body) via `next/font/google`
- [x] Reusable blocks: AnnouncementBar, Hero, DirectAnswer, TrustStrip,
      SplitEditorial, ServiceGrid, FeatureList, Benefits, ProcessSteps,
      PortfolioPreview, PricingGuidance, UseCases, FaqAccordion,
      RelatedServices, LocationBlock, CtaBanner, Breadcrumbs, ContactForm,
      BotEntry
- [x] Header (mega-menu desktop, accordion drawer mobile, focus/Escape)
- [x] Footer (4-column)
- [x] `/api/contact` route (validated, honeypot; delivery integration
      pending — see "Open Questions & Blockers" below)

## Phase 2 — Homepage + 8 service hubs — DONE

- [x] Homepage
- [x] Advertising hub + 4 sub-services
- [x] Social Media hub + 5 sub-services
- [x] Villas & Real Estate hub + 9 sub-services
- [x] Food & Restaurants hub + 7 sub-services
- [x] Business & Local Presence hub + 6 sub-services
- [x] Websites & Digital hub + 9 sub-services
- [x] Video & Production hub + 4 sub-services
- [x] Branding & Creative hub + 4 sub-services

48 sub-service pages total, all sharing
`src/app/[locale]/[hub]/[service]/page.tsx`.

## Phase 3 — Portfolio / Case Studies / About / Contact / Journal — DONE

- [x] `/portfolio/` — honest reference-imagery state (no fabricated
      projects; see the Truth Rule in "Open Questions & Blockers" below)
- [x] `/case-studies/` — honest "first case studies in progress" state
- [x] `/about/` — story, approach, principles (no invented team bios)
- [x] `/contact/` — working form + email + BotEntry fallback
- [x] `/journal/` — honest "first articles on the way" state
- [x] `/privacy/`, `/terms/` — drafted, explicitly marked pending legal
      review, so footer links aren't dead ends

## Phase 4 — SEO/schema/hreflang/sitemap/llms.txt — DONE

- [x] `sitemap.ts` (per-locale entries, reciprocal hreflang alternates)
- [x] JSON-LD per page: Organization (global), WebPage + BreadcrumbList on
      every page, Service + FAQPage on hub/service pages
- [x] hreflang — `alternates.languages` on every page + reciprocal
      `<xhtml:link>` entries in `sitemap.ts` for all 4 locales + x-default,
      now that Phase 7's routing infrastructure is in
- ⚠️ `robots.txt` / `llms.txt` are currently **static files**
      (`public/robots.txt`, `public/llms.txt`, allowing
      GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot per the GEO
      requirement) rather than generated from `src/content/**` — a
      teammate's GitHub Pages experiment replaced the generated
      `src/app/robots.ts` / `src/app/llms.txt/route.ts` route handlers.
      Correct today, will drift as hubs/services are added. See
      "Open Questions & Blockers" → "Technical debt" below.

## Phase 5 — Bot integration (Telegram + WhatsApp) — BUILT, NOT DEPLOYED

- [x] `BotEntry` component + `src/lib/integrations.ts`: reads
      `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_TELEGRAM_BOT`; falls
      back to a "Message Us" → `/contact` link when unset, so nothing
      fake or broken ships
- [x] `bots/` package: full intake flow (language → service → location →
      project type → description → budget → timeline → files → contact →
      review → submit), channel-agnostic state machine shared by both
      adapters, EN/RU/TH/HE copy, staff notification via a shared
      Telegram chat. Telegram (grammY) and WhatsApp (Cloud API + Express
      webhook) adapters both implemented; `npm run typecheck` passes.
      See `bots/README.md`.
- [ ] Not deployed — needs a real Telegram bot token + WhatsApp Cloud API
      account (`bots/.env.example`) and a host with a stable public URL
      for the WhatsApp webhook. CRM handoff is currently "notify staff
      chat", not a CRM record — see `docs/tasks/TASK-005-bot-integration.md`.

## Phase 6 — Performance pass — INITIAL CHECK DONE

- [x] Production build inspected: 263 pages (71 canonical routes × 4
      locales), mostly static/SSG, minimal client JS (Header/mobile-nav,
      ContactForm, AnnouncementBar, and the `<details>`-based FAQ
      accordion are the only client components)
- [ ] No Lighthouse/CrUX run yet (needs a deployed or otherwise reachable
      URL, or local Lighthouse CLI, to measure LCP/INP/CLS meaningfully)
- [ ] Real photography/video will affect LCP more than anything else at
      this stage — current images are placeholder JPEGs

## Phase 7 — 4 languages (EN/RU/TH/HE) — DONE AS LLM DRAFT, PENDING NATIVE REVIEW

- [x] Routing: EN canonical/unprefixed, RU/TH/HE prefixed (`/ru/`, `/th/`,
      `/he/`) per `proposal.md` §09. Every route moved under
      `src/app/[locale]/`; `src/proxy.ts` handles the unprefixed-EN
      rewrite + `/en/*` redirect-away; all 263 pages (4 locales × every
      route) prerender at build time.
- [x] Internal links auto-localize via `src/components/ui/LocalizedLink.tsx`
      (detects locale from the real request URL) — no content file needed
      to change.
- [x] RTL: `dir`/`lang` set server-side per locale; hardcoded physical
      Tailwind utilities swapped for logical ones across shared
      components; directional arrow mirrors via `rtl:`; emails wrapped in
      `<bdi>`. Structurally verified (`curl` + `dir="rtl"` on a live page);
      not yet eyeballed against real Hebrew copy.
- [x] Thai font stack (`Noto_Sans_Thai` via `next/font/google`, applied
      for `locale==="th"`); ICU line-breaking unverified (no Thai copy to
      test against yet).
- [x] Translation layer (2026-09-22): English stays the master in
      `src/content/**.ts`; RU/TH/HE live in
      `src/content/locales/<locale>/{ui,pages,hubs/*}.json` and are merged
      over English by `src/content/translations.ts` (missing strings fall
      back to English). The menu, footer, breadcrumbs, homepage cards and
      related-service cards all read names from the hub/service data, so
      one edit updates the name everywhere. All interface text that was
      hardcoded in components moved to `src/content/ui.ts`. Workflow:
      `docs/i18n.md`; tooling: `npm run i18n:check|sync|export`
      (`i18n:check` also runs in CI).
- [x] Language switcher (EN/RU/TH/HE) in the header (desktop dropdown +
      mobile menu), linking to the same page in the other language.
- [x] RU/TH/HE copy for every page, drafted by LLM on 2026-09-22 at the
      client's request ("translate everything, we'll review later").
- [ ] **Native review of RU/TH/HE copy**: `proposal.md` forbids machine
      translation as *final* copy, so every locale needs a native
      reviewer before launch (SEO fields `metaTitle`/`metaDescription`/
      `primaryKeyword` especially). Edit the JSON files directly; see
      `docs/i18n.md`.
- [ ] Visual check of Hebrew RTL and Thai line-breaking against the real
      translated copy on mobile widths.
- [ ] Not translated by design: `/llms.txt`, `/llms-full.txt` (English
      for AI crawlers), Telegram lead messages to staff, and
      `[[VERIFY: …]]` markers in the legal pages.

### Deployment target (resolved)

On 2026-09-14 a teammate configured the repo for GitHub Pages static
export (`output: "export"`, `.github/workflows/deploy.yml`) the same day
this locale routing landed. Static export disables Next.js
middleware/API routes entirely — it broke `next dev` outright and would
have shipped a build with no working unprefixed-EN routes and a
non-functional contact form (verified by inspecting the exported `out/`
directly). Confirmed with the team: production is Vercel/Node, not
GitHub Pages — `next.config.ts` is back to plain, unblocking local dev.
On 2026-09-22 `.github/workflows/deploy.yml` was removed from `main` at
the client's decision (it failed on every push). The DrAndromeda fork
keeps its own GitHub Pages preview; it can't run the contact form or
locale routing.

## Phase 8 — QA — PARTIAL

- [x] `npm run build`, `npx tsc --noEmit`, `npm run lint` all clean
- [x] All internal links crawled and verified (0 broken links across every
      hub/service cross-link, nav, and footer link)
- [x] Contact form manually tested end-to-end in-browser (found and fixed
      a real bug: `e.currentTarget` goes null after an `await` in an async
      React event handler, which was breaking the post-submit success
      state — fixed by not touching `currentTarget` after the fetch)
- [x] Homepage and several hub/service pages visually checked in Chrome
      (desktop viewport)
- [ ] No formal a11y (axe-core), Lighthouse, or cross-browser pass yet
- [ ] No multi-breakpoint visual regression pass yet (mobile viewport
      screenshots didn't render correctly through the automation tool used
      this session — the responsive Tailwind classes are in place but
      untested visually below desktop width)

## Phase 9 — Launch checklist — NOT STARTED

Blocked on real content inputs — see "Open Questions & Blockers" above
for the full list (contact details, real photography, bot credentials,
legal review, translations, hosting/deployment decision).

## Phase 10 — Proposal audit build (2026-09-22/23) — DONE, PENDING REVIEW

Audit of `proposal.md` + `Improvements.md` against the code, then built
per the client's answers (23.09):

- [x] **IA per proposal §2/§4/§14.**
  - `/services/*`: 13 P0 pages. 10 overlap a hub page and set `canonicalPath` → hub; they're not in the sitemap.
  - `/industries/*`: 7 pages.
  - `/locations/*`: Koh Phangan, Koh Samui, Koh Tao.
  - Index pages for all three trees.
  - Mega-menu in the spec's structure (Services in 5 groups / Industries / Locations / Work / Journal / About / Contact).
- [x] **Geography:** all three islands. Organization schema has `areaServed` ×3, geo and contactPoint; location pages have Place schema.
- [x] **Content depth §8:** hubs ~1.5k words, 8–10 FAQs; services ~800 words, 8 FAQs; service overview blocks; SEO field lengths fixed. Service page order per §16.
- [x] **Templates:** case study (§20) and journal article (§22), both with schema and currently empty; `/editorial-policy` and `/accessibility`.
- [x] **UI/UX:**
  - hero slider and portfolio carousel;
  - mobile contact bar;
  - browser-language suggestion banner (no redirect);
  - chat buttons in every CTA;
  - bot deep links (`s_/l_/u_` payload).
- [x] **Contact form:** consent checkbox, length limits, rate limit, phone field, UTM/page/locale, `?service=` prefill.
- [x] **Analytics layer + consent banner:** consent-gated, no IDs yet.
- [x] **Technical:** single brand in titles, localized 404 (`global-not-found`), Heebo for Hebrew, OG image, AVIF, security headers, sitemap/llms with new pages.
- [x] **Bots rebuilt per proposal** (`bots/README.md`): 8 services × 3 islands × 4 languages, back/language/restart everywhere, persistence, webhook + signature checks, 35 tests in CI.
- [x] **Translation tooling** (`docs/i18n.md`): per-string "translated-from" tracking; `i18n:pending` / `i18n:accept`. All new English translated to RU/TH/HE as an LLM draft.
- [ ] **Not built (not selected 23.09):** site test suite, backlinks plan, AdFoto Wayback analysis. Homepage variants declined.

## Open Questions & Blockers

Everything here needs a person — a client answer, a teammate decision, or
external credentials — not more code. Remove an entry once it's resolved
(fold the answer into the relevant task/phase above instead of leaving a
stale note here).

Per `proposal.md`'s Truth Rule and Missing Data Protocol: nothing on the
live pages is invented as fact. Anything not verifiable is either
omitted, phrased qualitatively, or marked `[[VERIFY]]` in source.

### Needs real client input

- **Contact details**: email (`karma8chakra@gmail.com`), phone, and
  WhatsApp (`+66 80 870 5704`, same number for both) were provided by the
  team on 2026-09-15, replacing an earlier `[[VERIFY]]`/all-zeros
  placeholder — treat these three as real. **`telegram` (`@creativelab1_bot`)
  is still unverified**: it was set in that same commit as the fake
  `+66-00-000-0000` placeholder and never revisited the way phone/WhatsApp
  were, so there's no evidence it's a real, live bot — confirm before
  relying on it. Physical address and legal entity details remain unset.
  `BotEntry` still correctly falls back to a "Message Us" link (its env
  vars, `NEXT_PUBLIC_WHATSAPP_NUMBER`/`NEXT_PUBLIC_TELEGRAM_BOT`, are
  unset) rather than wiring to `SITE.whatsapp`/`SITE.telegram` directly —
  intentionally not changed here given the Telegram handle's unverified
  status; Footer/schema still omit `PostalAddress`/`telephone` rather than
  invent them.
- **No real proof content yet**: no real client projects, testimonials,
  awards, or case studies exist. `/portfolio/` and `/case-studies/`
  intentionally show an honest "in progress" state instead of fabricated
  results — needs real work supplied before populating.
- **Pricing**: current tables use `proposal.md`'s own example figures
  where given; everything else is an original estimate in the same
  style/order of magnitude. Needs confirming with the client before
  launch.
- **Real photography/video**: all current imagery is placeholder/
  reference. This is also the single biggest lever left on Core Web
  Vitals — every sampled page's LCP is over the 2.5s target, tracing
  directly to the placeholder hero JPEGs (see `docs/tasks/TASK-006-performance-pass.md`).
- **Legal review**: Privacy Policy / Terms are drafted but marked
  `[[VERIFY]]` pending qualified legal counsel (Thai law).
- **Launch checklist** (`docs/tasks/TASK-009-launch-checklist.md`) is
  blocked end-to-end on the items above, plus analytics/tracking IDs and
  the hosting decision below.

### Added 2026-09-23 (see NOTES.md for the short list)

- **Shop:** e-commerce service page (exists) vs a real store (needs a brief).
- **Bot matrix:** 8 × 3 as built vs the "13 × 5" row in the proposal table.
- **Lead storage:** Telegram only for now; Sheets/Airtable/CRM later.
- **LLM-written English copy** for the new pages and expansions needs a factual/tone review, including "Indicative" prices on new rows.
- **Bots deployment:** host, WhatsApp account + app secret, bot photos, `CONTACT_EMAIL` confirmation, shared session store for multiple instances.
- **Analytics IDs**, Search Console / Yandex Webmaster access, social profile URLs for `sameAs`, author bios.
- **CSP header** not set; contact-form rate limit is per instance.

### Needs a team/teammate decision

- **Production host + domain**: Vercel/Node is confirmed and the Pages
  workflow is gone from `main` (2026-09-22), but no production
  deployment exists yet and `creativelab.in.th` isn't pointed at one.
  The host needs `TELEGRAM_BOT_TOKEN` / `TELEGRAM_STAFF_CHAT_ID` set, or
  the contact form returns an error instead of delivering leads.
- **`creativelab.in.th` domain**: `SITE.url` (used for every canonical/
  hreflang/JSON-LD/sitemap URL) is `https://creativelab.in.th`, but the
  GitHub Pages deployment has no `public/CNAME` and actually serves from
  `https://drandromeda.github.io/CreativeLAB.in.th/`. Needs reconciling
  if Pages is ever used for anything — moot if the hosting question above
  resolves to "GitHub Pages isn't used at all."
- **RU/TH/HE native review**: all copy exists as an LLM draft
  (2026-09-22) and is live behind the language switcher. It needs a
  native reviewer per language before launch; see Phase 7.
- **Leaked Telegram bot token**: until 2026-09-22 the token was
  hardcoded in client JS (`ContactForm.tsx`, commit `0bda801`) and is
  still in git history. Confirm it was revoked via @BotFather (the fork
  says it was), then set the new one only in the host's env vars. See
  `SECURITY.md`.
- **"Shop" in the fork's notes**: unclear whether it means the existing
  `/websites-digital/ecommerce` service page or a real CreativeLAB store.
  Needs a brief if it's the latter.
- **Telegram/WhatsApp bot credentials**: `bots/` is built and
  type-checked but not deployed — needs a real Telegram bot token,
  WhatsApp Business/Cloud API account, and a host with a stable public
  URL for the WhatsApp webhook (`bots/.env.example`).
- **IA cannibalization inherited from the proposal**: the proposal's own
  architecture tables define near-duplicate pages (e.g.
  `/food-restaurants/website/` vs. `/websites-digital/restaurant-website/`),
  which conflicts with its own "no two pages same primary intent" rule.
  Resolved here by giving each pair a distinct angle (vertical-bundle
  framing vs. underlying-discipline framing) — flagging so it can be
  revisited with the client rather than silently merged.

### Technical debt (known, not urgent)

- Contact form: `/api/contact` delivers leads to the staff Telegram chat
  (server-side). There's still no email/CRM copy or rate limiting; add
  one if Telegram alone isn't enough.
- `src/components/blocks/TrustStrip.tsx` isn't used anywhere and wasn't
  moved to the translation layer. Delete it, or localize it before
  reusing it.
- Header is sticky + translucent at all times rather than
  transparent-on-hero/solid-on-scroll — avoids fragile per-template
  coordination, same visual intent. Revisit only if the client wants the
  literal proposal behavior.

## How to continue

- Real data needed before launch: see "Open Questions & Blockers" above.
- To add a new sub-service: add an entry to the relevant
  `src/content/hubs/*.ts` file's `services` array — no new route file
  needed.
- To add a new hub: create `src/content/hubs/<slug>.ts` following the
  existing files' shape, then register it in `src/content/hubs/index.ts`.
- After adding or changing English content, run `npm run i18n:sync`, then
  translate the new strings in `src/content/locales/*/` (`docs/i18n.md`).
