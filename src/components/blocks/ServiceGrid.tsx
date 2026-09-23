import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export type ServiceGridItem = {
  title: string;
  description: string;
  href: string;
};

export function ServiceGrid({
  eyebrow,
  title,
  description,
  items,
  locale,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ServiceGridItem[];
  locale: Locale;
}) {
  return (
    <section className="bg-base py-16 lg:py-24">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-12 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between bg-surface p-7 transition-colors hover:bg-base"
            >
              <div>
                <h3 className="font-display text-xl font-medium text-text group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
              <span className="mt-6 text-xs font-medium tracking-wide text-accent uppercase">
                {getUi(locale).cta.explore} <span className="inline-block rtl:rotate-180" aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
