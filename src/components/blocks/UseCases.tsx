import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { UseCase } from "@/content/types";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export function UseCases({
  items,
  title,
  eyebrow,
  locale,
}: {
  items: UseCase[];
  title?: string;
  eyebrow?: string;
  locale: Locale;
}) {
  const ui = getUi(locale).blocks;
  if (!items.length) return null;
  return (
    <section className="border-t border-line bg-surface py-16 lg:py-24">
      <Container>
        <SectionHeading eyebrow={eyebrow ?? ui.useCasesEyebrow} title={title ?? ui.useCasesTitle} />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="border border-line p-6">
              <h3 className="font-display text-lg font-medium text-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
