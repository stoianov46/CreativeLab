# CreativeLAB bots

Telegram + WhatsApp **project-intake funnel** (not a generic AI chat), built to
`proposal.md` → "TELEGRAM БОТЫ — PREMIUM INTAKE FUNNEL" and the "15. BOT" rows.

```
Language → Welcome → Service → Sub-service / project type → Location → Description
→ Budget (optional) → Timeline (optional) → Files → Name → Contact → Review / Edit
→ Submit → Handoff ("we'll reply within 24h" + website link)
```

- 8 services (Advertising, Social Media, Photography, Video, Branding, Web, SEO,
  Digital), each with sub-services that are real pages on the website
  (`src/content/hubs/*.ts`) + "Something else / not sure".
- Locations: Koh Phangan, Koh Samui, Koh Tao, Other / remote. Availability is
  data-driven (`unavailableIn` in `shared/data.ts`); if a service isn't offered
  somewhere, the bot offers nearby locations, similar services, or "continue
  anyway". On-site work on Samui/Tao shows "travel fee may apply" (no prices).
- Back, 🌐 Language and Restart on every step (also `/back`, `/language`,
  `/restart`, or typing "back"/"назад"/…); switching language keeps all answers.
- Progress is saved (file store, 14 days): leave, come back, `/start` → "Continue?".
- Multiple photos / documents / videos / voice notes / links, ≤ 20 MB each, ≤ 10
  files; friendly fallback (send a link or email) for anything rejected.
- If delivering the lead to staff fails, the user is told honestly, shown the
  direct contacts and a "Try again" button — nothing is lost.
- EN / RU / TH / HE copy; Hebrew is RTL-marked with isolated user values.

## Layout

| Path | What |
|---|---|
| `shared/flow.ts` | **Pure** engine: `reduce(state, input, ctx)` → `{ state, effects, notice }`, `render(state, ctx)` → `View`. No I/O. |
| `shared/data.ts` | Services, sub-services, locations, budget/timeline ranges, availability + fallback. |
| `shared/i18n.ts` | All user-facing strings in 4 languages. |
| `shared/deeplink.ts` | Deep-link parser/builder (one parser for both channels). |
| `shared/runtime.ts` | Shared impure loop: load session → reduce → submit effect → save → render. |
| `shared/notify.ts` | Posts the lead (all fields, HTML-escaped) + attachments to the staff Telegram chat. |
| `shared/session-store.ts` | File (atomic JSON) and in-memory session stores with TTL. |
| `shared/guards.ts` | Rate limiter, per-user queue, log redaction, constant-time compare. |
| `shared/config.ts` | Every env var, read lazily. |
| `telegram/` | grammY adapter (inline keyboards, share-phone button, polling or webhook). |
| `whatsapp/` | Cloud API adapter (Express webhook, signature check, lists/buttons). |
| `tests/` | `node:test` suites. |

## Setup

```bash
cd bots
npm install
cp .env.example .env   # fill in — every variable is documented there
```

## Running

```bash
npm run telegram         # dev: long polling, auto-reload (TELEGRAM_MODE=polling)
npm run whatsapp         # dev: WhatsApp webhook server on $PORT, auto-reload
npm run start:telegram   # prod (no watch); set TELEGRAM_MODE=webhook
npm run start:whatsapp   # prod (no watch)
npm run test             # all tests (in-memory sessions)
npm run typecheck        # tsc --noEmit
npm run check            # typecheck + tests
```

## Environment

See `.env.example` for the full, commented list. Summary:

| Variable | Purpose | Required |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Bot token (@BotFather); also used to post WhatsApp leads to staff | Yes |
| `TELEGRAM_STAFF_CHAT_ID` | Staff chat that receives every lead | Yes (for delivery) |
| `TELEGRAM_MODE` | `polling` (default) or `webhook` | No |
| `TELEGRAM_WEBHOOK_SECRET` | Secret checked against `X-Telegram-Bot-Api-Secret-Token` | In webhook mode |
| `TELEGRAM_WEBHOOK_URL` | Public URL; registered via `setWebhook` on start if set | No |
| `TELEGRAM_WEBHOOK_PATH` | Webhook path (default `/telegram/webhook`) | No |
| `TELEGRAM_PORT` | Webhook server port (default 3000) | No |
| `WHATSAPP_ACCESS_TOKEN` | Cloud API access token | WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID` | Cloud API phone number id | WhatsApp |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification handshake token | WhatsApp |
| `WHATSAPP_APP_SECRET` | Verifies `X-Hub-Signature-256` | WhatsApp |
| `PORT` | WhatsApp server port (default 3001) | No |
| `SITE_URL` | Website base for links (default `https://creativelab.in.th`) | No |
| `BOT_PHOTO_BASE_URL` | Example-photo base (absolute or path on `SITE_URL`); empty = no photos | No |
| `CONTACT_EMAIL` / `CONTACT_WHATSAPP` | Direct-contact fallbacks | No |
| `SESSION_STORE` | `file` (default) or `memory` | No |
| `SESSION_STORE_PATH` | Session file (default `./data/sessions.json`) | No |
| `SESSION_TTL_DAYS` | Session lifetime (default 14) | No |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | Per-user limit (default 20 / 10000 ms) | No |

