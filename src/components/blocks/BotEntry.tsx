import { Button } from "@/components/ui/Button";
import { telegramLink, whatsappLink, type BotContext } from "@/lib/integrations";
import type { Locale } from "@/content/i18n";
import { format } from "@/content/localize";
import { getUi } from "@/content/translations";

/**
 * WhatsApp / Telegram chat buttons. `context` preselects the service and
 * location in the bots (deep-link payload); `serviceContext` is the
 * human-readable service name for the pre-filled WhatsApp message.
 */
export function BotEntry({
  serviceContext,
  context = {},
  className = "",
  tone = "light",
  locale,
}: {
  serviceContext?: string;
  context?: BotContext;
  className?: string;
  /** "dark" for use on the inverse (dark) CTA banner. */
  tone?: "light" | "dark";
  locale: Locale;
}) {
  const ui = getUi(locale).cta;
  const source = { ...context, source: context.source ?? "site" };
  const wa = whatsappLink(
    serviceContext ? format(ui.whatsappGreeting, { service: serviceContext }) : undefined,
    source
  );
  const tg = telegramLink(source);
  const variant = tone === "dark" ? "ghost" : "secondary";

  if (!wa && !tg) {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        <Button href="/contact" variant={variant}>
          {ui.messageUs}
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {wa && (
        <Button href={wa} variant={variant} external>
          {ui.chatWhatsapp}
        </Button>
      )}
      {tg && (
        <Button href={tg} variant={variant} external>
          {ui.chatTelegram}
        </Button>
      )}
    </div>
  );
}
