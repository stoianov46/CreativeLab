import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContentSection } from "@/content/types";

/** A heading + paragraphs block — service overviews and the depth sections on hubs/industries/locations. */
export function ProseSection({
  eyebrow,
  title,
  paragraphs,
  tone = "base",
}: {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  tone?: "base" | "surface";
}) {
  if (!paragraphs.length) return null;
  return (
    <section className={`${tone === "surface" ? "border-t border-line bg-surface" : "bg-base"} py-16 lg:py-24`}>
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <div className="max-w-[68ch] space-y-5 text-base leading-relaxed text-text-secondary lg:pt-2">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Renders a page's `sections`, alternating backgrounds for rhythm. */
export function ContentSections({ sections, startTone = "surface" }: { sections: readonly ContentSection[]; startTone?: "base" | "surface" }) {
  return (
    <>
      {sections.map((section, index) => (
        <ProseSection
          key={section.title}
          title={section.title}
          paragraphs={section.body}
          tone={(index % 2 === 0) === (startTone === "surface") ? "surface" : "base"}
        />
      ))}
    </>
  );
}
