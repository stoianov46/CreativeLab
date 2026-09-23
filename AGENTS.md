<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project documentation rules

- **Start at [`docs/Index.md`](docs/Index.md)** — the index of every project doc, including the full list of setup/config/devops files and required env vars.
- **Any change that affects setup** — config files (`next.config.ts`, `tsconfig.json`, `.gitignore`, `package.json` scripts/engines, `Makefile`), devops files (`.github/workflows/*`, hosting/deploy config), or env requirements (a variable added, renamed, removed, or moved between client/server) — **must be reflected in the same change** in:
  1. `README.md` (setup / env vars / deploy sections), and
  2. `docs/Index.md` → "Setup, configuration & environment" (file list + env var table).
  Also `.env.example` when an env var changes. A setup change without these doc updates is incomplete.
- Secrets never go in `src/` or `NEXT_PUBLIC_*` vars — see [`SECURITY.md`](SECURITY.md).
