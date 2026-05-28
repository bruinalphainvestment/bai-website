#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[codex cleanup] %s\n' "$*"
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

if [ "${CODEX_CLEAN_NODE_MODULES:-0}" = "1" ]; then
  remove_path node_modules
else
  log "Leaving node_modules in place; set CODEX_CLEAN_NODE_MODULES=1 to remove it"
fi

if [ "${CODEX_CLEAN_CODEGRAPH:-0}" = "1" ]; then
  remove_path .codegraph
else
  log "Leaving .codegraph in place; set CODEX_CLEAN_CODEGRAPH=1 to remove it"
fi

log "Cleanup complete"
