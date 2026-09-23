/**
 * Deep-link contract shared by the website and both bots (documented in
 * bots/README.md → "Deep-link contract").
 *
 *   payload := part ( "__" part )*          (max 64 chars, [A-Za-z0-9_-] only)
 *   part    := "s_" <service-key>           e.g. s_photography
 *            | "l_" <location-key>          e.g. l_koh-samui
 *            | "u_" <source/campaign>       e.g. u_google-villa-2026
 *
 * Every part is optional and order doesn't matter. Unknown/invalid parts are
 * ignored (never an error) so an old or mistyped link still opens the bot.
 *
 * Telegram: https://t.me/<bot>?start=<payload>  → `/start <payload>`
 * WhatsApp: https://wa.me/<number>?text=<message>%20[ref:<payload>]
 *
 * Legacy `service_<hub-slug>` payloads (the previous website contract) are
 * still understood.
 */
import { isLocationKey, resolveServiceKey, type LocationKey, type ServiceKey } from './data.js';

export const MAX_PAYLOAD_LENGTH = 64;
const PAYLOAD_RE = /^[A-Za-z0-9_-]{1,64}$/;
const SOURCE_RE = /^[A-Za-z0-9-]{1,48}$/;

export interface DeepLink {
  service?: ServiceKey;
  location?: LocationKey;
  source?: string;
  /** The payload exactly as received, when it was syntactically valid. */
  raw?: string;
}

/** Pure parser. Never throws; returns `{}` for anything unusable. */
export function parseDeepLink(input: string | undefined | null): DeepLink {
  const payload = (input ?? '').trim();
  if (!PAYLOAD_RE.test(payload)) return {};

  const result: DeepLink = { raw: payload };

  if (payload.startsWith('service_')) {
    const service = resolveServiceKey(payload.slice('service_'.length));
    if (service) result.service = service;
    return result;
  }

  for (const part of payload.split('__')) {
    const prefix = part.slice(0, 2);
    const value = part.slice(2);
    if (!value) continue;
    if (prefix === 's_' && !result.service) {
      const service = resolveServiceKey(value);
      if (service) result.service = service;
    } else if (prefix === 'l_' && !result.location) {
      const location = value.toLowerCase();
      if (isLocationKey(location)) result.location = location;
    } else if (prefix === 'u_' && !result.source) {
      if (SOURCE_RE.test(value)) result.source = value;
    }
  }
  return result;
}

/** Inverse of parseDeepLink — used by tests and handy for building website links. */
export function buildDeepLink(link: Omit<DeepLink, 'raw'>): string {
  const parts: string[] = [];
  if (link.service) parts.push(`s_${link.service}`);
  if (link.location) parts.push(`l_${link.location}`);
  if (link.source) parts.push(`u_${link.source}`);
  return parts.join('__').slice(0, MAX_PAYLOAD_LENGTH);
}

const WHATSAPP_REF_RE = /\s*\[ref:([^\]\s]{1,64})\]\s*$/;

/**
 * WhatsApp has no /start payload, so the website pre-fills the first
 * message and ends it with `[ref:<payload>]`. Returns the message without
 * the token plus the parsed payload (`{}` when absent or invalid).
 */
export function extractWhatsAppRef(message: string): { text: string; link: DeepLink } {
  const match = WHATSAPP_REF_RE.exec(message);
  if (!match) return { text: message.trim(), link: {} };
  return { text: message.slice(0, match.index).trim(), link: parseDeepLink(match[1]) };
}
