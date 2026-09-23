import type { Metadata } from "next";
import { IndexPageView } from "@/components/pages/IndexPageView";
import { getHubs, getPages, getServiceLandings, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { toLocale } from "@/content/i18n";

export async function generateMetadata(props: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).servicesIndex;
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: "/services", locale });
}

export default async function ServicesIndexPage(props: PageProps<"/[locale]/services">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).servicesIndex;
  const ui = getUi(locale);
  return (
    <IndexPageView
      page={page}
      path="/services"
      crumbLabel={ui.nav.services}
      groups={[
        {
          title: page.landingsTitle,
          description: page.landingsDescription,
          items: getServiceLandings(locale).map((s) => ({
            title: s.navLabel,
            description: s.heroSupport,
            href: `/services/${s.slug}`,
          })),
          columns: 3,
        },
        {
          title: page.hubsTitle,
          description: page.hubsDescription,
          items: getHubs(locale).map((h) => ({ title: h.navLabel, description: h.heroSupport, href: `/${h.slug}` })),
          columns: 4,
        },
      ]}
      locale={locale}
    />
  );
}
