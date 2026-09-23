import { Breadcrumbs, type Crumb } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ProseSection } from "@/components/blocks/ProseSection";
import { FeatureList } from "@/components/blocks/FeatureList";
import { Benefits } from "@/components/blocks/Benefits";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { PortfolioPreview } from "@/components/blocks/PortfolioPreview";
import { PricingGuidance } from "@/components/blocks/PricingGuidance";
import { UseCases } from "@/components/blocks/UseCases";
import { LinkCards } from "@/components/blocks/LinkCards";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { RelatedServices } from "@/components/blocks/RelatedServices";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import type { Locale } from "@/content/i18n";
import { format } from "@/content/localize";
import { getIndustries, getLocations, getPages, getUi, pageLabelFor } from "@/content/translations";
import type { RelatedLink, ServicePage } from "@/content/types";
import { botServiceFor } from "@/lib/integrations";

/**
 * Service page body, in the proposal's order (§16): H1 → Direct Answer →
 * Overview → Deliverables → Process → Portfolio → Industries → Locations →
 * FAQ → CTA, plus benefits/pricing/use cases/related from the brief.
 * Shared by /<hub>/<service> and /services/<slug>.
 */
export function ServicePageView({
  service,
  eyebrow,
  breadcrumbs,
  fallbackRelated,
  botSlugs,
  locale,
}: {
  service: ServicePage;
  eyebrow: string;
  breadcrumbs: Crumb[];
  /** Used when the page defines no `related` links. */
  fallbackRelated: RelatedLink[];
  /** Slugs to map to a bot service key (service slug first, then its hub). */
  botSlugs: string[];
  locale: Locale;
}) {
  const ui = getUi(locale);
  const { portfolioItems } = getPages(locale);
  const industries = getIndustries(locale).filter((page) => service.industrySlugs?.includes(page.slug));
  const locations = getLocations(locale);
  const botContext = { service: botServiceFor(...botSlugs) };
  const contactHref = `/contact?service=${encodeURIComponent(service.navLabel)}`;
  const related = service.related.length
    ? service.related.map((item) => ({ ...item, label: pageLabelFor(item.href, locale) ?? item.label }))
    : fallbackRelated;

  return (
    <>
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <Hero
        eyebrow={eyebrow}
        h1={service.h1}
        support={service.heroSupport}
        image={service.heroImage}
        imageAlt={service.heroImageAlt}
        ctaLabel={service.finalCtaLabel}
        ctaHref={contactHref}
        locale={locale}
      />
      <DirectAnswer text={service.directAnswer} />
      {service.overview && (
        <ProseSection
          eyebrow={ui.blocks.overviewEyebrow}
          title={ui.blocks.overviewTitle}
          paragraphs={service.overview}
        />
      )}
      <FeatureList items={service.scope} locale={locale} />
      <Benefits items={service.benefits} locale={locale} />
      <ProcessSteps steps={service.process} locale={locale} />
      <PortfolioPreview items={portfolioItems} locale={locale} />
      <PricingGuidance rows={service.pricing} caption={format(ui.blocks.pricingCaption, { service: service.navLabel })} locale={locale} />
      <UseCases items={service.useCases} locale={locale} />
      <LinkCards
        eyebrow={ui.blocks.industriesEyebrow}
        title={ui.blocks.industriesTitle}
        items={industries.map((page) => ({ title: page.navLabel, description: page.heroSupport, href: `/industries/${page.slug}` }))}
        columns={industries.length === 4 ? 4 : 3}
        tone="surface"
      />
      <LinkCards
        eyebrow={ui.blocks.locationsEyebrow}
        title={ui.blocks.locationsTitle}
        description={ui.blocks.locationsDescription}
        items={locations.map((page) => ({ title: page.navLabel, description: page.heroSupport, href: `/locations/${page.slug}` }))}
      />
      <FaqAccordion faqs={service.faqs} locale={locale} />
      <RelatedServices items={related} locale={locale} />
      <CtaBanner
        title={format(ui.service.ctaTitle, { service: service.navLabel })}
        ctaLabel={service.finalCtaLabel}
        ctaHref={contactHref}
        serviceContext={service.navLabel}
        botContext={botContext}
        locale={locale}
      />
    </>
  );
}
