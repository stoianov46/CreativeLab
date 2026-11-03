/** Contact-form field limits — enforced in the form (maxLength) and in /api/contact. */
export const CONTACT_LIMITS = { name: 100, email: 200, phone: 60, service: 200, message: 5000 } as const;

/**
 * Stable option values for the enquiry form. The visitor sees translated
 * labels (island/business labels come from the translated content, the rest
 * from `ui.form`); the API only ever accepts these values and the staff
 * message is built from the English labels below.
 */
export const LOCATION_VALUES = ["koh-phangan", "koh-samui", "koh-tao", "other"] as const;
export const BUSINESS_VALUES = [
  "villas-real-estate",
  "hotels-resorts",
  "restaurants-food",
  "tourism-hospitality",
  "brands-lifestyle",
  "wellness-retreats",
  "events",
  "other",
] as const;
export const BUDGET_VALUES = ["under-20k", "20-50k", "50-100k", "over-100k", "not-sure"] as const;
export const TIMELINE_VALUES = ["asap", "within-1-month", "1-3-months", "exploring"] as const;

export const REPLY_LANGUAGE_VALUES = ["en", "ru", "th", "he"] as const;

export type LocationValue = (typeof LOCATION_VALUES)[number];
export type BusinessValue = (typeof BUSINESS_VALUES)[number];
export type BudgetValue = (typeof BUDGET_VALUES)[number];
export type TimelineValue = (typeof TIMELINE_VALUES)[number];
export type ReplyLanguageValue = (typeof REPLY_LANGUAGE_VALUES)[number];

/** English labels for the staff notification (the inbox language). */
export const STAFF_LABELS = {
  location: {
    "koh-phangan": "Koh Phangan",
    "koh-samui": "Koh Samui",
    "koh-tao": "Koh Tao",
    other: "Other / not sure",
  },
  business: {
    "villas-real-estate": "Villas & real estate",
    "hotels-resorts": "Hotels & resorts",
    "restaurants-food": "Restaurants & food",
    "tourism-hospitality": "Tourism & hospitality",
    "brands-lifestyle": "Brands & lifestyle",
    "wellness-retreats": "Wellness & retreats",
    events: "Events",
    other: "Other",
  },
  budget: {
    "under-20k": "Under THB 20,000",
    "20-50k": "THB 20,000–50,000",
    "50-100k": "THB 50,000–100,000",
    "over-100k": "Over THB 100,000",
    "not-sure": "Not sure yet",
  },
  replyLanguage: { en: "English", ru: "Russian", th: "Thai", he: "Hebrew" },
  timeline: {
    asap: "As soon as possible",
    "within-1-month": "Within a month",
    "1-3-months": "1–3 months",
    exploring: "Just exploring",
  },
} as const;

/** Returns `value` only if it is one of `allowed`, otherwise "". */
export function pickOption<T extends string>(value: unknown, allowed: readonly T[]): T | "" {
  const v = String(value ?? "").trim();
  return (allowed as readonly string[]).includes(v) ? (v as T) : "";
}
