# Implementation Plan

How the completion work in `TO-DO_2026-11-03.md` was planned, done and verified. Status labels: `CODE DONE` = built and verified on a **local build**; `PARTIAL`; `OWNER INPUT REQUIRED`; `BLOCKED`. Nothing is `PRODUCTION VERIFIED` — the live site returns 403 Forbidden to every request (including a real browser) and nothing has been deployed.

Order followed (the brief's §14, adapted): audit → pricing → SEO content → portfolio → languages → RTL → schema → contact and legal → forms → local SEO and analytics readiness → performance and accessibility → final QA.

| # | Stage | Status | What was done | Verified by |
|---|---|---|---|---|
| 1 | Repo audit and automated checks | CODE DONE | `npm run site:check` crawls the production build in 4 languages; `AUDIT.md` and the four generated maps | 476 pages, 0 errors, 15 warnings (12 `[[VERIFY]]` markers on legal drafts, 3 FAQ "guarantee" questions answered "no") |
| 2 | Pricing | CODE DONE | Central `src/content/pricing.ts` (153 ids, 173 rows), Included / Not included lists, units, "last reviewed" date | `npm run pricing:check` (CI) |
| 3 | Pricing research | PARTIAL | Every category searched once and logged in `PRICING_STRATEGY.md` | Evidence is thin; no numbers changed |
| 4 | SEO content | CODE DONE | Direct answers 40–60 words, descriptions, FAQs, links and keywords enforced | `site:check` |
| 5 | Demonstration portfolio | CODE DONE | 8 labelled concept projects with original SVG boards | `site:check` concept rules; browser review |
| 6 | Four languages | CODE DONE (LLM drafts) | RU/TH/HE fully translated, 0 pending | `npm run i18n:check`; native review `OWNER INPUT REQUIRED` |
| 7 | Hebrew RTL and local QA | CODE DONE | Overflow matrix, Lighthouse, keyboard and mobile-menu tests, 7 bugs fixed | `FINAL_QA.md` (Chrome only) |
| 8 | Schema | CODE DONE | `Organization`, `WebSite`, `ContactPage`, Service + `OfferCatalog`, concept `CreativeWork` | `SCHEMA_QA.md`, enforced by `site:check` |
| 9 | Contact and legal | CODE DONE (drafts) | Address; Privacy extended; new Cookie Policy | Lawyer review `OWNER INPUT REQUIRED` |
| 10 | Forms | CODE DONE | Island, business type, budget, timeline, reply language, review step, attribution | `npm run contact:check` (mocked Telegram); delivery `BLOCKED` |
| 11 | Local SEO and analytics readiness | CODE DONE | Consent-gated analytics, Search Console / Yandex verification tags, robots, sitemap, `llms.txt` | `site:check`; IDs and verification `OWNER INPUT REQUIRED` |
| 12 | Final QA | CODE DONE (local) | Full regression | see below |

## Commands run for the final regression

`npx tsc --noEmit` · `npm run lint` · `npm run build` · `npm run i18n:check` · `npm run pricing:check` · `npm run contact:check` · `npm run site:check` · `cd bots && npm run check` (typecheck + 35 tests) — all pass.

## Remaining (see the Obsidian BLOCKED list and `NOTES.md`)

- **Owner / external:** Telegram token and chat ID, deployment and DNS, Google Business Profile status, phone and legal-name confirmation, lawyer review of Privacy / Terms / Cookies, native review of RU/TH/HE, approval of the draft revisions and turnaround values and of the price positioning, real photography and video.
- **Built on the owner's instruction (2026-11-03):** 18 dedicated sub-service pages (`src/content/extra-services/`), indicative draft prices, translated into RU/TH/HE. Owner must still approve scope, prices and the draft wording.
- **Needs a deployed site:** a production crawl, Core Web Vitals, Rich Results Test, Search Console submission, cross-browser and real-device testing.

## Spec cross-check against `TO-DO_2026-11-03.md` (2026-11-03, read section by section)

| Spec § | Status | Evidence / gap |
|---|---|---|
| 2 Production audit | **BLOCKED** (partly) | Local build crawled (476 pages × 4 locales, `AUDIT.md`); the live site returns 403 to everyone, so nothing is `PRODUCTION VERIFIED` |
| 3 Services and child pages | CODE DONE | All named services have a page; 18 added on the owner's instruction. "Villa Marketing", "SEO", "Web Development", "Photography" map to existing pages (`/villas-real-estate/marketing`, `/websites-digital/technical-seo`, `/web-design`, the photography pages) |
| 4 Pricing | CODE DONE, drafts | Central `pricing.ts` (153 ids / 173 rows), tables on every commercial page, ad spend separated, indicative + dated. Research is thin (no island data); the 10–20% premium has no evidence. Starter/Growth/Signature exists only on the monthly social packages; other recurring services have 1–2 tiers; per-package `extras` field added (rendered as "Optional extras (quoted separately)") on the tiered retainers: monthly social packages, Instagram management, Google/Meta Ads management |
| 5 SEO / AI search | CODE DONE | Enforced by `site:check` (direct answer, FAQ, links, keyword, word count); `llms.txt` |
| 6 Demo portfolio | CODE DONE | 8 labelled concept projects (`DEMO_PORTFOLIO.md`); the spec's longer lists (e.g. Google Ads structures, storyboards) are covered by one concept board per category, not one asset each |
| 7 Address / contact | CODE DONE | Address everywhere, no GBP claim; phone and legal entity `OWNER INPUT REQUIRED` |
| 8 Four languages, RTL | CODE DONE (LLM drafts) | `i18n:check` 0; RTL and 12-width overflow tests; native review open |
| 9 Schema | CODE DONE | Organization, WebSite, WebPage, Service/OfferCatalog (no prices), BreadcrumbList, CreativeWork, Article, ContactPage, FAQPage. `ImageObject` as `primaryImageOfPage` on service and hub pages (skipped for `social.jpg` and the SVG concept boards) |
| 10 Forms | CODE DONE | Mocked delivery only; real Telegram delivery `BLOCKED` |
| 11 Legal / analytics | CODE DONE | Privacy, Terms, Cookies, Accessibility, Editorial policy, consent Accept/Reject/Settings (renders once analytics IDs exist), sitemap, `llms.txt`, verification tags |
| 12 Performance / a11y | CODE DONE for Chrome | Lighthouse and axe on key pages and on all 18 new pages; Safari / Firefox / Edge and real devices not tested |
| 13 Documents | CODE DONE | All listed documents exist (`I18N.md` = `docs/i18n.md`) |
| 15 Definition of done | 27/27 ticked in `Improvements.md` §24, last item (production verification) needs an approved deploy | |
