# CreativeLAB.in.th Website

**Priority:** P0
**Status:** In progress — see task breakdown below

The whole `proposal.md` brief, as one epic. Previously split across 9
separate epic issues (one per `TO-DO_2026-11-03.md` phase); that added tracking
overhead without adding clarity, since it's all one proposal being built
by the same team in the same sessions. It's now one epic with large tasks
under it — see `docs/epics/README.md` for why.

## What this covers

A premium creative content & advertising agency website for Koh Phangan:
Next.js homepage + 8 service hubs + 48 sub-service pages, supporting
pages, SEO/schema, Telegram/WhatsApp bots, 4 languages, performance and
QA to a high bar. Full detail in `proposal.md`.

## Task breakdown

Each of these is a `docs/tasks/TASK-*.md` file, large enough to represent
a real work session rather than a micro-step. Status per task (kept in
sync with each task's own `**Status:**` line — see `docs/tasks/README.md`):

| Task | Status |
|---|---|
| Brand Shell + Design System | Done |
| Homepage + 8 Service Hubs | Done |
| Portfolio / Case Studies / About / Contact / Journal | Done |
| SEO / Schema / Sitemap / llms.txt | Done |
| Bot Integration (Telegram + WhatsApp) | Partial — built and type-checked, not deployed |
| Performance Pass | Initial check done, no formal audit yet |
| Multilingual (EN/RU/TH/HE) | Infrastructure done, translated content not started |
| QA | Partial |
| Launch Checklist | Not started |

## Notes

The former per-phase epics' full detail wasn't lost — it's preserved in
each corresponding `docs/tasks/TASK-*.md` file, just recategorized as a
task instead of a separate epic. See `TO-DO_2026-11-03.md`'s "Open Questions &
Blockers" for placeholder data and
flagged assumptions that affect several of these tasks (contact details,
bot credentials, legal review, translations, hosting/deployment target).
