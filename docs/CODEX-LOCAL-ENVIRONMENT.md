# Codex Local Environment

Codex discovers this project's local worktree environment at:

```bash
.codex/environments/environment.toml
```

The default environment runs `.codex/scripts/setup-worktree.sh` when Codex creates a worktree, and `.codex/scripts/cleanup-worktree.sh` before Codex cleans one up.

## Setup Behavior

- Uses Bun because `bun.lock` is the lockfile and CI installs with Bun.
- Copies `.env.local` from `CODEX_SOURCE_TREE_PATH` when the source workspace has one.
- Falls back to `.env.example` and sets `NEXT_PUBLIC_USE_SANITY=false` so worktrees can run without real Sanity secrets.
- Runs `bun install --frozen-lockfile`.
- Runs `bunx playwright install chromium` so the Chromium-only Playwright projects can run. Set `CODEX_SKIP_PLAYWRIGHT_INSTALL=1` to skip that step.
- Initializes CodeGraph with `codegraph init -i` when `.codegraph` is missing and the `codegraph` CLI is available.

Codex provides these setup variables:

```bash
CODEX_SOURCE_TREE_PATH   # source workspace path
CODEX_WORKTREE_PATH      # new worktree path
```

## Cleanup Behavior

Cleanup removes generated caches and test/build artifacts such as `.next`, `test-results`, `playwright-report`, `.lighthouseci`, `sanity.schema.json`, and TypeScript build info.

It leaves `node_modules` and `.codegraph` by default because Codex normally deletes the whole worktree afterward. Set `CODEX_CLEAN_NODE_MODULES=1` and/or `CODEX_CLEAN_CODEGRAPH=1` when manually shrinking an abandoned worktree.

## Local Actions

The environment also exposes Codex toolbar actions for setup, CodeGraph init, `bun run dev`, `bun run typecheck && bun run lint`, `bun run build`, and the desktop Playwright suite. Start the dev server before running the E2E action unless `BASE_URL` points at an existing deployment.
