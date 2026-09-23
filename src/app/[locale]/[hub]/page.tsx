import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { SplitEditorial } from "@/components/blocks/SplitEditorial";
import { ServiceGrid } from "@/components/blocks/ServiceGrid";
import { ContentSections } from "@/components/blocks/ProseSection";
import { botServiceFor } from "@/lib/integrations";
import { PortfolioPreview } from "@/components/blocks/PortfolioPreview";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { LocationBlock } from "@/components/blocks/LocationBlock";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { allHubParams } from "@/content/hubs";
import { getHub, getUi } from "@/content/translations";
import { format } from "@/content/localize";
import { buildMetadata } from "@/lib/metadata";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return allHubParams();
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[hub]">
): Promise<Metadata> {
  const { hub: hubSlug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const hub = getHub(hubSlug, locale);
  if (!hub) return {};
  return buildMetadata({
    title: hub.metaTitle,
    description: hub.metaDescription,
    path: `/${hub.slug}`,
    locale,
  });
}

export default async function HubPage(props: PageProps<"/[locale]/[hub]">) {
  const { hub: hubSlug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const hub = getHub(hubSlug, locale);
  if (!hub) notFound();
  const ui = getUi(locale);
  const vars = { hub: hub.navLabel };

  const url = `${SITE.url}${localePath(locale, `/${hub.slug}`)}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({
      name: hub.metaTitle,
      description: hub.metaDescription,
      url,
      inLanguage: locale,
    }),
    serviceSchema({
      name: hub.h1,
      description: hub.metaDescription,
      url,
      serviceType: hub.primaryKeyword,
    }),
    breadcrumbSchema([
      { name: ui.nav.home, url: homeUrl },
      { name: hub.navLabel, url },
    ]),
    faqSchema(hub.faqs),
  ]);

  const portfolioItems = Array.from(
    new Map(
      hub.services.map((service) => [
        service.heroImage,
        {
          image: service.heroImage,
          alt: service.heroImageAlt,
          caption: service.navLabel,
        },
      ])
    ).values()
  ).slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <Breadcrumbs
        items={[{ label: ui.nav.home, href: "/" }, { label: hub.navLabel, href: `/${hub.slug}` }]}
        locale={locale}
      />
      <Hero
        eyebrow={ui.location}
        h1={hub.h1}
        support={hub.heroSupport}
        image={hub.heroImage}
        imageAlt={hub.heroImageAlt}
        locale={locale}
      />
      <DirectAnswer text={hub.directAnswer} />
      <SplitEditorial
        eyebrow={ui.hub.approachEyebrow}
        title={hub.editorialTitle}
        image={hub.heroImage}
        imageAlt={hub.heroImageAlt}
      >
        {hub.editorialBody.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </SplitEditorial>
      {hub.sections && <ContentSections sections={hub.sections} />}
      <ServiceGrid
        eyebrow={ui.hub.servicesEyebrow}
        title={format(ui.hub.servicesTitle, vars)}
        items={hub.services.map((service) => ({
          title: service.navLabel,
          description: service.heroSupport,
          href: `/${hub.slug}/${service.slug}`,
        }))}
        locale={locale}
      />
      <PortfolioPreview items={portfolioItems} locale={locale} />
      <ProcessSteps title={ui.hub.processTitle} steps={ui.hub.process} locale={locale} />
      <LocationBlock text={format(ui.hub.locationText, vars)} />
      <FaqAccordion faqs={hub.faqs} locale={locale} />
      <CtaBanner
        title={format(ui.hub.ctaTitle, vars)}
        description={ui.hub.ctaDescription}
        ctaLabel={hub.finalCtaLabel}
        serviceContext={hub.navLabel}
        botContext={{ service: botServiceFor(hub.slug) }}
        locale={locale}
      />
    </>
  );
}
