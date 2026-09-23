/**
 * Env-driven config shared by both bots. Read lazily (functions, not
 * constants) so tests and `dotenv/config` ordering never matter.
 * Every variable here is documented in bots/.env.example and bots/README.md.
 */

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : undefined;
}

function envInt(name: string, fallback: number): number {
  const raw = env(name);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function siteUrl(): string {
  return (env('SITE_URL') ?? 'https://creativelab.in.th').replace(/\/+$/, '');
}

/**
 * Base URL for optional bot photos (`welcome.jpg`, `<service-key>.jpg`).
 * Absolute (`https://cdn…/bot`) or a path resolved against SITE_URL
 * (`/bot` → `${SITE_URL}/bot`). Unset → no photos are sent (the website's
 * images are bundled with hashed names, so there is no stable URL to guess).
 * A photo that fails to load is skipped and the step is sent as text.
 */
export function photoBaseUrl(): string | undefined {
  const raw = env('BOT_PHOTO_BASE_URL');
  if (!raw) return undefined;
  const base = /^https?:\/\//i.test(raw) ? raw : `${siteUrl()}/${raw.replace(/^\/+/, '')}`;
  return base.replace(/\/+$/, '');
}

/** Direct-contact fallbacks shown when a submission can't be delivered. Defaults = src/content/site.ts. */
export function contactEmail(): string {
  return env('CONTACT_EMAIL') ?? 'karma8chakra@gmail.com';
}

export function contactWhatsApp(): string {
  return env('CONTACT_WHATSAPP') ?? '+66 80 870 5704';
}

export function whatsAppLink(): string {
  return `https://wa.me/${contactWhatsApp().replace(/[^0-9]/g, '')}`;
}

export function sessionStoreKind(): 'file' | 'memory' {
  return env('SESSION_STORE') === 'memory' ? 'memory' : 'file';
}

export function sessionStorePath(): string {
  return env('SESSION_STORE_PATH') ?? './data/sessions.json';
}

export function sessionTtlMs(): number {
  return envInt('SESSION_TTL_DAYS', 14) * 24 * 60 * 60 * 1000;
}

export function rateLimitMax(): number {
  return envInt('RATE_LIMIT_MAX', 20);
}

export function rateLimitWindowMs(): number {
  return envInt('RATE_LIMIT_WINDOW_MS', 10_000);
}

/** Max size of a single uploaded file. Telegram bots can only download files ≤ 20 MB. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_ATTACHMENTS = 10;

export function telegramBotToken(): string | undefined {
  return env('TELEGRAM_BOT_TOKEN');
}

export function telegramStaffChatId(): string | undefined {
  return env('TELEGRAM_STAFF_CHAT_ID');
}

export function telegramMode(): 'polling' | 'webhook' {
  return env('TELEGRAM_MODE') === 'webhook' ? 'webhook' : 'polling';
}

export function telegramWebhookSecret(): string | undefined {
  return env('TELEGRAM_WEBHOOK_SECRET');
}

/** Public HTTPS URL Telegram should POST updates to (e.g. https://bots.example.com/telegram/webhook). */
export function telegramWebhookUrl(): string | undefined {
  return env('TELEGRAM_WEBHOOK_URL');
}

export function telegramWebhookPath(): string {
  const raw = env('TELEGRAM_WEBHOOK_PATH') ?? '/telegram/webhook';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export function telegramPort(): number {
  return envInt('TELEGRAM_PORT', 3000);
}

export function whatsAppPort(): number {
  return envInt('PORT', 3001);
}
