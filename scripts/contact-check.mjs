#!/usr/bin/env node
/**
 * Contact-form API check — `npm run contact:check` (also in CI).
 *
 * Runs the real POST handler from src/app/api/contact/route.ts in-process with
 * a MOCKED fetch, so Telegram is never called and no real lead is sent. Covers
 * validation, honeypot, rate limiting, option whitelisting, HTML escaping, the
 * attribution lines in the staff message, and delivery failure / missing
 * credentials. It also checks the form's option values against the real
 * content slugs so they can't drift. Exits 1 on any failure.
 */
import { createJiti } from "jiti";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const jiti = createJiti(import.meta.url, {
  alias: { "@/assets/images": path.join(root, "scripts/lib/i18n-image-stub.ts"), "@": src },
});

// --- mocked network: only the Telegram endpoint exists; anything else is a bug ---
const calls = [];
let telegramStatus = 200;
globalThis.fetch = async (url, init) => {
  const u = String(url);
  if (!u.startsWith("https://api.telegram.org/bot")) throw new Error(`unexpected network call to ${u}`);
  calls.push({ url: u, body: JSON.parse(init.body) });
  return new Response(telegramStatus === 200 ? "{}" : "nope", { status: telegramStatus });
};
const origError = console.error;
console.error = () => {}; // the route logs delivery failures on purpose

const { POST } = await jiti.import(path.join(src, "app/api/contact/route.ts"));
const contact = await jiti.import(path.join(src, "lib/contact.ts"));
const { LOCATIONS } = await jiti.import(path.join(src, "content/locations/index.ts"));
const { INDUSTRIES } = await jiti.import(path.join(src, "content/industries/index.ts"));

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  (ok ? console.log : origError)(`${ok ? "  ok  " : "  FAIL"} ${name}${!ok && detail ? ` — ${detail}` : ""}`);
};

let ipCounter = 0;
const send = (body, { ip, raw } = {}) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip ?? `10.0.0.${++ipCounter}` },
      body: raw ?? JSON.stringify(body),
    })
  );
const valid = {
  name: "Test Person",
  email: "test@example.com",
  message: "A project description that is long enough.",
  consent: true,
};

// 1. option values match the real content
const slugs = (list) => list.map((x) => x.slug).sort().join();
check("location options = real locations + other", slugs(LOCATIONS) === [...contact.LOCATION_VALUES].filter((v) => v !== "other").sort().join());
check("business options = real industries + other", slugs(INDUSTRIES) === [...contact.BUSINESS_VALUES].filter((v) => v !== "other").sort().join());
for (const [group, values] of [["location", contact.LOCATION_VALUES], ["business", contact.BUSINESS_VALUES], ["budget", contact.BUDGET_VALUES], ["timeline", contact.TIMELINE_VALUES], ["replyLanguage", contact.REPLY_LANGUAGE_VALUES]])
  check(`staff labels cover every ${group} value`, values.every((v) => contact.STAFF_LABELS[group][v]) && Object.keys(contact.STAFF_LABELS[group]).length === values.length);

// 2. request handling without credentials
delete process.env.TELEGRAM_BOT_TOKEN;
delete process.env.TELEGRAM_STAFF_CHAT_ID;
check("invalid JSON → 400", (await send(null, { raw: "{nope" })).status === 400);
const before = calls.length;
check("honeypot filled → 200 and nothing sent", (await send({ ...valid, website: "http://spam" })).status === 200 && calls.length === before);
for (const [label, patch] of [
  ["name too short", { name: "A" }],
  ["bad email", { email: "not-an-email" }],
  ["message too short", { message: "short" }],
  ["message too long", { message: "x".repeat(contact.CONTACT_LIMITS.message + 1) }],
  ["no consent", { consent: false }],
  ["consent as string", { consent: "true" }],
]) check(`${label} → 422`, (await send({ ...valid, ...patch })).status === 422);
check("valid but no Telegram credentials → 503 (never a silent ok)", (await send(valid)).status === 503 && calls.length === before);

// 3. delivery with credentials (mocked)
process.env.TELEGRAM_BOT_TOKEN = "TEST_TOKEN";
process.env.TELEGRAM_STAFF_CHAT_ID = "TEST_CHAT";
calls.length = 0;
const full = {
  ...valid,
  name: "Anna <b>Test</b> & Co",
  message: "We need <script>alert(1)</script> help with a villa.",
  phone: "+66 80 000 0000",
  service: "Villa photography",
  location: "koh-samui",
  businessType: "villas-real-estate",
  budget: "20-50k",
  timeline: "within-1-month",
  replyLanguage: "th",
  locale: "ru",
  page: "https://creativelab.in.th/contact",
  landing_page: "https://creativelab.in.th/advertising?utm_source=test",
  referrer: "https://example.org/",
  utm_source: "newsletter",
  utm_medium: "email",
  utm_campaign: "launch",
};
const res = await send(full);
check("valid submission → 200", res.status === 200);
const msg = calls[0]?.body;
check("sent exactly one Telegram message to the right bot and chat", calls.length === 1 && calls[0].url === "https://api.telegram.org/botTEST_TOKEN/sendMessage" && msg?.chat_id === "TEST_CHAT" && msg?.parse_mode === "HTML");
const text = msg?.text ?? "";
for (const line of ["Island: Koh Samui", "Business type: Villas & real estate", "Budget: THB 20,000–50,000", "Timeline: Within a month", "Service: Villa photography", "Language: ru", "Reply language: Thai", "UTM: source=newsletter medium=email campaign=launch", "First page seen: https://creativelab.in.th/advertising?utm_source=test", "Referrer: https://example.org/"])
  check(`staff message contains "${line}"`, text.includes(line));
check("HTML in name and message is escaped", !text.includes("<script>") && !text.includes("<b>Test</b>") && text.includes("&lt;script&gt;") && text.includes("&lt;b&gt;Test&lt;/b&gt;"));

calls.length = 0;
await send({ ...valid, location: "atlantis", businessType: "<x>", budget: "1000000", timeline: "never", replyLanguage: "klingon" });
const t2 = calls[0]?.body?.text ?? "";
check("unknown option values are dropped, not forwarded", calls.length === 1 && !/Island:|Business type:|Budget:|Timeline:|Reply language:/.test(t2) && !t2.includes("atlantis"));

calls.length = 0;
await send({ ...valid, landing_page: "https://creativelab.in.th/contact", page: "https://creativelab.in.th/contact" });
check("'First page seen' omitted when it equals the current page", !(calls[0]?.body?.text ?? "").includes("First page seen"));

// 4. delivery failure and rate limit
telegramStatus = 500;
check("Telegram rejects → 502", (await send(valid)).status === 502);
telegramStatus = 200;
const ip = "203.0.113.9";
const codes = [];
for (let i = 0; i < 7; i++) codes.push((await send(valid, { ip })).status);
check("rate limit: 5 accepted then 429", codes.slice(0, 5).every((c) => c === 200) && codes.slice(5).every((c) => c === 429), codes.join(","));

console.error = origError;
console.log(failures ? `\ncontact-check: ${failures} failure(s)` : "\ncontact-check: all checks passed (mocked Telegram, no real lead sent)");
process.exit(failures ? 1 : 0);
