#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

failed=0

pass() {
  printf 'PASS: %s\n' "$1"
}

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  failed=1
}

check_file() {
  if [ -f "$1" ]; then
    pass "required file exists: $1"
  else
    fail "missing required file: $1"
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    pass "required directory exists: $1"
  else
    fail "missing required directory: $1"
  fi
}

is_allowed_placeholder_path() {
  case "$1" in
    templates/* | \
    docs/PRD.md | \
    docs/copilot.md | \
    docs/npm-publishing.md | \
    docs/repo-customisation.md | \
    docs/template-variables.md)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

required_root_files="
.editorconfig
.gitignore
AGENTS.md
CHANGELOG.md
CODE_OF_CONDUCT.md
CONTRIBUTING.md
LICENSE
README.md
ROADMAP.md
SECURITY.md
.github/dependabot.yml
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/agent_task.md
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/workflows/branchbrief.yml
.github/workflows/ci.yml
.github/workflows/docs.yml
"

required_docs="
docs/agent-workflow.md
docs/agent-prompts.md
docs/branchbrief.md
docs/cloudflare-pages.md
docs/copilot.md
docs/dependency-policy.md
docs/github-actions.md
docs/llm-policy.md
docs/npm-publishing.md
docs/PRD.md
docs/release-checklist.md
docs/release-process.md
docs/repo-customisation.md
docs/security-policy.md
docs/template-variables.md
"

required_template_dirs="
templates/agents
templates/branchbrief
templates/cloudflare-pages
templates/contributors
templates/dependabot
templates/docs-site
templates/github
templates/github/ISSUE_TEMPLATE
templates/github/workflows
templates/license
templates/npm-package
templates/npm-package/src
templates/npm-package/test
templates/readme
templates/release
templates/security
"

required_template_files="
templates/agents/AGENTS.snippet.md
templates/agents/AGENTS.template.md
templates/branchbrief/README.md
templates/cloudflare-pages/README.md
templates/cloudflare-pages/deploy-docs-cloudflare-pages.yml
templates/cloudflare-pages/wrangler.toml.template
templates/contributors/CODE_OF_CONDUCT.template.md
templates/contributors/CONTRIBUTING.template.md
templates/contributors/REVIEW_PACK.template.md
templates/dependabot/README.md
templates/docs-site/.gitignore
templates/docs-site/README.md
templates/docs-site/astro.config.mjs
templates/docs-site/package.json
templates/docs-site/src/content.config.ts
templates/docs-site/src/content/docs/contributing.mdx
templates/docs-site/src/content/docs/getting-started.mdx
templates/docs-site/src/content/docs/index.mdx
templates/docs-site/tsconfig.json
templates/github/dependabot.yml
templates/github/pull_request_template.md
templates/github/ISSUE_TEMPLATE/agent_task.md
templates/github/ISSUE_TEMPLATE/bug_report.md
templates/github/ISSUE_TEMPLATE/feature_request.md
templates/github/workflows/branchbrief.yml
templates/github/workflows/ci.yml
templates/github/workflows/docs.yml
templates/license/LICENSE.MIT.template
templates/npm-package/README.md
templates/npm-package/package.json
templates/npm-package/src/index.js
templates/npm-package/test/index.test.js
templates/readme/README.template.md
templates/release/CHANGELOG.template.md
templates/release/ROADMAP.template.md
templates/release/release-checklist.template.md
templates/release/release-process.template.md
templates/security/SECURITY.github-private-reporting.template.md
templates/security/SECURITY.template.md
"

printf 'Checking required root files...\n'
for file in $required_root_files; do
  check_file "$file"
done

printf '\nChecking required docs...\n'
for file in $required_docs; do
  check_file "$file"
done

printf '\nChecking required template directories...\n'
for dir in $required_template_dirs; do
  check_dir "$dir"
done

printf '\nChecking required template files...\n'
for file in $required_template_files; do
  check_file "$file"
done

printf '\nScanning for unresolved placeholders outside allowed template paths...\n'
placeholder_hits="$(grep -RInE '\{\{[A-Z0-9_]+\}\}' \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=build \
  . || true)"

unexpected_hits=""
if [ -n "$placeholder_hits" ]; then
  while IFS= read -r hit; do
    path="${hit#./}"
    path="${path%%:*}"

    if ! is_allowed_placeholder_path "$path"; then
      unexpected_hits="${unexpected_hits}${hit}
"
    fi
  done <<EOF
$placeholder_hits
EOF
fi

if [ -n "$unexpected_hits" ]; then
  fail "found unresolved placeholders outside allowed template paths"
  printf '%s' "$unexpected_hits" >&2
else
  pass "no unresolved placeholders outside allowed template paths"
fi

if [ "$failed" -ne 0 ]; then
  printf '\nTemplate validation failed.\n' >&2
  exit 1
fi

printf '\nTemplate validation passed.\n'
