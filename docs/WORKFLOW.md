# Team Workflow

How we plan, track and ship work on CreativeLAB.in.th. This is the single
process document — link everything else to it rather than re-explaining
the process elsewhere. For the step-by-step "what do I actually type"
version, see [HowTo.md](./HowTo.md) instead.

Every `scripts/*.sh` command below has a `make` shortcut (`make help`
lists them all):

| Script | Make target |
|---|---|
| `scripts/github-bootstrap.sh` | `make board-setup` |
| `scripts/create-epic-issues.sh` | `make board-epics` |
| `scripts/create-task-issues.sh` | `make board-tasks` |
| `scripts/backfill-status.sh [status]` | `make board-backfill [STATUS=...]` |
| `scripts/sync-epic-status.sh` | `make board-sync-status` |
| `scripts/sync-task-status.sh` | `make board-sync-tasks` |
| `scripts/create-task.sh --title ...` (ad-hoc task, no committed file) | `make task-new TITLE=... [EPIC=] [PRIORITY=] [PHASE=] [BODY=]` |
| `scripts/start-task.sh <n>` | `make task-start TASK=<n>` |

## The three layers

| Layer | Lives in | Purpose |
|---|---|---|
| **Proposal** | `docs/Proposals.md` + the proposal file itself (`proposal.md`) | The brief: what we're building and why. Rarely changes once approved. |
| **Epic** — **ONE per proposal** | A GitHub Issue (`type: epic`) backed by one `docs/epics/EPIC-XXX-*.md` | The whole proposal. Tracks its large tasks as native sub-issues. |
| **Task** — as many as needed, but each **large** | A GitHub Issue (`type: task`), usually backed by a pre-written `docs/tasks/TASK-XXX-*.md` | A real work session's worth of doing — not a five-minute step. This is what a branch and PR are built against. |

**One proposal = one epic.** This repo used to split `proposal.md` into 9
separate epic issues, one per `TO-DO_2026-11-03.md` phase — that turned out to be
pure overhead: more issues to open, more links to keep straight, for work
that's all one brief built by the same team in the same sessions. It's now
one epic; what used to be 9 epics are now 9 large tasks under it. Don't
re-introduce multiple epics per proposal.

**The GitHub Issue is always the source of truth for status.** The
`docs/epics/` and `docs/tasks/` markdown files are an optional second
layer for specs too long or too detailed for an issue body (architecture
notes, content requirements, acceptance criteria with a lot of nuance).
When one exists, the issue links to it and the doc links back to the
issue — never duplicate a status/checkbox in both places. If a file's
`**Status:**` line and the board disagree, run `make board-sync-status`
(epics) or `make board-sync-tasks` (tasks) to push the file's status onto
the board — never the other direction.

Small, unplanned tasks don't need a doc file at all — file the issue
directly using the task template (see `docs/tasks/README.md` for this
ad-hoc path vs. the pre-written large-task path, which should be most of
your work).

## Issue types

Three issue templates, all plain GitHub Issues distinguished by a `type`
label:

- **`type: epic`** — the whole proposal. Exactly one open epic at a time.
- **`type: task`** — a large chunk of implementation work (a real work
  session, not necessarily a single PR — it's fine for a big task to span
  several PRs, each referencing it with `Part of #<n>` until the final one
  closes it).
- **`type: bug`** — something broken in production or in an existing
  feature. Anyone (including external reporters) can file one.

Every epic and task issue also carries:

- **Priority**: `P0`, `P1`, `P2` — matches the priority already used in
  `proposal.md`.
- **Phase**: matches the phase numbering in `TO-DO_2026-11-03.md` (Phase 1
  Foundation, Phase 2 Hubs, … Phase 9 Launch) where relevant. Not every
  issue needs a phase (e.g. an unplanned bug fix).

## The board (GitHub Projects)

One Project board tracks every epic and task issue (bugs can be added
too, or left off the board and just tracked as issues — team's call per
bug). Board fields:

