# Build Notes — pending human review

Everything that is **not implemented, only drafted, or blocked** on a
person (client answer, teammate decision, credentials, native review).
Short list here; full context in `PROGRESS.md` → "Open Questions &
Blockers", task-level status in `Improvements.md`. When something is
resolved, remove it here and fold the answer into `PROGRESS.md`.

Per `proposal.md`'s Truth Rule and Missing Data Protocol: nothing on the
live pages is invented as fact. Anything not verifiable is either
omitted, phrased qualitatively, or marked `[[VERIFY]]` in source.

## Decisions needed

- [ ] **"Shop"** (fork note): the existing `/websites-digital/ecommerce` service page, or a real CreativeLAB store? A store needs a brief (what's sold, payments, delivery).
- [ ] **"Start a Project" header → footer** (Improvements.md §12): remove from header, or just make the footer link a button?
- [ ] **Header style:** translucent (current) vs transparent-on-hero.
- [ ] **Near-duplicate pairs inside hubs** (`/food-restaurants/website` vs `/websites-digital/restaurant-website`, etc.): kept with different angles. Confirm.
- [ ] **Bot matrix:** the proposal's "15. BOT" row says "13 services × 5 locations"; built per the client's 23.09 decision as 8 services (+ sub-services) × 3 islands + "Other". Confirm.
- [ ] **Lead storage:** Telegram only for now (decision 23.09). Google Sheets / Airtable / CRM later: choose one and supply credentials.
- [ ] **Not built (not selected 23.09):** automated site test suite (one H1, links, hreflang, schema, banned phrases), free-backlinks plan (proposal ~L417), AdFoto Wayback analysis (~L1245). Homepage variants /v1–/v5: client said not needed.

## Review

- [ ] **RU/TH/HE translation of the 23.09 content expansion is PARTIAL** — stopped early to save tokens. Still untranslated (shown in English until done): RU 1372, TH 2440, HE 2557 strings. Resume per file with `npm run i18n:pending -- <locale> <file>` → translate → `npm run i18n:accept -- <locale> <file>` (docs/i18n.md).
- [ ] **All RU/TH/HE copy is an LLM draft** — needs a native reviewer per language before launch, SEO fields especially.
- [ ] **New English content** (services, industries, locations, expanded hubs) was written by LLM under the Truth Rule. Review for tone and facts, especially:
  - island area names (Tanote Bay, Ao Leuk, Choeng Mon were web-verified; the rest are well known);
  - general "how we work" statements;
  - prices marked "Indicative", including new multi-island add-on rows (Meta Ads, Web Design), which are estimates.
- [ ] **Word counts:** a few service pages come out ~740–750 words by a strict count vs the proposal's 800 (hubs ~1380–1400 vs 1500). Visible text incl. headings is above target; extend if the client wants a strict count.
- [ ] **Hebrew:** a few first-person FAQ questions are masculine singular. Check gender-neutral phrasing.
- [ ] **Visual QA:** mobile widths, cross-browser, Hebrew RTL and Thai line breaks with the real translated copy. The browser automation disconnected this session.

## Blocked on client input / credentials

- [ ] **Telegram token leak:** the old token was in client JS and is still in git history. Confirm it's revoked (@BotFather); set a new `TELEGRAM_BOT_TOKEN` + `TELEGRAM_STAFF_CHAT_ID` on the host. Until then the contact form returns an error. See `SECURITY.md`.
- [ ] **`NEXT_PUBLIC_TELEGRAM_BOT`:** set once a real bot is live (`@creativelab1_bot` is unconfirmed). No Telegram buttons show until then. WhatsApp links use the team number `+66 80 870 5704`.
- [ ] **Bots deployment:**
  - host with a public URL;
  - WhatsApp Business / Cloud API account (`WHATSAPP_*`, incl. `WHATSAPP_APP_SECRET`);
  - bot photos (`public/bot/*.jpg` + `BOT_PHOTO_BASE_URL`);
  - confirm `CONTACT_EMAIL`;
  - Redis/KV session store if running more than one instance;
  - an analytics sink for bot events.
  - See `bots/README.md`.
- [ ] **Analytics IDs:** `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_YM_ID` / `NEXT_PUBLIC_META_PIXEL_ID`; Search Console + Yandex Webmaster access.
- [ ] **Business details:** physical address, legal entity name, social profile URLs (for schema `sameAs`), team/author bios.
- [ ] **Real content:** portfolio, case studies (template ready: `src/content/case-studies.ts`), testimonials, photos/video (the hero slider and portfolio use placeholders), Journal articles (template ready: `src/content/journal.ts`), logo.
- [ ] **Pricing** confirmation (all tables are indicative).
- [ ] **Privacy Policy / Terms:** lawyer review (Thai law, PDPA); `[[VERIFY]]` markers remain.
- [ ] **Production deploy** (Vercel/Node) + `creativelab.in.th` DNS, then Lighthouse / Core Web Vitals on the live URL.

## Technical follow-ups (known, not urgent)

- [ ] **No Content-Security-Policy header yet:** analytics hosts would need allow-listing once IDs exist.
- [ ] **Contact-form rate limit is in-memory, per server instance.** Use a shared store (Upstash/KV) if spam appears.
- [ ] **`TrustStrip.tsx` is unused** and not localized. Delete it, or localize before reuse.
