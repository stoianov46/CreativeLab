import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView } from "@/components/pages/ServicePageView";
import { allServiceParams } from "@/content/hubs";
import { getConcepts, getService, getUi } from "@/content/translations";
import { format } from "@/content/localize";
import { buildMetadata } from "@/lib/metadata";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { pricingCatalog } from "@/lib/pricing-schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return allServiceParams();
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[hub]/[service]">
): Promise<Metadata> {
  const { hub: hubSlug, service: serviceSlug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const match = getService(hubSlug, serviceSlug, locale);
  if (!match) return {};
  return buildMetadata({
    title: match.service.metaTitle,
    description: match.service.metaDescription,
    path: `/${hubSlug}/${serviceSlug}`,
    locale,
  });
}

export default async function ServicePageRoute(
  props: PageProps<"/[locale]/[hub]/[service]">
) {
  const { hub: hubSlug, service: serviceSlug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const match = getService(hubSlug, serviceSlug, locale);
  if (!match) notFound();
  const { hub, service } = match;
  const ui = getUi(locale);
  const concepts = getConcepts(locale);

  const url = `${SITE.url}${localePath(locale, `/${hub.slug}/${service.slug}`)}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const hubUrl = `${SITE.url}${localePath(locale, `/${hub.slug}`)}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: service.metaTitle, description: service.metaDescription, url, inLanguage: locale }),
    serviceSchema({
      name: service.h1,
      description: service.metaDescription,
      url,
      serviceType: service.primaryKeyword,
      catalog: pricingCatalog(service.pricing, locale, `${service.navLabel} — ${ui.blocks.pricingTitle}`),
    }),
    breadcrumbSchema([
      { name: ui.nav.home, url: homeUrl },
      { name: hub.navLabel, url: hubUrl },
      { name: service.navLabel, url },
    ]),
    faqSchema(service.faqs),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <ServicePageView
        service={service}
        eyebrow={hub.navLabel}
        breadcrumbs={[
          { label: ui.nav.home, href: "/" },
          { label: hub.navLabel, href: `/${hub.slug}` },
          { label: service.navLabel, href: `/${hub.slug}/${service.slug}` },
        ]}
        fallbackRelated={hub.services
          .filter((s) => s.slug !== service.slug)
          .slice(0, 3)
          .map((s) => ({ label: s.navLabel, href: `/${hub.slug}/${s.slug}`, description: s.heroSupport }))}
        botSlugs={[service.slug, hub.slug]}
        moreInHub={{
          title: format(ui.service.moreInHub, { hub: hub.navLabel }),
          items: [
            ...hub.services
              .filter((s) => s.slug !== service.slug)
              .map((s) => ({ title: s.navLabel, href: `/${hub.slug}/${s.slug}` })),
            ...concepts
              .filter((c) => c.hubSlug === hub.slug)
              .map((c) => ({ title: c.navLabel, description: c.label, href: `/portfolio/${c.slug}` })),
          ],
        }}
        locale={locale}
      />
    </>
  );
}
