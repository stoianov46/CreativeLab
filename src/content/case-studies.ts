import type { CaseStudy } from "@/content/types";

/**
 * Real, completed and client-approved projects only (proposal Truth Rule —
 * no invented clients or numbers). Empty until the client supplies them;
 * /case-studies shows an honest "in progress" state meanwhile. Add an entry
 * here and it gets a page at /case-studies/<slug>, a card on the listing
 * page, CreativeWork schema and a sitemap entry; then `npm run i18n:sync`.
 */
export const CASE_STUDIES: CaseStudy[] = [];
