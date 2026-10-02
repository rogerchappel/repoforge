#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d "${TMPDIR:-/tmp}/repoforge-smoke.XXXXXX")"
trap 'rm -rf "$work"' EXIT
(cd "$work" && node "$root/bin/repoforge.js" new smoke-project)
grep -q 'Smoke Project' "$work/smoke-project/README.md"
git -C "$work/smoke-project" rev-parse --git-dir >/dev/null
test -s "$work/smoke-project/.github/ISSUE_TEMPLATE/agent_task.md"
grep -q 'npm test' "$work/smoke-project/README.md"
