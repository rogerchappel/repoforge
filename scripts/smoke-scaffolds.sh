#!/usr/bin/env bash
set -euo pipefail

repo_root="${REPOFORGE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
work_dir="$(mktemp -d "${TMPDIR:-/tmp}/repoforge-scaffolds.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT

normalize_placeholders() {
  local directory="$1"
  local open_braces='{''{'
  local close_braces='}''}'
  while IFS= read -r -d '' file; do
    sed -i.bak \
      -e "s/${open_braces}PACKAGE_NAME${close_braces}/@repoforge\\/smoke-package/g" \
      -e "s/${open_braces}PACKAGE_DESCRIPTION${close_braces}/Repoforge scaffold smoke fixture/g" \
      -e "s/${open_braces}PROJECT_NAME${close_braces}/Repoforge Smoke Project/g" \
      -e "s/${open_braces}PROJECT_DESCRIPTION${close_braces}/Repoforge scaffold smoke fixture/g" \
      -e "s#${open_braces}REPOSITORY_URL${close_braces}#https://github.com/example/repoforge-smoke#g" \
      -e "s#${open_braces}DOCS_URL${close_braces}#https://example.com/repoforge-smoke/#g" \
      -e "s/${open_braces}RUNTIME_REQUIREMENT${close_braces}/Node.js 24/g" \
      -e "s/${open_braces}PACKAGE_MANAGER${close_braces}/npm/g" \
      -e "s/${open_braces}INSTALL_COMMAND${close_braces}/npm install/g" \
      -e "s/${open_braces}PRIMARY_VERIFICATION_COMMAND${close_braces}/npm test/g" \
      -e "s/${open_braces}LICENSE${close_braces}/MIT/g" \
      -e "s/${open_braces}AUTHOR_NAME${close_braces}/Example Author/g" \
      "$file"
    rm -f "$file.bak"
  done < <(find "$directory" -type f -not -path '*/node_modules/*' -print0)

  if grep -RInE '\{\{[A-Z0-9_]+\}\}' "$directory" \
    --exclude-dir=node_modules --exclude-dir=dist; then
    printf 'Unresolved scaffold placeholders remain in %s\n' "$directory" >&2
    return 1
  fi
}

cp -R "$repo_root/templates/npm-package" "$work_dir/npm-package"
normalize_placeholders "$work_dir/npm-package"
(
  cd "$work_dir/npm-package"
  npm test
  npm pack --dry-run --json > pack.json
  node -e '
    const report = require("./pack.json")[0];
    const files = report.files.map(({path}) => path).sort();
    for (const expected of ["README.md", "package.json", "src/index.js"]) {
      if (!files.includes(expected)) throw new Error(`missing ${expected} from package`);
    }
    if (files.some((path) => path.startsWith("test/"))) {
      throw new Error("test files must not be published");
    }
  '
)

cp -R "$repo_root/templates/docs-site" "$work_dir/docs-site"
normalize_placeholders "$work_dir/docs-site"
(
  cd "$work_dir/docs-site"
  npm ci --ignore-scripts
  npm run build 2>&1 | tee build.log
  if grep -Fq 'Could not render `/404`' build.log; then
    printf 'Docs site build reported a conflicting 404 route.\n' >&2
    exit 1
  fi
  if grep -Fq 'Sitemap integration requires the site' build.log; then
    printf 'Docs site build skipped sitemap generation.\n' >&2
    exit 1
  fi
  test -f dist/index.html
  test -f dist/404.html
  find dist -maxdepth 1 -type f -name 'sitemap*.xml' -print -quit | grep -q .
)

printf 'Scaffold smoke checks passed.\n'
