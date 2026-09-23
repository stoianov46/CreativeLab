/**
 * Locale routing constants, per proposal.md §09 LANGUAGE: EN is the
 * canonical/x-default locale and stays unprefixed (`/`, `/contact`), RU/TH/HE
 * are prefixed (`/ru/`, `/th/`, `/he/`). Every locale mirrors the same URL
 * structure ("Единая структура URL").
 */
export type Locale = "en" | "ru" | "th" | "he";

export const LOCALES: Locale[] = ["en", "ru", "th", "he"];
export const DEFAULT_LOCALE: Locale = "en";

/** Each language's name in itself — what the language switcher shows. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  th: "ไทย",
  he: "עברית",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/**
 * Narrows a route param's `string` type (Next's typed-routes codegen
 * can't know it's constrained to `Locale`) to `Locale`. Safe to use
 * anywhere under `app/[locale]/` — the layout's `generateStaticParams` +
 * `dynamicParams = false` guarantee only real locale values ever reach a
 * page; this doesn't re-validate at runtime.
 */
export function toLocale(value: string): Locale {
  return value as Locale;
}

export function isRtl(locale: Locale): boolean {
  return locale === "he";
}

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  th: "th_TH",
  he: "he_IL",
};

export function ogLocale(locale: Locale): string {
  return OG_LOCALE[locale];
}

/**
 * Prefixes a canonical (EN) path for a given locale — "/contact" + "ru" ->
 * "/ru/contact"; the default locale is returned unprefixed. `path` must
 * start with "/" and use the site's canonical (EN) URL shape.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Every locale's URL for the same canonical path — for hreflang/alternates. */
export function localeAlternates(path: string): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, localePath(locale, path)])
  ) as Record<Locale, string>;
}

/** Strips a known locale prefix off a real (already-prefixed) pathname, if present. */
export function splitLocaleFromPathname(pathname: string): {
  locale: Locale;
  path: string;
} {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) {
    const path = `/${rest.join("/")}`;
    return { locale: first, path: path === "/" ? "/" : path.replace(/\/$/, "") || "/" };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}
