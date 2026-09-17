#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fixture_root="$(mktemp -d "${TMPDIR:-/tmp}/repoforge-scaffold-regression.XXXXXX")"
trap 'rm -rf "$fixture_root"' EXIT

mkdir -p "$fixture_root/templates"
cp -R "$repo_root/templates/npm-package" "$fixture_root/templates/npm-package"
cp -R "$repo_root/templates/docs-site" "$fixture_root/templates/docs-site"
printf 'export function createMessage( {\n' > "$fixture_root/templates/npm-package/src/index.js"

if REPOFORGE_ROOT="$fixture_root" bash "$repo_root/scripts/smoke-scaffolds.sh" \
  >"$fixture_root/output.log" 2>&1; then
  printf 'Expected malformed npm scaffold validation to fail.\n' >&2
  cat "$fixture_root/output.log" >&2
  exit 1
fi

grep -Eq 'SyntaxError|Unexpected token' "$fixture_root/output.log"
printf 'Malformed scaffold regression check passed.\n'
