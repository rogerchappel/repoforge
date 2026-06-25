# repoforge

Status: work in progress.

`repoforge` is planned as a local-first CLI for creating agent-friendly open
source repositories with the boring setup already done.

The intended V1 command is:

```sh
repoforge new <name>
```

## Usage Today

The generator CLI is not implemented yet. Until it is, use the repository as a
planning and scaffold-design workspace:

```sh
git clone https://github.com/rogerchappel/repoforge.git
cd repoforge
sed -n '1,220p' docs/PRD.md
sed -n '1,220p' docs/TASKS.md
```

When implementation starts, the first useful local smoke should create a
throwaway repository under `/tmp/repoforge-smoke` and verify that scaffold
variables, git initialization, and generated setup issues are deterministic.

## Planned V1

The current PRD scopes `repoforge` around deterministic repository generation:

- read `repoforge.config.json`
- copy the bundled repository scaffold
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

## Limitations

- The CLI command is documented as intended behavior, not current behavior.
- The repository should not be used to create production project scaffolds until
  implementation and fixture-backed smoke tests exist.
- GitHub repository creation must remain opt-in and documented before any
  network side effect is added.

## Development

Use small, reviewable commits and keep behavior local-first by default. Network
or GitHub actions must be explicit through flags and documented inputs.

For repository workflow rules, see [AGENTS.md](AGENTS.md).

## License

MIT.
