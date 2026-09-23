import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { LegalDocument } from "@/components/blocks/LegalDocument";
import { getPages, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export async function generateMetadata(props: PageProps<"/[locale]/accessibility">): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).accessibility;
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: "/accessibility", locale });
}

export default async function AccessibilityPage(props: PageProps<"/[locale]/accessibility">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).accessibility;
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, "/accessibility")}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.accessibility, url },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.accessibility, href: "/accessibility" }]} locale={locale} />
      <LegalDocument page={page} />
    </>
  );
}
