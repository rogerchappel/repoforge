# Release Checklist

Use this checklist before publishing. Remove items that do not apply, but keep
verification and rollback notes.

## Scope

- [ ] Release version or name is confirmed.
- [ ] Release type is clear.
- [ ] Included changes are merged and reviewable.
- [ ] Deferred changes are tracked separately.

## Changelog

- [ ] `CHANGELOG.md` has an `Unreleased` section.
- [ ] User-visible changes are grouped in Keep a Changelog categories.
- [ ] Release section uses the correct version and date.
- [ ] Placeholder owner, repository, version, and date values are removed.
- [ ] Breaking changes and migrations are called out clearly.

## Versioning

- [ ] Version bump matches release impact.
- [ ] Relevant manifests, packages, binaries, containers, docs, or other
      artifacts are updated consistently.
- [ ] Tags follow project convention.

## Verification

- [ ] Smallest relevant automated check has run.
- [ ] Build or packaging command has run when artifacts are published.
- [ ] Documentation checks have run when docs changed.
- [ ] Manual QA notes are captured when needed.
- [ ] Skipped checks are documented.

## Release Notes

- [ ] Summary explains why the release matters.
- [ ] User-visible changes are listed.
- [ ] Breaking changes include migration guidance.
- [ ] Verification commands or checks are included.
- [ ] Known issues are included or explicitly marked as none known.
- [ ] Rollback or recovery notes are included.

## Publishing

- [ ] Correct branch and commit are selected.
- [ ] Release tag is created according to project policy.
- [ ] GitHub release, package, binary, container, docs site, or other artifact is
      published only if applicable.
- [ ] Checksums, provenance, or signatures are published when required.
- [ ] Announcement channels are updated when relevant.

## After Release

- [ ] Release page and artifacts are visible to users.
- [ ] Install or upgrade instructions are accurate.
- [ ] `CHANGELOG.md` has a fresh `Unreleased` section.
- [ ] Follow-up issues exist for deferred work.
