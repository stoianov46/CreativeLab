import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { Container } from "@/components/ui/Container";
import type { RelatedLink } from "@/content/types";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export function RelatedServices({ items, locale }: { items: RelatedLink[]; locale: Locale }) {
  if (!items.length) return null;
  return (
    <section className="border-t border-line bg-surface py-16 lg:py-24">
      <Container>
        <h2 className="font-display text-2xl font-light text-text">
          {getUi(locale).blocks.relatedTitle}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-line p-6 transition-colors hover:border-accent"
            >
              <h3 className="text-base font-medium text-text group-hover:text-accent">
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
