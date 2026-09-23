import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BotEntry } from "@/components/blocks/BotEntry";
import type { BotContext } from "@/lib/integrations";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";

export function CtaBanner({
  title,
  description,
  ctaLabel,
  ctaHref = "/contact",
  serviceContext,
  botContext,
  locale,
}: {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Human-readable service name for the pre-filled chat message. */
  serviceContext?: string;
  /** Preselects service/location in the chat bots. */
  botContext?: BotContext;
  locale: Locale;
}) {
  return (
    <section className="bg-inverse py-16 text-text-inverse lg:py-24">
      <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl leading-tight font-light sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-text-inverse-secondary">
              {description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-start gap-4">
          <Button href={ctaHref} variant="primary">
            {ctaLabel ?? getUi(locale).cta.startProject}
          </Button>
          <BotEntry serviceContext={serviceContext} context={botContext} tone="dark" locale={locale} />
        </div>
      </Container>
    </section>
  );
}
