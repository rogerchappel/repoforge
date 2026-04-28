# repoforge

Status: work in progress.

`repoforge` is planned as a local-first CLI for deterministic OSS repository
generation, starting with
[`agentic-oss-template`](https://github.com/rogerchappel/agentic-oss-template)
as the default scaffold.

The intended V1 command is:

```sh
repoforge new <name>
```

## Planned V1

The current PRD scopes `repoforge` around deterministic repository generation:

- read `repoforge.config.json`
- copy `agentic-oss-template` as the default scaffold
- replace project variables
- initialize git
- optionally create a GitHub repository only when explicitly requested
- generate first issues from a setup checklist

## Current State

This repository currently contains the project scaffold, operating docs, and the
PRD. Product implementation has not started yet.

The source PRD is at [docs/PRD.md](docs/PRD.md).

## Verification Target

The planned V1 should be verifiable by generating a fixture repository into
`/tmp/repoforge-smoke`, confirming variables are replaced, and running the
project test suite.

## Development

Use small, reviewable commits and keep behavior local-first by default. Network
or GitHub actions must be explicit through flags and documented inputs.

For repository workflow rules, see [AGENTS.md](AGENTS.md).

## License

MIT.
