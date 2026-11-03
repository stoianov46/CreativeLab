# Integrations

State of every external integration. **No integration is verified end to end** — delivery needs credentials that do not exist in this environment, so only validation, the mocked API and the browser flow were tested.

| Integration | Code | What was tested | Status |
|---|---|---|---|
| Contact form → Telegram | `src/app/api/contact/route.ts` | `npm run contact:check`: the real handler with a **mocked** Telegram (validation, honeypot, rate limit, option whitelist, HTML escaping, UTM / first-page / reply-language lines, 503 without credentials, 502 on rejection); browser flow incl. a failed send | `BLOCKED` — needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_STAFF_CHAT_ID` |
| WhatsApp links | `src/lib/integrations.ts`, `MobileContactBar`, contact page | Link format only; the team number `+66 80 870 5704` is shown (owner to confirm it is the business number) | `OWNER INPUT REQUIRED` |
| Telegram links | same | Hidden until `NEXT_PUBLIC_TELEGRAM_BOT` is set (`@creativelab1_bot` is unconfirmed) | `BLOCKED` |
| Telegram / WhatsApp bots | `bots/` | `cd bots && npm run check`: typecheck + 35 tests | Code complete; not deployed — needs tokens, a WhatsApp Cloud API account and a public host |
| Analytics (GA4, Yandex Metrica, Meta Pixel) | `src/lib/analytics.ts`, `Analytics.tsx` | Consent gating by code review and the banner; nothing loads until an ID is set and the visitor accepts | `OWNER INPUT REQUIRED` — IDs |
| Search Console / Yandex Webmaster | `src/app/[locale]/layout.tsx` | Tags emitted only when the env codes are set (checked with test values) | `OWNER INPUT REQUIRED` — codes and sitemap submission |
| Email / CRM | none | — | `BLOCKED` — no endpoint; decision 23.09: Telegram only for now |

## Environment variables (server-only unless `NEXT_PUBLIC_`)

`TELEGRAM_BOT_TOKEN`, `TELEGRAM_STAFF_CHAT_ID` (server-only — never in `src/` or a `NEXT_PUBLIC_` variable, see `SECURITY.md`) · `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_TELEGRAM_BOT` · `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_YM_ID`, `NEXT_PUBLIC_META_PIXEL_ID` · `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_YANDEX_VERIFICATION`. Template: `.env.example`; full table: `docs/Index.md`. The bots read their own `bots/.env`.

## Data the enquiry form sends

Name, email, optional phone/messenger, message, consent; optional service, island, business type, budget band, timeline and reply language; plus the page, the first page seen this session, the referrer and any UTM parameters. The first-touch values live only in the visitor's tab session storage until they submit. Staff receive it as one Telegram message; nothing is stored by the site.

## Test after credentials exist

1. Set the two Telegram variables on the host and **revoke the old leaked tokens** first (`SECURITY.md`).
2. Send one test enquiry from the live form; confirm the staff message shows island, business type, budget, timeline, reply language, UTM and first page seen.
3. Confirm a 503 no longer appears and the success state shows.
