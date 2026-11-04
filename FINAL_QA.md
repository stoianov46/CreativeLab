# Final QA — local build

Run on **2026-11-03** against a **local production build** (`next start` on localhost) in **Chrome only**. Nothing here is `PRODUCTION VERIFIED`: the live site was not tested (it returns 403 Forbidden to every request, including from a real browser), and no deploy has happened.

Automated checks that run in CI are in [AUDIT.md](AUDIT.md) (`npm run site:check`), [PRICING_MASTER.md](PRICING_MASTER.md) (`npm run pricing:check`) and `npm run i18n:check`. This document records the **browser** QA that those cannot do.

## What was tested

| Area | How | Result |
|---|---|---|
| Horizontal overflow at the 12 required widths (320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1440, 1728, 1920) | 16 page types × 4 locales × 12 widths = **768 combinations**, each page loaded in an iframe of that exact width (Chrome cannot shrink a window below ~500px) and measured | **0 overflows** after the fixes below |
| Lighthouse (mobile + desktop), 8 pages across EN/RU/TH/HE | Lighthouse 13.6 via `npx`, local build | Accessibility **100**, Best Practices **100**, SEO **100** on every page re-run after fixes; mobile Performance **82–85** on hero pages (see Performance), **100** on pages without a hero image |
| Hebrew RTL, visual review | Screenshots of the header, hero, breadcrumbs, pricing table, contact page (form, details, address) and the mobile drawer | Layout mirrors correctly: logo right, nav reversed, CTA/switcher left, text right-aligned, drawer close button left, bottom bar reversed, prices and the address stay left-to-right |
| Hebrew RTL, structural | `dir="rtl"` / `lang="he"` on every Hebrew page (site-check); prices in `dir="ltr"`; phone, WhatsApp and address in `<bdi dir="ltr">` | Pass |
| Mobile menu (390px frame, all 4 locales) | Open, focus, Escape, scroll lock | Panel fills the screen; focus goes to the close button; Escape closes and returns focus to the menu button; page scroll locks and releases |
| Desktop dropdown by keyboard | Real Enter / Escape key presses | Opens and closes (`aria-expanded` follows) |
| Focus visibility | All 67 interactive elements on a service page focused programmatically | All have the 2px accent focus ring |
| Contact form validation | Empty submit (no real inquiry was sent) | Errors shown, `aria-invalid` set, honeypot hidden from assistive tech, no network request |

## Block 6 additions (contact form and concept portfolio)

| Area | How | Result |
|---|---|---|
| Enquiry form flow | Chrome: prefill from `?service=`, empty submit, fill, review, Edit, failed send | Errors + focus on the first invalid field; review step shows the summary and moves focus to its heading; **Edit** returns with every value intact; a failed send (no token locally → 503) shows the error, stays on the review step and keeps all data. Only one request left the page and **nothing was delivered** (no token exists in this environment) |
| Form attribution | Session storage after landing on `/contact?utm_source=…` | UTM + first page seen stored; sent with the lead (verified in the mocked API, `npm run contact:check`) |
| Form at narrow widths | Form and review step in 4 locales at 320 and 390px, with a very long unbroken word | No overflow |
| Hebrew form review step | Screenshot | Labels/values right-aligned, buttons in RTL order, prices/email left-to-right |
| Concept portfolio visuals | Screenshots of all 8 boards on `/portfolio` | Render cleanly in the site palette; the profile card uses empty outline stars on purpose (no implied rating) |
| Concept pages overflow | 10 pages × 4 locales × 12 widths = **480 combinations** | **0 overflows** |
| Hebrew concept page | Screenshots | Label, title, three content columns and the disclaimer mirror correctly |

## Accessibility pass on the full page set (completion work)

Lighthouse's accessibility audit (axe-core rules) on **12 page types × 4 languages = 48 pages**, plus its best-practices and SEO audits: accessibility **100 on 44 pages**, best-practices **100 and SEO 100 on all 48**. The other 4 were the concept page `/portfolio/villa-launch-campaign` in each language at **96**: the concept label (accent text on the near-black hero) had a **3.46:1** contrast against the required 4.5:1. All eight concept pages share that label, so it was fixed in the component (a light tint on dark backgrounds) and re-tested at **100** on three concept pages across languages. A **standalone axe-core 4.10 run** was then done (the `axe-core` and `puppeteer-core` npm packages installed in a scratch folder outside the repo, driving a separate headless Chrome — injecting a CDN script into the interactive browser had been refused): **14 pages × 4 languages × 2 widths (1280 and 390 px) = 112 page-runs, WCAG 2.0–2.2 A/AA plus best-practice rules**. It found two issues Lighthouse had not reported, both fixed and re-run to **no violations**: (1) the language button's accessible name ("Language: English") did not contain its visible text "EN" (WCAG 2.5.3 *Label in Name*) — it now starts with it; (2) the horizontally scrolling price table was not keyboard-reachable at phone width on 12 pages — it is now a focusable, labelled region. The runner is not kept in the repo (it would add two dev dependencies); re-run it with those packages when needed.

