# How To: Adding and Executing a Task

A practical, in-order walkthrough of the process — "what do I actually
type." For the *why* behind each rule (branch naming, why Status is
structured this way, etc.), see [WORKFLOW.md](./WORKFLOW.md). This doc is
the sequence; that one is the reference.

Every command below also has a `make` shortcut — run `make help` to see
the full list.

## Before any of this works: one-time setup

Only needed once per repo, by whoever sets it up first.

```bash
gh auth login                       # or: gh auth refresh -s project,read:project
make board-setup                    # creates labels + the Project board + its fields
```

Then, **by hand in the browser** (not scriptable — see `WORKFLOW.md` for
why): open the project, rename the built-in `Status` field's options so
they read `Backlog, Ready, In Progress, In Test, Done`, and set up the
board automations. `make board-setup` prints the exact steps at the end
of its output — follow those.

If any issues already existed before you did the rename:

```bash
make board-backfill                 # sets Status=Backlog on every open issue
```

This asks for confirmation and lists every issue it's about to touch
first — it's a blunt "set everyone to X" tool, not a "top up only what's
missing" one, so don't reach for it as routine maintenance later (it
would reset anything already `In Progress`/`In Test` back to `Backlog`).
It's a one-time fixup for right after setup.

## 1. Turning a proposal into its one epic

One proposal = one epic — see `docs/epics/README.md` for why (this repo
used to have 9; that was overhead, not clarity). Deciding what goes in it
is a manual, human step, not something a script does.

1. Write `docs/epics/EPIC-XXX-<slug>.md` (there should be only one),
   following the template in [docs/epics/README.md](./epics/README.md).
2. Turn it into a real GitHub Issue:
   ```bash
   make board-epics
   ```
   Safe to re-run — a no-op if the issue already exists.
3. `make board-sync-status` — corrects Status if the file says it's
   already in progress, since step 2 always starts a new issue at
   Backlog.

## 2. Breaking the epic into large tasks

This is where the actual planning happens. Write one
`docs/tasks/TASK-XXX-<slug>.md` per substantial chunk of work — sized to a
real work session, not a five-minute step (see `docs/tasks/README.md`;
the 9 that exist now came straight from what used to be 9 separate
epics, one per `TO-DO_2026-11-03.md` phase).

```bash
$EDITOR docs/tasks/TASK-010-my-large-task.md   # write it, using the template
make board-tasks                               # creates its issue, linked as
                                                # a sub-issue of the epic
make board-sync-tasks                          # corrects Status if it's not
                                                # starting from Backlog
```

### Filing a small, ad-hoc task instead (the exception)

For something genuinely too small to deserve a written file:

**Via the GitHub UI** — Issues → New issue → **✅ Task** template. Fill in
the parent epic, description, acceptance criteria, priority. Link it to
the epic either by pasting the epic's number in the **Parent epic** field
and creating the link yourself via the epic's "Create sub-issue" button,
or with a checklist line in the epic's body (`- [ ] #43`) as a lighter
fallback.

**Via the CLI:**

```bash
make task-new TITLE="Fix a typo in the footer" EPIC=1 PRIORITY=P2
```

This creates the issue, links it as a **native GitHub sub-issue** of
`EPIC=1`, adds it to the Project board, and sets Priority/Status. Only
`TITLE` is required. If you find yourself using this for most of your
work instead of the large-task path above, that's a sign tasks are being
cut too small — see `docs/tasks/README.md`.

The task lands in `Backlog` either way. Move it to `Ready` when it's
actually next in line to be picked up (a manual drag — there's no
automation for this step, it's a planning decision).

## 3. Starting work on a task

```bash
make task-start TASK=43
```

This one command:
- creates a branch named `task/43-<slug-from-the-issue-title>`
- checks it out locally
- links the branch to the issue (shows up in the issue's "Development"
  panel)
- moves the board item's Status to `In Progress`

Go write the code.

## 4. Opening the PR

```bash
git push -u origin task/43-<slug>
gh pr create --fill
```

**In the PR description, include:**

```
Closes #43
```

(The PR template already has a field for this — don't delete it.) This
is what:
- links the PR to the issue on GitHub (shows in both the PR and issue
  pages)
- automatically moves the board item to `In Test` (see WORKFLOW.md's
  "Automating the transitions" section for how this is wired up)
- will auto-close #43 and move it to `Done` when the PR merges

If the PR only partially completes the issue, use `Part of #43` instead
— it links without auto-closing.

## 5. Review and merge

- CI (`.github/workflows/ci.yml`) runs automatically: lint, typecheck,
  build. It must pass.
- Get the PR reviewed and approved as normal.
- Merge it.

That's it — the issue closes, the board moves the item to `Done`, and if
it was the last unchecked box on its parent epic, the epic's checklist
shows 100% complete (close the epic manually once all its tasks are
done).

## Quick reference: the whole loop

```bash
make board-epics                    # (once per proposal) file the one epic issue
$EDITOR docs/tasks/TASK-010-my-large-task.md
make board-tasks                    # file large tasks, linked as sub-issues of the epic
make task-start TASK=<n>            # branch + checkout + Status=In Progress
#  ... write code, commit ...
git push -u origin task/<n>-<slug>
gh pr create --fill                 # body must contain: Closes #<n>
#  ... review, CI passes, merge ...
#  -> board auto-moves to In Test on PR open, Done on merge
```

## Filing a bug (not planned work)

Anyone: Issues → New issue → **🐛 Bug report**. No epic/task ceremony
required — fix it via the same branch/PR flow (`fix/<n>-<slug>` instead
of `task/<n>-<slug>`) if it needs code changes, or just resolve and close
it directly if it doesn't.
