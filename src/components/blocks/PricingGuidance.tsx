import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PricingRow } from "@/content/types";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";
import { format } from "@/content/localize";
import { PRICES, PRICING_UPDATED, formatPriceRange, type PriceSpec } from "@/content/pricing";

export function PricingGuidance({ rows, caption, locale }: { rows: PricingRow[]; caption?: string; locale: Locale }) {
  if (!rows.length) return null;
  const ui = getUi(locale).blocks;
  return (
    <section className="border-t border-line bg-surface py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={ui.pricingEyebrow}
          title={ui.pricingTitle}
          description={ui.pricingDescription}
        />
        {/* Keyboard-focusable so the table can be scrolled sideways without a mouse on narrow screens. */}
        <div className="mt-10 overflow-x-auto" role="region" tabIndex={0} aria-label={caption ?? ui.pricingTitle}>
          <table className="w-full min-w-[560px] border-collapse text-start text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead>
              <tr className="border-b border-line text-xs tracking-wide text-text-secondary uppercase">
                <th className="py-3 pe-4 font-medium">{ui.pricingService}</th>
                <th className="py-3 pe-4 font-medium">{ui.pricingRange}</th>
                <th className="py-3 font-medium">{ui.pricingNotes}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const spec = PRICES[row.priceId] as PriceSpec;
                const isRange = spec.kind !== "custom" && spec.kind !== "bundled";
                const range =
                  formatPriceRange(row.priceId) ?? (spec.kind === "custom" ? ui.pricingCustom : ui.pricingBundled);
                const unit =
                  isRange && spec.unit === "per-month"
                    ? ui.pricingUnitPerMonth
                    : isRange && spec.unit === "one-time"
                      ? ui.pricingUnitOneTime
                      : undefined;
                const meta: string[] = [];
                if (isRange && spec.revisions !== undefined) meta.push(`${ui.pricingRevisions}: ${spec.revisions}`);
                if (isRange && spec.turnaroundDays !== undefined)
                  meta.push(
                    `${ui.pricingTurnaround}: ${format(ui.pricingTurnaroundDays, { n: String(spec.turnaroundDays) })}`
                  );
                return (
                  <tr key={row.service} className="border-b border-line align-top">
                    <td className="py-4 pe-4 font-medium text-text">{row.service}</td>
                    <td className="py-4 pe-4 whitespace-nowrap text-text">
                      {/* Latin figures stay left-to-right inside RTL (Hebrew) text. */}
                      <span dir={isRange ? "ltr" : undefined}>{range}</span>
                      {unit && <span className="block text-xs text-text-secondary">{unit}</span>}
                    </td>
                    <td className="py-4 text-text-secondary">
                      <p>{row.note}</p>
                      {row.included && row.included.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium tracking-wide text-text uppercase">{ui.pricingIncluded}</p>
                          <ul className="mt-1 list-disc ps-5">
                            {row.included.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {row.excluded && row.excluded.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium tracking-wide text-text uppercase">{ui.pricingExcluded}</p>
                          <ul className="mt-1 list-disc ps-5">
                            {row.excluded.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {meta.length > 0 && <p className="mt-2 text-xs">{meta.join(" · ")}</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-text-secondary">
          {ui.pricingDisclaimer}{" "}
          {format(ui.pricingUpdated, { date: PRICING_UPDATED })}
        </p>
      </Container>
    </section>
  );
}
