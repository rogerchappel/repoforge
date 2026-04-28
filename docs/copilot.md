# GitHub Copilot Instructions

Generated repositories can configure GitHub Copilot with repository-specific instructions. These instructions help Copilot match the repository's workflow, risk policy, verification expectations, and coding conventions.

Copilot configuration is optional. Projects can use this template without enabling GitHub Copilot.

## Recommended File

For repository-wide instructions, create:

```text
.github/copilot-instructions.md
```

GitHub Copilot can use this file as persistent context when generating suggestions for the repository.

## What To Include

Keep Copilot instructions short, concrete, and specific to the generated repository.

Recommended sections:

- project purpose
- preferred package manager and runtime
- branch and commit expectations
- verification commands
- coding style and architecture boundaries
- security, privacy, and secret-handling rules
- areas where Copilot should ask for human review

Use `AGENTS.md` as the authoritative operating policy for agentic work. Copilot instructions should summarize the parts that help interactive coding suggestions.

## Starter Template

Copy this into `.github/copilot-instructions.md` in a generated repository and customize it:

```md
# GitHub Copilot Instructions for {{PROJECT_NAME}}

{{PROJECT_NAME}} is {{PROJECT_DESCRIPTION}}.

## Working Style

- Keep changes small, reviewable, and scoped to the requested task.
- Follow the repository's `AGENTS.md` and contributor documentation.
- Use Conventional Commits for suggested commit messages.
- Prefer existing project patterns over new abstractions.

## Verification

- Primary check: `{{PRIMARY_VERIFICATION_COMMAND}}`
- For documentation-only changes, perform a manual consistency review.
- Do not claim a check passed unless it was run.

## Safety

- Do not suggest committing secrets, tokens, private keys, `.env` files, or production data.
- Ask for human review before changing auth, billing, security controls, migrations, telemetry, privacy behavior, licensing, or public APIs.
- Avoid broad rewrites unless explicitly requested.
```

## Relationship To Other Agent Files

Use these files together:

- `AGENTS.md`: operating policy for agents and maintainers
- `.github/copilot-instructions.md`: concise Copilot-specific guidance
- `CONTRIBUTING.md`: human contributor workflow
- `docs/llm-policy.md`: project policy for LLM and agent usage

When the files disagree, generated repositories should treat `AGENTS.md` and maintainer instructions as higher priority than Copilot suggestions.

## Review Checklist

Before committing Copilot instructions in a generated repository, confirm:

- placeholders are replaced
- verification commands are accurate
- sensitive areas are listed
- instructions do not ask Copilot to bypass review or tests
- instructions do not include secrets or private operational details
