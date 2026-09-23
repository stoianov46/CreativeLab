import { SITE } from "@/content/site";

/**
 * Chat channels.
 * - WhatsApp: NEXT_PUBLIC_WHATSAPP_NUMBER, falling back to the team's
 *   confirmed number in SITE.whatsapp (already linked on /contact) — a human
 *   answers it even before the WhatsApp bot is deployed.
 * - Telegram: only NEXT_PUBLIC_TELEGRAM_BOT. SITE.telegram (@creativelab1_bot)
 *   is unconfirmed as a live bot (NOTES.md), so no Telegram link ships until
 *   the env var is set.
 */
export const INTEGRATIONS = {
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || SITE.whatsapp).replace(/[^0-9]/g, ""),
  telegramBotHandle: (process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? "").replace(/^@/, ""),
} as const;

/**
 * Deep-link payload understood by both bots (bots/README.md): which service
 * and location to preselect, and where the visitor came from. Only
 * [A-Za-z0-9_-], max 64 chars (Telegram's /start limit).
 */
export type BotContext = { service?: string; location?: string; source?: string };

export function botPayload({ service, location, source }: BotContext): string {
  const clean = (v: string) => v.replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  return [service && `s_${clean(service)}`, location && `l_${clean(location)}`, source && `u_${clean(source)}`]
    .filter(Boolean)
    .join("__")
    .slice(0, 64);
}

export function whatsappLink(text?: string, context: BotContext = {}) {
  if (!INTEGRATIONS.whatsappNumber) return null;
  const payload = botPayload(context);
  const message = [text, payload && `[ref:${payload}]`].filter(Boolean).join(" ");
  return `https://wa.me/${INTEGRATIONS.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function telegramLink(context: BotContext = {}) {
  if (!INTEGRATIONS.telegramBotHandle) return null;
  const payload = botPayload(context);
  return `https://t.me/${INTEGRATIONS.telegramBotHandle}${payload ? `?start=${payload}` : ""}`;
}

/**
 * Maps a site page (hub slug / service slug / /services/* slug) to the bots'
 * service keys (proposal: Advertising, Social Media, Photography, Video,
 * Branding, Web, SEO, Digital).
 */
const BOT_SERVICE_BY_SLUG: Record<string, string> = {
  advertising: "advertising",
  "google-ads": "advertising",
  "meta-ads": "advertising",
  "social-media": "social-media",
  "social-media-management": "social-media",
  "content-creation": "social-media",
  "villas-real-estate": "photography",
  "commercial-photography": "photography",
  "food-restaurants": "photography",
  "restaurant-marketing": "digital",
  "video-production": "video",
  "commercial-video": "video",
  "branding-creative": "branding",
  branding: "branding",
  "websites-digital": "web",
  "web-design": "web",
  "business-local-presence": "seo",
  seo: "seo",
  "digital-marketing": "digital",
};

export function botServiceFor(...slugs: (string | undefined)[]): string | undefined {
  for (const slug of slugs) if (slug && BOT_SERVICE_BY_SLUG[slug]) return BOT_SERVICE_BY_SLUG[slug];
  return undefined;
}
