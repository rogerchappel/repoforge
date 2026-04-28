# Contributing

Thanks for helping improve this project.

This repository is intended to stay reviewable, reusable, and safe for future maintainers. Contributions should be small enough to review, clear about their intent, and verified before they are submitted.

## Issues

Use issues for bugs, feature requests, documentation improvements, and agent tasks.

Before opening an issue:

- Search existing issues to avoid duplicates.
- Confirm whether the request applies to this template repository or to a repository generated from it.
- Include enough context for another maintainer or agent to reproduce the problem or understand the requested change.

For bug reports, include:

- What happened.
- What you expected to happen.
- Steps to reproduce, when applicable.
- Relevant logs, screenshots, links, or files.
- The smallest verification command or manual check that demonstrates the problem.

For feature requests, include:

- The use case.
- Why the current template is insufficient.
- Any risks, compatibility concerns, or migration notes.
- Suggested files or templates that may need to change.

## Pull Requests

Pull requests should be focused on one reviewable intent.

Expected PR standards:

- Use a branch for the change.
- Keep unrelated formatting, dependency, generated file, and behavior changes separate.
- Follow Conventional Commits for commit messages.
- Update documentation or templates when behavior or workflow expectations change.
- Do not include secrets, private credentials, private contact details, or client-specific information.
- Do not imply paid support, guaranteed response times, or production SLAs unless the project explicitly provides them.

## Review Packs

Every meaningful PR should include a review pack in the PR body or final agent response.

Use this format:

```md
## Review Pack
Repo:
Branch:
PR:
Task:
Status: done / blocked / needs review
Summary:
Commits:
Files changed:
Verification:
Risk level:
Rollback plan:
Human decision needed:
Next recommended task:
```

Keep the review pack factual. It should say what changed, how it was verified, what remains risky, and what a reviewer should decide next.

## Verification

Every contribution needs verification appropriate to the change.

Use the smallest relevant verification first:

- Documentation-only changes: review the rendered Markdown or inspect the diff.
- Template changes: confirm placeholders are clear and no project-specific private details were introduced.
- CI or workflow changes: run the narrowest relevant local check, then confirm expected GitHub Actions behavior when possible.
- Code changes in generated repositories: run the targeted test, typecheck, lint, build, or smoke command that proves the change.

If verification cannot be run, say why and provide the exact command or manual check a maintainer should run.

## Agent Contributions

AI agent contributions must follow the same standards as human contributions.

Agents should:

- State the objective, blast radius, files likely to change, verification plan, and risk level before editing.
- Work in small, atomic commits.
- Review `git status` and `git diff` before staging.
- Stage only files related to the current intent.
- Avoid touching risky areas such as auth, billing, production data, secrets, licensing, telemetry, or public API compatibility without explicit maintainer approval.
- Return a review pack when done.

## Maintainer Review

Maintainers may ask for smaller commits, clearer verification, reduced scope, or safer defaults before merging.

No contribution is accepted until a maintainer reviews and approves it.
