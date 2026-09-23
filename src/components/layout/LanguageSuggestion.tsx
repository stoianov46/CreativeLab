"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, isRtl, localePath, splitLocaleFromPathname, type Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";

const STORAGE_KEY = "cl-language-suggestion-dismissed";

/**
 * If the browser's preferred language is one of ours but differs from the
 * page's, offer — in that language — to switch. Never redirects (automatic
 * redirects confuse crawlers and people sharing links), and remembers "no".
 */
export function LanguageSuggestion({ copy }: { copy: Record<Locale, UiStrings["languageSuggestion"]> }) {
  const pathname = usePathname() ?? "/";
  const { locale: current, path } = splitLocaleFromPathname(pathname);
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // storage unavailable — just show it again next time
    }
    if (dismissed) return;
    const preferred = (navigator.languages ?? [navigator.language])
      .map((tag) => tag.toLowerCase().split("-")[0])
      .map((code) => (code === "iw" ? "he" : code))
      .find((code): code is Locale => (LOCALES as string[]).includes(code));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuggested(preferred && preferred !== current ? preferred : null);
  }, [current]);

  if (!suggested) return null;
  const text = copy[suggested];
  const dismiss = () => {
    setSuggested(null);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div
      lang={suggested}
      dir={isRtl(suggested) ? "rtl" : "ltr"}
      role="region"
      aria-label={text.text}
      className="fixed inset-x-3 bottom-20 z-40 mx-auto flex max-w-md flex-wrap items-center gap-3 border border-line bg-surface p-4 text-sm text-text shadow-[0_12px_32px_rgba(20,18,16,0.12)] lg:bottom-6"
    >
      <p className="w-full">{text.text}</p>
      <Link
        href={localePath(suggested, path)}
        hrefLang={suggested}
        onClick={dismiss}
        className="bg-accent px-4 py-2 font-medium text-text-inverse hover:bg-[#804e33]"
      >
        {text.switch}
      </Link>
      <button type="button" onClick={dismiss} className="px-3 py-2 text-text-secondary hover:text-text">
        {text.dismiss}
      </button>
    </div>
  );
}
