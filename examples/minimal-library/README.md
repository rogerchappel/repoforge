# Minimal library repository example

This example shows a generated repository after it has been customized for a
small open-source library.

It is intentionally documentation-first. It does not include package source,
tests, or release automation beyond the baseline policy files a maintainer would
usually keep before adding real library code.

## Example shape

```text
minimal-library/
  README.md
  AGENTS.md
  CONTRIBUTING.md
  SECURITY.md
  LICENSE
  CHANGELOG.md
  ROADMAP.md
  .github/
    ISSUE_TEMPLATE/
    pull_request_template.md
    workflows/
      ci.yml
      docs.yml
      branchbrief.yml
```

## What was kept

- `AGENTS.md`, because maintainers expect agent-assisted contributions.
- `CONTRIBUTING.md`, because the library accepts external pull requests.
- `SECURITY.md`, customized with a monitored security contact.
- `CHANGELOG.md` and `ROADMAP.md`, because releases and compatibility promises
  matter for library users.
- GitHub issue and pull request templates.
- Baseline CI and documentation checks.

## What was removed

- `templates/`, after the first customization pass copied the useful guidance.
- Optional docs-site scaffolding, because the library starts with README-first
  documentation.
- Optional npm package starter files, until the real package layout is chosen.
- Deployment examples, because the library does not publish a documentation site
  yet.

## What was customized

- The root README now describes the library API, supported platforms, install
  instructions, and a short usage example.
- `LICENSE` uses the library's chosen copyright owner.
- `SECURITY.md` points to the project's real vulnerability reporting path.
- CI was narrowed to checks that work before package code exists, then can be
  extended when source and tests are added.

## Notes for maintainers

This shape is useful when the project should be public before the implementation
is complete, but the maintainers still want contribution, security, and release
expectations in place from day one.
