/**
 * Translation overlay rules — shared by the site (`localize`) and by
 * `scripts/i18n.mjs` (`translatableSkeleton`), so what the script asks
 * translators for and what the site actually reads can never disagree.
 *
 * English content in `src/content/**` (TS) is the master copy. Each other
 * locale is a JSON file with the SAME shape but only the text fields; the
 * site deep-merges it over English. Anything missing or empty in the
 * translation falls back to English, so a half-translated file never
 * breaks a page.
 *
 * Shape rules (applied identically in both directions):
 * - strings are translated; numbers/booleans are not
 * - keys in NON_TRANSLATABLE_KEYS (URLs, slugs, ordering) are never translated
 * - image objects (next/image StaticImageData) are skipped
 * - arrays of objects that all have a `slug` become an object keyed by
 *   slug (e.g. a hub's `services`), so reordering pages can't misalign
 *   translations; every other array is matched by index
 */

const NON_TRANSLATABLE_KEYS = new Set([
  "slug",
  "hubSlug",
  "href",
  "priority",
  "order",
  "industrySlugs",
  "canonicalPath",
  "servicePaths",
  "relatedPaths",
  "locationSlug",
  "industrySlug",
  "cluster",
  "datePublished",
  "dateModified",
  "geo",
]);

type Dict = Record<string, unknown>;

function isPlainObject(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isImage(value: unknown): boolean {
  return isPlainObject(value) && "src" in value && "width" in value;
}

function isSlugList(value: unknown[]): value is { slug: string }[] {
  return value.length > 0 && value.every((item) => isPlainObject(item) && typeof item.slug === "string");
}

export function localize<T>(base: T, overlay: unknown): T {
  if (overlay === undefined || overlay === null) return base;

  if (typeof base === "string") {
    return (typeof overlay === "string" && overlay.trim() ? overlay : base) as T;
  }

  if (Array.isArray(base)) {
    if (isSlugList(base) && isPlainObject(overlay)) {
      return base.map((item) => localize(item, overlay[item.slug])) as T;
    }
    if (Array.isArray(overlay)) {
      return base.map((item, index) => localize(item, overlay[index])) as T;
    }
    return base;
  }

  if (isPlainObject(base) && !isImage(base) && isPlainObject(overlay)) {
    const out: Dict = { ...base };
    for (const key of Object.keys(base)) {
      if (NON_TRANSLATABLE_KEYS.has(key)) continue;
      out[key] = localize(base[key], overlay[key]);
    }
    return out as T;
  }

  return base;
}

/**
 * The English text fields of `base`, in exactly the shape a translation
 * file must have. Returns undefined for values with nothing to translate.
 */
export function translatableSkeleton(base: unknown): unknown {
  if (typeof base === "string") return base;

  if (Array.isArray(base)) {
    if (isSlugList(base)) {
      return Object.fromEntries(base.map((item) => [item.slug, translatableSkeleton(item) ?? {}]));
    }
    return base.map((item) => translatableSkeleton(item) ?? null);
  }

  if (isPlainObject(base) && !isImage(base)) {
    const out: Dict = {};
    for (const [key, value] of Object.entries(base)) {
      if (NON_TRANSLATABLE_KEYS.has(key)) continue;
      const skeleton = translatableSkeleton(value);
      if (skeleton !== undefined) out[key] = skeleton;
    }
    return Object.keys(out).length ? out : undefined;
  }

  return undefined;
}

/** Fills `{name}` placeholders: format("Ready to talk about {hub}?", { hub: "Advertising" }). */
export function format(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}
