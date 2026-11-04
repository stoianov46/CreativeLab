"use client";

import { useEffect } from "react";
import { ATTRIBUTION_KEY } from "@/lib/attribution";

/**
 * Remembers where a visitor first landed (UTM parameters, landing page,
 * referrer) for the length of the browser session, so the contact form can
 * attach it even if they browse a few pages before enquiring. Stored only in
 * this tab's sessionStorage and sent nowhere unless the visitor submits the
 * enquiry form (see the privacy policy and TO-DO_2026-11-03.md). Renders nothing.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;
      const params = new URLSearchParams(window.location.search);
      const data: Record<string, string> = {
        landing_page: window.location.href.slice(0, 500),
        referrer: document.referrer.slice(0, 500),
      };
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
        const value = params.get(key);
        if (value) data[key] = value.slice(0, 100);
      }
      window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
    } catch {
      // Storage blocked (private mode etc.) — the form falls back to the current URL.
    }
  }, []);
  return null;
}
