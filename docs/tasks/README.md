# Task files

Tasks are how the one epic's work actually gets broken up and tracked.
Two ways a task comes into existence — pick whichever fits.

## A. Pre-written, large tasks (most of this proposal's work)

Write `docs/tasks/TASK-XXX-<slug>.md` (a local sequence number, e.g.
`TASK-001-...`, `TASK-002-...` — **not** a GitHub issue number; the issue
doesn't exist yet), then run `make board-tasks`
(`scripts/create-task-issues.sh`) to turn every such file into a real
issue, linked as a **native sub-issue** of the repo's one epic. Safe to
re-run — skips any task whose issue title already exists.

**Make these large.** A task here should represent a real work session —
"Bot Integration (Telegram + WhatsApp)", "Multilingual (EN/RU/TH/HE)",
"Performance Pass" — not "add a button" or "fix a typo". If you're tempted
to write ten tiny task files for one afternoon's work, write one task file
instead and use its own checklist for the sub-steps. The GitHub Issue's
checklist (`- [ ] ...` in the body) is for tracking your own progress
through a task, not for spawning more issues.

Format (same shape as an epic file, see `../epics/README.md`):

```markdown
# Task Title Here

**Priority:** P1
**Phase:** 7
**Status:** Partial — homepage translated, hub/service pages pending

Free-form spec content, acceptance criteria, whatever this task needs —
as long as it takes.
```

- **Line 1** (`# Title`) is required, and is the exact-match key
  `create-task-issues.sh` uses to avoid duplicating an already-created
  task (issue title becomes `[TASK] <this title>`).
- **`**Priority:**`**, **`**Phase:**`** — optional, same rules as epics.
  `Phase` is worth keeping since it matches `TO-DO_2026-11-03.md`'s numbering;
  drop it for a task that doesn't correspond to one of those phases.
- **`**Status:**`** — optional, read by `make board-sync-tasks`
  (`scripts/sync-task-status.sh`) with the same mapping as epics: "not
  started" → Backlog, "Done" → Done, anything else → In Progress. Update
  this line as work progresses and re-run the sync — don't hand-edit the
  board and the file separately.

## B. Ad-hoc tasks (the exception, not the rule)

For something genuinely small and unplanned — a quick fix, a follow-up
that doesn't deserve its own written spec — skip the file. File the issue
directly:

- **GitHub UI**: Issues → New issue → "Task" template
  (`.github/ISSUE_TEMPLATE/feature-task.yml`).
- **CLI**: `make task-new TITLE="..." EPIC=<n> PRIORITY=P1 BODY="..."` —
  same effect, one command, also creates a native sub-issue link.

If it turns out to need more spec than fits in the issue body after all,
write `docs/tasks/TASK-<issue-number>-<slug>.md` at that point (note: issue
number *first* here, since the issue already exists — opposite order from
the pre-written large-task files above) and link it from the issue.

## Why the split

Pre-written large task files (A) get the same treatment as epics: written
once, reviewed, turned into an issue and kept in sync via a script — good
for the bulk, planned work a proposal actually consists of. Ad-hoc issues
(B) are the escape hatch for the inevitable small things that don't
deserve that ceremony. Most of what you file should be (A).
