import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type LinkCard = { title: string; description?: string; href: string };

/** A titled grid of linked cards — industries, locations, index pages. */
export function LinkCards({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  tone = "base",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items: LinkCard[];
  columns?: 2 | 3 | 4;
  tone?: "base" | "surface";
}) {
  if (!items.length) return null;
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <section className={`${tone === "surface" ? "border-t border-line bg-surface" : "bg-base"} py-16 lg:py-24`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className={`mt-10 grid grid-cols-1 gap-6 ${cols}`}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between border border-line bg-surface p-6 transition-colors hover:border-accent"
            >
              <div>
                <h3 className="font-display text-lg font-medium text-text group-hover:text-accent">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
                )}
              </div>
              <span className="mt-5 text-xs font-medium tracking-wide text-accent uppercase" aria-hidden>
                <span className="inline-block rtl:rotate-180">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
