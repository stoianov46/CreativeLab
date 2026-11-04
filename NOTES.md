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

- [ ] **Privacy / Cookie Policy drafts (2026-11-03):** Privacy now names the new form data and the session-only attribution, and adds sections on cookies and Thailand's PDPA B.E. 2562; a new `/cookies` page lists what the site stores (consent choice in local storage, first-visit info in session storage; analytics/marketing only after consent). All are **drafts**: counsel to confirm controller details, legal bases, transfer wording (Telegram delivery) and retention (`[[VERIFY]]` markers).
- [ ] **Search Console / Yandex:** set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_YANDEX_VERIFICATION` (the `content` value of the verification meta tag), rebuild, then verify and submit the sitemap.
- [ ] **Possibly low price:** the drone add-on to a photo shoot (฿3,000–6,000) is below the one benchmark found (฿5,000–10,000) — owner to decide (`PRICING_STRATEGY.md`).
- [x] **Internal linking:** every service page now has a "More in this category" block linking its sibling services and the hub's concept project; only the 10 intentionally duplicate `/services/*` pages (canonical to a hub page) have fewer than 3 inbound links.

- [ ] **Concept portfolio (`DEMO_PORTFOLIO.md`):** 8 original concepts for fictional businesses, clearly labelled, no results/clients/testimonials — read the wording and decide whether the fictional-business framing suits the public site. No photos, video or drone footage are represented; real portfolio work is still needed. Translations are LLM drafts.
- [ ] **Contact form data (privacy policy):** the enquiry form now also collects island, business type, optional budget and timeline, and sends first-touch UTM parameters + landing page (kept only in the visitor's tab session, `sessionStorage`, until they submit). The privacy policy draft should name these; lawyer to confirm. Delivery to Telegram is untested end to end (no token): only validation and the mocked API are tested (`npm run contact:check`).

- [ ] **Browser QA (`FINAL_QA.md`) was Chromium-only on a local build.** Still needs: Safari/Firefox/Edge, real iOS/Android devices, a screen-reader pass, an eyeball review of Thai line breaks and Russian wrapping, and Core Web Vitals on the deployed URL (mobile LCP is 4.3–4.7 s under Lighthouse simulation but 0.7 s observed — see `FINAL_QA.md`; the one flagged lever is the single 10.8 KB render-blocking stylesheet).

- [ ] **SEO content pass (2026-11-03):** `site:check` now enforces on commercial pages (hubs, services, `/services/*`, industries, locations): direct answer 40–60 words, English description 140–165 characters, at least 5 FAQ items, links to hub / an industry / a location / 3+ other services, primary keyword in the title or H1. Fixed: 7 direct answers (34–39 words), 2 descriptions, and 4 primary keywords that did not match their title/H1 (`/advertising` → "advertising agency Koh Phangan", `/branding-creative/branding` → "brand identity design Koh Phangan", `/websites-digital/ecommerce` → "e-commerce website Koh Phangan", `/industries/wellness-retreats` → "wellness retreat marketing agency"). Added clauses restate what the pages already say (no new claims) — read them. Not measurable by code: search intent, content quality and uniqueness, whether the answers are actually good. RU/TH/HE changes are LLM drafts.

- [ ] **Site audit (`AUDIT.md`, `npm run site:check`)** ran against a **local build only**: 0 errors, 11 warnings. The live site returns 403 Forbidden to every request (a real Chrome too, served by openresty), so a production audit needs the site to be served (or an exported URL list). Mobile, RTL appearance, accessibility and Lighthouse are not covered by it.
- [x] **Organization schema** switched from `ProfessionalService` (a LocalBusiness subtype) to plain `Organization`, and the approximate `geo` was removed — CreativeLAB's own Google Business Profile is unverified and there are no opening hours. Revisit only if the owner confirms a verified listing.
- [ ] **Address (2026-11-03):** the owner-given `PX5R+JX7, Forma.in.th, Koh Phangan, Ko Pha-ngan District, Surat Thani 84280, Thailand` is in `SITE.address` and shown on the contact page and footer, in the schema and in `llms.txt`. It is the same address FORMA uses; the Maps listing the owner supplied is FORMA's, so it is **not** linked as a CreativeLAB listing (the "View on map" link is a plain Maps search for the Plus Code). Owner to confirm: no street/building number exists, GBP status (`OWNER INPUT REQUIRED`).
- [ ] **Phone `+66 80 870 5704`** (`SITE.phone`, also WhatsApp) was provided by the team on 2026-09-15 and is shown on the contact page and in schema. Owner to confirm it is the business number (`OWNER INPUT REQUIRED`); remove from `SITE.phone` if not.
- [ ] **`SITE.legalName` = "CreativeLAB Koh Phangan"** appears in the footer copyright. It is a trading name, not a confirmed legal entity — owner to confirm or replace (`OWNER INPUT REQUIRED`). No registration number is shown anywhere.
- [ ] **Telegram on the contact page** now appears only once `NEXT_PUBLIC_TELEGRAM_BOT` is set (`@creativelab1_bot` is unconfirmed), matching the rest of the site.
- [ ] **Schema decisions:** services carry an `OfferCatalog` of *Service* items whose description holds the visible indicative price — deliberately no `Offer` / `price` / `priceSpecification` (prices are provisional). No `CreativeWork` / `ImageObject` for the portfolio: the images are placeholders/reference imagery, not CreativeLAB's own work (Truth Rule); `case-studies/[slug]` and journal `Article` schemas exist and will apply when real entries are added. `site:check` enforces these rules.

- [ ] **Pricing rework (`PRICING_MASTER.md`).** CODE DONE 2026-11-03: all 133 pricing rows (8 hubs + `/services/*` landing pages) use a `priceId` from `src/content/pricing.ts`, every row has Included / Not included lists, and `npm run pricing:check` enforces it (CI). Still open: (1) **figures are not researched** — only Advertising was searched, thin evidence (`PRICING_STRATEGY.md`); the other 123 rows carry the old numbers; (2) **revisions / turnaround values are drafts** by service type, shown publicly, owner must approve; (3) the Included / Not included lists were written from existing page copy, owner/team should read them; (4) **Signature tier** — added 2026-11-03 on the monthly social packages as a draft price (owner to approve); other recurring services (management retainers, local SEO) still have fewer than three tiers; (5) Service / OfferCatalog schema from the pricing data.
- [ ] **Hebrew pricing table caption** still English ("Indicative prices for {service}", screen-reader only; `blocks.pricingCaption` in `he/ui.json`).

- [x] **RU/TH/HE translation of the 23.09 content expansion — CODE DONE 2026-11-03** (was 1372 / 2440 / 2557 strings in English; `npm run i18n:check` now reports 0 pending for all three, and a scan finds no English-only strings). It is still an LLM draft, see next item. Re-run `i18n:check` after any English edit.
- [ ] **All RU/TH/HE copy is an LLM draft** — needs a native reviewer per language before launch, SEO fields especially. Specific things for reviewers:
  - **RU:** `services/commercial-video.json` `faqs.4.a`; the repeated «в согласии с…» phrasing reads a little bureaucratic.
  - **TH:** Koh Tao area spellings (แม่หาด, หาดทรายรี, ฉลอกบ้านเก่า, อ่าวโตนด, อ่าวลึก) and Koh Phangan places (ท้องศาลา, ศรีธนู, หาดริ้น) were written from model knowledge; confirm.
  - **HE:** Koh Tao names (מאה האד, סאירי, צ'אלוק באן קאו, מפרץ תנוטה, או לוק) and Koh Phangan names (טונג סאלה, סריתאנו, האד רין) were chosen by the translator; confirm. Cookie checkbox uses «מסכים/ה».
- [ ] **New English content** (services, industries, locations, expanded hubs) was written by LLM under the Truth Rule. Review for tone and facts, especially:
  - island area names (Tanote Bay, Ao Leuk, Choeng Mon were web-verified; the rest are well known);
  - general "how we work" statements;
  - prices marked "Indicative", including new multi-island add-on rows (Meta Ads, Web Design), which are estimates.
- [x] **Word counts** (re-measured 2026-11-03 on the rendered pages by `site:check`): every service page and hub is at or above the proposal's targets (~800 / ~1500 words of main content, including headings, pricing and FAQ). The older "~740–750 strict count" note no longer applies; do not pad. A `word-count` warning appears if a page falls below.
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
- [ ] **Business details:** (physical address now set, see Review) legal entity name and registration, social profile URLs (for schema `sameAs`), team/author bios.
- [ ] **Real content:** portfolio, case studies (template ready: `src/content/case-studies.ts`), testimonials, photos/video (the hero slider and portfolio use placeholders), Journal articles (template ready: `src/content/journal.ts`), logo.
- [ ] **Pricing** confirmation (all tables are indicative).
- [ ] **Privacy Policy / Terms:** lawyer review (Thai law, PDPA); `[[VERIFY]]` markers remain.
- [ ] **Production deploy** (Vercel/Node) + `creativelab.in.th` DNS, then Lighthouse / Core Web Vitals on the live URL.

## Technical follow-ups (known, not urgent)

- [ ] **No Content-Security-Policy header yet:** analytics hosts would need allow-listing once IDs exist.
- [ ] **Contact-form rate limit is in-memory, per server instance.** Use a shared store (Upstash/KV) if spam appears.
- [ ] **`TrustStrip.tsx` is unused** and not localized. Delete it, or localize before reuse.

## Sub-service pages added 2026-11-03 (owner decision: "Build all ~18")

- [ ] **OWNER INPUT REQUIRED — approve the 18 new pages:** campaign-strategy, advertising-creative, tracking-analytics, stories, property-social-media, listing-presentation, restaurant-branding, promotional-campaigns, restaurant-video, local-business-content, structured-data, website-maintenance, brand-films, video-editing, creative-production, logo-design, visual-systems, packaging-design. Scope, what each includes and the **37 draft prices** (`src/content/pricing.ts`, marked indicative) were set by Claude, not by the owner or market quotes.
- [ ] **Contractual statement to confirm:** the logo-design FAQ says the final logo belongs to the client once paid in full. Confirm with the owner/lawyer before launch.
- [ ] **Image problem (existing, not new):** `images.social` (`social.jpg`) shows a Netflix logo. It is used on the homepage, wellness-retreats, the food and social-media hubs, the advertising hub (~line 327), `/services/meta-ads` and `/services/social-media-management`. Replace with owned photography (item 13). The new pages avoid this image.
- [ ] Hero photos on the new pages reuse the six existing JPGs (several pages share one photo) — real photos needed.
- [ ] RU/TH/HE copy for the new pages is an LLM draft; native review as for the rest (BLOCKED item 16). Some Hebrew/Thai strings spell numbers differently from English; `pricing:check` enforces digits in price rows.
- Drafter-defined terms to confirm: a Stories "sequence" = about 3–5 frames; ad copy is delivered in English unless Thai/Russian/Hebrew is raised at briefing; filming is not part of the creative or Stories packages.

## Spec gaps — status after the owner's decisions (2026-11-03)

- [x] **Portfolio breadth (spec §6):** owner chose to keep the 8 labelled concept boards. Closed.
- [x] **Tiers on other recurring services:** owner chose "split the existing range"; done for Google Ads, Meta Ads and local SEO retainers. The new Signature prices (30,000–45,000 / 25,000–40,000 / 25,000–40,000) are drafts, owner to approve (BLOCKED item 18/25).
- [ ] **Safari / Firefox / Edge:** Safari opened five pages and showed the right titles, but layout and overflow were not inspected (screen capture is blocked, and Safari's Automation checkboxes are greyed out — likely a managed-device policy); Firefox and Edge are not installed (BLOCKED items 19 and 36).
