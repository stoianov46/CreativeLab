"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

const INTERVAL_MS = 6000;

/**
 * Cross-fading hero backdrop (proposal: hero slider, 3–5 images). Pausable,
 * with prev/next, and it never auto-advances for visitors who prefer reduced
 * motion. Only the first image is preloaded — it's the LCP element.
 */
export function HeroSlides({
  slides,
  labels,
}: {
  slides: { image: StaticImageData; alt: string }[];
  labels: { prev: string; next: string; pause: string; play: string; slide: string };
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const autoplay = playing && !reducedMotion && slides.length > 1;
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [autoplay, slides.length]);

  const go = (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length);

  return (
    <>
      <div className="absolute inset-0" aria-live={autoplay ? "off" : "polite"}>
        {slides.map((slide, i) => (
          <Image
            key={i}
            src={slide.image}
            alt={i === index ? slide.alt : ""}
            aria-hidden={i !== index}
            fill
            preload={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            sizes="100vw"
            placeholder="blur"
            className={`object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-45" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/70 to-inverse/20" />
      </div>
      {slides.length > 1 && (
        <div className="absolute end-5 bottom-6 z-10 flex items-center gap-2 sm:end-8 lg:end-12">
          <span className="me-2 text-xs text-text-inverse-secondary tabular-nums" aria-live="polite">
            {labels.slide.replace("{n}", String(index + 1)).replace("{total}", String(slides.length))}
          </span>
          {[
            { label: labels.prev, onClick: () => go(-1), icon: "‹" },
            { label: playing ? labels.pause : labels.play, onClick: () => setPlaying(!playing), icon: playing ? "❚❚" : "▶" },
            { label: labels.next, onClick: () => go(1), icon: "›" },
          ].map((button) => (
            <button
              key={button.label}
              type="button"
              aria-label={button.label}
              onClick={button.onClick}
              className="flex h-9 w-9 items-center justify-center border border-line-inverse text-sm text-text-inverse hover:border-accent hover:text-accent"
            >
              <span aria-hidden className={button.icon.length === 1 ? "rtl:rotate-180 text-lg leading-none" : "text-[10px]"}>
                {button.icon}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
