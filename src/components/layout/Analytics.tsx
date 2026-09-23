"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ANALYTICS_IDS, CONSENT_KEY, hasAnyAnalytics, readConsent, track } from "@/lib/analytics";
import type { UiStrings } from "@/content/ui";
import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";

type Consent = { analytics: boolean; marketing: boolean };

/**
 * Consent banner + provider scripts + automatic events (proposal §16–17:
 * Accept / Reject / Settings; GA and Meta Pixel blocked until consent).
 * Renders nothing at all while no analytics IDs are configured.
 */
export function Analytics({ ui }: { ui: UiStrings["consent"] }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [draft, setDraft] = useState<Consent>({ analytics: false, marketing: false });

  useEffect(() => {
    if (!hasAnyAnalytics) return;
    const saved = readConsent();
    /* eslint-disable react-hooks/set-state-in-effect */
    setConsent(saved);
    setOpen(!saved);
    /* eslint-enable react-hooks/set-state-in-effect */
    const reopen = () => {
      setOpen(true);
      setSettings(true);
    };
    window.addEventListener("cl:open-consent", reopen);
    return () => window.removeEventListener("cl:open-consent", reopen);
  }, []);

  // Automatic events: page views, 75% scroll, outbound contact clicks.
  useEffect(() => {
    track("page_view", { path: pathname ?? "/" });
    let sent = false;
    const onScroll = () => {
      const el = document.documentElement;
      if (!sent && el.scrollTop + window.innerHeight >= el.scrollHeight * 0.75) {
        sent = true;
        track("scroll_75", { path: pathname ?? "/" });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("wa.me")) track("whatsapp_click");
      else if (href.includes("t.me/")) track("telegram_click");
      else if (href.startsWith("tel:")) track("phone_click");
      else if (href.startsWith("mailto:")) track("email_click");
      else if (a.hasAttribute("hreflang")) track("language_switch", { to: a.getAttribute("hreflang") ?? "" });
      else if (/\/contact(\?|$)/.test(href)) track("cta_click", { label: a.textContent?.trim().slice(0, 60) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!hasAnyAnalytics) return null;

  const save = (next: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setConsent(next);
    setOpen(false);
    setSettings(false);
  };

  return (
    <>
      {consent?.analytics && ANALYTICS_IDS.ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_IDS.ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ANALYTICS_IDS.ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {consent?.analytics && ANALYTICS_IDS.ym && (
        <Script id="ym" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${Number(ANALYTICS_IDS.ym)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
        </Script>
      )}
      {consent?.marketing && ANALYTICS_IDS.metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${ANALYTICS_IDS.metaPixel}');fbq('track','PageView');`}
        </Script>
      )}
      {open && (
        <div
          role="dialog"
          aria-labelledby="consent-title"
          className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-xl border border-line bg-surface p-5 text-sm text-text shadow-[0_12px_32px_rgba(20,18,16,0.15)] lg:bottom-6"
        >
          <p id="consent-title" className="font-display text-lg">{ui.title}</p>
          <p className="mt-2 text-text-secondary">
            {ui.text}{" "}
            <Link href="/privacy" className="text-accent underline">{ui.privacyLink}</Link>
          </p>
          {settings && (
            <fieldset className="mt-4 space-y-2">
              <label className="flex items-center gap-3 text-text-secondary">
                <input type="checkbox" checked disabled /> {ui.necessary}
              </label>
              {(["analytics", "marketing"] as const).map((key) => (
                <label key={key} className="flex items-center gap-3">
                  <input type="checkbox" checked={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })} />
                  {ui[key]}
                </label>
              ))}
            </fieldset>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="bg-accent px-4 py-2 font-medium text-text-inverse hover:bg-[#804e33]">
              {ui.accept}
            </button>
            <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="border border-text px-4 py-2 font-medium hover:bg-text hover:text-text-inverse">
              {ui.reject}
            </button>
            {settings ? (
              <button type="button" onClick={() => save(draft)} className="px-4 py-2 text-accent underline">
                {ui.save}
              </button>
            ) : (
              <button type="button" onClick={() => setSettings(true)} className="px-4 py-2 text-text-secondary underline">
                {ui.settings}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the consent settings (only when analytics is configured). */
export function ConsentSettingsLink({ label }: { label: string }) {
  if (!hasAnyAnalytics) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("cl:open-consent"))}
      className="hover:text-text-inverse"
    >
      {label}
    </button>
  );
}
