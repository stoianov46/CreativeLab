/**
 * PRICING MASTER — the single source of truth for every number shown in a
 * pricing table. Content rows (`PricingRow.priceId`) reference an id here;
 * the numbers are rendered by `formatPriceRange`, never typed into a
 * locale file, so EN / RU / TH / HE always show identical figures.
 *
 * Status: INDICATIVE. Nothing here is a confirmed commercial offer, and
 * structured data must not present it as one (see PRICING_MASTER.md).
 * Values are carried over from the previous per-page tables until the
 * market research in PRICING_STRATEGY.md replaces them.
 *
 * Migration status: COMPLETE — every pricing row on the site uses a priceId
 * (checked by `npm run pricing:check`). Figures in the non-Advertising ids were
 * migrated unchanged from the old per-page tables and are not yet researched;
 * their unit is `fixed` until the packages rework sets a precise unit.
 */

export const PRICING_CURRENCY = "THB" as const;
/** Date the numbers in this file were last reviewed. Update on every change. */
export const PRICING_UPDATED = "2026-11-03";

/**
 * `fixed` = a price for the item named in the row ("per dish", "per finished
 * video", "per project"…); no unit label is shown beside it — the row's name
 * and note carry the unit. `one-time` and `per-month` show a label.
 */
export type PriceUnit = "one-time" | "per-month" | "fixed";

export type RangePrice = {
  kind?: "range";
  min: number;
  max: number;
  unit: PriceUnit;
  /** Included revision rounds. Omit when not applicable. */
  revisions?: number;
  /** Working days from kickoff to delivery. Omit for ongoing retainers. */
  turnaroundDays?: number;
};

/** Scoped per client; shows "Custom" (translated) instead of a figure. */
export type CustomPrice = { kind: "custom" };

/** Part of another package; shows "Included in package" (translated). */
export type BundledPrice = { kind: "bundled" };

export type PriceSpec = RangePrice | CustomPrice | BundledPrice;

