# CLI and tooling repository example

This example shows a generated repository after it has been customized for a
small command-line tool or developer automation project.

It keeps the repository policy and review workflow, but does not duplicate a
full CLI implementation. The example assumes implementation files will be added
after the maintainer settles the command surface and packaging path.

## Example shape

```text
cli-tooling/
  README.md
  AGENTS.md
  CONTRIBUTING.md
  SECURITY.md
  LICENSE
  CHANGELOG.md
  ROADMAP.md
  docs/
    usage.md
    release-process.md
  .github/
    ISSUE_TEMPLATE/
    pull_request_template.md
    workflows/
      ci.yml
      branchbrief.yml
```

## What was kept

- `AGENTS.md`, with extra guidance for avoiding destructive local commands.
- `CONTRIBUTING.md`, because CLI behavior changes need reproducible review
  steps.
- `SECURITY.md`, because developer tools can handle tokens, paths, or private
  repository data.
- `CHANGELOG.md`, because CLI users need clear upgrade notes.
- Pull request and issue templates.
- Baseline CI, ready to grow into lint, test, and package checks.

## What was removed

- Optional docs-site scaffolding, because plain Markdown usage docs are enough
  for the first release.
- Template variable reference docs, after repository identity was resolved.
- Unused release templates that duplicated the customized release process.
- Deployment examples, because the tool is distributed as a package or binary,
  not a hosted site.

## What was customized

- The root README now leads with install, command synopsis, common workflows,
  and exit-code expectations.
- `docs/usage.md` contains task-oriented examples instead of template setup
  instructions.
- `AGENTS.md` calls out high-risk areas such as filesystem mutation, shell
  execution, secrets, and package publishing.
- CI starts with repository hygiene checks and later adds CLI smoke tests.

## Notes for maintainers

This shape works well for tools that will evolve quickly. Keep behavior changes
small, document command examples near the code they verify, and require every
pull request to include the exact command used for smoke testing.
