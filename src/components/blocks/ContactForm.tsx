"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import type { UiStrings } from "@/content/ui";
import { LOCALES, LOCALE_NAMES, splitLocaleFromPathname } from "@/content/i18n";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { CONTACT_LIMITS } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";
type Step = "form" | "review";
export type Option = { value: string; label: string };

type Values = {
  service: string;
  location: string;
  businessType: string;
  budget: string;
  timeline: string;
  replyLanguage: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string; // honeypot
};

const EMPTY: Values = {
  service: "",
  location: "",
  businessType: "",
  budget: "",
  timeline: "",
  replyLanguage: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  website: "",
};

const inputClass =
  "mt-2 w-full border border-line bg-surface px-4 py-3 text-sm focus-visible:border-accent";

/**
 * Project enquiry form: details → review → send. `ui` and the option lists are
 * passed in (not imported per locale) so the client bundle carries one
 * language. A `?service=` query (set by the CTAs on service/industry pages)
 * pre-fills the service field; UTM parameters, first page seen, current page,
 * referrer and language travel with the lead. All values live in state, so a
 * failed send never clears what the visitor typed.
 */
export function ContactForm({
  serviceContext,
  ui,
  locationOptions,
  businessOptions,
}: {
  serviceContext?: string;
  ui: UiStrings["form"];
  locationOptions: Option[];
  businessOptions: Option[];
}) {
  const pathname = usePathname() ?? "/";
  const [values, setValues] = useState<Values>(EMPTY);
  const [step, setStep] = useState<Step>("form");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const started = useRef(false);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // The query string is only known in the browser (the page is static).
    const prefill = (new URLSearchParams(window.location.search).get("service") ?? "").slice(0, CONTACT_LIMITS.service);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (prefill) setValues((v) => (v.service ? v : { ...v, service: prefill }));
    // Reply language defaults to the language of the page the visitor is reading.
    const here = splitLocaleFromPathname(window.location.pathname).locale;
    setValues((v) => (v.replyLanguage ? v : { ...v, replyLanguage: here }));
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));

  function onFirstInput() {
    if (started.current) return;
    started.current = true;
    track("form_start", { path: pathname });
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = ui.nameError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = ui.emailError;
    if (values.message.trim().length < 10) next.message = ui.messageError;
    if (values.message.trim().length > CONTACT_LIMITS.message)
      next.message = ui.tooLong.replace("{max}", String(CONTACT_LIMITS.message));
    if (!values.consent) next.consent = ui.consentError;
    return next;
  }

  function handleReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      track("form_error", { fields: Object.keys(nextErrors).join(",") });
      // Focus the first invalid field: its aria-describedby error is then read out.
      const first = ["name", "email", "message", "consent"].find((key) => nextErrors[key]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("idle");
    setStep("review");
    track("form_review", { path: pathname });
    // Move focus to the review heading once it has rendered.
    window.setTimeout(() => reviewHeading.current?.focus(), 0);
  }

  function backToEdit() {
    setStatus("idle");
    setStep("form");
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus(), 0);
  }

  async function send() {
    setStatus("submitting");
    const service = serviceContext || values.service.trim() || null;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
          consent: values.consent,
          service,
          location: values.location,
          businessType: values.businessType,
          budget: values.budget,
          timeline: values.timeline,
          replyLanguage: values.replyLanguage,
          locale: splitLocaleFromPathname(pathname).locale,
          page: window.location.href.slice(0, 500),
          referrer: document.referrer.slice(0, 500),
          ...readAttribution(),
          website: values.website, // honeypot
        }),
      });
      if (res.status === 429) {
        setStatus("rate-limited");
        track("form_error", { reason: "rate_limited" });
        return;
      }
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      track("form_submit", { service: service ?? "" });
    } catch {
      // Stay on the review step with everything still filled in, so a retry is one click.
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

  const [consentBefore, consentAfter] = ui.consentLabel.split("{privacy}");
  const label = (v: string, options: Option[]) => options.find((o) => o.value === v)?.label ?? "";
  const budgetOptions: Option[] = [
    { value: "under-20k", label: ui.budgetUnder20k },
    { value: "20-50k", label: ui.budget20to50k },
    { value: "50-100k", label: ui.budget50to100k },
    { value: "over-100k", label: ui.budgetOver100k },
    { value: "not-sure", label: ui.budgetNotSure },
  ];
  const languageOptions: Option[] = LOCALES.map((l) => ({ value: l, label: LOCALE_NAMES[l] }));
  const timelineOptions: Option[] = [
    { value: "asap", label: ui.timelineAsap },
    { value: "within-1-month", label: ui.timelineMonth },
    { value: "1-3-months", label: ui.timeline13 },
    { value: "exploring", label: ui.timelineExploring },
  ];

  const textField = (
    id: "name" | "email" | "phone",
    text: string,
    type: string,
    required: boolean,
    autoComplete: string
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {text}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={CONTACT_LIMITS[id]}
        value={values[id]}
        onChange={(e) => set(id, e.target.value)}
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

  const selectField = (
    id: "location" | "businessType" | "budget" | "timeline" | "replyLanguage",
    text: string,
    options: Option[],
    optional: boolean
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {text}
        {optional && <span className="font-normal text-text-secondary"> {ui.optionalSuffix}</span>}
      </label>
      <select
        id={id}
        name={id}
        value={values[id]}
        onChange={(e) => set(id, e.target.value)}
        className={inputClass}
      >
        <option value="">{ui.selectPlaceholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  if (step === "review") {
    const rows: [string, string][] = [
      [ui.serviceLabel, serviceContext || values.service.trim()],
      [ui.locationLabel, label(values.location, locationOptions)],
      [ui.businessLabel, label(values.businessType, businessOptions)],
      [ui.budgetLabel, label(values.budget, budgetOptions)],
      [ui.timelineLabel, label(values.timeline, timelineOptions)],
      [ui.nameLabel, values.name.trim()],
      [ui.emailLabel, values.email.trim()],
      [ui.phoneLabel, values.phone.trim()],
      [ui.replyLanguageLabel, label(values.replyLanguage, languageOptions)],
      [ui.messageLabel, values.message.trim()],
    ];
    return (
      <div aria-label={ui.aria} className="space-y-5">
        <h3 ref={reviewHeading} tabIndex={-1} className="font-display text-xl font-light text-text outline-none">
          {ui.reviewTitle}
        </h3>
        <p className="text-sm text-text-secondary">{ui.reviewIntro}</p>
        <dl className="divide-y divide-line border-y border-line text-sm">
          {rows.map(([term, value]) => (
            <div key={term} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[1fr_2fr] sm:gap-4">
              <dt className="text-text-secondary">{term}</dt>
              <dd className="break-words whitespace-pre-line text-text [overflow-wrap:anywhere]">
                {value ? <bdi>{value}</bdi> : <span className="text-text-secondary">{ui.notProvided}</span>}
              </dd>
            </div>
          ))}
        </dl>
        {(status === "error" || status === "rate-limited") && (
          <p role="alert" className="text-sm text-accent">
            {status === "rate-limited" ? ui.rateLimited : ui.failure}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={send}
            disabled={status === "submitting"}
            className="bg-accent px-6 py-3 text-sm font-medium text-text-inverse hover:bg-[#804e33] disabled:opacity-60"
          >
            {status === "submitting" ? ui.sending : ui.send}
          </button>
          <button
            type="button"
            onClick={backToEdit}
            disabled={status === "submitting"}
            className="border border-line px-6 py-3 text-sm font-medium text-text hover:border-text disabled:opacity-60"
          >
            {ui.editButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleReview} onInput={onFirstInput} noValidate aria-label={ui.aria} className="space-y-5">
      {/* Honeypot field for basic spam protection */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
        value={values.website}
        onChange={(e) => set("website", e.target.value)}
      />

      {!serviceContext && (
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-text">
            {ui.serviceLabel}
          </label>
          <input
            id="service"
            name="service"
            type="text"
            value={values.service}
            onChange={(e) => set("service", e.target.value)}
            maxLength={CONTACT_LIMITS.service}
            className={inputClass}
            placeholder={ui.servicePlaceholder}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {selectField("location", ui.locationLabel, locationOptions, true)}
        {selectField("businessType", ui.businessLabel, businessOptions, true)}
      </div>

      {textField("name", ui.nameLabel, "text", true, "name")}
      {textField("email", ui.emailLabel, "email", true, "email")}
      {textField("phone", ui.phoneLabel, "text", false, "tel")}
      {selectField("replyLanguage", ui.replyLanguageLabel, languageOptions, true)}

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
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {selectField("budget", ui.budgetLabel, budgetOptions, true)}
        {selectField("timeline", ui.timelineLabel, timelineOptions, true)}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            name="consent"
            required
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
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

      <button
        type="submit"
        className="bg-accent px-6 py-3 text-sm font-medium text-text-inverse hover:bg-[#804e33]"
      >
        {ui.reviewButton}
      </button>
    </form>
  );
}
