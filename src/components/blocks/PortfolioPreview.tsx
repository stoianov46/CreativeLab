import Image, { type StaticImageData } from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/blocks/Carousel";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export type PortfolioPreviewItem = {
  image: StaticImageData;
  alt: string;
  caption: string;
};

/**
 * No client projects have been delivered/approved for publication yet
 * (Truth Rule — never invent clients or results). This renders honestly
 * captioned reference imagery instead of fabricated case studies; swap
 * `items` for real project photography as work is delivered.
 */
export function PortfolioPreview({
  title,
  description,
  items,
  locale,
}: {
  title?: string;
  description?: string;
  items: PortfolioPreviewItem[];
  locale: Locale;
}) {
  if (!items.length) return null;
  const ui = getUi(locale).blocks;
  return (
    <section className="border-t border-line bg-surface py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={ui.portfolioEyebrow}
          title={title ?? ui.portfolioTitle}
          description={description ?? ui.portfolioDescription}
        />
        <div className="mt-10">
          <Carousel label={title ?? ui.portfolioTitle} prevLabel={ui.slidePrev} nextLabel={ui.slideNext}>
          {items.map((item) => (
            <figure key={item.caption} className="group w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
              <figcaption className="mt-3 text-sm text-text-secondary">
                {item.caption}
              </figcaption>
            </figure>
          ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