- **Status** (single select, GitHub's built-in field — renamed by hand,
  see below, since the API won't let it be deleted/recreated):
  `Backlog` → `Ready` → `In Progress` → `In Test` → `Done`
- **Priority**: `P0` / `P1` / `P2`
- **Phase**: `Phase 1` … `Phase 9`

`In Test` is the "there's an open PR" stage. Rather than relying on
someone to remember to drag the card there, the cause and effect is
flipped so it's enforced automatically: **opening the linked PR is what
moves the card** — a task can't reach `In Test` without a real PR behind
it. Same idea for `Done`: merging the PR is what moves it, not a manual
drag.

Set up once via `scripts/github-bootstrap.sh`, which creates the `Priority`
and `Phase` fields (see that script's header for prerequisites). The
`Status` field itself ships on every new Project with default options
`Todo` / `In Progress` / `Done` — GitHub's API refuses to delete or
recreate it ("only custom fields can be deleted"), so rename its options
by hand once: open the project → click the `Status` column header → Edit
→ rename `Todo` to `Backlog`, and add `Ready` and `In Test` options.
**If you created epic/task issues before doing this**, their Status
silently failed to be set — run `./scripts/backfill-status.sh` once
afterward to fix them up.

After that, add new issues to the board manually, or let
`scripts/create-epic-issues.sh` / the board's "auto-add" workflow
(Project → `⋯` → Workflows → "Auto-add to project", filtered to this
repo) do it.

### Automating the In Progress → In Test → Done transitions

Two ways to get this, pick one (or both):

1. **Built-in, zero setup.** Open the project → `⋯` → Workflows, and
   check whether your Projects UI offers a "Pull request opened" (or
   similar) trigger alongside the standard "Issue closed" / "Pull request
   merged" ones. If so, set:
   - **Item added to project** → Status = `Backlog`
   - **Pull request opened**, linked to an item → Status = `In Test`
   - **Issue closed** / **Pull request merged** → Status = `Done`

2. **Guaranteed, needs one secret.** `.github/workflows/project-status-sync.yml`
   does the same thing via `gh` CLI calls we control directly, so it
   doesn't depend on exactly which triggers your Projects UI happens to
   expose. It parses `Closes #N` (or `Part of #N`) out of the PR
   description and sets Status accordingly on open/merge. Requires a repo
   secret `PROJECT_TOKEN` — a personal access token with `repo` +
   `project` scopes (Settings → Secrets and variables → Actions). Without
   it, the workflow fails loudly (not a silent no-op) so it's obvious
   it's unconfigured.

Moving a card to `In Progress` still has no automatic trigger either
way — GitHub doesn't support "board move → create a branch." Use
`./scripts/start-task.sh <issue-number>` instead: it creates the linked
branch, checks it out, and sets Status to `In Progress` in one command.

## Branch naming

```
task/<issue-number>-<short-slug>
```

Examples: `task/42-add-ru-locale-routes`, `task/57-fix-mobile-nav-focus-trap`.

For a bug fix: `fix/<issue-number>-<short-slug>`.

The issue number is what makes the binding automatic — GitHub links a
branch, its PR and the issue together as soon as the number appears in
the right places (see below), and shows all three on the issue page
under "Development".

## Pull requests

Every PR must reference the issue it implements, using a
closing keyword in the PR description (not just the title):

```
Closes #42
```

(`Fixes #42` / `Resolves #42` work identically.) Use `Part of #12` instead
when a PR only partially completes a larger issue — that links without
auto-closing.

The PR template (`.github/PULL_REQUEST_TEMPLATE.md`) has a field for this
and a short checklist (build/lint/typecheck pass, screenshots for visual
changes). Do not remove the "Closes #" line — a PR without it doesn't
auto-close its issue or show up under the issue's Development section.

## Lifecycle, end to end

1. A proposal is approved → linked from `docs/Proposals.md`.
2. Write **the one epic** for it (`docs/epics/EPIC-XXX-*.md`, Priority
   set), then `make board-epics`.
3. Break it into **large tasks** (`docs/tasks/TASK-XXX-*.md`, Priority +
   Phase set — see `docs/tasks/README.md`), then `make board-tasks`, which
   links each as a native GitHub sub-issue of the epic automatically.
4. Both land on the Project board automatically (the scripts add them).
5. Someone picks up a task: `./scripts/start-task.sh <issue-number>` —
   creates and checks out `task/<n>-slug`, sets Status to `In Progress`.
6. Open a PR with `Closes #<n>` in the description (or `Part of #<n>` if
   the task needs more than one PR) → board moves it to `In Test`
   automatically on the closing PR (see "Automating the transitions"
   above).
7. Review, CI (`.github/workflows/ci.yml`) passes, merge → board moves it
   to `Done` automatically; the epic's sub-issues list shows the task as
   done too (GitHub tracks this natively).
8. When every task under the epic is done, close the epic.

## CI

`.github/workflows/ci.yml` runs on every PR: `npm ci`, `npx tsc --noEmit`,
`npm run lint`, `npm run build`. A PR shouldn't merge with any of these
failing — this is enforced by branch protection once you turn it on
(Settings → Branches → require the `ci` check to pass before merging).

## First-time setup

1. `gh auth login` (needs the `project` scope — the script below expects
   this; run `gh auth refresh -s project,read:project` if you're already
   logged in without it).
2. `./scripts/github-bootstrap.sh` — creates the labels, the Project
   board, and its `Priority`/`Phase` fields. Safe to re-run (skips things
   that already exist).
3. Rename the built-in `Status` field's options by hand (see
   [above](#the-board-github-projects) — not scriptable), then run
   `./scripts/backfill-status.sh` if any issues were created beforehand.
4. Set up the In Progress → In Test → Done automation (built-in
   Workflows tab, and/or `project-status-sync.yml` — see above).
5. Write the one epic (`make board-epics`) and its large tasks
   (`make board-tasks`), then `make board-sync-status` /
   `make board-sync-tasks` to correct any that aren't starting from
   Backlog.
6. Turn on branch protection requiring the `ci` check on the default
   branch (one-time, in repo Settings — not scriptable via this repo).
