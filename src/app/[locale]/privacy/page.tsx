import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { LegalDocument } from "@/components/blocks/LegalDocument";
import { getPages, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export async function generateMetadata(
  props: PageProps<"/[locale]/privacy">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).privacy;
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage(props: PageProps<"/[locale]/privacy">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).privacy;
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, "/privacy")}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([{ name: ui.nav.home, url: homeUrl }, { name: ui.nav.privacy, url }]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.privacy, href: "/privacy" }]}
        locale={locale}
      />
      <LegalDocument page={page} />
    </>
  );
}