export const PRICES = {
  // Advertising → Google Ads
  "google-ads.setup": { min: 15000, max: 35000, unit: "one-time", revisions: 1, turnaroundDays: 7 },
  "google-ads.management": { min: 12000, max: 30000, unit: "per-month" },
  "google-ads.audit": { min: 6000, max: 12000, unit: "one-time", turnaroundDays: 5 },
  // Advertising → Meta Ads
  "meta-ads.setup": { min: 12000, max: 28000, unit: "one-time", revisions: 1, turnaroundDays: 7 },
  "meta-ads.management": { min: 10000, max: 25000, unit: "per-month" },
  "meta-ads.creative-pack": { min: 6000, max: 15000, unit: "one-time", revisions: 2, turnaroundDays: 10 },
  // Advertising → Campaign launch
  "campaign-launch.single": { min: 25000, max: 55000, unit: "one-time", revisions: 2, turnaroundDays: 14 },
  "campaign-launch.multi": { min: 45000, max: 95000, unit: "one-time", revisions: 2, turnaroundDays: 21 },
  // Advertising → Performance marketing
  "performance.retainer": { min: 20000, max: 50000, unit: "per-month" },
  "performance.analytics-audit": { min: 8000, max: 15000, unit: "one-time", turnaroundDays: 7 },
  // social-media
  "social-media.content-creation.1": { min: 10000, max: 20000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "social-media.content-creation.2": { min: 18000, max: 35000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "social-media.content-creation.3": { min: 8000, max: 20000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "social-media.influencer-marketing.1": { min: 8000, max: 25000, unit: "fixed" },
  "social-media.influencer-marketing.2": { min: 20000, max: 50000, unit: "fixed" },
  "social-media.influencer-marketing.3": { min: 3000, max: 8000, unit: "fixed" },
  "social-media.instagram-management.1": { min: 12000, max: 20000, unit: "per-month" },
  "social-media.instagram-management.2": { min: 22000, max: 40000, unit: "per-month" },
  "social-media.monthly-packages.1": { min: 18000, max: 28000, unit: "per-month" },
  "social-media.monthly-packages.2": { min: 30000, max: 55000, unit: "per-month" },
  "social-media.monthly-packages.3": { min: 8000, max: 18000, unit: "per-month" },
  "social-media.reels.1": { min: 3500, max: 8000, unit: "fixed", revisions: 2, turnaroundDays: 7 },
  "social-media.reels.2": { min: 12000, max: 25000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  // villas-real-estate
  "villas-real-estate.architecture-photography.1": { min: 8000, max: 15000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "villas-real-estate.architecture-photography.2": { min: 15000, max: 28000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "villas-real-estate.drone.1": { min: 3000, max: 6000, unit: "fixed", turnaroundDays: 5 },
  "villas-real-estate.drone.2": { min: 6000, max: 12000, unit: "fixed", turnaroundDays: 5 },
  "villas-real-estate.fpv.1": { min: 20000, max: 45000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "villas-real-estate.land-photography.1": { min: 4000, max: 8000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "villas-real-estate.land-photography.2": { min: 8000, max: 15000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "villas-real-estate.marketing.1": { min: 35000, max: 80000, unit: "fixed" },
  "villas-real-estate.marketing.2": { kind: "custom" },
  "villas-real-estate.property-video.1": { min: 15000, max: 30000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "villas-real-estate.real-estate-photography.1": { min: 5000, max: 10000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "villas-real-estate.real-estate-photography.2": { kind: "custom" },
  "villas-real-estate.villa-photography.1": { min: 6000, max: 12000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "villas-real-estate.villa-photography.2": { min: 12000, max: 22000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "villas-real-estate.virtual-tours.1": { min: 8000, max: 16000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "villas-real-estate.virtual-tours.2": { min: 16000, max: 28000, unit: "fixed", revisions: 1, turnaroundDays: 14 },
  // food-restaurants
  "food-restaurants.advertising.1": { min: 8000, max: 18000, unit: "one-time", revisions: 1, turnaroundDays: 7 },
  "food-restaurants.advertising.2": { min: 8000, max: 18000, unit: "per-month" },
  "food-restaurants.food-photography.1": { min: 1500, max: 4000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "food-restaurants.food-photography.2": { min: 15000, max: 35000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "food-restaurants.food-styling.1": { kind: "bundled" },
  "food-restaurants.food-styling.2": { min: 6000, max: 15000, unit: "fixed" },
  "food-restaurants.menu-design.1": { min: 5000, max: 12000, unit: "fixed", revisions: 2, turnaroundDays: 10 },
  "food-restaurants.menu-design.2": { min: 12000, max: 25000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "food-restaurants.menu-photography.1": { min: 12000, max: 28000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "food-restaurants.menu-photography.2": { min: 28000, max: 45000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "food-restaurants.social.1": { min: 14000, max: 22000, unit: "per-month" },
  "food-restaurants.social.2": { min: 24000, max: 40000, unit: "per-month" },
  "food-restaurants.website.1": { min: 25000, max: 45000, unit: "fixed", revisions: 2, turnaroundDays: 21 },
  "food-restaurants.website.2": { min: 45000, max: 90000, unit: "fixed", revisions: 2, turnaroundDays: 35 },
  // business-local-presence
  "business-local-presence.google-business-profile.1": { min: 5000, max: 10000, unit: "one-time", turnaroundDays: 5 },
  "business-local-presence.google-business-profile.2": { min: 6000, max: 15000, unit: "per-month" },
  "business-local-presence.google-maps.1": { min: 4000, max: 9000, unit: "one-time", turnaroundDays: 5 },
  "business-local-presence.listings.1": { min: 6000, max: 14000, unit: "one-time", turnaroundDays: 7 },
  "business-local-presence.local-seo.1": { min: 8000, max: 15000, unit: "one-time", turnaroundDays: 7 },
  "business-local-presence.local-seo.2": { min: 10000, max: 25000, unit: "per-month" },
  "business-local-presence.reputation.1": { min: 10000, max: 25000, unit: "per-month" },
  "business-local-presence.reviews.1": { min: 5000, max: 10000, unit: "one-time", turnaroundDays: 5 },
  "business-local-presence.reviews.2": { min: 6000, max: 15000, unit: "per-month" },
  // websites-digital
  "websites-digital.ai-search.1": { min: 10000, max: 20000, unit: "one-time", turnaroundDays: 7 },
  "websites-digital.ai-search.2": { min: 15000, max: 35000, unit: "fixed" },
  "websites-digital.business-websites.1": { min: 70000, max: 140000, unit: "fixed", revisions: 2, turnaroundDays: 35 },
  "websites-digital.ecommerce.1": { min: 60000, max: 120000, unit: "fixed", revisions: 2, turnaroundDays: 45 },
  "websites-digital.ecommerce.2": { min: 120000, max: 220000, unit: "fixed", revisions: 2, turnaroundDays: 60 },
  "websites-digital.landing-pages.1": { min: 15000, max: 35000, unit: "fixed", revisions: 2, turnaroundDays: 10 },
  "websites-digital.landing-pages.2": { min: 30000, max: 60000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "websites-digital.redesign.1": { min: 10000, max: 20000, unit: "one-time", turnaroundDays: 7 },
  "websites-digital.redesign.2": { min: 60000, max: 150000, unit: "fixed", revisions: 2, turnaroundDays: 60 },
  "websites-digital.restaurant-website.1": { min: 35000, max: 80000, unit: "fixed", revisions: 2, turnaroundDays: 21 },
  "websites-digital.technical-seo.1": { min: 12000, max: 25000, unit: "one-time", turnaroundDays: 7 },
  "websites-digital.technical-seo.2": { min: 15000, max: 45000, unit: "fixed" },
  "websites-digital.villa-website.1": { min: 35000, max: 75000, unit: "fixed", revisions: 2, turnaroundDays: 21 },
  "websites-digital.villa-website.2": { min: 60000, max: 130000, unit: "fixed", revisions: 2, turnaroundDays: 35 },
  "websites-digital.web-design.1": { min: 40000, max: 100000, unit: "fixed", revisions: 2, turnaroundDays: 21 },
  "websites-digital.web-design.2": { min: 90000, max: 180000, unit: "fixed", revisions: 2, turnaroundDays: 35 },
  // video-production
  "video-production.commercial.1": { min: 25000, max: 60000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "video-production.commercial.2": { min: 60000, max: 150000, unit: "fixed", revisions: 2, turnaroundDays: 21 },
  "video-production.drone-video.1": { min: 5000, max: 12000, unit: "fixed", turnaroundDays: 5 },
  "video-production.drone-video.2": { min: 12000, max: 30000, unit: "fixed", turnaroundDays: 5 },
  "video-production.fpv-video.1": { min: 20000, max: 45000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "video-production.social-video.1": { min: 4000, max: 9000, unit: "fixed", revisions: 2, turnaroundDays: 7 },
  "video-production.social-video.2": { min: 18000, max: 35000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  // branding-creative
  "branding-creative.branding.1": { min: 30000, max: 80000, unit: "one-time", revisions: 3, turnaroundDays: 25 },
  "branding-creative.branding.2": { min: 70000, max: 150000, unit: "fixed", revisions: 3, turnaroundDays: 45 },
  "branding-creative.creative-direction.1": { min: 15000, max: 40000, unit: "fixed", turnaroundDays: 14 },
  "branding-creative.creative-direction.2": { min: 20000, max: 45000, unit: "per-month" },
  "branding-creative.graphic-design.1": { min: 2500, max: 8000, unit: "fixed", revisions: 2, turnaroundDays: 5 },
  "branding-creative.graphic-design.2": { min: 10000, max: 25000, unit: "fixed", revisions: 2, turnaroundDays: 10 },
  "branding-creative.menu-design.1": { min: 8000, max: 20000, unit: "fixed", revisions: 2, turnaroundDays: 10 },
  "branding-creative.menu-design.2": { min: 35000, max: 90000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  // Landing pages (/services/*)
  "services.advertising.1": { min: 10000, max: 20000, unit: "one-time", turnaroundDays: 7 },
  "services.advertising.2": { min: 15000, max: 35000, unit: "one-time", revisions: 1, turnaroundDays: 7 },
  "services.advertising.3": { min: 12000, max: 30000, unit: "per-month" },
  "services.advertising.4": { min: 45000, max: 95000, unit: "one-time", revisions: 2, turnaroundDays: 21 },
  "services.commercial-photography.1": { min: 5000, max: 15000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "services.commercial-photography.2": { min: 10000, max: 20000, unit: "fixed", revisions: 1, turnaroundDays: 7 },
  "services.commercial-photography.3": { min: 18000, max: 35000, unit: "fixed", revisions: 1, turnaroundDays: 10 },
  "services.commercial-video.1": { min: 25000, max: 60000, unit: "fixed", revisions: 2, turnaroundDays: 14 },
  "services.commercial-video.2": { min: 8000, max: 18000, unit: "fixed" },
  "services.content-creation.1": { min: 22000, max: 45000, unit: "fixed" },
  "services.digital-marketing.1": { min: 15000, max: 30000, unit: "one-time", turnaroundDays: 7 },
  "services.digital-marketing.2": { min: 35000, max: 80000, unit: "per-month" },
  "services.digital-marketing.3": { min: 40000, max: 100000, unit: "one-time" },
  "services.meta-ads.3": { min: 4000, max: 10000, unit: "per-month" },
  "services.restaurant-marketing.1": { min: 20000, max: 45000, unit: "fixed" },
  "services.seo.1": { min: 12000, max: 25000, unit: "one-time", turnaroundDays: 7 },
  "services.seo.2": { min: 15000, max: 40000, unit: "per-month" },
  "services.social-media-management.1": { min: 18000, max: 28000, unit: "per-month" },
  "services.social-media-management.2": { min: 30000, max: 55000, unit: "per-month" },
  "services.social-media-management.3": { min: 35000, max: 65000, unit: "per-month" },
  "services.villas-real-estate.1": { kind: "custom" },
  "services.web-design.1": { min: 8000, max: 20000, unit: "fixed" },
} as const satisfies Record<string, PriceSpec>;

export type PriceId = keyof typeof PRICES;

/**
 * "THB 15,000 – 35,000". Always en-US digit grouping, in every locale, so
 * the figure is character-for-character identical across languages.
 * Returns null for `custom` / `bundled` prices (the UI shows a translated label).
 */
export function formatPriceRange(id: PriceId): string | null {
  const spec = PRICES[id] as PriceSpec;
  if (spec.kind === "custom" || spec.kind === "bundled") return null;
  const n = (v: number) => v.toLocaleString("en-US");
  return spec.min === spec.max ? `${PRICING_CURRENCY} ${n(spec.min)}` : `${PRICING_CURRENCY} ${n(spec.min)} – ${n(spec.max)}`;
}
