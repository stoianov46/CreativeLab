import type { Locale } from "@/content/i18n";
import { format } from "@/content/localize";
import { getUi } from "@/content/translations";
import { PRICES, PRICING_UPDATED, formatPriceRange, type PriceSpec } from "@/content/pricing";
import type { PricingRow } from "@/content/types";

/**
 * Items for `serviceSchema({ catalog })`: one per visible price-table row, with
 * the same indicative price text the page shows (same figure in every locale).
 */
export function pricingCatalog(rows: PricingRow[], locale: Locale, name: string) {
  const ui = getUi(locale).blocks;
  return {
    name,
    items: rows.map((row) => {
      const spec = PRICES[row.priceId] as PriceSpec;
      const isRange = spec.kind !== "custom" && spec.kind !== "bundled";
      const price = formatPriceRange(row.priceId) ?? (spec.kind === "custom" ? ui.pricingCustom : ui.pricingBundled);
      const unit =
        isRange && spec.unit === "per-month" ? ` ${ui.pricingUnitPerMonth}` : isRange && spec.unit === "one-time" ? ` ${ui.pricingUnitOneTime}` : "";
      return {
        name: row.service,
        description: `${price}${unit}. ${format(ui.pricingUpdated, { date: PRICING_UPDATED })}`,
      };
    }),
  };
}
