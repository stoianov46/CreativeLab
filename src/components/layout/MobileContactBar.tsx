import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import type { UiStrings } from "@/content/ui";

/**
 * Sticky bottom bar on phones: WhatsApp / Telegram / Call / Start a project.
 * Hidden from lg up (the header CTA is visible there). Channels without a
 * configured link are left out.
 */
export function MobileContactBar({
  ui,
  whatsapp,
  telegram,
  phone,
}: {
  ui: UiStrings["mobileBar"];
  whatsapp: string | null;
  telegram: string | null;
  phone: string;
}) {
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium";
  return (
    <nav
      aria-label={ui.aria}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-base/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${item} text-text`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.7L4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          {ui.whatsapp}
        </a>
      )}
      {telegram && (
        <a href={telegram} target="_blank" rel="noopener noreferrer" className={`${item} text-text`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          {ui.telegram}
        </a>
      )}
      <a href={`tel:${phone.replace(/\s/g, "")}`} className={`${item} text-text`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        {ui.call}
      </a>
      <Link href="/contact" className={`${item} bg-accent text-text-inverse`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" className="rtl:origin-center rtl:rotate-180" /></svg>
        {ui.start}
      </Link>
    </nav>
  );
}