## Telegram

1. Create the bot with [@BotFather](https://t.me/BotFather) → `TELEGRAM_BOT_TOKEN`.
2. Add the bot to the staff group, send a message there, read the chat id
   (`https://api.telegram.org/bot<TOKEN>/getUpdates`) → `TELEGRAM_STAFF_CHAT_ID`.
   The bot only runs the intake in **private** chats, so it stays quiet in the staff group.
3. Dev: `npm run telegram` (polling; any registered webhook is removed on start).
4. Production (webhook):
   ```bash
   TELEGRAM_MODE=webhook
   TELEGRAM_WEBHOOK_SECRET=$(openssl rand -hex 32)
   TELEGRAM_WEBHOOK_URL=https://bots.example.com/telegram/webhook
   npm run start:telegram
   ```
   The server rejects any POST whose `X-Telegram-Bot-Api-Secret-Token` doesn't
   match (401). If you don't set `TELEGRAM_WEBHOOK_URL`, register it yourself:
   ```bash
   curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -d url=https://bots.example.com/telegram/webhook \
     -d secret_token=$TELEGRAM_WEBHOOK_SECRET \
     -d 'allowed_updates=["message","callback_query"]'
   ```
   Health check: `GET /healthz`.

## WhatsApp

1. Meta app with the WhatsApp product → `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
   app secret (App settings → Basic) → `WHATSAPP_APP_SECRET`.
2. Choose any `WHATSAPP_VERIFY_TOKEN`; in the dashboard set the callback URL to
   `https://<host>/webhook` with that verify token, and subscribe to `messages`.
3. `npm run start:whatsapp` behind HTTPS. Every POST must carry a valid
   `X-Hub-Signature-256` (HMAC-SHA256 of the raw body with the app secret,
   compared in constant time) — otherwise 401.
4. WhatsApp can't show more than 10 list rows / 3 buttons; when a step has more,
   low-priority nav rows are dropped from the list but still work by typing
   "back", "restart" or "language" (hinted in the footer). Typing an option's
   number or name also works.
5. Media is checked via the Graph API (`file_size`, 20 MB cap) and, on submit,
   downloaded and forwarded to the staff Telegram chat.

## Deep-link contract

One parser (`shared/deeplink.ts`) for both channels.

```
payload := part ("__" part)*        ≤ 64 chars, [A-Za-z0-9_-] only, every part optional, any order
part    := s_<service>              advertising | social-media | photography | video | branding | web | seo | digital
         | l_<location>             koh-phangan | koh-samui | koh-tao | other
         | u_<source>               utm_source / campaign, [A-Za-z0-9-]{1,48}
```

Examples: `s_photography`, `s_web__l_koh-samui`, `s_video__l_koh-tao__u_google-ads-sep`.

- **Telegram:** `https://t.me/<bot_username>?start=<payload>` → `/start <payload>`.
- **WhatsApp:** the website pre-fills the first message and ends it with
  `[ref:<payload>]`, e.g.
  `https://wa.me/66808705704?text=Hi%2C%20I%27d%20like%20villa%20photos%20%5Bref%3As_photography__l_koh-phangan__u_site%5D`.
  The bot strips the token, applies the payload and forwards the rest as "first message".
- Preselected steps are skipped once on the way forward; Back still reaches them.
- Invalid/unknown parts are ignored (the bot simply starts normally).
- Legacy `service_<hub-slug>` payloads (old website links) are still accepted.
- Service/location keys are a public contract — don't rename them.

## Tests

`npm run test` (node:test via tsx). Covers:

- every service × sub-service × location × 4 languages × both channels reaches
  submit, with every button on every screen checked for "handled + leads somewhere"
  (0 dead ends) and WhatsApp size limits;
- Back on every step, Restart, resume after `/start`, edit-any-field from review;
- language switch at any step preserves answers; Hebrew RTL marks;
- deep-link parsing (valid, partial, invalid, legacy, WhatsApp `[ref:]`);
- budget/timeline skip, unknown input, upload validation (size/type/count, voice note as description);
- notify failure → honest message + retry; file store persistence/TTL; rate limiting;
- WhatsApp signature verification, GET handshake, end-to-end webhook with a fake Graph API.

## Operations notes

- Sessions: single-process file store. For several replicas, implement
  `SessionStore` on Redis/KV.
- Logs never contain names, contacts or descriptions — only a hashed lead ref,
  channel, service and error codes.
- Photos: the website's images are bundled with hashed file names, so there's
  no stable URL to point at. Put `welcome.jpg` and `<service-key>.jpg` somewhere
  public (e.g. `public/bot/` on the site) and set `BOT_PHOTO_BASE_URL=/bot`.
