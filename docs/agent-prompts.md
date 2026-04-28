# Agent Prompts

This document provides reusable prompts for common open-source maintenance work
in repositories generated from this template.

Use these prompts as starting points. Replace bracketed notes with the generated
repository's actual task, files, verification commands, and risk context before
handing work to an agent.

## Customise A New Repository

```md
You are working in [REPOSITORY_NAME], a repository generated from
agentic-oss-template.

Task: Complete the first repository customisation pass.

Scope:
- Replace template identity in README, LICENSE, package metadata, security
  policy, contributor docs, and agent instructions.
- Remove optional template files that this repository will not use.
- Keep source code, dependencies, generated files, and CI behavior unchanged
  unless required for accurate project identity.

Before editing, report:
- task objective
- expected blast radius
- files likely to change
- commit plan
- verification plan
- risk level

Verification:
- Run `rg '\{\{[A-Z0-9_]+\}\}'` and explain any intentional remaining
  placeholders.
- Run `rg 'agentic-oss-template|template repository|starter|placeholder|TODO'`
  and remove stale template language that no longer applies.
- Run the smallest repository-specific check available.

Return a review pack with summary, verification, risk, rollback plan, and any
human decisions needed.
```

## Add A Feature

```md
You are working in [REPOSITORY_NAME].

Task: Add [FEATURE] for [USER_OR_MAINTAINER_OUTCOME].

Scope:
- Keep the change to one reviewable intent.
- Prefer existing project patterns over new abstractions.
- Update docs or examples only when the feature changes user-facing behavior.
- Do not touch auth, billing, production data, secrets, licensing, telemetry, or
  public API compatibility without explicit maintainer approval.

Before editing, report objective, blast radius, likely files, commit plan,
verification plan, and risk level.

Verification:
- Run the smallest targeted test or smoke command that proves the feature works.
- Run broader checks only when the touched code affects shared behavior.

Commit:
- Use `feat: [short feature summary]`.

Return a review pack.
```

## Fix A Bug

```md
You are working in [REPOSITORY_NAME].

Task: Fix [BUG] where [OBSERVED_BEHAVIOR] should instead [EXPECTED_BEHAVIOR].

Scope:
- Reproduce or inspect the failure before changing code when possible.
- Keep the fix narrowly focused on the failing behavior.
- Add or update a targeted regression test when the repository has a relevant
  test surface.

Before editing, report objective, blast radius, likely files, commit plan,
verification plan, and risk level.

Verification:
- Run the targeted regression test or reproduction command.
- Run the smallest adjacent check needed to prove the fix did not break the
  touched area.

Commit:
- Use `fix: [short bug summary]`.

Return a review pack that includes the root cause if known.
```

## Improve Documentation

```md
You are working in [REPOSITORY_NAME].

Task: Improve documentation for [TOPIC].

Scope:
- Keep the docs accurate to current repository behavior.
- Do not document features, commands, workflows, or guarantees that do not
  exist.
- Update cross-links when moving or adding docs.

Before editing, report objective, blast radius, likely files, commit plan,
verification plan, and risk level.

Verification:
- Manually review the rendered Markdown structure.
- Check links touched by the change.
- Run repository docs validation if available.

Commit:
- Use `docs: [short documentation summary]`.

Return a review pack.
```

## Prepare A Release

```md
You are working in [REPOSITORY_NAME].

Task: Prepare release [VERSION].

Scope:
- Review the changelog, release checklist, version references, package metadata,
  and publishing documentation.
- Do not publish, tag, deploy, or merge without explicit maintainer approval.
- Keep release preparation separate from unrelated fixes.

Before editing, report objective, blast radius, likely files, commit plan,
verification plan, and risk level.

Verification:
- Run the release checklist.
- Run the project's required test, build, lint, or smoke commands.
- Confirm no unresolved placeholders or stale release notes remain.

Commit:
- Use `docs: prepare release [VERSION]` for documentation-only release prep, or
  the appropriate Conventional Commit type if package metadata changes.

Return a review pack with remaining human release decisions.
```

## Review A Pull Request

```md
You are reviewing pull request [PR_NUMBER_OR_URL] in [REPOSITORY_NAME].

Task: Perform a code-review style assessment.

Scope:
- Prioritize bugs, regressions, missing verification, security risks, and
  maintainability problems.
- Do not rewrite the PR unless explicitly asked.
- Cite exact files and line numbers for each finding.

Review focus:
- behavior changes
- tests and verification
- risky areas named in AGENTS.md
- docs and template accuracy
- rollback or migration concerns

Return findings first, ordered by severity. If there are no findings, say so
clearly and list any residual test gaps.
```

## Address CI Failure

```md
You are working in [REPOSITORY_NAME].

Task: Diagnose and fix the failing CI check [CHECK_NAME_OR_URL].

Scope:
- Inspect the failing job logs before editing.
- Fix the smallest cause of the failure.
- Do not silence checks, remove verification, or broaden permissions unless the
  maintainer explicitly approves that plan.

Before editing, report objective, blast radius, likely files, commit plan,
verification plan, and risk level.

Verification:
- Re-run the failed command locally when possible.
- If the check cannot run locally, explain why and provide the exact remote
  workflow expected to verify the fix.

Commit:
- Use the Conventional Commit type that matches the fix, usually `fix:`, `ci:`,
  `docs:`, or `test:`.

Return a review pack.
```

## Update Dependencies Safely

```md
You are working in [REPOSITORY_NAME].

Task: Update [DEPENDENCY_OR_GROUP] from [OLD_VERSION] to [NEW_VERSION].

Scope:
- Inspect release notes or changelog for breaking changes.
- Keep dependency updates separate from unrelated refactors.
- Do not perform major dependency upgrades without explicit maintainer approval.

Before editing, report objective, blast radius, likely files, commit plan,
verification plan, and risk level.

Verification:
- Run install with the repository's package manager.
- Run the smallest relevant test, typecheck, build, or smoke command.
- Note any migration or rollback instructions.

Commit:
- Use `chore: update [DEPENDENCY_OR_GROUP]` unless the repository has a more
  specific dependency commit convention.

Return a review pack.
```

## Plan A Security-Sensitive Change

```md
You are working in [REPOSITORY_NAME].

Task: Create an implementation plan for [SECURITY_SENSITIVE_CHANGE].

Scope:
- Inspect the relevant files and current behavior.
- Do not edit files yet.
- Do not expose secrets, credentials, exploit details, or private data in public
  output.

Risk areas:
- authentication or authorization
- security controls
- payments or billing
- production data
- data deletion
- migrations
- secrets or environment variables
- public API compatibility
- licensing
- telemetry, analytics, or privacy behavior
- production configuration
- major dependency upgrades

Return:
- current behavior summary
- proposed change
- expected blast radius
- files likely to change
- verification plan
- rollback plan
- open questions
- explicit human approval needed before editing
```
