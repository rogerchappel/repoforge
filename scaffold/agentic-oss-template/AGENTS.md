# Agent Operating Instructions for {{PROJECT_NAME}}

This file defines how AI agents and human maintainers should work in `{{PROJECT_NAME}}`.

## Project Context

- Project: `{{PROJECT_NAME}}`
- Slug: `{{PROJECT_SLUG}}`
- Description: {{PROJECT_DESCRIPTION}}
- Repository owner: `{{GITHUB_OWNER}}`
- Default branch: `{{DEFAULT_BRANCH}}`
- License: `{{LICENSE}}`

## Core Principle

Move quickly, but keep every change reviewable, reversible, verifiable, and safe.

## Branch Policy

- Work on a branch for all repository changes.
- Branch from the latest `{{DEFAULT_BRANCH}}` before editing.
- Do not merge without explicit maintainer approval.
- Do not rewrite shared history unless explicitly instructed.

## Atomic Commits

- Use Conventional Commits.
- One commit should represent one reviewable intent.
- Keep unrelated docs, code, tests, generated files, dependency changes, and CI changes in separate commits.
- Prefer one clean commit over several artificial commits.
- Prefer several clean commits over one mixed commit.
- If a task may touch more than 3 files, write the split plan before editing.

Allowed commit types:

- `feat:`
- `fix:`
- `test:`
- `docs:`
- `refactor:`
- `ci:`
- `chore:`
- `perf:`
- `types:`

## Expected Workflow

Before editing, report:

1. Task objective
2. Expected blast radius
3. Files likely to change
4. Commit plan
5. Verification plan
6. Risk level: low, medium, or high

Then:

1. Create or confirm a branch.
2. Make the smallest coherent change.
3. Review `git status`.
4. Review `git diff`.
5. Stage only files related to the current intent.
6. Run the smallest relevant verification.
7. Commit atomically.
8. Return a review pack.

## Verification

Every task must include verification.

Use the smallest relevant check first:

- targeted unit test
- targeted integration test
- typecheck
- lint
- build
- smoke command
- manual documentation review

If verification cannot be run, say why and provide the exact command a maintainer should run.

## Review Pack

Every completed task must return:

```md
## Review Pack
Repo: {{PROJECT_NAME}}
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

## Safety Rules

Stop and ask before touching:

- authentication or authorization
- security controls
- payments or billing
- production data
- data deletion or destructive commands
- database migrations
- secrets or environment variables
- public API compatibility
- licensing
- telemetry, analytics, or privacy behavior
- production configuration
- major dependency upgrades

Never commit secrets. Never mutate production data unless explicitly instructed.
