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
