# GitHub Creation And Issue Planning

`repoforge` stays local-first by default. GitHub repository creation and issue
planning are explicit integration steps that run only when requested by flags.

## Expected Flags

| Flag | Behavior |
| --- | --- |
| `--github` | Opt in to GitHub repository creation through the `gh` CLI. Without this flag, no repository is created. |
| `--public` | Plan or create the repository as public. Mutually exclusive with `--private`. |
| `--private` | Plan or create the repository as private. This is the default visibility when neither visibility flag is provided. |
| `--issue-plan` | Generate `.github/repoforge-initial-issues.md` from `templates/issues/initial-issues.json`. |
| `--dry-run` | Print planned commands and issue payloads without creating repositories or issues. This should be the default integration mode until execution is explicit. |

## Repository Creation Helper

`src/github.js` exports:

- `planGithubCreation(options)`: validates inputs and returns the exact
  `gh repo create` command that would run.
- `createGithubRepository(options)`: runs `gh repo create` only when
  `options.github === true` and `options.dryRun === false`.
- `buildGithubCreateArgs(options)`: returns argv for integration tests or CLI
  rendering.

The helper does not read tokens or environment variables. Authentication is left
to the installed `gh` CLI and its existing credential handling.

The CLI passes the generated repository path as `--source` and configures the
`origin` remote when `gh repo create` succeeds.

Example helper usage:

```js
import { createGithubRepository, planGithubCreation } from "./src/github.js";

const options = {
  github: flags.github,
  dryRun: flags.dryRun,
  public: flags.public,
  private: flags.private,
  owner: config.githubOwner,
  name: config.githubRepo,
  description: config.projectDescription,
  source: outputDir,
  remote: "origin"
};

const plan = planGithubCreation(options);
console.log(plan.shellCommand);

if (plan.willCreate) {
  await createGithubRepository(options);
}
```

## Issue Planning Helper

`src/issues.js` exports:

- `loadIssuePlan(planPath)`: reads a JSON issue plan.
- `planInitialIssues(options)`: renders issue titles, Markdown bodies, labels,
  and `gh issue create` command metadata.
- `renderIssue(issue, context)`: renders one issue using template variables.
- `buildIssueCreateArgs(issue, repo)`: returns argv suitable for `gh issue create`.
- `writeInitialIssuesFile(options)`: writes a Markdown issue handoff file into
  the generated repository.

The CLI currently writes a reviewable issue handoff file. A future integration
can call `gh issue create --body-file` for each rendered issue after maintainer
approval.

Example integration shape:

```js
import { planInitialIssues } from "./src/issues.js";

const issuePlan = await planInitialIssues({
  issuePlan: flags.issuePlan,
  dryRun: flags.dryRun,
  repo: `${config.githubOwner}/${config.githubRepo}`,
  context: {
    GITHUB_OWNER: config.githubOwner,
    GITHUB_REPO: config.githubRepo,
    DEFAULT_BRANCH: config.defaultBranch || "main",
    PRIMARY_VERIFICATION_COMMAND: config.primaryVerificationCommand || "npm test"
  }
});

if (issuePlan.enabled) {
  console.log(JSON.stringify(issuePlan.issues, null, 2));
}
```

## Execution Rules

- No network operations happen by default.
- Repository creation requires `--github` and a non-dry-run execution path.
- Issue planning requires `--issue-plan`; issue execution should be added as a
  separate explicit integration decision.
- `--public` and `--private` must not both be accepted.
- Keep generated issue bodies reviewable before passing them to `gh issue create`.
