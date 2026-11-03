export const ATTRIBUTION_KEY = "cl_attr";
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/**
 * Lead attribution for the enquiry form: the first-touch data remembered for
 * this session, with any UTM parameters on the current URL taking precedence.
 * Browser-only; returns {} when storage is unavailable.
 */
export function readAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}");
    for (const [k, v] of Object.entries(stored)) if (typeof v === "string" && v) out[k] = v.slice(0, 500);
  } catch {
    // ignore
  }
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 100);
  }
  return out;
}
