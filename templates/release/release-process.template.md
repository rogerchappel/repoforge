# Release Process

Use this process to publish releases that are reviewable, verifiable, and clear
to users. Adapt the publishing section to the project artifacts; do not assume a
specific package registry or hosting platform unless the project requires one.

## Versioning

Use semantic versioning when publishing versioned artifacts:

- `MAJOR`: incompatible public API, CLI, config, data, or workflow changes.
- `MINOR`: backwards-compatible features or meaningful new capabilities.
- `PATCH`: backwards-compatible fixes and maintenance updates.

If the project does not publish versioned artifacts, use release names or dated
GitHub releases, and avoid fake semantic versions.

## Changelog

- Keep `CHANGELOG.md` in Keep a Changelog style.
- Maintain an `Unreleased` section.
- Move completed entries into a release section when publishing.
- Include comparison links once release tags exist.

## Release Notes

Each release should include:

- Summary.
- User-visible changes.
- Breaking changes or migration steps.
- Verification performed.
- Known issues.
- Rollback or recovery notes.

## Verification

Choose checks that match the release:

- Documentation-only: markdown review and link checks when available.
- Library/package: tests, typecheck, lint, build, and package dry run where
  supported.
- CLI: smoke tests for key commands and install paths.
- Service: integration checks, deployment smoke test, and rollback notes.
- Template: sample generated repository review when practical.

Record exact commands or manual checks in the release notes.

## Publishing

Publishing may include:

- Git tag.
- GitHub release.
- Package registry publish.
- Binary, archive, checksum, or provenance upload.
- Container image publish.
- Documentation site publish.
- Release announcement.

Only include commands for the artifacts this project actually publishes.

## Rollback Notes

Describe the recovery path for each release:

- Source revert and patch release.
- Previous docs deployment.
- Deployment rollback.
- Package yank, deprecation, replacement, or follow-up fix.
- Feature flag disablement.

If rollback is impossible for an artifact, state that and describe the forward
fix path.

## Minimal Flow

1. Confirm release scope and version.
2. Update `CHANGELOG.md`.
3. Run `docs/release-checklist.md`.
4. Commit release prep changes.
5. Tag or create the release according to project policy.
6. Publish applicable artifacts.
7. Record verification and rollback notes.
8. Track follow-up work.
