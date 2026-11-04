# FINAL QA — test results (short version)

Last updated: 2026-11-04. Full old log with every experiment: `docs/archive/FINAL_QA_FULL_LOG.md`. TODO list: `TO-DO_2026-11-03.md`.

## 0. How to read this file

- Everything was tested on a LOCAL build (`npm run build && npm run start`). Nothing was tested on the live site (it returns 403 to everyone).
- Status words: **PASS** = checked and fine. **FIXED** = a bug was found and fixed. **NOT TESTED** = needs a person, a device or the deployed site.
- Browsers used: Chrome (most checks) and Safari 26.5 on macOS (overflow, form, menu). Firefox, Edge and real phones were NOT tested.
- Never write `PRODUCTION VERIFIED`.

## 1. Automatic checks (all PASS)

Run these commands to repeat the checks. Last run 2026-11-04 after the latest change.

| Command | What it proves | Result |
|---|---|---|
| `npx tsc --noEmit` | TypeScript has no errors | PASS |
| `npm run lint` | Code style | PASS |
| `npm run build` | The site builds | PASS |
| `npm run i18n:check` | Russian, Thai, Hebrew have every English key | PASS, 0 missing |
| `npm run pricing:check` | Every price row uses a central price id; numbers are the same in all languages | PASS, 159 ids / 183 rows |
| `npm run contact:check` | Contact form server code: validation, spam trap, rate limit, Telegram / email / webhook delivery (network mocked) | PASS |
| `npm run nav:check` | Mobile menu has exactly 8 category links in all 4 languages | PASS |
| `npm run site:check` | Crawls every page in 4 languages: titles, descriptions, one H1, canonical, hreflang, schema, FAQ, links, banned words | PASS: 476 pages, 0 errors, 15 warnings |
| `(cd bots && npm run check)` | Chat bots | PASS, 35 tests |

The 15 warnings are expected: 12 `[[VERIFY]]` markers in the legal pages and 3 FAQ questions about "guarantees" that answer "no".

## 2. Browser checks

| Area | What was done | Result |
|---|---|---|
| Horizontal overflow | 23 page types × 4 languages × 12 widths (320 to 1920 px) in Safari = 1,104 checks. Earlier Chrome matrices of 768 + 480 + 288 + 336 checks | PASS, 0 overflows (a few were found earlier and FIXED, see section 3) |
| Accessibility | Lighthouse on 120+ pages; axe-core (WCAG 2.0 to 2.2 A/AA) on 14 pages × 4 languages × 2 widths and on the 18 new pages × 4 languages × 2 widths | Lighthouse accessibility, best practices and SEO = 100. axe: no violations after fixes |
| Mobile menu | 120 touch runs in Chrome: 4 languages × 5 start pages × 6 widths (320, 360, 375, 390, 412, 430). Safari at 390 px in 4 languages | PASS: 8 category links, no overflow, no console errors, a tap goes to the right page and closes the menu |
| Contact form in the browser | Empty submit, valid entry, review step, Edit, failed send, retry, success. English at 1280 and 390 px; Russian, Thai, Hebrew at 390 px (network mocked) | PASS, 35 checks in Chrome; 7 of 7 in Safari. No real inquiry was sent |
| Cookie consent | Fake analytics ids, third-party hosts blocked | PASS, 20 of 20: nothing tracked before a choice; Reject and Accept work; Settings work; works in RU/TH/HE |
| Hebrew right-to-left | Screenshots and structure checks | PASS in Chrome; Safari scripted checks PASS (not looked at by eye) |
| Rendered-site facts | 66 checks on the running site: address, email, WhatsApp, no Telegram bot link, schema without fake ratings, robots, sitemap (436 URLs), llms.txt, no analytics without ids | PASS, 66 of 66 |
| Contacts | `/contact` shows `tel:+66808705704`, Telegram link `https://t.me/+66808705704`, "Copy number" button in 4 languages | PASS |
| Keyboard | Menu with Escape, dropdown with Enter, focus ring on 67 elements | PASS |

## 3. Bugs found and FIXED

1. Mobile menu was invisible (a blur effect shrank the fixed panel). Fixed.
2. Header overflowed at 1024 px. Fixed.
3. Long Russian words overflowed at 320 px (footer, headings, one call-to-action heading). Fixed with `overflow-wrap: anywhere`.
4. Switching from Hebrew to English caused a 404 on client-side navigation. Now a normal link.
5. Mobile bar link text "Start" was not descriptive. Now "Start a Project".
6. Language notice covered the open mobile menu. Lowered.
7. Contact form did not move focus to the first error. Fixed.
8. Language button name did not contain its visible text "EN". Fixed.
9. The price table was not keyboard-reachable on phones. Now a focusable labelled region.
10. Concept-page label had low contrast (3.46:1). Fixed.

## 4. Page speed (LCP = time until the biggest element is painted)

- Test profile: Lighthouse, slow 4G, 4× slower CPU, devtools throttling. It is harsh and noisy (about plus or minus 1 s between runs).
- Result: **LCP went from 5.4 s to about 2.9 to 3.5 s.** Target is 2.5 s. **Target NOT reached** in this profile.
- What worked: turn off route prefetching (`prefetch={false}` in `LocalizedLink`), and do not preload fonts (`preload: false` in `src/app/[locale]/layout.tsx`).
- What did NOT help (tried and removed): image format, `fetchPriority`, inlined CSS, removing the blur, `display: optional`, one variable font, system fonts (only 0.4 s), plain server-rendered links.
- Without any JavaScript the page still needs 1.8 to 2.9 s. So the remaining gap is the framework baseline (Next + React) and the web fonts.
- **Owner decision 2026-11-04: closed as "needs real data after deploy".** After deploy measure real-user LCP. Only if above 2.5 s decide between system fonts and a lighter front end.
- Un-throttled local run: LCP 0.7 s.

## 5. NOT TESTED (needs a person, a device or the live site)

- Firefox, Edge (not installed), a real iPhone or Android phone.
- Screen readers: VoiceOver, NVDA, TalkBack.
- Looking by eye at Thai line breaks and Russian wrapping.
- Cookie consent in Safari. `prefers-reduced-motion`. Print styles.
- A real lead: Telegram, email and webhook delivery with real keys (the owner sets the keys after hosting).
- The live site: real network, Core Web Vitals field data, Rich Results Test.
- Quality of the Russian, Thai and Hebrew text (machine drafts, needs native reviewers).
- Legal pages (need a lawyer).

## 6. Rules about test evidence

- A test counts only if a command or a browser run produced it. Do not claim a check you did not run.
- Automated paint-timing probes (PerformanceObserver in headless Chrome) were unreliable on this site and were discarded. Only Lighthouse trace numbers are used.
- Test scripts for axe and the multi-width browser runs are NOT kept in the repo (they need extra dev packages). The repo keeps `contact-check`, `nav-check`, `pricing-check`, `site-check` and `i18n`.
