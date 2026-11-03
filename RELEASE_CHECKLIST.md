# Release Checklist

Nothing below has been done by the automated work: **no push, DNS change or deploy happens without explicit owner approval.**

## 1. Owner decisions and inputs (see the Obsidian BLOCKED list)
- [ ] Commit and push approved (branch named).
- [ ] New Telegram bot token and chat ID created; **old leaked tokens revoked in @BotFather**.
- [ ] Phone `+66 80 870 5704` confirmed as the business number; footer name "CreativeLAB Koh Phangan" confirmed or replaced; Google Business Profile status confirmed.
- [ ] Draft revisions / turnaround values and price positioning approved; Included / Not included lists read.
- [ ] Concept-portfolio wording approved.
- [ ] Lawyer has reviewed Privacy, Terms and Cookie Policy; every `[[VERIFY]]` marker resolved.
- [ ] Native reviewers have read the RU / TH / HE copy.
- [ ] Decision on the dedicated sub-service pages (BLOCKED item 31).

## 2. Host and environment
- [ ] A Node-capable host (e.g. Vercel); the site does **not** use static export.
- [ ] Server env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_STAFF_CHAT_ID`.
- [ ] Public env as decided: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_TELEGRAM_BOT`, analytics IDs, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_YANDEX_VERIFICATION` (public values are baked in at build time — rebuild after changing them).
- [ ] DNS for `creativelab.in.th` points at the host; HTTPS works.

## 3. Before deploying (run locally)
- [ ] `npm ci`
- [ ] `npx tsc --noEmit` · `npm run lint` · `npm run build`
- [ ] `npm run i18n:check` · `npm run pricing:check` · `npm run contact:check`
- [ ] `npm run site:check` — 0 errors
- [ ] `cd bots && npm run check`
- [ ] `git diff` reviewed; no secrets (the working tree was scanned once and was clean).

## 4. After deploying
- [ ] `npm run site:check -- --base https://creativelab.in.th` — 0 errors on the live site (currently the live URL returns 403).
- [ ] Send one real test enquiry; check the Telegram message and the success state.
- [ ] Lighthouse and Core Web Vitals on the live URL (mobile LCP target ≤ 2.5 s).
- [ ] Google Rich Results Test and Schema.org validator on a service page, the contact page and a concept page.
- [ ] Search Console and Yandex Webmaster verified; sitemap submitted; indexing checked.
- [ ] Test in Safari, Firefox, Edge and on real iOS / Android phones; one screen-reader pass.
- [ ] Cookie banner: nothing loads before consent; "Cookie settings" reopens the choice.

## 5. Rollback
Redeploy the previous build; the content is data-driven and there is no database. Rotate the Telegram token if it was exposed.
