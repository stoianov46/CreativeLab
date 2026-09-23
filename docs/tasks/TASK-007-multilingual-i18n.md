# Multilingual (EN/RU/TH/HE)

**Priority:** P0
**Phase:** 7
**Status:** Done as LLM draft (2026-09-22), pending native review — see `docs/i18n.md`

EN is the master copy; RU, TH and HE need **native, professionally
adapted** translations per page — the proposal explicitly rules out
literal machine translation. Hebrew needs true RTL (`dir="rtl"`, mirrored
icons, `margin-inline`/`text-align: start` throughout, `bdi` around
numbers/URLs/emails), Thai needs correct ICU line-breaking.

## Deliberately not auto-generated

Machine-translating all 56 pages in one pass — even via an LLM rather
than Google Translate — would violate `proposal.md`'s own translation
rule in spirit. This needs either:
- a native RU/TH/HE copywriter/reviewer in the loop per page, or
- an explicit client decision to accept LLM-drafted copy as a starting
  point pending human review (documented as such, not shipped as final).

## Scope

- [x] Routing strategy implemented per `proposal.md` §09: EN stays
      canonical/unprefixed (`/`, `/contact`), RU/TH/HE are prefixed
      (`/ru/...`, `/th/...`, `/he/...`). Every route moved under
      `src/app/[locale]/`; `src/proxy.ts` rewrites unprefixed requests to
      `locale=en` under the hood (visible URL unchanged) and redirects
      away any literal `/en/*` URL (single canonical URL per page). All
      263 pages (4 locales × every static/hub/service route) prerender
      at build time (`generateStaticParams` in
      `src/app/[locale]/layout.tsx`, `dynamicParams = false`).
- [x] Internal linking: every content-authored href stays canonical
      (EN-relative, e.g. `/contact`) — `src/components/ui/LocalizedLink.tsx`
      auto-prefixes it to the current locale by reading the real request
      URL, so no page or content file needs to know about locales. Swapped
      in wherever `next/link` was used directly (`Header`, `Footer`,
      `Button`, `Breadcrumbs`, `ServiceGrid`, `RelatedServices`).
- [x] RTL layout support: `dir="rtl"`/`lang` set server-side per locale
      on `<html>` (`src/app/[locale]/layout.tsx`); hardcoded physical
      Tailwind classes (`pl-`/`pr-`/`ml-`/`mr-`/`text-left`/`left-`/`right-`)
      swapped for logical equivalents (`ps-`/`pe-`/`ms-`/`me-`/`text-start`/
      `start-`/`end-`) across `Header`, `Footer`, `AnnouncementBar`,
      `FeatureList`, `LocationBlock`, `PricingGuidance`, the skip-link; the
      `ServiceGrid` "Explore →" arrow mirrors via `rtl:rotate-180`; emails
      wrapped in `<bdi>` (Footer, Contact, Privacy, Terms) per §09's `bdi`
      rule. **Not yet done**: a full component-by-component RTL visual QA
      pass — verified structurally and via `dir=rtl` on a running page,
      but not eyeballed against real Hebrew copy (no translated content
      exists yet to check line-wrapping/mirroring against).
- [x] Thai font stack: `Noto_Sans_Thai` loaded via `next/font/google`,
      applied through a `.font-thai` class on `<html>` for `locale==="th"`
      (overrides both `--font-display` and `--font-body`, since Fraunces
      has no Thai glyphs at all). ICU line-breaking not separately
      verified — no Thai copy exists yet to test wrapping against.
- [x] hreflang: `buildMetadata()` now emits `alternates.languages` (all 4
      locales + `x-default`) on every page, and `sitemap.ts` emits one
      entry per locale per canonical path with the same reciprocal
      alternates — this also closes `TASK-004`'s blocked hreflang item.
- [ ] Translate/adapt Homepage (RU, TH, HE) — pilot page to validate the
      process before scaling to all 56. **Not started** — every locale
      currently serves the same English copy through the new routing
      (infrastructure-only, per this task's own "deliberately not
      auto-generated" rule above; needs a native reviewer/copywriter or
      an explicit client sign-off to proceed with LLM-drafted copy).
- [ ] Translate/adapt remaining hub + service pages

## ⚠️ Hosting constraint discovered (2026-09-14)

This routing depends on `src/proxy.ts` (Next middleware) and
`src/app/api/contact/route.ts` — both require a Node-capable host.
A teammate independently configured the repo for GitHub Pages static
export (`output: "export"`) the same day; static export **disables
middleware and API routes entirely** (confirmed via Next.js's own build
warning and by inspecting the `out/` output — no unprefixed EN routes or
`/api/contact` existed in it). It also broke `next dev` outright
(`⨯ Middleware cannot be used with "output: export"`, every route 404s).

Reverted `next.config.ts` to plain (no `output`/`basePath`/`assetPrefix`)
to unblock local dev and match the real deployment target (Vercel/Node —
confirmed with the team, not GitHub Pages). See `PROGRESS.md`'s "Open
Questions & Blockers" for the still-open GitHub Pages / `deploy.yml`
reconciliation and the `SITE.url` vs. actual Pages URL mismatch —
neither touched here since they're the teammate's call to make.
