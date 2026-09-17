# Docs-only repository example

This example shows a generated repository after it has been customized for a
documentation-only project, such as a handbook, policy guide, public knowledge
base, or project manual.

It keeps the collaboration and review structure, but removes code-oriented
scaffolding that would create noise for documentation contributors.

## Example shape

```text
docs-only/
  README.md
  AGENTS.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  LICENSE
  CHANGELOG.md
  docs/
    index.md
    style-guide.md
  .github/
    ISSUE_TEMPLATE/
    pull_request_template.md
    workflows/
      docs.yml
      branchbrief.yml
```

## What was kept

- `AGENTS.md`, focused on writing, citation, review, and source handling.
- `CONTRIBUTING.md`, because documentation projects still need contribution
  standards.
- `CODE_OF_CONDUCT.md`, if the project accepts public discussion or issues.
- `SECURITY.md`, shortened to explain how to report sensitive documentation
  mistakes.
- `CHANGELOG.md`, for visible updates to public guidance.
- Documentation checks and branchbrief.

## What was removed

- General CI for application code.
- Package starter files and dependency publishing guidance.
- Runtime, deployment, and release templates that do not apply.
- Roadmap content if the project tracks documentation priorities in issues
  instead.

## What was customized

- The root README now describes the documentation audience, scope, and reading
  path.
- `docs/index.md` became the entry point for the actual content.
- `docs/style-guide.md` defines tone, terminology, citation, and review rules.
- Pull request templates ask for source links, screenshots when relevant, and a
  note about whether content changes policy or only wording.

## Notes for maintainers

This shape keeps documentation repositories lightweight without losing review
discipline. It is a good fit when the primary artifact is trusted written
guidance rather than code.