Also tested in the browser: the language switcher by click (EN → RU), the form's success and rate-limited states with stubbed responses (nothing sent), the mobile menu on 7 nested pages × 4 languages (28 combinations, 0 failures), and a visual review of Thai and Russian pages (font, wrapping, price tables).

## Bugs found and fixed

1. **Mobile menu was invisible** — the full-screen panel was sized to the header (64px) because the header's `backdrop-filter` became the containing block of the `fixed` panel. Fixed: no blur while the panel is open. (Found only by measuring in a browser.)
2. **Header overflowed at 1024px** in English and Russian (13px / 28px) — nav and CTA did not fit. Fixed with tighter padding/gaps below `xl`.
3. **Russian long words overflowed at 320px** — the footer links, and section headings such as "Ориентировочные цены". Fixed with `overflow-wrap: anywhere` on headings and footer links; the same fix covers the long "Политика конфиденциальности" H1 on phones.
4. **Language switch was a client-side navigation** from `/he/…` to the unprefixed English URL, which 404s through the locale rewrite (console error, Best Practices 96). Both the switcher and the "Switch to English" notice are now plain links (full page load), which is right anyway because `lang`/`dir` change.
5. **Mobile bar link "Start"** failed Lighthouse's descriptive-link-text check — now "Start a Project" (translated).
6. **Language notice covered the open mobile menu** — lowered one stacking level (the cookie banner intentionally stays on top).
7. **Contact form** left focus on the page after a failed submit — it now moves to the first invalid field, so its error is announced.

## Performance (local, indicative only)

- Unthrottled (`--throttling-method=provided`): LCP **0.7 s**, Performance **100**.
- Lighthouse's default mobile simulation (slow 4G, 4× CPU): LCP **4.3–4.7 s**, Performance **82–85** on pages with a hero image; layout shift ≈ 0, blocking time 0 ms.
- **LCP investigation (completion work):** Lighthouse's own trace records the *observed* LCP at **708 ms**; the 4.3–4.7 s is its simulated slow-4G / 4× CPU model, driven by the request chain document → one 10.8 KB render-blocking stylesheet → hero image. Nothing else is flagged (TBT 0 ms, CLS ≈ 0, fonts `font-display` passes, hero image preloaded and ~35 KB). The stylesheet is the only lever and it is already a single small file, so no code change is justified before a real measurement.
- Hero images are small (~35 KB at the mobile size) and preloaded, so this is mostly the simulation on localhost. **Re-measure on the deployed URL** (CDN, real caching) before drawing conclusions; only then decide whether the hero or font loading needs work.

## Not tested — needs a person or a real device

- **Safari, Firefox, Edge** and **real iOS / Android devices** (Chromium only here).
- **Screen readers** (VoiceOver, NVDA, TalkBack) and a full axe-core pass beyond Lighthouse's accessibility audit.
- **Visual appearance** at the 12 widths: overflow was measured, but only the Hebrew pages and the mobile drawer were looked at in screenshots; Thai line breaking and Russian wrapping were not reviewed by eye.
- **Touch interactions** and gestures; `prefers-reduced-motion`; print styles.
- **A real submission:** the Telegram delivery, the staff message and the success state were never exercised against a live bot (`BLOCKED` until credentials exist); the success message was not seen in a browser.
- **The live site**, real network conditions and Core Web Vitals field data.
- **Forms end to end**: delivery is `BLOCKED` until the Telegram credentials exist; only validation was tested.
- **Hebrew copy quality** (LLM draft) — needs a native reviewer.

## Sub-service pages (18) — browser checks, 2026-11-03

