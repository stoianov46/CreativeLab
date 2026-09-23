import Image, { type StaticImageData } from "next/image";
import { Button } from "@/components/ui/Button";
import { HeroSlides } from "@/components/blocks/HeroSlides";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export function Hero({
  eyebrow,
  h1,
  support,
  image,
  imageAlt,
  ctaHref = "/contact",
  ctaLabel,
  slides,
  locale,
}: {
  eyebrow?: string;
  h1: string;
  support: string;
  image: StaticImageData;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
  /** Extra images → cross-fading slideshow (first slide is `image`). */
  slides?: { image: StaticImageData; alt: string }[];
  locale: Locale;
}) {
  const ui = getUi(locale);
  return (
    <section className="relative overflow-hidden bg-inverse text-text-inverse">
      {slides?.length ? (
        <HeroSlides
          slides={[{ image, alt: imageAlt }, ...slides]}
          labels={{
            prev: ui.blocks.slidePrev,
            next: ui.blocks.slideNext,
            pause: ui.blocks.slidePause,
            play: ui.blocks.slidePlay,
            slide: ui.blocks.slideLabel,
          }}
        />
      ) : (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            preload
            sizes="100vw"
            placeholder="blur"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/70 to-inverse/20" />
        </div>
      )}
      <div className="relative mx-auto flex max-w-[1440px] flex-col px-5 pt-28 pb-20 sm:px-8 lg:px-12 lg:pt-40 lg:pb-28">
        {eyebrow && (
          <p className="mb-6 text-xs tracking-[0.2em] text-accent-soft uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance max-w-4xl font-display [text-shadow:0_1px_24px_rgba(0,0,0,0.35)] text-4xl leading-[1.05] font-light tracking-tight sm:text-6xl lg:text-[80px]">
          {h1}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-inverse-secondary">
          {support}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={ctaHref} variant="primary">
            {ctaLabel ?? ui.cta.startProject}
          </Button>
          <Button href="/portfolio" variant="ghost">
            {ui.cta.seeOurWork}
          </Button>
        </div>
      </div>
    </section>
  );
}
