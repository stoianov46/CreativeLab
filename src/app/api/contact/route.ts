import { NextResponse } from "next/server";
import { CONTACT_LIMITS } from "@/lib/contact";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Best-effort rate limit: 5 submissions per IP per 10 minutes. In-memory, so
 * it's per server instance — on a serverless host each cold instance starts
 * fresh. Good enough against casual abuse; a shared store (e.g. Upstash/KV)
 * is the upgrade if spam becomes a problem (NOTES.md).
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

  const meta = {
    locale: text(body.locale, 5),
    page: text(body.page, 500),
    referrer: text(body.referrer, 500),
    utm: ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .map((key) => [key.replace("utm_", ""), text(body[key], 100)])
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join(" "),
  };

  // Same env vars (and staff chat) as bots/shared/notify.ts, so website
  // leads land in the one inbox the bots already use. Server-only — never
  // NEXT_PUBLIC_, see SECURITY.md.
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_STAFF_CHAT_ID;

  if (!token || !chatId) {
    // Fail visibly (the form shows its error state with direct contacts)
    // rather than returning ok and silently dropping the lead. No personal
    // data in the log line.
    console.error("[contact] TELEGRAM_BOT_TOKEN or TELEGRAM_STAFF_CHAT_ID not set — lead was NOT delivered.", {
      service: service || null,
      locale: meta.locale,
      messageLength: message.length,
    });
    return NextResponse.json({ error: "Delivery not configured" }, { status: 503 });
  }

  const lines = [
    "<b>New lead — website form</b>",
    "",
    `Name: ${escapeHtml(name)}`,
    `Email: ${escapeHtml(email)}`,
    phone ? `Phone / messenger: ${escapeHtml(phone)}` : null,
    `Service: ${service ? escapeHtml(service) : "—"}`,
    `Language: ${escapeHtml(meta.locale || "—")}`,
    meta.page ? `Page: ${escapeHtml(meta.page)}` : null,
    meta.utm ? `UTM: ${escapeHtml(meta.utm)}` : null,
    meta.referrer ? `Referrer: ${escapeHtml(meta.referrer)}` : null,
    "",
    escapeHtml(message),
  ].filter((line): line is string => line !== null);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" }),
    });
    if (!res.ok) {
      console.error("[contact] Telegram API rejected the lead", res.status, await res.text());
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Failed to reach the Telegram API", err);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
