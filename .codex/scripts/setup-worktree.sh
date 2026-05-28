#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[codex setup] %s\n' "$*"
}

warn() {
  printf '[codex setup] warning: %s\n' "$*" >&2
}

die() {
  printf '[codex setup] error: %s\n' "$*" >&2
  exit 1
}

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
repo_root="$(cd "$repo_root" && pwd -P)"
cd "$repo_root"

source_tree="${CODEX_SOURCE_TREE_PATH:-}"
if [ -n "$source_tree" ] && [ -d "$source_tree" ]; then
  source_tree="$(cd "$source_tree" && pwd -P)"
fi

set_env_value() {
  local key="$1"
  local value="$2"
  local tmp

  tmp="$(mktemp "${TMPDIR:-/tmp}/codex-env.XXXXXX")"

  if [ -f .env.local ] && grep -q "^${key}=" .env.local; then
    awk -v key="$key" -v value="$value" '
      BEGIN { prefix = key "=" }
      index($0, prefix) == 1 { print prefix value; next }
      { print }
    ' .env.local > "$tmp"
  else
    cat .env.local > "$tmp"
    printf '\n%s=%s\n' "$key" "$value" >> "$tmp"
  fi

  mv "$tmp" .env.local
}

ensure_env_file() {
  if [ -f .env.local ]; then
    log ".env.local already exists; leaving it unchanged"
    return
  fi

  if [ -n "$source_tree" ] &&
    [ "$source_tree" != "$repo_root" ] &&
    [ -f "$source_tree/.env.local" ]; then
    cp "$source_tree/.env.local" .env.local
    chmod 600 .env.local 2>/dev/null || true
    log "Copied .env.local from source workspace"
    return
  fi

  if [ -f .env.example ]; then
    cp .env.example .env.local
    set_env_value "NEXT_PUBLIC_USE_SANITY" "false"
    chmod 600 .env.local 2>/dev/null || true
    log "Created .env.local from .env.example with Sanity fallback mode"
    return
  fi

  warn "No .env.local or .env.example found; local Sanity-backed routes may fail"
}

ensure_codegraph() {
  if [ -d .codegraph ]; then
    log "CodeGraph index already exists"
    return
  fi

  if ! command -v codegraph >/dev/null 2>&1; then
    warn "codegraph CLI was not found on PATH; skipping CodeGraph initialization"
    return
  fi

  log "Initializing CodeGraph index"
  if ! codegraph init -i; then
    warn "CodeGraph initialization failed; run 'codegraph init -i' manually if structural code search is needed"
  fi
}

if ! command -v bun >/dev/null 2>&1; then
  die "Bun is required for this project but was not found on PATH"
fi

ensure_env_file

log "Installing dependencies with bun install --frozen-lockfile"
bun install --frozen-lockfile

if [ "${CODEX_SKIP_PLAYWRIGHT_INSTALL:-0}" = "1" ]; then
  log "Skipping Playwright browser install because CODEX_SKIP_PLAYWRIGHT_INSTALL=1"
else
  log "Ensuring Playwright Chromium is available"
  if ! bunx playwright install chromium; then
    warn "Playwright Chromium install failed; browser tests may need manual setup"
  fi
fi

ensure_codegraph

log "Worktree ready"
