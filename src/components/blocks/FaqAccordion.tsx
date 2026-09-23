import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqItem } from "@/content/types";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export function FaqAccordion({ faqs, locale }: { faqs: FaqItem[]; locale: Locale }) {
  if (!faqs.length) return null;
  return (
    <section className="bg-base py-16 lg:py-24">
      <Container narrow>
        <SectionHeading title={getUi(locale).blocks.faqTitle} />
        <div className="mt-10 divide-y divide-line border-t border-b border-line">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-base font-medium text-text marker:content-none">
                {faq.q}
                <span
                  className="shrink-0 text-xl text-accent transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-text-secondary">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
