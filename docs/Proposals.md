# Proposals

Every brief we've built or are building against, newest first. A proposal
is a rarely-changing source document — implementation status is tracked
separately (see the linked epics/progress doc for each).

| Proposal | Status | Tracked by |
|---|---|---|
| [proposal.md](../proposal.md) — CreativeLAB.in.th site build | In progress | [TO-DO_2026-11-03.md](../TO-DO_2026-11-03.md), [epics](./epics/) |

## Adding a new proposal

1. Add the proposal document itself under `docs/proposals/<slug>.md` (for
   the first one, `proposal.md` stays at the repo root for now — new ones
   go in the subfolder to keep the root clean).
2. Add a row to the table above.
3. Write it as **one epic** — see [docs/epics/README.md](./epics/README.md).

**One proposal, one file.** If a later brief adds to or tightens an
earlier one, edit that proposal's file directly (or add a clearly dated
addendum section inside it) rather than creating a second file like
`proposal-v2.md` — a sibling project made exactly that mistake and it
meant half its requirements were invisible to everything built from its
docs. Don't repeat it here.
