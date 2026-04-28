# repoforge

Status: V1 implementation in progress and publish-ready checks are wired.

`repoforge` is a local-first CLI for deterministic OSS repository generation,
starting with
[`agentic-oss-template`](https://github.com/rogerchappel/agentic-oss-template)
as the default scaffold.

## Usage

```sh
npx repoforge new <name>
```

Useful options:

- `--config <path>` reads `repoforge.config.json` from a specific path.
- `--target-dir <dir>` writes the generated repository to a specific directory.
- `--dry-run` prints planned actions without writing files or calling GitHub.
- `--no-git` skips local git initialization.
- `--github --public` or `--github --private` explicitly creates a GitHub repo with `gh`.
- `--issue-plan` writes `.github/repoforge-initial-issues.md` into the generated repo.

## V1 Scope

The current PRD scopes `repoforge` around deterministic repository generation:

- read `repoforge.config.json`
- copy `agentic-oss-template` as the default scaffold
- replace project variables
- initialize git
- optionally create a GitHub repository only when explicitly requested
- generate first issues from a setup checklist

## Publishing Status

The repo is being prepared for npm and Homebrew publishing, but publish steps are
not run automatically. CI validates the CLI, scaffold, smoke generation, and
`npm pack --dry-run`.

The source PRD is at [docs/PRD.md](docs/PRD.md).

## Verification

```sh
npm run validate
npm test
npm run smoke
npm run pack:dry-run
```

## Development

Use small, reviewable commits and keep behavior local-first by default. Network
or GitHub actions must be explicit through flags and documented inputs.

For repository workflow rules, see [AGENTS.md](AGENTS.md).

## License

MIT.
