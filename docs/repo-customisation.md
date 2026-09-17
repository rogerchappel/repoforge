# Repository Customisation

Use this guide immediately after creating a new repository from the template.
The first pass should replace template identity, remove unused files, and leave
the repository in a state that is accurate enough for contributors and agents.

## First 30 Minutes

1. Replace the project identity placeholders:
   - `{{PROJECT_NAME}}`
   - `{{PROJECT_DESCRIPTION}}`
   - `{{AUTHOR_NAME}}`
   - `{{GITHUB_OWNER}}`
   - `{{YEAR}}`
   - `{{LICENSE}}`
2. Update the root README so it describes the generated repository, not the template.
3. Replace the root LICENSE with the correct license text and copyright owner.
4. Review `AGENTS.md` and keep only instructions that match the generated repository.
5. Review contributor, security, issue, and pull request templates for accuracy.
6. Remove template files that are not useful for the new repository.
7. Run `rg '\{\{[A-Z0-9_]+\}\}'` and replace or intentionally keep every
   remaining placeholder.
8. Run `rg 'template|starter|example|placeholder|TODO'` and remove stale
   template language that does not apply to the generated repository.
9. Make the first commit as a small identity-only change before adding project
   code.

## Recommended Order

Start with identity files because they are the most visible:

- `README.md`
- `LICENSE`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`

Then update GitHub-facing templates:

- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/*.md`

Finally, review optional template assets under `templates/`. Keep them when the
generated repository will reuse them, and remove them when they would confuse future
contributors.

## Placeholder Rules

Use the placeholder names from [Template Variables](template-variables.md).
Replace placeholders with plain project values in generated repositories unless
the file is intentionally kept as a reusable template.

Do not leave placeholders in published project-facing files such as README,
LICENSE, package metadata, security policy, or contributor guidance. It is fine
for reusable files under `templates/` to keep placeholders when the file is
meant to be copied later.

## Commit Guidance

Keep the first customisation commit small and reviewable. A good first commit
usually includes only identity and policy updates. Add source code, dependency
changes, CI, generated files, or release automation in later commits.
