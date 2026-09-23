import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ProseSection } from "@/components/blocks/ProseSection";
import { LinkCards } from "@/components/blocks/LinkCards";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CASE_STUDIES } from "@/content/case-studies";
import { getCaseStudies, getIndustries, getLocations, getUi, pageLabelFor } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, creativeWorkSchema, jsonLdGraph } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

// Empty until real, approved projects exist (src/content/case-studies.ts) —
// every URL 404s meanwhile.
export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/[locale]/case-studies/[slug]">): Promise<Metadata> {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const study = getCaseStudies(locale).find((c) => c.slug === slug);
  if (!study) return {};
  return buildMetadata({ title: study.metaTitle, description: study.metaDescription, path: `/case-studies/${slug}`, locale });
}

/** Section order per proposal §20: Hero → Client → Challenge → Strategy → Creative → Production → Advertising → Result → Gallery → Services → Location. */
export default async function CaseStudyPage(props: PageProps<"/[locale]/case-studies/[slug]">) {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const study = getCaseStudies(locale).find((c) => c.slug === slug);
  if (!study) notFound();
  const ui = getUi(locale);
  const t = ui.caseStudy;
  const location = getLocations(locale).find((l) => l.slug === study.locationSlug);
  const industry = getIndustries(locale).find((i) => i.slug === study.industrySlug);
  const url = `${SITE.url}${localePath(locale, `/case-studies/${slug}`)}`;
  const graph = jsonLdGraph([
    creativeWorkSchema({
      name: study.title,
      description: study.metaDescription,
      url,
      image: `${SITE.url}${study.heroImage.src}`,
      datePublished: study.datePublished,
      inLanguage: locale,
    }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.caseStudies, url: `${SITE.url}${localePath(locale, "/case-studies")}` },
      { name: study.title, url },
    ]),
  ]);
  const sections: [string, readonly string[]][] = [
    [t.challenge, study.challenge],
    [t.strategy, study.strategy],
    [t.creative, study.creative],
    [t.production, study.production],
    [t.advertising, study.advertising],
    [t.results, study.results],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.caseStudies, href: "/case-studies" },
          { label: study.title, href: `/case-studies/${slug}` },
        ]}
        locale={locale}
      />
      <Hero eyebrow={t.eyebrow} h1={study.title} support={study.summary} image={study.heroImage} imageAlt={study.heroImageAlt} locale={locale} />
      <DirectAnswer text={study.summary} />
      <Container className="py-10">
        <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
          {[
            [t.client, study.client],
            [t.location, location?.navLabel],
            [t.industry, industry?.navLabel],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="border-t border-line pt-4">
                <dt className="text-text-secondary">{label}</dt>
                <dd className="mt-1 text-base text-text">{value}</dd>
              </div>
            ))}
        </dl>
      </Container>
      {sections.map(([title, paragraphs], index) => (
        <ProseSection key={title} title={title} paragraphs={paragraphs} tone={index % 2 ? "base" : "surface"} />
      ))}
      {study.gallery.length > 0 && (
        <section className="border-t border-line bg-surface py-16 lg:py-24">
          <Container>
            <SectionHeading title={t.gallery} />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {study.gallery.map((item) => (
                <figure key={item.caption}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={item.image} alt={item.alt} fill placeholder="blur" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 text-sm text-text-secondary">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}
      <LinkCards
        title={t.services}
        items={study.servicePaths.map((href) => ({ title: pageLabelFor(href, locale) ?? href, href }))}
        columns={4}
      />
      <CtaBanner title={ui.hub.ctaDescription} locale={locale} />
    </>
  );
}
