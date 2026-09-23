/**
 * Analytics event layer (proposal §16). One `track()` call fans out to
 * whichever providers are configured AND consented to: GA4 (gtag),
 * Yandex Metrica (ym) and Meta Pixel (fbq). With no IDs set (the current
 * state — Improvements.md §6) nothing loads and `track()` is a no-op apart
 * from the dataLayer push.
 *
 * IDs (public, set on the host): NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_YM_ID,
 * NEXT_PUBLIC_META_PIXEL_ID.
 */
export const ANALYTICS_IDS = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  ym: process.env.NEXT_PUBLIC_YM_ID ?? "",
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
} as const;

export const hasAnyAnalytics = Boolean(ANALYTICS_IDS.ga4 || ANALYTICS_IDS.ym || ANALYTICS_IDS.metaPixel);

export type AnalyticsEvent =
  | "page_view"
  | "scroll_75"
  | "cta_click"
  | "form_start"
  | "form_submit"
  | "form_error"
  | "whatsapp_click"
  | "telegram_click"
  | "phone_click"
  | "email_click"
  | "language_switch";

/** Events that count as conversions (goals) — proposal: form, bot start, call, WhatsApp. */
const GOALS: AnalyticsEvent[] = ["form_submit", "whatsapp_click", "telegram_click", "phone_click"];

type Consent = { analytics: boolean; marketing: boolean };
export const CONSENT_KEY = "cl-consent";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ym?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function track(event: AnalyticsEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  (w.dataLayer ??= []).push({ event, ...params });
  const consent = readConsent();
  if (consent?.analytics) {
    w.gtag?.("event", event, params);
    if (ANALYTICS_IDS.ym) w.ym?.(Number(ANALYTICS_IDS.ym), "reachGoal", event, params);
  }
  if (consent?.marketing && GOALS.includes(event)) {
    w.fbq?.("track", event === "form_submit" ? "Lead" : "Contact", params);
  }
}
