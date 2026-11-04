#!/usr/bin/env bash
#
# One-time setup for the GitHub Issues + Projects workflow described in
# docs/WORKFLOW.md: creates the labels and the Project (v2) board with its
# Status/Priority/Phase fields, and links the board to this repo.
#
# Prerequisites:
#   1. gh auth login   (or: gh auth refresh -s project,read:project   if already logged in)
#   2. Run this from inside the repo (it uses `gh repo view` to detect owner/repo).
#
# Safe to re-run:
#   - labels: created with --force (update in place)
#   - project: skipped if a project with the same title already exists
#   - fields: Priority/Phase skipped if they already exist
#   - the built-in "Status" field (Todo/In Progress/Done, present on every
#     new project) can't be touched by this script at all — the API
#     refuses to delete/recreate it. Rename its options by hand once (see
#     the printed instructions at the end) to Backlog/Ready/In Progress/
#     In Test/Done.

set -euo pipefail

PROJECT_TITLE="${PROJECT_TITLE:-CreativeLAB Roadmap}"

if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Run 'gh auth login' first (needs the 'project' scope)." >&2
  exit 1
fi

REPO_NWO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
OWNER="${REPO_NWO%%/*}"
echo "Repo: $REPO_NWO"
echo "Owner: $OWNER"

echo
echo "== Labels =="

create_label() {
  local name="$1" color="$2" desc="$3"
  gh label create "$name" --color "$color" --description "$desc" --force --repo "$REPO_NWO"
  echo "  ✓ $name"
}

create_label "type: epic" "8250df" "A larger feature or phase, broken into tasks"
create_label "type: task" "0e8a16" "One concrete, PR-sized piece of work"
create_label "type: bug" "d73a4a" "Something is broken"

create_label "priority: P0" "b60205" "Blocking / must-have"
create_label "priority: P1" "d93f0b" "Important, not blocking"
create_label "priority: P2" "fbca04" "Nice to have"

for i in 1 2 3 4 5 6 7 8 9; do
  create_label "phase: $i" "c5def5" "Matches Phase $i in TO-DO_2026-11-03.md"
done

echo
echo "== Project board =="

EXISTING_NUMBER="$(gh project list --owner "$OWNER" --format json --jq \
  ".projects[] | select(.title == \"$PROJECT_TITLE\") | .number" 2>/dev/null | head -n1 || true)"

if [ -n "${EXISTING_NUMBER:-}" ]; then
  echo "Project \"$PROJECT_TITLE\" already exists (number $EXISTING_NUMBER)."
  PROJECT_NUMBER="$EXISTING_NUMBER"
else
  PROJECT_NUMBER="$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json --jq .number)"
  echo "Created project #$PROJECT_NUMBER"
fi

# Linking is safe to attempt even if already linked.
gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$REPO_NWO" >/dev/null 2>&1 \
  && echo "  ✓ linked to $REPO_NWO" \
  || echo "  (already linked to $REPO_NWO)"

field_exists() {
  local name="$1"
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq \
    ".fields[] | select(.name == \"$name\") | .id" 2>/dev/null | head -n1
}

# Priority / Phase: create only if missing (non-destructive).
ensure_select_field() {
  local name="$1" options="$2"
  local id
  id="$(field_exists "$name")"
  if [ -n "$id" ]; then
    echo "  \"$name\" field already exists — skipping"
  else
    gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" \
      --name "$name" --data-type SINGLE_SELECT --single-select-options "$options" >/dev/null
    echo "  ✓ $name field"
  fi
}

ensure_select_field "Priority" "P0,P1,P2"
ensure_select_field "Phase" "Phase 1,Phase 2,Phase 3,Phase 4,Phase 5,Phase 6,Phase 7,Phase 8,Phase 9"

# Status: every new project ships with a built-in "Status" field
# (Todo/In Progress/Done) that the GitHub API refuses to delete
# ("Only custom fields can be deleted"), and there's no gh CLI command to
# edit an existing field's options. So this can't be scripted — see the
# manual step printed below instead.
echo "  \"Status\" is GitHub's built-in field — customize its options by hand (see below)"

echo
echo "Done. Remaining manual steps (not scriptable via gh CLI or the API):"
echo "  1. Open the project (gh project view $PROJECT_NUMBER --owner $OWNER --web),"
echo "     click the 'Status' column header -> '...' -> Edit, and rename/add"
echo "     options so it reads: Backlog, Ready, In Progress, In Test, Done"
echo "     (rename the default 'Todo' to 'Backlog')."
echo "     Then run ./scripts/backfill-status.sh if any issues already exist."
echo "  2. Set up board automations — either the Projects UI (under '...' ->"
echo "     Workflows, if it offers a 'Pull request opened' trigger) or"
echo "     .github/workflows/project-status-sync.yml (needs a PROJECT_TOKEN"
echo "     secret) — see docs/WORKFLOW.md for both options:"
echo "       - Item added to project        -> set Status = Backlog"
echo "       - Pull request opened (linked) -> set Status = In Test"
echo "       - Issue closed / PR merged     -> set Status = Done"
echo "  3. Repo Settings -> Branches: require the 'CI / Lint, typecheck & build'"
echo "     check to pass before merging into main."
echo "  4. Optionally set 'Auto-add to project' (same Workflows menu) so new"
echo "     issues land on the board automatically."
