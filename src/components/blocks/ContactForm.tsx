"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import type { UiStrings } from "@/content/ui";
import { splitLocaleFromPathname } from "@/content/i18n";
import { track } from "@/lib/analytics";
import { CONTACT_LIMITS } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";


const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const inputClass =
  "mt-2 w-full border border-line bg-surface px-4 py-3 text-sm focus-visible:border-accent";

/**
 * Project enquiry form. `ui` is passed in (not imported per locale) so the
 * client bundle only carries one language. A `?service=` query (set by the
 * CTAs on service/industry pages) pre-fills the service field; UTM
 * parameters, the page and the language travel with the lead.
 */
export function ContactForm({
  serviceContext,
  ui,
}: {
  serviceContext?: string;
  ui: UiStrings["form"];
}) {
  const pathname = usePathname() ?? "/";
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefill, setPrefill] = useState("");
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const started = useRef(false);

  useEffect(() => {
    // Query/referrer are only known in the browser (the page is static).
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    setPrefill((params.get("service") ?? "").slice(0, CONTACT_LIMITS.service));
    setAttribution(
      Object.fromEntries(
        UTM_KEYS.map((key) => [key, params.get(key) ?? ""]).filter(([, value]) => value)
      )
    );
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function onFirstInput() {
    if (started.current) return;
    started.current = true;
    track("form_start", { path: pathname });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const name = value("name");
    const email = value("email");
    const phone = value("phone");
    const message = value("message");
    const consent = form.get("consent") === "on";

    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = ui.nameError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = ui.emailError;
    if (message.length < 10) nextErrors.message = ui.messageError;
    if (message.length > CONTACT_LIMITS.message)
      nextErrors.message = ui.tooLong.replace("{max}", String(CONTACT_LIMITS.message));
    if (!consent) nextErrors.consent = ui.consentError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      track("form_error", { fields: Object.keys(nextErrors).join(",") });
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          consent,
          service: serviceContext || value("service") || null,
          locale: splitLocaleFromPathname(pathname).locale,
          page: window.location.href.slice(0, 500),
          referrer: document.referrer.slice(0, 500),
          ...attribution,
          website: value("website"), // honeypot
        }),
      });
      if (res.status === 429) {
        setStatus("rate-limited");
        track("form_error", { reason: "rate_limited" });
        return;
      }
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      track("form_submit", { service: serviceContext || value("service") || "" });
    } catch {
      setStatus("error");
      track("form_error", { reason: "delivery" });
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="border border-olive/40 bg-olive/10 p-6 text-sm text-text">
        {ui.success}
      </div>
    );
  }

  const field = (
    id: "name" | "email" | "phone",
    label: string,
    type: string,
    required: boolean,
    autoComplete: string
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={CONTACT_LIMITS[id]}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        className={inputClass}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-accent">
          {errors[id]}
        </p>
      )}
    </div>
  );

  const [consentBefore, consentAfter] = ui.consentLabel.split("{privacy}");

  return (
    <form onSubmit={handleSubmit} onInput={onFirstInput} noValidate aria-label={ui.aria} className="space-y-5">
      {/* Honeypot field for basic spam protection */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      {!serviceContext && (
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-text">
            {ui.serviceLabel}
          </label>
          <input
            id="service"
            name="service"
            type="text"
            key={prefill}
            defaultValue={prefill}
            maxLength={CONTACT_LIMITS.service}
            className={inputClass}
            placeholder={ui.servicePlaceholder}
          />
        </div>
      )}

      {field("name", ui.nameLabel, "text", true, "name")}
      {field("email", ui.emailLabel, "email", true, "email")}
      {field("phone", ui.phoneLabel, "text", false, "tel")}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text">
          {ui.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={CONTACT_LIMITS.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={inputClass}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-accent">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
          />
          <span>
            {consentBefore}
            <Link href="/privacy" className="text-accent underline">
              {ui.consentPrivacy}
            </Link>
            {consentAfter}
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-xs text-accent">
            {errors.consent}
          </p>
        )}
      </div>

      {(status === "error" || status === "rate-limited") && (
        <p role="alert" className="text-sm text-accent">
          {status === "rate-limited" ? ui.rateLimited : ui.failure}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-accent px-6 py-3 text-sm font-medium text-text-inverse hover:bg-[#804e33] disabled:opacity-60"
      >
        {status === "submitting" ? ui.sending : ui.send}
      </button>
    </form>
  );
}
