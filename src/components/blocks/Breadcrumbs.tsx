import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: Locale }) {
  return (
    <nav aria-label={getUi(locale).nav.breadcrumbAria} className="border-b border-line bg-base">
      <Container className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden>/</span>}
              {index === items.length - 1 ? (
                <span className="text-text" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-text">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}
