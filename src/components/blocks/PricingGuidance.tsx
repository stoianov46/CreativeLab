import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PricingRow } from "@/content/types";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

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
        <div className="mt-10 overflow-x-auto">
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
              {rows.map((row) => (
                <tr key={row.service} className="border-b border-line">
                  <td className="py-4 pe-4 font-medium text-text">
                    {row.service}
                  </td>
                  <td className="py-4 pe-4 whitespace-nowrap text-text">
                    {row.range}
                  </td>
                  <td className="py-4 text-text-secondary">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-text-secondary">
          {ui.pricingDisclaimer}
        </p>
      </Container>
    </section>
  );
}
