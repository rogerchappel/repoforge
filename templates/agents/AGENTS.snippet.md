## Agent Workflow

Agents and maintainers working in `{{PROJECT_NAME}}` must keep changes reviewable, reversible, verifiable, and safe.

Before editing, report the task objective, expected blast radius, likely files, commit plan, verification plan, and risk level.

Work on a branch based on `{{DEFAULT_BRANCH}}`. Use Conventional Commits, keep one reviewable intent per commit, inspect `git status` and `git diff` before staging, stage only related files, and run the smallest relevant verification. If a change touches more than 3 files, split it into smaller commits unless it is scaffold, generated, lockfile-only, or a clearly mechanical repository-wide rename.

When opening a PR, follow `.github/pull_request_template.md`, use a body file or heredoc, preview it with `cat`, and never post shell-escaped literal `\n` strings.

Stop and ask before touching auth, security controls, payments, production data, destructive operations, migrations, secrets, public API compatibility, licensing, telemetry/privacy behavior, production configuration, or major dependency upgrades.

Every completed task should return a review pack with repository, branch, PR, task, status, summary, commits, files changed, verification, risk level, rollback plan, human decision needed, and next recommended task.
