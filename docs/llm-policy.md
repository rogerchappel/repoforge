# LLM and Agent Policy

This policy defines acceptable and unacceptable use of LLMs and AI agents for open-source work in this repository and repositories generated from this template.

## Purpose

LLMs and agents may be used to increase maintainership throughput, improve documentation, assist with implementation, and reduce repetitive project setup work. They must not reduce review quality, security, attribution clarity, or maintainer accountability.

## Acceptable Use

LLMs and agents may be used for:

- drafting and editing documentation
- creating issue, pull request, and release templates
- generating boilerplate that is reviewed before merge
- proposing implementation plans
- writing tests for already specified behavior
- refactoring within clearly defined boundaries
- explaining code and summarizing diffs
- preparing review packs and release notes
- identifying likely bugs or missing verification

All generated work must be reviewed by a human maintainer or an explicitly trusted project agent workflow before merge.

## Unacceptable Use

LLMs and agents must not be used to:

- commit secrets, credentials, tokens, or private keys
- bypass review, tests, security controls, or license checks
- generate or add code copied from incompatible licenses
- impersonate maintainers or contributors
- fabricate test results, benchmarks, citations, or review approvals
- mutate production data without explicit approval
- make security, billing, legal, licensing, or privacy decisions without human review
- submit intentionally obfuscated code
- hide the use of automation when disclosure is required by project policy or platform rules

## Maintainer Accountability

The maintainer who merges a change is accountable for it, regardless of whether it was written by a human, LLM, or agent.

Before merge, maintainers should confirm:

- the change matches the stated task
- the diff is understandable
- verification was run or clearly deferred
- licensing risk has been considered
- generated content is appropriate for the project
- no secrets or private information were introduced

## Disclosure

Routine use of agents for drafting, refactoring, testing, or documentation does not need special disclosure in every file.

Disclose AI assistance in the pull request or review pack when:

- the contribution is mostly generated
- the agent made broad changes across the repository
- generated text may affect legal, security, privacy, or compliance expectations
- project policy, contributor policy, or platform rules require disclosure

## Source and License Hygiene

Agents must avoid copying substantial text or code from external sources unless the source license allows reuse and attribution requirements are satisfied.

For third-party material:

- prefer linking to the source instead of copying it
- preserve required notices
- record attribution when required
- do not mix incompatible licenses
- ask a maintainer when license compatibility is unclear

## Security and Privacy

Do not provide secrets, private customer data, unpublished vulnerability details, or confidential business information to external LLM services unless a maintainer has explicitly approved that use and the service is allowed for the data class.

Agents should treat the following as sensitive:

- credentials, tokens, and private keys
- customer or user data
- private repository content
- unpublished security reports
- billing records
- internal operational details

## Verification Expectations

Agent-authored changes require the same verification as human-authored changes.

Documentation changes should be checked for internal consistency. Code changes should have the smallest relevant automated verification. Risky changes require stronger verification and explicit human approval.

## Generated Project Defaults

Repositories generated from this template should keep an LLM policy, update it for their own risk profile, and make clear who can approve agent-authored work.
