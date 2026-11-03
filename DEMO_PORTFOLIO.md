# Demo Portfolio

Original demonstration work, authorised by the owner on 2026-11-03, shown on `/portfolio` and `/portfolio/<slug>` in all four languages. **Every item is a concept made by CreativeLAB for a fictional business. None of it is a real client engagement.**

Status of the whole set: **CODE DONE on a local build.** Not `PRODUCTION VERIFIED`. Wording and visuals need the owner's review (see below).

## The rules (enforced by `npm run site:check`)

1. Every concept carries a visible label — *Concept Project*, *Demonstration Project*, *Illustrative Campaign*, *Sample Creative* or *Speculative Brand Concept* — on its card and its page (`data-concept-label`), and an "About this concept" disclaimer.
2. The businesses are fictional and unnamed ("a boutique villa", "a beach café"). No client names, real addresses, budgets, ROAS, leads, revenue, conversion rates, results, testimonials, awards or certifications. The audit fails a concept page that contains `ROAS`, a percentage, "award", "testimonial", "our client", "conversion rate" or "leads generated" outside the disclaimer.
3. Schema is an honest `CreativeWork` with `genre: "Concept project"`, created by the CreativeLAB organisation. The audit fails a portfolio `CreativeWork` without that genre.
4. The visuals are original SVG boards drawn for this site in its own palette (`src/components/blocks/ConceptVisual.tsx`). They contain no copy — only bars standing in for text, digits, hex codes and the generic "Aa" — so they need no translation and cannot imply a real brand. Nothing is copied from a competitor, a stock library or another agency's work.
5. When a real project is delivered and approved for publication it goes into `src/content/case-studies.ts`, not here; concepts can then be removed or kept as clearly labelled samples.

## The eight concepts

| # | Service category | Slug / URL | Label | What it demonstrates |
|---|---|---|---|---|
| 1 | Advertising | `/portfolio/villa-launch-campaign` | Illustrative Campaign | A Meta Ads + Google Ads structure around one booking goal; feed, story and search creative formats |
| 2 | Social Media | `/portfolio/beach-cafe-social-content` | Sample Creative | A nine-post Instagram grid and a four-week content calendar |
| 3 | Villas & Real Estate | `/portfolio/hillside-villa-listing` | Concept Project | A ground + aerial shot plan and a listing page layout |
| 4 | Food & Restaurants | `/portfolio/seaside-restaurant-menu` | Demonstration Project | A menu layout and an overhead plate photography style |
| 5 | Business & Local Presence | `/portfolio/dive-shop-local-presence` | Demonstration Project | A complete Google Business Profile (fields, photo categories, posting rhythm, review replies) |
| 6 | Websites & Digital | `/portfolio/wellness-retreat-website` | Concept Project | Desktop and mobile wireframes, page order and call-to-action placement |
| 7 | Video & Production | `/portfolio/brand-film-storyboard` | Concept Project | A six-frame, ~60-second storyboard with timing and aerial notes |
| 8 | Branding & Creative | `/portfolio/coffee-roaster-identity` | Speculative Brand Concept | A logo mark, four-colour palette, type pairing and packaging/menu applications |

Each page has: label, an H1, a 40–60 word direct answer, the concept board, the brief, "what it demonstrates", "what the concept contains", the disclaimer, links to the related real service pages, and the other concepts.

## What this is not

- **No photographs, video, drone footage or renders.** CreativeLAB's real photography and video are not represented here, and these boards are not a substitute for them. Real portfolio work is still `OWNER INPUT REQUIRED` (see the Obsidian BLOCKED list).
- Not performance evidence: no concept reports a result of any kind.

## Files

- Content (English master): `src/content/concepts.ts` — translations in `src/content/locales/{ru,th,he}/concepts.json` (LLM drafts).
- Visuals: `src/components/blocks/ConceptVisual.tsx`; cards: `src/components/blocks/ConceptCards.tsx`; page: `src/app/[locale]/portfolio/[slug]/page.tsx`; listing section: `src/app/[locale]/portfolio/page.tsx`.
- Included in `sitemap.xml` (with hreflang) and `llms.txt`.

## Open for the owner

- Read the wording and the labels; confirm the fictional-business framing is acceptable on the public site.
- Native review of RU/TH/HE copy.
- Decide whether to keep the concepts once real projects exist.
