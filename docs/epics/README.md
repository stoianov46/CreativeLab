# Epic files

**One proposal = one epic.** This repo used to split the single
`proposal.md` into 9 separate epic issues (one per `TO-DO_2026-11-03.md` phase) —
that turned out to be pure overhead: more issues to open, more links to
keep straight, for work that's all one brief built by the same team in the
same sessions. Break the work into **large tasks** instead (see
`../tasks/README.md`) — each task should represent a real work session's
worth of doing, not a five-minute step.

If this repo ever takes on a genuinely separate second proposal later,
that's a second epic — but a single proposal should map to exactly one
epic file here, however big the proposal is.

## Format `scripts/create-epic-issues.sh` parses

```markdown
# Epic Title Here

**Priority:** P0
**Status:** In progress — see task breakdown below

Free-form spec content from here down — as long as you need. This is what
gets copied into the created issue's body, plus a link back to this file.
```

- **Line 1** (`# Title`) is **required** and is the exact-match key used for
  duplicate detection — `create-epic-issues.sh` skips creating an issue if one
  already exists with this exact title. Don't change an epic file's title
  after its issue has been created, or you'll get a duplicate on the next
  run.
- **`**Priority:**`** is optional. Must be exactly `P0`, `P1`, or `P2`.
- **`**Status:**`** is optional but is what `make board-sync-status` reads.
  Write it in plain English — the script maps it onto the board loosely:
  contains "not started" → Backlog; is (or contains) "Done" → Done;
  anything else ("Partial", "In progress", "Mostly done", ...) → In Progress.
  For the one epic, this is usually a summary/rollup — the real per-task
  status lives on each task.
- Everything else is free-form — write the actual spec, or (more likely,
  since it's one epic covering everything) a summary plus a table linking
  out to the task breakdown, same shape as `EPIC-001-creativelab-website.md`.

There's no `**Phase:**` field for epics anymore — with one epic per
proposal, "phase" doesn't distinguish anything at the epic level. Tasks can
still carry a `**Phase:**` line, matching `TO-DO_2026-11-03.md`'s phase numbering
(see `../tasks/README.md`).

## Turning a proposal into an epic is a manual, human step

`scripts/create-epic-issues.sh` only turns an **already-written** file in
this directory into a GitHub Issue — it does not read the proposal itself,
and it does not decide how to summarize it. Write the epic file first (one
per proposal, using the template above), then run `make board-epics`.
