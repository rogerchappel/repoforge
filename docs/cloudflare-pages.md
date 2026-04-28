# Cloudflare Pages

This guide explains how repositories generated from this template can optionally deploy generated documentation sites with Cloudflare Pages.

Cloudflare Pages is not required for this template. Use it only when a generated repository wants hosted documentation and the maintainers have chosen Cloudflare as the hosting provider.

## When To Use This

Use Cloudflare Pages when a generated repository needs:

- a static documentation site built from a generated docs-site package
- preview deployments for pull requests
- deployment from a GitHub repository
- hosting without adding application infrastructure

Skip this guide when the project keeps documentation only in Markdown, uses another host, or does not need hosted docs.

## Suggested Project Layout

For a docs site copied from `templates/docs-site/`, use:

```text
docs-site/
  astro.config.mjs
  package.json
  src/
```

The docs site should remain optional. Do not make the root package, CI, or base template depend on it unless the generated repository explicitly adopts hosted docs.

## Cloudflare Pages Settings

In the Cloudflare dashboard, create a Pages project connected to the generated repository.

Recommended settings for an Astro/Starlight docs site:

- Framework preset: `Astro`
- Root directory: `docs-site`
- Build command: replace the docs build command placeholder
- Build output directory: replace the docs build output directory placeholder
- Production branch: the generated repository's default branch, usually `main`
- Preview deployments: enabled for pull requests when maintainers want public preview URLs

For the provided `templates/docs-site/` example, use:

- docs build command: `npm run build`
- docs build output directory: `dist`

If the generated docs site uses a package manager other than npm, update the build command to match the generated repository, for example `pnpm build`, `yarn build`, or `npm run docs:build`.

## Environment Variables

This repository does not require or store Cloudflare secrets.

Generated repositories usually do not need repository secrets for dashboard-managed Cloudflare Pages builds. If a repository deploys through GitHub Actions instead, store Cloudflare credentials only in that generated repository's GitHub Actions secrets or variables.

Common generated repository settings:

- `CLOUDFLARE_API_TOKEN`: GitHub Actions secret, scoped to Cloudflare Pages deployment
- `CLOUDFLARE_ACCOUNT_ID`: GitHub Actions variable or secret
- `CLOUDFLARE_PROJECT_NAME`: GitHub Actions variable

No real values for these settings belong in this template repository.

## What Not To Commit

Do not commit:

- Cloudflare API tokens or account credentials
- `.env`, `.env.local`, or exported dashboard environment files
- generated Cloudflare deployment output
- project-specific production domains unless the generated repository intentionally documents them
- copied workflow files before the generated repository has reviewed the branch, package-manager, and output-directory placeholders

## Optional GitHub Actions Deployment

The `templates/cloudflare-pages/` directory contains optional examples for generated repositories that prefer GitHub Actions or checked-in Pages configuration over dashboard-managed builds.

Use it only after the generated repository has:

- copied in an optional docs site
- created a Cloudflare Pages project
- configured required GitHub Actions secrets or variables in the generated repository
- replaced placeholders such as the Cloudflare project name
- reviewed the workflow for the repository's branch, package-manager, and output-directory conventions

Dashboard-managed Pages builds are simpler and should be the default recommendation for most small documentation sites.

## Verification

Before enabling Cloudflare Pages in a generated repository, confirm:

- the docs site builds locally
- the Cloudflare Pages project points at the docs-site root
- no Cloudflare credentials are committed
- Cloudflare is described as optional in project docs
- pull request previews are enabled only if the project wants them

## Rollback

To roll back Cloudflare Pages adoption in a generated repository:

1. Disable or delete the Cloudflare Pages project.
2. Remove any copied Cloudflare workflow from `.github/workflows/`.
3. Remove Cloudflare GitHub Actions secrets or variables if they are no longer used.
4. Keep the Markdown docs unless the project no longer needs them.
