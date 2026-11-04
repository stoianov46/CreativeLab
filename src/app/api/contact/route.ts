import { NextResponse } from "next/server";
import {
  BUDGET_VALUES,
  BUSINESS_VALUES,
  CONTACT_LIMITS,
  LOCATION_VALUES,
  REPLY_LANGUAGE_VALUES,
  STAFF_LABELS,
  TIMELINE_VALUES,
  pickOption,
} from "@/lib/contact";
import { SITE } from "@/content/site";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Best-effort rate limit: 5 submissions per IP per 10 minutes. In-memory, so
 * it's per server instance — on a serverless host each cold instance starts
 * fresh. Good enough against casual abuse; a shared store (e.g. Upstash/KV)
 * is the upgrade if spam becomes a problem (TO-DO_2026-11-03.md).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory
  return recent.length > MAX_PER_WINDOW;
}

const text = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans never see them.
  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const rawMessage = String(body.message ?? "").trim();
  const name = text(body.name, CONTACT_LIMITS.name);
  const email = text(body.email, CONTACT_LIMITS.email);
  const phone = text(body.phone, CONTACT_LIMITS.phone);
  const service = text(body.service, CONTACT_LIMITS.service);
  const message = rawMessage.slice(0, CONTACT_LIMITS.message);

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length < 10 ||
    rawMessage.length > CONTACT_LIMITS.message ||
    body.consent !== true
  ) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 422 });
  }

  // Optional qualifiers: only known option values are accepted, anything else is dropped.
  const location = pickOption(body.location, LOCATION_VALUES);
  const business = pickOption(body.businessType, BUSINESS_VALUES);
  const budget = pickOption(body.budget, BUDGET_VALUES);
  const timeline = pickOption(body.timeline, TIMELINE_VALUES);
  const replyLanguage = pickOption(body.replyLanguage, REPLY_LANGUAGE_VALUES);

  const meta = {
    locale: text(body.locale, 5),
    page: text(body.page, 500),
    landing: text(body.landing_page, 500),
    referrer: text(body.referrer, 500),
    utm: ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .map((key) => [key.replace("utm_", ""), text(body[key], 100)])
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join(" "),
  };

  // Delivery channels, each optional and server-only (never NEXT_PUBLIC_, see
  // SECURITY.md). A lead is accepted when at least one configured channel
  // takes it; with none configured the endpoint answers 503 so the form shows
  // its error state instead of silently dropping the lead.
  //  - Telegram: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (TELEGRAM_STAFF_CHAT_ID
  //    is the older name, same as bots/shared/notify.ts).
  //  - Email (Resend HTTP API, works on any host): RESEND_API_KEY +
  //    CONTACT_EMAIL_FROM (verified sender); recipient CONTACT_EMAIL_TO,
  //    default SITE.email.
  //  - CRM / automation: LEAD_WEBHOOK_URL receives the lead as JSON.
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChat = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_STAFF_CHAT_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.CONTACT_EMAIL_FROM;
  const emailTo = process.env.CONTACT_EMAIL_TO || SITE.email;
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  const useTelegram = Boolean(telegramToken && telegramChat);
  const useEmail = Boolean(resendKey && emailFrom);
  const useWebhook = Boolean(webhookUrl);

  if (!useTelegram && !useEmail && !useWebhook) {
    // No personal data in the log line.
    console.error("[contact] No delivery channel configured (Telegram, email or webhook) — lead was NOT delivered.", {
      service: service || null,
      locale: meta.locale,
      messageLength: message.length,
    });
    return NextResponse.json({ error: "Delivery not configured" }, { status: 503 });
  }

  const build = (esc: (value: string) => string, title: string) =>
    [
      title,
      "",
      `Name: ${esc(name)}`,
      `Email: ${esc(email)}`,
      phone ? `Phone / messenger: ${esc(phone)}` : null,
      `Service: ${service ? esc(service) : "—"}`,
      location ? `Island: ${STAFF_LABELS.location[location]}` : null,
      business ? `Business type: ${STAFF_LABELS.business[business]}` : null,
      budget ? `Budget: ${STAFF_LABELS.budget[budget]}` : null,
      timeline ? `Timeline: ${STAFF_LABELS.timeline[timeline]}` : null,
      `Language: ${esc(meta.locale || "—")}`,
      replyLanguage ? `Reply language: ${STAFF_LABELS.replyLanguage[replyLanguage]}` : null,
      meta.page ? `Page: ${esc(meta.page)}` : null,
      meta.landing && meta.landing !== meta.page ? `First page seen: ${esc(meta.landing)}` : null,
      meta.utm ? `UTM: ${esc(meta.utm)}` : null,
      meta.referrer ? `Referrer: ${esc(meta.referrer)}` : null,
      "",
      esc(message),
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

  const deliveries: Promise<boolean>[] = [];
  const attempt = (label: string, run: () => Promise<Response>) =>
    deliveries.push(
      run()
        .then(async (res) => {
          if (!res.ok) console.error(`[contact] ${label} rejected the lead`, res.status, await res.text());
          return res.ok;
        })
        .catch((err) => {
          console.error(`[contact] Failed to reach ${label}`, err);
          return false;
        })
    );
  const json = { "Content-Type": "application/json" };

  if (useTelegram) {
    attempt("Telegram", () =>
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: json,
        body: JSON.stringify({
          chat_id: telegramChat,
          text: build(escapeHtml, "<b>New lead — website form</b>"),
          parse_mode: "HTML",
        }),
      })
    );
  }
  if (useEmail) {
    attempt("the email service", () =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { ...json, Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: emailFrom,
          to: [emailTo],
          reply_to: email,
          subject: `New lead — ${service || "website form"} — ${name}`,
          text: build((v) => v, "New lead — website form"),
        }),
      })
    );
  }
  if (useWebhook) {
    attempt("the lead webhook", () =>
      fetch(webhookUrl as string, {
        method: "POST",
        headers: json,
        body: JSON.stringify({
          name, email, phone, service, location, businessType: business, budget, timeline, replyLanguage, message, ...meta,
          receivedAt: new Date().toISOString(),
        }),
      })
    );
  }

  const results = await Promise.all(deliveries);
  if (!results.some(Boolean)) {
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
