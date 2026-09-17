# Agent Operating Instructions

This file defines how AI agents and human maintainers should work in this repository.

## Core Principle

Move quickly, but keep every change reviewable, reversible, verifiable, and safe.

## Branch Policy

- Work on a branch for all repository changes.
- Branch from the latest `main` before editing.
- Rebase on the latest `main` before opening a pull request.
- Do not work directly on `main` unless a maintainer explicitly says this repository is being treated as personal scratch space.
- Do not merge without explicit human approval.
- Do not rewrite shared history unless explicitly instructed.

## Concurrent Agent And PR Split Policy

When work is delegated to multiple agents or split into concurrent workstreams,
each workstream must be independently reviewable.

Hard rules:

- One agent or workstream owns one branch.
- One agent or workstream opens one pull request.
- Every delegated agent must submit a PR. This is a hard line, not a preference.
- One PR should contain one reviewable intent.
- The final integration PR may contain only integration glue, conflict
  resolution, documentation that connects the parts, or end-to-end verification
  updates.
- Do not put several agents' work on one shared branch unless a maintainer
  explicitly asks for one combined PR.
- Do not wait until after implementation to split PRs. Create or prepare the
  branch and PR boundary before or immediately after each workstream's first
  commit.

For stacked PRs:

- Each PR base must be the previous PR's head branch.
- Each PR head must contain only that workstream's commits on top of its base.
- Do not merge lower stack branches into higher stack branches to update them.
- Do not create merge commits between stacked branches unless a maintainer
  explicitly asks for merge commits.
- Prefer rebasing or cherry-picking to keep each PR diff clean.
- If a lower PR changes after review starts, update downstream stacks with a
  clean rebase and force-push only branches created for the current task.
- Never force-push shared or maintainer-owned branches without explicit
  approval.

Before reporting that concurrent work is submitted, verify:

- every workstream has a branch on the remote;
- every workstream has an open PR;
- every PR diff contains only its intended workstream;
- every PR commit list is clean enough to review;
- CI or the smallest relevant verification has run or is clearly pending.

## Atomic Commits

- Use Conventional Commits.
- One commit should represent one reviewable intent.
- Keep unrelated docs, code, tests, generated files, dependency changes, and CI changes in separate commits.
- Prefer one clean commit over several artificial commits only when the commit
  changes 3 files or fewer and remains one reviewable intent.
- Prefer several clean commits over one mixed commit.
- Hard gate: no commit may change more than 3 files unless a maintainer
  explicitly approves the exception before the commit.
- If a task touches more than 3 files, split it before committing.
- Do not spread a large number of file changes across a few broad commits.
- Scaffold drops, generated output, lockfile-only dependency updates, and
  mechanical repository-wide renames still need explicit maintainer approval
  when they exceed 3 files.
- If a task may touch more than 3 files, write the split plan before editing.
- If the correct split is unclear, stop and propose the commit split before
  staging.

Tests:

- One test intent per commit.
- Separate unrelated unit tests, regression tests, fixture tests, and smoke tests
  into separate commits.
- Multiple tests for the same behavior in the same test file may share one
  commit only when the commit still changes 3 files or fewer and remains one
  reviewable intent.

Allowed commit types:

- `feat:` user-visible capability
- `fix:` bug fix
- `test:` tests only
- `docs:` documentation only
- `refactor:` internal change with no behavior change
- `ci:` CI, build, or release workflow
- `chore:` repository hygiene
- `perf:` performance improvement
- `types:` type-only change

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
8. Continue only when the next change is a separate reviewable intent.
9. Return a review pack.

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

## PR Body Formatting Gate

When opening or updating a pull request, the PR body must follow `.github/pull_request_template.md` unless the maintainer explicitly asks for a different format.

Do not pass PR bodies or review comments as shell strings containing escaped newlines like `\n`. GitHub will render those literally and the comment is not reviewable.

Use a body file or heredoc instead:

```bash
cat > /tmp/pr-body.md <<'EOF'
## Summary

-

## Verification

- [ ] Tests or checks run:
- [ ] Manual review completed:

## Risk Level

- [ ] Low
- [ ] Medium
- [ ] High

Notes:

## Rollback Plan

-

## Human Decision Needed

- [ ] None
- [ ] Maintainer review
- [ ] Product/design decision
- [ ] Security/privacy review
- [ ] Other:
EOF

gh pr create --body-file /tmp/pr-body.md
```

Before creating or updating a PR, inspect the final rendered source:

```bash
cat /tmp/pr-body.md
```

If the preview contains literal `\n`, missing headings, or does not match the repository template, fix it before posting.

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

Never commit secrets. Never mutate production data unless explicitly instructed. Prefer dry runs, idempotent operations, and clear rollback notes for any data-affecting work.

## Agent Conduct

- Prefer existing repository patterns over new abstractions.
- Keep edits scoped to the task.
- Do not modify GitHub Actions, package scaffolds, or generated repository structure unless the task explicitly asks for it.
- Do not revert user or maintainer changes unless explicitly instructed.
- Surface blockers early with options and a recommendation.
