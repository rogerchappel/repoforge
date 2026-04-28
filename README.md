# agentic-oss-template

`agentic-oss-template` is a GitHub repository template for starting an
open-source project with clear maintainer policy, agent-friendly workflow rules,
baseline GitHub automation, and practical release and security documentation.

It is not an application framework or runtime starter. Use it when the first
thing a new repository needs is trustworthy project structure: reviewable
contribution flow, documented agent expectations, lightweight CI, issue and pull
request templates, dependency update policy, and release discipline.

## Who this is for

This template is intended for maintainers who want a new repository to begin
with working collaboration norms instead of adding them later.

It is a good fit for:

- open-source libraries, tools, CLIs, and documentation projects
- agent-assisted projects where humans and coding agents will both contribute
- early-stage repositories that need policy, review, and release scaffolding
- maintainers who want small, auditable commits and clear review handoffs

It is not a complete product scaffold. It does not include application source
code, a configured package manager at the root, deployment credentials, or a
project-specific security contact. Generated repositories should customize the
template before publishing.

## What's included

### Repository policy

- `AGENTS.md`: operating instructions for AI agents and human maintainers.
- `CONTRIBUTING.md`: contribution expectations for generated repositories.
- `CODE_OF_CONDUCT.md`: baseline community conduct policy.
- `SECURITY.md`: generic vulnerability reporting policy to customize.
- `LICENSE`: MIT license text for the template.
- `CHANGELOG.md`: changelog structure for release notes.
- `ROADMAP.md`: lightweight roadmap structure.
- `.editorconfig`: shared editor formatting defaults.
- `.gitignore`: common ignores for editors, operating systems, dependencies,
  build output, and local environment files.

### GitHub project files

- `.github/pull_request_template.md`: pull request review checklist and handoff
  structure.
- `.github/ISSUE_TEMPLATE/agent_task.md`: issue template for agent-executable
  tasks.
- `.github/ISSUE_TEMPLATE/bug_report.md`: bug report template.
- `.github/ISSUE_TEMPLATE/feature_request.md`: feature request template.
- `.github/dependabot.yml`: weekly GitHub Actions dependency updates.
- `.github/workflows/ci.yml`: baseline repository checks for this template.
- `.github/workflows/docs.yml`: documentation presence checks.
- `.github/workflows/branchbrief.yml`: pull request branch summary artifact.
- `scripts/validate-template.sh`: local repository hygiene validation for this
  template.

### Documentation

- [Repository customisation](docs/repo-customisation.md): first-pass setup after
  generating a new repository.
- [Agent workflow](docs/agent-workflow.md): branch, verification, commit, and
  review pack expectations.
- [Agent prompts](docs/agent-prompts.md): reusable prompts for common
  agent-assisted OSS maintenance tasks.
- [GitHub Actions](docs/github-actions.md): included workflows and how to extend
  them.
- [Dependency policy](docs/dependency-policy.md): baseline Dependabot policy and
  later npm update guidance.
- [Release process](docs/release-process.md): lightweight versioning, changelog,
  release notes, publishing, and rollback guidance.
- [Security policy customisation](docs/security-policy.md): how to adapt
  vulnerability reporting for the generated repository.

Additional docs cover branchbrief, Cloudflare Pages, npm publishing, Copilot,
LLM usage policy, release checklists, template variables, and the project PRD.

### Examples

The `examples/` directory contains small documentation-first examples of how
generated repositories can look after customization:

- [Minimal library repository](examples/minimal-library/README.md)
- [CLI and tooling repository](examples/cli-tooling/README.md)
- [Docs-only repository](examples/docs-only/README.md)

### Reusable templates

The `templates/` directory contains copyable or reference files for generated
repositories, including:

- agent instruction templates
- contributor and review pack templates
- GitHub issue, pull request, workflow, and Dependabot templates
- release, changelog, roadmap, and release-checklist templates
- generated repository README template
- security policy templates
- MIT license template
- optional Cloudflare Pages documentation deployment files
- optional npm package starter files
- optional Astro/Starlight docs-site starter files

## Use this template

1. Open this repository on GitHub.
2. Select **Use this template**.
3. Create a new repository from the template.
4. Clone the generated repository locally.
5. Create a branch for the first customisation pass.
6. Replace the template identity with the generated repository's name, description,
   owner, license choice, maintainer guidance, and security reporting path.
7. Remove files and template assets that the generated repository will not use.
8. Run the checks listed in the first-30-minute checklist below.
9. Commit the identity and policy changes before adding application, package, or
   product code.

## First 30 minutes after generation

Use this checklist before inviting contributors or agents into the generated
repository:

- Update `README.md` so it describes the generated repository, not this template.
- Review `LICENSE` and set the correct license text and copyright owner.
- Review `AGENTS.md` and keep only instructions that match the generated repository.
- Review `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` for accuracy.
- Confirm the security reporting path exists and is monitored.
- Review `.github/pull_request_template.md` and `.github/ISSUE_TEMPLATE/*.md`.
- Remove unused files from `templates/`.
- Search for unresolved template markers and resolve every marker that should
  not ship in the generated repository.
- Search for stale template language and remove anything that no longer applies
  to the generated repository.
- Run `bash scripts/validate-template.sh` while maintaining this template.
- Run the smallest relevant local verification for the generated repository.
- Make the first commit as a small identity-only change.

For the full setup sequence, see
[Repository customisation](docs/repo-customisation.md).

## Operating model

The repository is designed around small, reviewable, reversible changes:

- branch before editing
- keep one commit to one reviewable intent
- run the smallest meaningful verification
- stage only related files
- use Conventional Commits
- return a review pack with summary, verification, risk, and rollback notes

These expectations are documented in
[Agent workflow](docs/agent-workflow.md) and mirrored in `AGENTS.md`.

## License

This template is released under the MIT License. Repositories generated from it
should choose and document the license that fits their own repository before
publishing.
