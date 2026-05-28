#!/usr/bin/env bash
set -euo pipefail

script_label="${WORKTREE_SCRIPT_LABEL:-}"
if [ -z "$script_label" ]; then
  if [ -n "${CONDUCTOR_WORKSPACE_PATH:-}" ]; then
    script_label="conductor cleanup"
  else
    script_label="codex cleanup"
  fi
fi

log() {
  printf '[%s] %s\n' "$script_label" "$*"
}

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
repo_root="$(cd "$repo_root" && pwd -P)"
cd "$repo_root"

remove_path() {
  local path="$1"

  if [ -e "$path" ] || [ -L "$path" ]; then
    rm -rf "$path"
    log "Removed $path"
  fi
}

for path in \
  .next \
  out \
  build \
  coverage \
  playwright-report \
  test-results \
  .playwright-mcp \
  .lighthouseci \
  sanity.schema.json \
  tsconfig.tsbuildinfo \
  next-env.d.ts; do
  remove_path "$path"
done

clean_node_modules="${WORKTREE_CLEAN_NODE_MODULES:-${CODEX_CLEAN_NODE_MODULES:-0}}"
if [ "$clean_node_modules" = "1" ]; then
  remove_path node_modules
else
  log "Leaving node_modules in place; set WORKTREE_CLEAN_NODE_MODULES=1 or CODEX_CLEAN_NODE_MODULES=1 to remove it"
fi

clean_codegraph="${WORKTREE_CLEAN_CODEGRAPH:-${CODEX_CLEAN_CODEGRAPH:-0}}"
if [ "$clean_codegraph" = "1" ]; then
  remove_path .codegraph
else
  log "Leaving .codegraph in place; set WORKTREE_CLEAN_CODEGRAPH=1 or CODEX_CLEAN_CODEGRAPH=1 to remove it"
fi

log "Cleanup complete"
