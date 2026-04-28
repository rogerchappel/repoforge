# Agent Workflow

This document explains the practical workflow expected from AI agents and human maintainers working in this repository.

## Goal

The goal is to ship useful changes while preserving trust. Every change should be easy to review, easy to verify, and easy to roll back.

For reusable task prompts that follow this workflow, see
[Agent Prompts](agent-prompts.md).

## Before Editing

Before making changes, state:

- the task objective
- the expected blast radius
- the files likely to change
- the commit plan
- the verification plan
- the risk level: low, medium, or high

This sets review expectations before files move.

## Branch First

Agents should work on a branch based on the latest `main`.

Recommended flow:

```sh
git fetch origin main
git switch -c codex/<short-task-name> origin/main
```

Use an existing task branch only when it already matches the current work.

## Make the Smallest Coherent Change

Keep each change focused on one reviewable intent. Do not bundle unrelated documentation, source, tests, dependency updates, generated files, or CI changes into the same commit.

When a task naturally has multiple intents, split them into multiple commits. When the task is one intent, keep it as one commit.

## Review Before Staging

Before staging, inspect:

```sh
git status --short
git diff
```

Confirm that the diff only includes files related to the current intent. Do not stage unrelated local changes.

## Verify

Run the smallest relevant verification for the change.

Examples:

- documentation-only change: manual consistency review
- markdown formatting change: markdown lint if available
- source change: targeted unit test
- shared behavior change: targeted test plus typecheck or build
- CI change: workflow syntax or dry-run check where available

If a check cannot be run locally, document the reason and the exact command that should be run by a maintainer.

## Commit

Use Conventional Commits. The commit subject should describe the reviewable intent.

Examples:

```text
docs: add agent workflow foundation
fix: preserve branch names with slashes
ci: add branchbrief workflow
```

Avoid vague subjects such as `update docs`, `changes`, or `misc`.

## Review Pack

End every task with a review pack:

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

The review pack is the handoff record. It should give a maintainer enough context to review or continue the work without rereading the whole conversation.

## Blockers

If blocked, stop guessing and return:

```md
## Blocker
What blocked:
Why it matters:
Options:
Recommended option:
Human decision needed:
```

Use this when the next step requires human judgment, access, credentials, or approval for a risky area.

## Risk Escalation

Stop and ask before touching high-risk areas:

- authentication or authorization
- security controls
- payments or billing
- production data
- data deletion
- database migrations
- secrets or environment variables
- public API compatibility
- licensing
- telemetry, analytics, or privacy behavior
- production configuration
- major dependency upgrades

For these areas, inspect and propose a plan before editing.

## Pull Requests

For production, client, company, or community repositories:

- push the branch when the work is ready for review
- open or prepare a pull request
- describe the task, summary, verification, risk, and rollback plan
- do not merge without explicit human approval

For personal scratch repositories, a maintainer may allow direct-to-main work explicitly, but commits should still be atomic and verified.
