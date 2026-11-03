"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LOCALES,
  LOCALE_NAMES,
  localePath,
  splitLocaleFromPathname,
} from "@/content/i18n";

/**
 * EN / RU / TH / HE switcher — links to the same page in the other
 * language (every locale mirrors the same URL structure). The hrefs are
 * already explicitly localized, and they are plain anchors on purpose: switching language
 * changes <html lang/dir>, so it must be a full page load — a client-side
 * (RSC) navigation from /he/… to the unprefixed English URL goes through the
 * locale rewrite and fails with a 404 in the console.
 */
export function LanguageSwitcher({
  label,
  variant = "dropdown",
  onNavigate,
}: {
  label: string;
  variant?: "dropdown" | "inline";
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const { locale: current, path } = splitLocaleFromPathname(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const links = LOCALES.map((locale) => (
    <a
      key={locale}
      href={localePath(locale, path)}
      hrefLang={locale}
      lang={locale}
      aria-current={locale === current ? "true" : undefined}
      onClick={() => {
        setOpen(false);
        onNavigate?.();
      }}
      className={
        variant === "inline"
          ? `border px-3 py-2 text-sm ${
              locale === current
                ? "border-text text-text"
                : "border-line text-text-secondary hover:border-text hover:text-text"
            }`
          : `flex items-center justify-between gap-4 px-4 py-2 text-sm hover:bg-base ${
              locale === current ? "font-medium text-accent" : "text-text-secondary hover:text-text"
            }`
      }
    >
      <span>{LOCALE_NAMES[locale]}</span>
      {variant === "dropdown" && (
        <span className="text-xs uppercase text-text-secondary">{locale}</span>
      )}
    </a>
  ));

  if (variant === "inline") {
    return (
      <nav aria-label={label} className="flex flex-wrap gap-2">
        {links}
      </nav>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex h-10 items-center gap-1.5 border border-line px-3 text-xs font-medium tracking-wide text-text uppercase hover:border-text"
        aria-expanded={open}
        aria-haspopup="true"
        // The visible text is the code ("EN"); WCAG 2.5.3 needs it in the accessible name — leading, as a separate word.
        aria-label={`${current.toUpperCase()}, ${label}: ${LOCALE_NAMES[current]}`}
        onClick={() => setOpen(!open)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {current}
      </button>
      {open && (
        <div className="absolute top-full end-0 z-50 mt-2 w-44 border border-line bg-surface py-2 shadow-[0_12px_32px_rgba(20,18,16,0.08)]">
          {links}
        </div>
      )}
    </div>
  );
}
