import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView } from "@/components/pages/ServicePageView";
import { SERVICE_LANDINGS } from "@/content/services";
import { getServiceLandings, getUi, pageLabelFor } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, jsonLdGraph, serviceSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export function generateStaticParams() {
  return SERVICE_LANDINGS.map((page) => ({ slug: page.slug }));
}

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getServiceLandings(locale).find((p) => p.slug === slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/services/${slug}`,
    canonicalPath: page.canonicalPath,
    locale,
  });
}

export default async function ServiceLandingPage(props: PageProps<"/[locale]/services/[slug]">) {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const landings = getServiceLandings(locale);
  const page = landings.find((p) => p.slug === slug);
  if (!page) notFound();
  const ui = getUi(locale);

  const url = `${SITE.url}${localePath(locale, `/services/${slug}`)}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    // Schema describes the canonical page's service when this one overlaps it.
    serviceSchema({
      name: page.h1,
      description: page.metaDescription,
      url: page.canonicalPath ? `${SITE.url}${localePath(locale, page.canonicalPath)}` : url,
      serviceType: page.primaryKeyword,
    }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.services, url: `${SITE.url}${localePath(locale, "/services")}` },
      { name: page.navLabel, url },
    ]),
    faqSchema(page.faqs),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <ServicePageView
        service={page}
        eyebrow={ui.nav.services}
        breadcrumbs={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.services, href: "/services" },
          { label: page.navLabel, href: `/services/${slug}` },
        ]}
        fallbackRelated={
          page.canonicalPath
            ? [{ label: pageLabelFor(page.canonicalPath, locale) ?? page.navLabel, href: page.canonicalPath, description: page.heroSupport }]
            : landings.filter((p) => p.slug !== slug).slice(0, 3).map((p) => ({ label: p.navLabel, href: `/services/${p.slug}`, description: p.heroSupport }))
        }
        botSlugs={[slug]}
        locale={locale}
      />
    </>
  );
}
