import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConceptVisual } from "@/components/blocks/ConceptVisual";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";
import type { ConceptProject } from "@/content/types";

/** The honesty label every concept carries — on the card, the page and in the audit (data-concept-label). */
export function ConceptLabel({ children, inverse = false }: { children: string; inverse?: boolean }) {
  // On the dark hero the brand accent is only 3.46:1 — use the soft tint there (WCAG AA needs 4.5:1).
  return (
    <span
      data-concept-label
      className={`inline-block border px-2.5 py-1 text-xs font-medium tracking-wide uppercase ${
        inverse ? "border-accent-soft text-accent-soft" : "border-accent text-accent"
      }`}
    >
      {children}
    </span>
  );
}

/** Grid of concept projects: original concept boards, each clearly labelled. */
export function ConceptCards({
  title,
  description,
  items,
  locale,
  tone = "base",
  compact = false,
}: {
  title: string;
  description?: string;
  items: ConceptProject[];
  locale: Locale;
  tone?: "base" | "surface";
  /** Title + label only (no brief) — for a "more projects" strip on a concept page. */
  compact?: boolean;
}) {
  if (!items.length) return null;
  const ui = getUi(locale).concept;
  return (
    <section className={`${tone === "surface" ? "border-t border-line bg-surface" : "bg-base"} py-16 lg:py-24`}>
      <Container>
        <SectionHeading eyebrow={ui.eyebrow} title={title} description={description} />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <Link key={item.slug} href={`/portfolio/${item.slug}`} className="group flex flex-col">
              <ConceptVisual id={item.visual} alt={item.visualAlt} className="transition-colors group-hover:border-accent" />
              <div className="mt-4 flex flex-col items-start gap-2">
                <ConceptLabel>{item.label}</ConceptLabel>
                <h3 className="font-display text-xl font-light text-text [overflow-wrap:anywhere] group-hover:text-accent">
                  {item.title}
                </h3>
                {!compact && <p className="text-sm text-text-secondary">{item.brief}</p>}
                <span className="text-sm font-medium text-accent">{ui.viewConcept}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
