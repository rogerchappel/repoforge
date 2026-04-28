# PRD: repoforge

Status: in-progress

## Scorecard

Total: 89/100
Band: build now
Last scored: 2026-04-29
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 19/20 | Repo setup is repeated friction in the OSS factory workflow. |
| Demand signal | 17/20 | Strong internal demand from Roger's 70-day OSS sprint and repeated repo creation needs; external validation still needed. |
| V1 buildability | 20/20 | Template copy, variable replacement, git init, and smoke fixtures are straightforward. |
| Differentiation | 13/15 | Agentic OSS defaults and local-first discipline make it sharper than generic scaffolding. |
| Agentic workflow leverage | 15/15 | Directly increases new-repo throughput for agents. |
| Distribution potential | 5/10 | Useful to agentic builders, but discovery depends on template adoption. |

## Pitch

Create new OSS repos from a template with all boring setup done.

## Why It Matters

Repo creation/setup should be a one-command factory step, not manual work.

## V1 Scope

- CLI: `repoforge new <name>`
- Reads `repoforge.config.json`
- Copies from `agentic-oss-template`
- Replaces template variables
- Initializes git
- Optional explicit GitHub creation only via flags/token
- Generates first issues from template checklist

## Out of Scope

- No agent dispatch
- No CI secret management
- No npm publishing

## Verification

- Generate fixture repo into `/tmp/repoforge-smoke`
- Confirm variables replaced
- Tests pass

## Agent Prompt

Build `repoforge`, a local-first Node CLI that creates new OSS repos from `agentic-oss-template`. Keep V1 deterministic and mostly offline. Implement config parsing, template copy, variable replacement, git init, smoke test fixture, README, and docs. Network/GitHub creation must be explicit via flags only.
