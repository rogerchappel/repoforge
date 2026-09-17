# Release Process

This process gives the project a lightweight release discipline without assuming
a specific runtime, package manager, registry, or hosting provider.

## Release Principles

- A release should be reviewable, reversible where practical, and tied to a
  clear changelog entry.
- Version numbers should describe user-visible change, not internal effort.
- Release notes should explain what changed, how it was verified, and any known
  upgrade or rollback concerns.
- Publishing steps should match the artifact being released, such as a package,
  binary, container image, documentation site, template update, or GitHub-only
  source release.

## Versioning

Use semantic versioning when the project publishes versioned artifacts:

- `MAJOR`: incompatible public API, CLI, config, data, or workflow changes.
- `MINOR`: backwards-compatible features or meaningful new capabilities.
- `PATCH`: backwards-compatible fixes, docs corrections, or small maintenance
  updates.

Pre-1.0 projects may treat `0.x` releases as unstable, but release notes should
still call out breaking changes clearly.

Projects that do not publish versioned artifacts may still use dated GitHub
releases or milestone names, but should avoid inventing fake semantic versions.

## Release Inputs

Before preparing a release, confirm:

- The intended version or release name.
- The changes since the previous release.
- The supported upgrade path.
- The artifacts to publish, if any.
- The verification required for the release risk level.
- Any rollback, recovery, or deprecation notes.

## Changelog

Keep `CHANGELOG.md` in Keep a Changelog style:

- Maintain an `Unreleased` section at the top.
- Group entries under headings such as `Added`, `Changed`, `Deprecated`,
  `Removed`, `Fixed`, and `Security`.
- Move completed entries from `Unreleased` into a release section when cutting a
  release.
- Include comparison links when the repository URL and previous tag are known.

## Release Notes

Release notes should be short and useful. Include:

- Summary of the release.
- User-visible changes.
- Breaking changes or migration steps.
- Verification performed.
- Known issues.
- Rollback notes or recovery guidance.

Do not paste raw commit logs as release notes unless the project intentionally
uses generated release notes and maintainers have reviewed them.

## Verification

Choose the smallest verification that gives confidence for the release:

- Documentation-only release: markdown review, link check if available, and
  spell or formatting checks when configured.
- Library or package release: targeted tests, typecheck, lint, build, and
  package dry run where supported.
- CLI release: command smoke tests across the supported install paths.
- Service release: integration checks, deployment smoke test, and rollback
  rehearsal or notes.
- Template release: generate or inspect a sample project path when practical.

Record the exact verification commands or manual checks in the release notes.

## Publishing

Publishing may include one or more of:

- Creating and pushing a signed or unsigned Git tag according to project policy.
- Creating a GitHub release.
- Publishing package artifacts to the relevant registry.
- Uploading binaries, archives, checksums, or provenance files.
- Publishing a documentation site.
- Announcing the release in the project's chosen channels.

Do not assume npm is the only release target. If a project does use npm, keep
npm-specific commands in that project's package publishing documentation.

## Rollback Notes

Every release should state what rollback means for that project:

- Revert source changes and publish a follow-up patch.
- Re-publish documentation from a previous commit.
- Roll back a deployment.
- Yank, deprecate, or replace a package version if the registry supports it.
- Disable a feature flag or documented integration path.

If rollback is not possible for a published artifact, say so directly and
describe the recovery path.

## Minimal Release Flow

1. Confirm release scope and version.
2. Update `CHANGELOG.md`.
3. Run the release checklist in `docs/release-checklist.md`.
4. Commit release prep changes.
5. Tag or create the release according to project policy.
6. Publish artifacts, if any.
7. Record verification and rollback notes in the release notes.
8. Open follow-up issues for deferred work.
