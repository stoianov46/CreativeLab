"use client";

import { useRef, type ReactNode } from "react";

/**
 * Horizontal, swipeable, keyboard-scrollable row (scroll-snap) with
 * prev/next buttons. Children are the slides; each should set its own width.
 */
export function Carousel({
  children,
  label,
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  label: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-accent motion-reduce:scroll-auto sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        {children}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {([
          [-1, prevLabel, "‹"],
          [1, nextLabel, "›"],
        ] as const).map(([dir, text, icon]) => (
          <button
            key={dir}
            type="button"
            aria-label={text}
            onClick={() => scroll(dir)}
            className="flex h-10 w-10 items-center justify-center border border-line text-lg text-text hover:border-accent hover:text-accent"
          >
            <span aria-hidden className="inline-block rtl:rotate-180">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
