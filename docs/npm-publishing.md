# Optional npm Package Scaffold

This repository includes an optional npm package starting point at
`templates/npm-package/`.

Use it only when the project you create with repoforge needs to publish a
small JavaScript package to npm. Do not copy it into projects that are docs-only,
GitHub Action-only, or otherwise do not need Node package metadata.

## What The Scaffold Provides

- Minimal ESM package structure.
- Placeholder package metadata for name, description, author, and license.
- A tiny exported function in `src/index.js`.
- A Node built-in test in `test/index.test.js`.
- No runtime dependencies.
- No top-level repository `package.json`.

## Use The Scaffold

1. Copy `templates/npm-package/` into the root of the generated repository.
2. Replace these placeholders:
   - `{{PACKAGE_NAME}}`
   - `{{PACKAGE_DESCRIPTION}}`
   - `{{AUTHOR_NAME}}`
   - `{{LICENSE}}`
3. Update `src/index.js` with real package code.
4. Update `test/index.test.js` with behavior that matches the package.
5. Run the package checks from inside the copied package directory:

```sh
npm test
```

The scaffold intentionally does not include TypeScript. If the generated repository
chooses TypeScript, add `typescript`, a `tsconfig.json`, and a `typecheck` script
in that generated repository as a separate reviewable change.

## Before Publishing

Before publishing a generated package:

1. Confirm the package name is available on npm.
2. Confirm the chosen license is correct for the project.
3. Add complete package documentation.
4. Add meaningful tests for public behavior.
5. Run `npm pack --dry-run` and inspect the package contents.
6. Publish from a clean, tagged release commit.

## Automation In This Repository

Repoforge validates the optional npm scaffold without publishing it:

- CI copies `templates/npm-package/` into a temporary fixture, replaces scaffold
  placeholders with valid package metadata, runs `npm install`, runs
  `npm run lint --if-present`, runs `npm test`, smoke-imports the package, and
  runs `npm pack --dry-run`.
- The package dry-run workflow repeats the npm package readiness checks when the
  scaffold or npm publishing documentation changes.
- The release workflow performs readiness checks for tags and manual dispatches,
  but it does not call `npm publish`.

This keeps normal CI free of npm tokens and registry secrets.

## Provenance And Trusted Publishing

For a real generated package, prefer npm trusted publishing from GitHub Actions
or npm provenance over a long-lived `NPM_TOKEN`.

Recommended future publishing shape:

1. Protect an `npm-publish` GitHub environment with maintainer approval.
2. Give the publish job `contents: read` and `id-token: write`; do not grant
   broader permissions to CI jobs that only test or dry-run packages.
3. Configure the package on npm for trusted publishing, or publish with
   provenance from an approved workflow run.
4. Run the same checks as CI immediately before publishing.
5. Publish public packages with a reviewed command such as:

```sh
npm publish --provenance --access public
```

Use `--access public` only for public scoped packages. Private packages and
organization policies may require different npm access settings.

## Package Readiness Review

Before enabling any publish command, confirm:

- `name`, `version`, `description`, `author`, `license`, `exports`, and `files`
  are final and intentional.
- `README.md` describes installation, usage, support, security reporting, and
  license terms accurately.
- `npm pack --dry-run` includes only intended files.
- Tests cover public behavior, not only the scaffold example.
- The release notes include verification and rollback or deprecation guidance.
- A maintainer has approved the exact package contents for the target version.

## Homebrew Readiness

Do not publish a Homebrew tap from this scaffold. If a generated project later
ships a CLI, treat Homebrew as a separate release channel:

- publish or identify the immutable release artifact first;
- compute checksums from that artifact;
- draft a formula with dependency metadata and a `test do` block;
- review whether the project should maintain its own tap;
- update the tap only after the package or binary release is approved.

This scaffold is a starting point only. It is not release automation, security
policy, or a substitute for a maintainer review before publishing.
