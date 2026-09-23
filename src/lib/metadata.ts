import type { Metadata } from "next";
import { SITE } from "@/content/site";
import {
  DEFAULT_LOCALE,
  localeAlternates,
  localePath,
  ogLocale,
  type Locale,
} from "@/content/i18n";

export function buildMetadata(params: {
  title: string;
  description: string;
  /** Canonical (EN-relative) path, e.g. "/contact" — never pre-prefixed. */
  path: string;
  /** Defaults to "en" for call sites that haven't gone locale-aware yet. */
  locale?: Locale;
  /**
   * For a page that overlaps another (the /services/* pages with a hub
   * equivalent): the canonical (EN-relative) path of the page to index.
   * canonical + hreflang then point there, per Google's guidance that
   * hreflang should only reference canonical URLs.
   */
  canonicalPath?: string;
}): Metadata {
  const locale = params.locale ?? DEFAULT_LOCALE;
  const url = `${SITE.url}${localePath(locale, params.path)}`;
  const indexedPath = params.canonicalPath ?? params.path;
  const canonical = `${SITE.url}${localePath(locale, indexedPath)}`;
  const alternates = localeAlternates(indexedPath);

  return {
    // The layout template appends " | CreativeLAB"; titles that already name
    // the brand are used as-is so it never appears twice.
    title: params.title.includes(SITE.name) ? { absolute: params.title } : params.title,
    description: params.description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          Object.entries(alternates).map(([loc, path]) => [
            loc,
            `${SITE.url}${path}`,
          ])
        ),
        "x-default": `${SITE.url}${alternates[DEFAULT_LOCALE]}`,
      },
    },
    openGraph: {
      // Pages set their own openGraph, which would otherwise drop the
      // file-based [locale]/opengraph-image — so reference it explicitly.
      images: [{ url: localePath(locale, "/opengraph-image"), width: 1200, height: 630, alt: SITE.name }],
      title: params.title,
      description: params.description,
      url,
      siteName: SITE.name,
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: [localePath(locale, "/opengraph-image")],
      title: params.title,
      description: params.description,
    },
  };
}
