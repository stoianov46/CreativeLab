# Launch Checklist

**Priority:** P0
**Phase:** 9
**Status:** Not started

Final pre-launch checklist. Blocked on real content inputs — see
`TO-DO_2026-11-03.md`'s "Open Questions & Blockers" for the running list of
what's still a placeholder.

## Scope

- [ ] Real contact details (email, phone, WhatsApp, Telegram, address)
      confirmed and wired in
- [ ] Real photography/video replacing all placeholder imagery
- [ ] Privacy Policy / Terms reviewed and approved by legal counsel
      (currently marked `[[VERIFY]]` drafts)
- [ ] Pricing figures confirmed with the client (currently indicative,
      styled after `proposal.md`'s own example table)
- [ ] Analytics + conversion tracking configured (no invented tracking
      IDs shipped)
- [ ] Domain, hosting and deployment pipeline finalized — see
      `TO-DO_2026-11-03.md`'s "Open Questions & Blockers": a GitHub Pages static-export pipeline
      (`.github/workflows/deploy.yml`) exists but is incompatible with
      this site's locale routing and contact form (both need
      middleware/API routes, which static export disables); confirmed
      the real target is Vercel/Node, but `deploy.yml` still auto-runs on
      every push to `main` and needs to be reconciled or disabled before
      it overwrites the (currently stale but working) live Pages site
      with a broken build
- [ ] `TASK-005` (bots), `TASK-006` (performance), `TASK-007` (i18n) and
      `TASK-008` (QA) all closed
- [ ] Sitemap submitted to Google Search Console / Yandex Webmaster
