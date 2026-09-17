# Release Checklist

Use this checklist before publishing a release. Remove items that do not apply
to the project, but do not skip verification and rollback notes.

## 1. Scope

- [ ] Release version or name is confirmed.
- [ ] Release type is clear: major, minor, patch, prerelease, documentation, or
      source/template-only.
- [ ] Included changes are reviewable and merged.
- [ ] Deferred changes are tracked separately.

## 2. Changelog

- [ ] `CHANGELOG.md` has an `Unreleased` section.
- [ ] User-visible changes are grouped in Keep a Changelog categories.
- [ ] The new release section uses the correct version and release date.
- [ ] No placeholder owner, repository, version, or date values remain in the
      published release entry.
- [ ] Breaking changes, migrations, and removals are called out clearly.

## 3. Versioning

- [ ] Version bump matches the impact of the release.
- [ ] Package, manifest, lockfile, binary, container, or docs-site versions are
      updated only where relevant.
- [ ] Version references are consistent across the repository.
- [ ] Tags follow the project convention, such as `v1.2.3`, if one exists.

## 4. Verification

- [ ] Smallest relevant test or smoke check has run.
- [ ] Build or packaging command has run when artifacts are published.
- [ ] Documentation links or generated docs are checked when docs changed.
- [ ] Manual QA notes are captured when automated coverage is not enough.
- [ ] Known limitations or skipped checks are documented.

## 5. Release Notes

- [ ] Summary explains why the release matters.
- [ ] User-visible changes are listed without relying only on commit messages.
- [ ] Breaking changes include migration guidance.
- [ ] Verification commands or checks are included.
- [ ] Known issues are included or explicitly marked as none known.
- [ ] Rollback or recovery notes are included.

## 6. Publishing

- [ ] Correct branch and commit are selected.
- [ ] Release tag is created according to project policy.
- [ ] GitHub release, registry package, binary, container, docs site, or other
      artifact is published only if applicable.
- [ ] Checksums, provenance, or signatures are published when the project
      requires them.
- [ ] Announcement channels are updated when relevant.

## 7. After Release

- [ ] Release page and artifacts are visible to users.
- [ ] Install or upgrade instructions are still accurate.
- [ ] `CHANGELOG.md` has a fresh `Unreleased` section for future changes.
- [ ] Follow-up issues exist for deferred bugs, docs, or release automation.
- [ ] Maintainers have reviewed monitoring, issue reports, or user feedback
      after release.
