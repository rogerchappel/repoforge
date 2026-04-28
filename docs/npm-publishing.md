# npm Publishing Readiness

`repoforge` is structured as an npm-installable CLI package, but this repository
does not publish to npm automatically.

## Current Package Shape

- Package name: `repoforge`
- CLI bin: `repoforge`
- Runtime: Node.js 20+
- Module format: ESM
- Default scaffold assets: `scaffold/agentic-oss-template/`
- Public API exports: `src/index.js`

## Local Checks

Run these checks before any release candidate:

```sh
npm install
npm run validate
npm run lint
npm test
npm run smoke
npm run pack:dry-run
```

Inspect the `npm pack --dry-run` output before publishing. It should include the
CLI entrypoint, source modules, default scaffold, issue templates, README,
license, and publishing docs. It should not include test fixtures, local logs,
or GitHub workflow internals unless intentionally added to `package.json`.

## Automation

CI is publish-ready but non-publishing:

- `.github/workflows/ci.yml` runs validation, install, lint, tests, smoke, and
  package dry-run on pull requests and `main`.
- `.github/workflows/package-dry-run.yml` repeats package-readiness checks for
  package/scaffold/publishing changes.
- `.github/workflows/release.yml` runs release-readiness checks for tags and
  manual dispatches. It does not call `npm publish`.

Normal CI requires no npm token, Homebrew token, or registry secret.

## Future Publish Procedure

Before enabling publishing:

1. Confirm the package name, description, license, exports, bin, and `files`
   list are final for the target release.
2. Confirm `npm pack --dry-run` contains only intended files.
3. Confirm README, security policy, changelog, and release notes are accurate.
4. Protect an `npm-publish` GitHub environment with maintainer approval.
5. Prefer npm trusted publishing or provenance over long-lived `NPM_TOKEN`
   credentials.
6. Use a reviewed publish command such as:

```sh
npm publish --provenance --access public
```

Do not publish until a maintainer has approved the exact package contents for
the target version.

## Homebrew Readiness

Do not publish a Homebrew tap from this repository yet. If Homebrew distribution
is added later:

- publish or identify the immutable npm package or release tarball first;
- compute checksums from the release artifact;
- draft a formula with dependency metadata and a `test do` block that runs
  `repoforge --help`;
- decide whether the formula belongs in a project tap;
- update the tap only after the package release is approved.
