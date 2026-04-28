# Optional npm Package Scaffold

This repository includes an optional npm package starting point at
`templates/npm-package/`.

Use it only when the project you create from this template needs to publish a
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

This scaffold is a starting point only. It is not release automation, security
policy, or a substitute for a maintainer review before publishing.