- Standalone axe-core (WCAG 2.0–2.2 A/AA + best practice), 18 new pages × 4 languages × 390 / 1280 px = 144 runs: **no violations**.
- Overflow, same 72 pages at 320 / 390 / 768 / 1280 px (288 checks): one failure — `/ru/websites-digital/structured-data` at 320 px (the long word «Структурированные» in the CTA heading, 334 > 320). Fixed with `[overflow-wrap:anywhere]` in `CtaBanner.tsx`; re-run at 320 and 360 px (144 checks): 0.
- Translation alignment: length-ratio check of 1,206 long strings per language against the English found no misaligned lines (two translators had zipped line lists onto keys); digits and script checked on every string. Native review of RU/TH/HE is still open (BLOCKED item 16). Lighthouse (mobile, local build) on **all 18** new pages × 4 languages = 72 runs: accessibility, best practices and SEO **100** on all; performance 83–85 (Lighthouse simulation, same range as the other hero pages).

## Safari and §§7–15 re-check, 2026-11-03

- **Safari (macOS, local build):** five pages opened in Safari (`/social-media/monthly-packages`, `/he/advertising/tracking-analytics`, `/ru/branding-creative/logo-design`, `/th/video-production/brand-films`, `/advertising/google-ads`); each loaded and Safari reported the correct localized title and URL. **Not tested in Safari:** layout, horizontal overflow, interactions, forms, Hebrew RTL rendering — screen capture and JavaScript from Apple Events are blocked on this machine, and Claude does not change those system/Safari settings. Firefox and Edge are not installed. Real iOS/Android devices not tested.
- **Rendered-site checks of §§6.9, 7, 8, 9, 11** (against `next start`, not grep): contact page returns 200 with the address, an email link and a WhatsApp link in all 4 languages; footer address on all 4 home pages; no GBP "verified" wording; no Telegram link while no bot is configured; 84 public pages (21 routes × 4 languages) return 200; Hebrew pages carry `lang="he" dir="rtl"`; schema types present: Organization, WebSite, WebPage, Service, BreadcrumbList, FAQPage, ContactPage, CreativeWork (no LocalBusiness); `robots.txt` has a Sitemap line; `sitemap.xml` lists 436 URLs; `llms.txt` serves; no analytics scripts load without configured IDs and consent; concept label visible on a portfolio page. §10 is covered by `contact:check` (mocked delivery); §12 by Lighthouse, axe and the 12-width overflow matrices above; §13 documents all exist.

## Cookie consent flow (§11), 2026-11-03

