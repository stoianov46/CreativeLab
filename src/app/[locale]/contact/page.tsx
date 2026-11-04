import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ContactForm } from "@/components/blocks/ContactForm";
import { BotEntry } from "@/components/blocks/BotEntry";
import { Container } from "@/components/ui/Container";
import { getIndustries, getLocations, getPages, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { CopyButton } from "@/components/ui/CopyButton";
import { INTEGRATIONS, telegramLink, telegramOwnerLink } from "@/lib/integrations";
import { localePath, toLocale } from "@/content/i18n";

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const { contact } = getPages(locale);
  return buildMetadata({
    title: contact.metaTitle,
    description: contact.metaDescription,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage(props: PageProps<"/[locale]/contact">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  // Telegram is shown only once a real bot is configured (TO-DO_2026-11-03.md): @creativelab1_bot is unconfirmed.
  const telegram = telegramLink({ source: "contact-page" });
  const { contact } = getPages(locale);
  const ui = getUi(locale);
  // Option values are stable slugs; labels are the translated page names.
  const other = { value: "other", label: ui.form.otherOption };
  const locationOptions = [...getLocations(locale).map((l) => ({ value: l.slug, label: l.navLabel })), other];
  const businessOptions = [...getIndustries(locale).map((i) => ({ value: i.slug, label: i.navLabel })), other];
  const url = `${SITE.url}${localePath(locale, "/contact")}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: contact.metaTitle, description: contact.metaDescription, url, inLanguage: locale, type: "ContactPage" }),
    breadcrumbSchema([{ name: ui.nav.home, url: homeUrl }, { name: ui.nav.contact, url }]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.contact, href: "/contact" }]}
        locale={locale}
      />
      <section className="bg-inverse py-20 text-text-inverse lg:py-28">
        <Container>
          <p className="mb-4 text-xs tracking-[0.2em] text-accent-soft uppercase">
            {ui.location}
          </p>
          <h1 className="font-display max-w-2xl text-4xl leading-[1.1] font-light tracking-tight sm:text-6xl">
            {contact.h1}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-inverse-secondary">
            {contact.heroSupport}
          </p>
        </Container>
      </section>
      <DirectAnswer text={contact.directAnswer} />
      <section className="bg-base py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-display mb-8 text-2xl font-light text-text">
                {ui.form.title}
              </h2>
              <ContactForm ui={ui.form} locationOptions={locationOptions} businessOptions={businessOptions} />
            </div>
            <div>
              <h2 className="font-display mb-8 text-2xl font-light text-text">
                {contact.optionsTitle}
              </h2>
              <dl className="space-y-6 text-sm">
                <div>
                  <dt className="text-text-secondary">{ui.contact.email}</dt>
                  <dd className="mt-1 text-base text-text">
                    <a href={`mailto:${SITE.email}`} className="hover:text-accent">
                      <bdi>{SITE.email}</bdi>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary">{ui.contact.phone}</dt>
                  <dd className="mt-1 text-base text-text">
                    <a href={`tel:${SITE.phoneTel}`} className="hover:text-accent">
                      <bdi dir="ltr">{SITE.phone}</bdi>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary">{ui.contact.whatsapp}</dt>
                  <dd className="mt-1 text-base text-text">
                    <a href={`https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`} className="hover:text-accent">
                      <bdi dir="ltr">{SITE.whatsapp}</bdi>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary">{ui.contact.telegram}</dt>
                  <dd className="mt-1 text-base text-text">
                    <a href={telegramOwnerLink} className="hover:text-accent" rel="noopener noreferrer" target="_blank">
                      <bdi dir="ltr">{SITE.phone}</bdi>
                    </a>
                    <CopyButton value={SITE.phoneTel} label={ui.contact.copyNumber} doneLabel={ui.contact.copied} />
                  </dd>
                </div>
                {telegram && (
                  <div>
                    <dt className="text-text-secondary">{ui.contact.telegram}</dt>
                    <dd className="mt-1 text-base text-text">
                      <a href={telegram} className="hover:text-accent">
                        <bdi dir="ltr">@{INTEGRATIONS.telegramBotHandle}</bdi>
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-text-secondary">{ui.contact.basedIn}</dt>
                  <dd className="mt-1 text-base text-text">{ui.location}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">{ui.contact.address}</dt>
                  <dd className="mt-1 text-base text-text">
                    <address className="not-italic">
                      <bdi dir="ltr">{SITE.address.display}</bdi>
                    </address>
                    <a href={SITE.address.mapUrl} className="mt-1 inline-block text-sm text-accent hover:underline" rel="noopener noreferrer" target="_blank">
                      {ui.contact.viewOnMap}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-8">
                <BotEntry locale={locale} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
