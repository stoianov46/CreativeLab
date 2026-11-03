import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ConceptCards, ConceptLabel } from "@/components/blocks/ConceptCards";
import { ConceptVisual } from "@/components/blocks/ConceptVisual";
import { LinkCards } from "@/components/blocks/LinkCards";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONCEPTS } from "@/content/concepts";
import { getConcepts, getUi, pageLabelFor } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, conceptSchema, jsonLdGraph } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/[locale]/portfolio/[slug]">): Promise<Metadata> {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const concept = getConcepts(locale).find((c) => c.slug === slug);
  if (!concept) return {};
  return buildMetadata({ title: concept.metaTitle, description: concept.metaDescription, path: `/portfolio/${slug}`, locale });
}

/** A concept project page: label → visual → brief → what it demonstrates → contents → honesty note → related services. */
export default async function ConceptPage(props: PageProps<"/[locale]/portfolio/[slug]">) {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const all = getConcepts(locale);
  const concept = all.find((c) => c.slug === slug);
  if (!concept) notFound();
  const ui = getUi(locale);
  const t = ui.concept;
  const url = `${SITE.url}${localePath(locale, `/portfolio/${slug}`)}`;
  const graph = jsonLdGraph([
    conceptSchema({
      name: concept.title,
      description: concept.metaDescription,
      url,
      datePublished: concept.datePublished,
      inLanguage: locale,
    }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.portfolio, url: `${SITE.url}${localePath(locale, "/portfolio")}` },
      { name: concept.navLabel, url },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.portfolio, href: "/portfolio" },
          { label: concept.navLabel, href: `/portfolio/${slug}` },
        ]}
        locale={locale}
      />
      <section className="bg-inverse py-16 text-text-inverse lg:py-24">
        <Container>
          <ConceptLabel inverse>{concept.label}</ConceptLabel>
          <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.1] font-light tracking-tight [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
            {concept.title}
          </h1>
        </Container>
      </section>
      <DirectAnswer text={concept.directAnswer} />
      <section className="bg-base py-12 lg:py-16">
        <Container>
          <ConceptVisual id={concept.visual} alt={concept.visualAlt} className="mx-auto max-w-4xl" />
        </Container>
      </section>
      <section className="border-t border-line bg-surface py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div>
              <SectionHeading title={t.briefTitle} />
              <p className="mt-6 text-text-secondary">{concept.brief}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-light text-text">{t.demonstratesTitle}</h2>
              <ul className="mt-6 list-disc space-y-3 ps-5 text-text-secondary">
                {concept.demonstrates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-light text-text">{t.deliverablesTitle}</h2>
              <ul className="mt-6 list-disc space-y-3 ps-5 text-text-secondary">
                {concept.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="mt-12 border-s-4 border-accent bg-base p-6">
            <h2 className="font-display text-lg font-medium text-text">{t.disclaimerTitle}</h2>
            <p className="mt-2 text-sm text-text-secondary">{t.disclaimer}</p>
          </aside>
        </Container>
      </section>
      <LinkCards
        title={t.servicesTitle}
        items={concept.servicePaths.map((href) => ({ title: pageLabelFor(href, locale) ?? href, href }))}
        columns={3}
      />
      <ConceptCards title={t.moreTitle} items={all.filter((c) => c.slug !== slug).slice(0, 4)} locale={locale} tone="surface" compact />
      <CtaBanner title={ui.hub.ctaDescription} locale={locale} />
    </>
  );
}
