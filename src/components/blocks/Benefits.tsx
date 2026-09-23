import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Benefit } from "@/content/types";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export function Benefits({ items, locale }: { items: Benefit[]; locale: Locale }) {
  if (!items.length) return null;
  return (
    <section className="bg-base py-16 lg:py-24">
      <Container>
        <SectionHeading title={getUi(locale).blocks.benefitsTitle} />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4">
              <span
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-accent text-xs text-accent"
                aria-hidden
              >
                ✓
              </span>
              <div>
                <h3 className="text-base font-medium text-text">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
