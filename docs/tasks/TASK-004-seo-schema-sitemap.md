# SEO / Schema / Sitemap / llms.txt

**Priority:** P0
**Phase:** 4
**Status:** Done

Technical SEO and AI-search (GEO) foundations: sitemap, robots, JSON-LD
schema on every page, and a generated `llms.txt`.

## Scope

- `src/app/sitemap.ts`
- JSON-LD: Organization (global), WebPage + BreadcrumbList everywhere,
  Service + FAQPage on hub/service pages
- [x] hreflang tags — `TASK-007`'s locale routing landed; `buildMetadata()`
      emits `alternates.languages` (4 locales + x-default) on every page,
      and `sitemap.ts` emits one entry per locale per canonical path with
      reciprocal `<xhtml:link rel="alternate">` tags.
- ⚠️ `robots.txt` / `llms.txt`: **regressed from generated to static**.
  A teammate's GitHub Pages static-export experiment (see
  `TO-DO_2026-11-03.md`'s "Open Questions & Blockers") replaced `src/app/robots.ts` and
  `src/app/llms.txt/route.ts` (generated from `src/content/**`, always in
  sync) with hand/one-time-generated files at `public/robots.txt` and
  `public/llms.txt`. The static-export attempt itself was reverted
  (broke `next dev` and the locale routing/contact form — see
  `next.config.ts` git history), but these two files were not restored.
  They still work today but will silently drift out of sync as hubs/
  services are added. Restoring the two route handlers is a small,
  unblocked follow-up — not done here to stay in scope of this pass.

## Outcome

Sitemap, JSON-LD and hreflang are complete and correct for all 4 locales
(RU/TH/HE currently serve the same EN copy pending real translations —
see `TASK-007`). `robots.txt`/`llms.txt` work but need restoring to their
generated form (see caveat above) to stay accurate as content grows.
