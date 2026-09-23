import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import type { Locale } from "@/content/i18n";
import { getFooterColumns, getUi } from "@/content/translations";
import { SITE } from "@/content/site";
import { ConsentSettingsLink } from "@/components/layout/Analytics";
import { Container } from "@/components/ui/Container";

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const ui = getUi(locale);
  return (
    <footer className="border-t border-line-inverse bg-inverse text-text-inverse">
      <Container className="py-16 lg:py-24">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {getFooterColumns(locale).map((column) => (
            <div key={column.title}>
              <h3 className="text-xs tracking-[0.15em] text-text-inverse-secondary uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-inverse-secondary hover:text-text-inverse"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line-inverse pt-8 text-sm text-text-inverse-secondary sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-text-inverse">
            CreativeLAB — {ui.location}
          </p>
          <p>
            <a href={`mailto:${SITE.email}`} className="hover:text-text-inverse">
              <bdi>{SITE.email}</bdi>
            </a>
          </p>
        </div>
        <p className="mt-6 text-xs text-text-inverse-secondary">
          © {year} {SITE.legalName}. {ui.footer.rights}{" "}
          <ConsentSettingsLink label={ui.consent.manage} />
        </p>
      </Container>
    </footer>
  );
}
