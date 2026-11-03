# Content QA

Quality checks on the written content, as of 2026-11-03. Automated results come from `npm run site:check` on a local build; **content quality itself (accuracy, tone, usefulness) is not measurable by code and needs human review.**

## Automated, passing

| Check | Result |
|---|---|
| Direct answer of 40–60 words on every commercial page (hubs, services, `/services/*`, industries, locations, concepts) | pass (English) |
| English meta descriptions 140–165 characters on commercial pages; titles unique per language | pass |
| One H1 per page; at least 5 FAQ items on commercial pages | pass |
| Main content ≥ 800 words on service pages and ≥ 1500 on hubs | pass |
| No near-duplicate pages (5-word-shingle overlap ≤ 35% outside index↔child pairs) | pass |
| Banned marketing clichés (unparalleled, one-stop, world-class, seamless, bespoke, …) | 0 hits |
| Guarantee wording | 3 FAQ questions ("Do you guarantee rankings?") answered "No" — reviewed, not promises |
| Concept projects: visible label, disclaimer, no ROAS / percentage / award / testimonial / "our client" claims | pass |
| English text left on RU/TH/HE pages | none detected |

## Headings reviewed by hand

The H1 and title of all 101 English pages were read against each page's topic and primary keyword (2026-11-03). Two hubs (`/business-local-presence`, `/websites-digital`) shared their H1 and primary keyword with their main child page and now have their own; two titles that did not match their page were aligned.

## Truth rule (nothing invented)

No client names, ratings, reviews, awards, certifications, results or testimonials appear anywhere. The portfolio shows only labelled concepts for fictional businesses (`DEMO_PORTFOLIO.md`). Prices are labelled indicative and dated. The address is the owner-specified one; no Google Business Profile claim is made; the phone is shown as supplied and flagged for confirmation.

## Needs a person

- **Read the new English copy** — it was written by an LLM from the existing pages: the Included / Not included lists on 133 price rows, the clauses added to 7 direct answers, the concept project texts, and the legal drafts.
- **Native review of all RU / TH / HE copy** (every translation is an LLM draft); specifics are in `NOTES.md`.
- **Price positioning and the draft revisions / turnaround values** shown in the price tables.
- **Lawyer review** of Privacy, Terms and Cookie Policy (12 `[[VERIFY]]` markers across the four languages).
- **Real proof content** when it exists: case studies, testimonials, journal articles, photography.