Tested in headless Chrome on a local build with **fake** analytics IDs (`NEXT_PUBLIC_GA4_ID=G-TEST000000`, a dummy Meta Pixel id); requests to Google, Meta and Yandex hosts were intercepted and blocked, so nothing was sent to any third party. The normal build (no IDs) was restored afterwards. 20 of 20 checks passed:
- First visit: banner with Accept / Reject / Settings; **no** tracking request before a choice.
- Reject: banner closes, `false/false` stored, no banner and no tracking after reload.
- Accept: `true/true` stored; Google tag and Meta Pixel requested only then.
- Settings: "necessary" locked on, analytics and marketing off by default; analytics-only saves `true/false` and requests the Google tag but not the Pixel; the footer control reopens the settings.
- Banner translated in RU, TH and HE; inherits RTL in Hebrew; keyboard Tab reaches the consent controls.
Not tested: real GA4 / Pixel / Metrica delivery (needs the owner's IDs; BLOCKED item 4).

## Core Web Vitals and form journey, 2026-11-03

- **Lab Core Web Vitals (Lighthouse mobile simulation, 72 runs on the 18 new pages × 4 languages, before the font change):** LCP 4.4–4.8 s (above the 2.5 s target in the simulation), CLS 0 on all, TBT 0–5 ms. Cause found: every page, in every language, preloaded all 7 font files, including the Thai and Hebrew fonts, competing with the fonts the page needs.
- **Fix:** `preload: false` for Noto Sans Thai and Heebo in `src/app/[locale]/layout.tsx` (they still load on demand: confirmed `Noto Sans Thai` on `/th` and `Heebo` on `/he`, Fraunces/Inter on English). Preloaded fonts 7 → 3 on every locale. Re-measured `/advertising/tracking-analytics`: LCP 3.9 s (EN), 4.2 s (TH), 4.3 s (HE) — was ~4.6 s; performance 88 / 86 / 86; accessibility 100; CLS ≈ 0; 0 horizontal overflow on all three. The simulated LCP is still above 2.5 s (render-blocking 11 KB stylesheet and font swap on throttled 4G + 4× CPU); real LCP was 708 ms observed earlier. **Not production-verified**: needs a real-user or live-URL measurement after deploy.
- **A hand-rolled LCP probe in headless Chrome returned 0 for image-hero pages** and was discarded (no evidence from it).
- **Form journey (headless Chrome, `/api/contact` intercepted in the browser — no request ever reached the server or Telegram):** EN @1280 and @390, RU / TH / HE @390, 35 checks, all pass: empty submit shows 4 errors and focuses the first invalid field; valid entry opens the review step with the data and focuses its heading; a failed send (mocked 500) shows an alert and stays on review; Edit keeps every field and the consent tick; retry (mocked 200) shows the success state; payload carries the page language and UTM and an empty honeypot; no horizontal overflow in any state.

## LCP follow-up, 2026-11-03 (not resolved)

- **Real throttling (Lighthouse `--throttling-method=devtools`: slow 4G, 4× CPU), mobile, 8 runs:** FCP 1.6–2.7 s, **LCP 5.2–6.2 s**, CLS 0–0.07, TBT 1–3 ms, performance 74–80. This is worse than the simulated figure (3.9–4.5 s), so the simulated LCP is not just a model artefact under a slow-4G profile. Un-throttled, resources are fast (hero AVIF 19 KB, loaded within ~30 ms) and an earlier real-browser run observed LCP 708 ms.
- **Tried, kept:** no preload of Thai/Hebrew fonts (7 → 3 preloaded files; simulated LCP −0.6 s).
- **Tried, reverted:** `experimental.inlineCss` (stylesheet inlined, no `<link rel="stylesheet">`): FCP unchanged at ~0.9 s and LCP 3.97 s vs 3.93 s — no gain, so it was not kept (experimental flag, no benefit).
- **Checked, nothing to fix:** the hero image already has a preload tag and is not lazy-loaded.
- **Open:** the 2.5 s LCP target is not met under slow-4G throttling and the LCP element/cause has not been pinned down (needs a Chrome trace, ideally on the deployed URL where real-user data exists). Left as a post-deploy measurement item (`RELEASE_CHECKLIST.md`, BLOCKED item 20).

## LCP investigation, 2026-11-03 (cause narrowed, not fixed)

Page: `/advertising/tracking-analytics`, Lighthouse mobile with real (devtools) throttling, trace saved and read event by event.

- **The page is visually complete early.** First visual change 0.53 s; a throttled filmstrip (slow 4G, 4× CPU) shows the full hero, heading and first paragraph at 0.7 s, with only a heading font swap at ~1.7 s.
- **The page is lean.** 10 scripts, 159 KB gzipped (507 KB raw; Next + React only), bootup 0.1 s, main-thread work 0.3 s, CLS 0, TBT ~2 ms. Hero image 19 KB AVIF, preloaded, finished by 1.7 s.
- **What the trace shows.** Lighthouse emulates ~560 ms per request here. LCP is re-invalidated at 0.58, 1.53, 1.89, 2.84, 3.02 and **5.40 s**; the last one follows a late JavaScript chunk (finished 5.31 s) and the Link prefetches in the viewport (`?_rsc=` requests from ~3 s). The LCP *element* behind that last update could not be identified (headless Chrome exposes no `largestContentfulPaint::Candidate` event; a PerformanceObserver probe returned nothing).
- **Tried without effect (all reverted):** `fetchPriority="high"` on the hero image (LCP 5.42 s vs 5.39 s); `display: "optional"` for Fraunces (5.39 s, unchanged); `experimental.inlineCss` (3.97 s vs 3.93 s simulated). **Kept:** no preload of Thai/Hebrew fonts (simulated LCP −0.6 s).
- **Conclusion:** no code change found that moves the metric; the visible experience is fast and the 2.5 s target is not met by Lighthouse's LCP number under slow-4G throttling. Next step is a measurement on the deployed URL (real-user LCP, Chrome DevTools Performance panel to see the LCP element) — BLOCKED item 20. Not claimed as passing.

## Spec §§2.2 and 7–15, bullet by bullet (2026-11-03)

Evidence is a command run on the local production build (`next start`) unless noted. `OPEN` = not done and why.

**§2.2 per-page checks** (`site:check`, 476 pages × all rules, 0 errors; plus a spot check of a service page in 4 languages): status, title, description, one H1, canonical, hreflang (4 languages + x-default), Open Graph + Twitter tags, breadcrumbs + BreadcrumbList, direct answer, pricing table, FAQ, image alt, internal links, schema validity — PASS. Mobile layout: 12-width overflow matrices + 336/288/144 further checks — PASS. Accessibility: Lighthouse + axe — PASS. CTA functionality: form journey (35 checks, mocked endpoint) — PASS; **OPEN:** real delivery (no token), real-user performance.

**§7 address and contact:** contact page, footer, mobile contact bar (WhatsApp / call / start-project), email, WhatsApp and map links (a plain Maps *search*, not a listing) in 4 languages — PASS. No Telegram link while no bot is set; no GBP-verified wording; Organization schema address equals the visible address; no geo / rating / review / award in schema — PASS. **OPEN (owner):** phone and legal entity confirmation, a street number if one exists (BLOCKED items 11, 3).

**§8 four languages:** all listed page types (services, industries, locations, portfolio, case studies, journal, about, contact, privacy, terms, cookies, editorial policy, accessibility) return 200 in EN/RU/TH/HE (84 pages); `i18n:check` 0 pending; `site:check` finds no English text on RU/TH/HE pages; prices identical (`pricing:check`). **OPEN:** native review — all RU/TH/HE copy is an LLM draft. §8.2 Hebrew RTL: `lang="he" dir="rtl"`, header / dropdown / breadcrumbs / forms / pricing tables / mobile menu reviewed visually earlier and re-tested at 12 widths for overflow, consent banner and form in RTL — PASS for Chrome. **OPEN:** Safari / Firefox / Edge RTL rendering.

**§9 schema:** Organization, WebSite, WebPage, Service + OfferCatalog (no prices), BreadcrumbList, CreativeWork (concepts, genre "Concept project"), Article (journal template, no entries), ContactPage, FAQPage, ImageObject (hero photo) — present and checked against visible content by `site:check`. Offer / priceSpecification deliberately **not** emitted (prices are indicative). LocalBusiness not used.

**§10 forms:** language, service, island, business type, description, budget, timeline, contact details, review step, confirmation, error handling, data kept after a failed send, UTM / landing page preserved, honeypot, validation messages, focus — PASS (browser, mocked endpoint) and `contact:check` (30 server checks, mocked Telegram). **OPEN:** delivery to a real Telegram chat / email — `BLOCKED` (no token). No real inquiry was ever sent.

**§11 legal, local SEO, analytics:** Privacy (PDPA B.E. 2562), Terms, Cookies, Accessibility, Editorial policy in 4 languages; consent Accept / Reject / Settings with nothing loaded before consent (20 browser checks, fake IDs, third-party hosts blocked); `robots.txt`, `sitemap.xml` (436 URLs), `llms.txt`; Search Console / Yandex verification tags via env; GA4 events (page view, scroll, contact clicks, form events) wired. **OPEN (owner/lawyer):** `[[VERIFY]]` legal markers, GA4 / Metrica / Pixel IDs, GBP verification status.

**§12 performance, mobile, accessibility:** Lighthouse (accessibility / best practices / SEO 100 on 120+ page-runs), axe (no violations), responsive images (AVIF/WebP via `next/image`), lazy loading, font loading (Thai/Hebrew no longer preloaded), keyboard navigation (dropdown, focus rings, consent controls, form), mobile menu, forms, RTL, overflow at the 12 required widths — PASS in Chrome. **OPEN:** Core Web Vitals — Lighthouse LCP 3.9–6.2 s depending on throttling vs a 2.5 s target (see the LCP investigation); Safari layout / forms, Firefox, Edge, real devices.

**§13 documents:** all 17 listed documents exist (`I18N.md` = `docs/i18n.md`), `docs/Index.md` updated — PASS. **§14 status labels** used throughout; nothing marked `PRODUCTION VERIFIED`. **§15 Definition of Done:** 27 of 27 ticked in `TO-DO_2026-11-03.md` §24 with caveats; the last item (production verified after an approved deploy) needs a deploy.

Addendum (LCP element search): three more attempts to read the LCP element — headless and headed puppeteer with a `PerformanceObserver`, and the real Chrome tab through the browser tools — returned no `largest-contentful-paint` entries; in the Chrome tab the first paint was even stamped at 5.9 s for a page that loaded in 142 ms (the tab was not painting until shown). These automated paint timings are therefore unreliable evidence; only the Lighthouse trace numbers above stand. The element can only be identified in a foreground DevTools Performance recording, ideally on the deployed site.

## Fresh full regression on the committed state, 2026-11-04

`tsc` clean, `lint` clean, `build` ok, `i18n:check` 0 pending (RU/TH/HE), `pricing:check` 159 ids / 183 rows, `contact:check` all passed (mocked Telegram), `bots` check 35 pass / 0 fail, `site:check` 476 pages · 0 errors · 15 warnings (12 `[[VERIFY]]` legal markers + 3 FAQ "guarantee" questions answered "no"). The audit's Commit column now records the HEAD hash when the source tree is clean (was a fixed `uncommitted`). Browser checks recorded above were run earlier on the same source (only docs and the audit script changed since).

Addendum (Safari): the owner confirmed with a screenshot that Safari's Developer > Automation checkboxes ("Allow remote automation", "Allow JavaScript from Apple Events") cannot be enabled on this Mac (greyed out, likely a managed-device policy). Scripted Safari testing is therefore not possible here; a person must check Safari (macOS and iOS) by hand (BLOCKED item 36, item 19).

Addendum (LCP, real Chrome tab, visible): first contentful paint 0.8 s on `/advertising/tracking-analytics` (un-throttled, local); a buffered `PerformanceObserver` for `largest-contentful-paint` returned **no entries** on this hero-image page, while text-only pages (`/contact`, `/journal`) did report an LCP of 30–60 ms in the earlier headless runs. So on pages with the full-bleed hero (a `fill` image at 45% opacity under a gradient) Chrome reports no LCP candidate in these automated sessions, and Lighthouse's single late update (5.4 s) is the only LCP signal there. That points at how the hero is composed (dimmed full-bleed image, text over it) rather than at a slow resource, but it is an observation, not a fix: the element must still be confirmed in a foreground DevTools Performance recording on the deployed site.

## Safari 26.5 on macOS (local production build), 2026-11-04

The owner enabled Safari's "Allow JavaScript from Apple Events" (the earlier note that the setting was locked is superseded). Scripts were run in Safari itself via AppleScript; the send endpoint was mocked inside the page, so no real inquiry was sent.

- **Horizontal overflow:** 23 pages (hubs, new and old service pages, contact, portfolio, journal, legal, about, industry, location, `/services/meta-ads`) × 4 languages × the 12 required widths (320 … 1920 px) = **1,104 checks, 0 overflows** (each page loaded in a same-origin frame of that exact width).
- **Contact form journey (English page):** 7 of 7 pass — empty submit shows 4 errors and focuses the first invalid field; review step shows the data with its heading focused; failed send (mock 500) shows an alert and stays on review; Edit keeps every field and the consent tick; retry (mock 200) shows the success state; payload has 2 sends, the page language, UTM kept and an empty honeypot; no overflow afterwards.
- **Mobile menu at 390 px, EN / RU / TH / HE:** opens with 10 visible links, no overflow while open, closes again — all pass. Hebrew: `lang="he" dir="rtl"`, heading direction RTL in the Heebo font, breadcrumbs mirrored (Home at the right edge), phone / WhatsApp link present. (One automatic failure was a test artefact: the Hebrew breadcrumb label is localized, so an English selector found nothing; positions were then read directly and are correct.)
- **Not tested in Safari:** cookie-consent flow (needs a build with analytics IDs), visual review by eye (screen capture is blocked), real iPhone/iPad Safari, Firefox, Edge.

## Fresh rendered-site re-run of §§2.2, 6.9, 7, 8, 9, 11 — 2026-11-04

Run against `next start` on the committed source (clean working tree): **66 of 66 checks pass**, all four languages — contact page (address, email, WhatsApp, Maps-search link), mobile bar (call link), no Telegram link without a bot, Organization schema address equals the visible address with no geo / rating / review / award / LocalBusiness, footer address, privacy (PDPA), terms / cookies / editorial policy / accessibility pages, one H1, canonical, hreflang (en, ru, th, he, x-default), Open Graph (title, description, image, locale, url), breadcrumbs + BreadcrumbList, pricing table + direct answer + FAQ + Service/FAQPage schema, image alt, `lang` and `dir="rtl"` for Hebrew, `robots.txt`, `sitemap.xml` (436 URLs), `llms.txt`, no analytics scripts without IDs and consent, concept label, and 60 further public pages returning 200.

## LCP element identified, 2026-11-04 (cause still open)

Lighthouse gather mode (`-G`, devtools throttling) saves a `TraceElements` artifact. On `/advertising/tracking-analytics` the only above-the-fold candidate is **the hero `<img>`** (`main#main-content > section.relative > div.absolute > img.object-cover`, 412 × 505 px at top 106, "A group of people working on laptops…"). The other listed nodes sit 5,400–6,400 px down the page (a price-table list item and a lazy portfolio image) and are layout/DOM-size entries, not LCP candidates. The hero image is preloaded, 19 KB, finished loading at ~1.7 s, yet LCP is reported at 5.4 s and FCP at 2.7 s, so the delay is between the image arriving and Chrome painting it under 4× CPU slowdown + ~560 ms per request.
- Tried on that basis, no effect (reverted): WebP-only image formats (LCP 5.66 s / 5.33 s vs 5.39 s with AVIF) — so AVIF decode is not the cause; the earlier tests of `fetchPriority="high"`, a dark overlay instead of `opacity-45`, `display: "optional"` for Fraunces and `inlineCss` also gave the same ~5.4 s.
- Open: why paint waits until ~2.7 s (FCP) and ~5.4 s (LCP) with all resources in hand; the next diagnostic is a foreground DevTools Performance recording on the deployed site (BLOCKED item 20). The 2.5 s target is **not** met in Lighthouse's throttled profile.

## LCP bisect, 2026-11-04 (JavaScript implicated, mechanism not found)

Page `/advertising/tracking-analytics`, Lighthouse mobile, devtools throttling (slow 4G + 4× CPU), same build each time:

| Variant | FCP | LCP |
|---|---|---|
| Baseline | 2.7 s | **5.4 s** |
| **Same HTML with every `<script>` stripped** (local proxy) | 2.4 s | **3.0 s** (performance 91) |
| No blur placeholder on the hero image | 1.6 s | 5.4 s |
| No language suggestion / analytics / attribution components | 2.7 s | 5.4 s |
| No header / mobile bar / footer (all layout client components) | 2.7 s | 6.7 s (hero moves up) |
| WebP only (no AVIF) | 2.7 s | 5.7 s |

Findings: (1) the LCP element is the hero image (see above); (2) with no JavaScript the same page reaches an LCP of 3.0 s, so roughly **2.4 s of the 5.4 s is caused by the JavaScript path**, not by the image, CSS or fonts; (3) the delay is **not** caused by the blur placeholder, the layout-level client components, the image format or its priority; (4) there are no console errors and no hydration-time replacement of the hero `<img>` (DOM mutation observer: none), and total bootup and main-thread time are small (0.1 s / 0.3 s). Even the script-free page misses 2.5 s (3.0 s), so reaching the target needs both removing whatever JS work delays the paint and trimming the remaining ~0.5 s. Not claimed as met.
Next diagnostic (cannot be done here): a foreground DevTools Performance recording of the baseline page to see what runs between ~2.7 s and ~5.4 s (BLOCKED item 20).

## LCP fix found: no route prefetching, 2026-11-04

Bisect continued: with only the external scripts removed LCP was 3.9 s, with only inline scripts removed 5.2 s, so the JavaScript path (not its execution time) was the cost. After hydration Next's `<Link>` started a burst of `?_rsc=` route-prefetch requests that competed for the throttled link. `LocalizedLink` (every internal link) now passes `prefetch={false}`.
- Lighthouse mobile, devtools throttling (slow 4G, 4× CPU), same pages: `/advertising/tracking-analytics` LCP **5.4 s → 3.6 s**, performance 79 → 90; `/social-media/monthly-packages` LCP 5.3 s → 3.5 s, performance 76 → 87.
- Trade-off: pages are no longer pre-fetched when links scroll into view, so a first click on an internal link loads that page on demand (a little slower per navigation, faster first load). Revert by removing `prefetch={false}` in `src/components/ui/LocalizedLink.tsx` if navigation speed matters more to the owner.
- **Still above the 2.5 s target** (3.5–3.6 s in this profile; the script-free page reached 3.0 s). Not claimed as met; confirm on the deployed site.
- Checks after the change: `tsc`, lint, `i18n:check`, `pricing:check`, `contact:check`, `site:check` (476 pages, 0 errors, 15 warnings) all unchanged.

## LCP: fonts no longer preloaded, 2026-11-04 (target still not met)

With link prefetching off (above) LCP was 3.5–3.6 s. Blocking `*.woff2` in Lighthouse gave 2.8 s, so the two main web fonts were competing with the hero image for the throttled link. `preload: false` is now set on Fraunces and Inter too (Thai and Hebrew already had it), so the page requests them right after the image; `font-display: swap` and size-matched fallback fonts are unchanged, so layout is stable (CLS 0 on the service pages; the home page's 0.058 is pre-existing).
- Lighthouse mobile, devtools throttling: `/advertising/tracking-analytics` LCP **3.3 s**, `/social-media/monthly-packages` **2.9 s**, `/` 3.3 s, `/th/…` 3.3 s (was ~4.3), `/he/…` 3.4 s (was ~4.3), `/ru/…` 3.5 s; performance 87–92, accessibility 100. Overall since the start of this investigation: 5.4 s → 2.9–3.5 s.
- Tried with no gain (reverted): inlined CSS (3.5–3.7 s), `fetchPriority="high"` on the hero (3.5–3.9 s), Inter as one variable font (same 84 KB of fonts, same LCP).
- Re-checked after the change: 336 overflow checks (7 changed pages × 4 languages × 12 widths) none, 56 axe runs none; `tsc`, lint, `i18n:check`, `pricing:check`, `contact:check`, `site:check` (476 pages, 0 errors, 15 warnings) unchanged.
- **Still above 2.5 s** in this deliberately harsh profile (slow 4G + ~560 ms latency + 4× CPU). The script-free page measured 3.0 s before the font change, so the remaining gap is the JavaScript and the fonts themselves; closing it further means shipping less JavaScript or system fonts (a design decision). Confirm on the deployed site with real-user data.

## LCP: measurement noise and remaining gap, 2026-11-04

- **Script-free page on the current build** (all `<script>` stripped through a local proxy): LCP 2.85 s on `/advertising/tracking-analytics` and 1.78 s on `/social-media/monthly-packages`. With scripts the same pages measured 3.3 s and 2.9 s, so JavaScript now costs about 0.5–1.1 s.
- **Run-to-run noise:** server response time is under 30 ms, yet first paint (FCP) flips between ~1.5 s and a constant ~2.68 s for the *same* page on identical builds (seen with and without scripts). Single Lighthouse runs on this machine therefore carry roughly ±1 s of noise; differences of a few tenths of a second between variants are not meaningful, and only the large steps (5.4 s → ~3.3 s from disabling route prefetching and font preloading) are real.
- **Remaining levers, none a clear win:** fewer or lighter JavaScript chunks (159 KB gzipped of Next + React; a framework baseline), or system fonts instead of Fraunces/Inter (a design decision). The 2.5 s target is **not claimed as met**; verify with real-user data after deployment (BLOCKED item 20).

## LCP: system-font experiment, 2026-11-04 (discarded)

On a throwaway branch (`experiment/system-fonts`, deleted) Fraunces and Inter were removed and the page used the system fallback stack (0 web fonts for English/Russian). Lighthouse mobile, devtools throttling, 2 runs × 3 pages: LCP 2.82–3.09 s, performance 91–95 — only about 0.4 s better than the current setup (2.9–3.3 s) and still above 2.5 s, so it does not reach the target and would change the brand typography. Not merged. Together with the script-free measurement (1.8–2.9 s), the target in this harsh profile would need both no web fonts **and** much less JavaScript — a redesign-level change, not a fix. Left for the owner to decide after real-user data from the deployed site.

## LCP: server-rendered links experiment, 2026-11-04 (discarded)

To test the "less JavaScript" lever, `LocalizedLink` (a client component wrapping `next/link` on every internal link) was replaced on a throwaway branch by a plain server-rendered anchor (English pages only, locale handling removed for the test). Result: page JavaScript fell only from 159 KB to 150 KB gzipped and Lighthouse LCP stayed at 2.9–3.5 s (2 runs × 3 pages), i.e. no gain over the current build. The refactor (threading the locale through every page and component) is therefore **not** worth its routing risk. Branch deleted, nothing merged.
Combined picture of the LCP investigation: the real wins were disabling route prefetching and font preloading (5.4 s → ~3 s); fonts, image format/priority, CSS inlining and link hydration give nothing measurable; what remains is the framework's JavaScript baseline (Next + React) and the web fonts, i.e. a redesign-level change; the 2.5 s "good" threshold is not met in this deliberately harsh profile.

**Owner decision, 2026-11-04:** the LCP item is closed as "needs real data after deploy". Nothing further is changed before deployment. After deploy: measure real-user LCP (Chrome UX Report / `RELEASE_CHECKLIST.md`); only if it is above 2.5 s, choose between system fonts and a lighter front end.
