# SEO and GEO (AI search) Audit

Status as of 2026-11-03 on a **local build**. Rankings, snippets and AI citations cannot be promised or measured before launch, and nothing here claims them.

## Search engines

| Area | State |
|---|---|
| Titles, descriptions, H1, canonical | Unique per page and language; canonical points at the indexed URL; the 10 `/services/*` pages that duplicate a hub page canonicalise to it |
| hreflang | EN, RU, TH, HE plus `x-default`, reciprocal on every self-canonical page |
| Sitemap | 404 URLs × 4 languages from the content source, matches the crawl; absolute URLs on `https://creativelab.in.th` |
| `robots.txt` | Allows crawling; allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot; blocks `/api/`; points at the sitemap |
| Structured data | `Organization`, `WebSite`, `WebPage`/`ContactPage`, `BreadcrumbList`, `Service` + `OfferCatalog`, `FAQPage`, concept `CreativeWork`; no `LocalBusiness`, `Offer`, ratings or reviews (`SCHEMA_QA.md`) |
| Featured-snippet shape | Every commercial page opens with a 40–60 word direct answer, followed by overview, deliverables, process, pricing, FAQ (5+ questions) and related links |
| Search Console / Yandex Webmaster | The site can emit the verification meta tags (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_YANDEX_VERIFICATION`); verification and sitemap submission `OWNER INPUT REQUIRED` |

## GEO (answer engines)

- `llms.txt` and `llms-full.txt` describe the agency, services, areas, address, FAQs and the concept projects (marked as concept work, not client work).
- The content states who CreativeLAB is, what each service includes, where it works (Koh Phangan, Koh Samui, Koh Tao), what it costs (indicative, dated) and what it does not promise.
- Language versions are real pages in each language, not machine-translated overlays at runtime.

## Not done / needs the deployed site

- No keyword-volume or SERP data was used; the "search intent" in `URL_INTENT_MAP.md` is a classification, not measurement.
- Google's Rich Results Test and the Schema.org validator were not run.
- Core Web Vitals and field data need the live URL (local mobile LCP: 0.7 s unthrottled, 4.3–4.7 s under Lighthouse's simulation).
- Real backlinks, reviews and a verified Google Business Profile are outside the code.
