# Optional Cloudflare Pages Template

This directory contains optional Cloudflare Pages deployment examples for generated repositories with hosted documentation sites.

Cloudflare Pages is not required by the base template. Copy these files only when a generated repository has chosen Cloudflare for hosted documentation.

## Files

- `wrangler.toml.template`: optional Pages project configuration
- `deploy-docs-cloudflare-pages.yml`: optional GitHub Actions workflow for deploying a docs site

## Recommended Default

For most projects, use Cloudflare dashboard-managed Pages builds instead of GitHub Actions deployment. Dashboard-managed builds usually avoid repository workflow changes and do not require this template repository to store secrets.

Recommended dashboard placeholders for the provided `templates/docs-site/` package:

- Root directory: `docs-site`
- Build command: `{{DOCS_BUILD_COMMAND}}`, usually `npm run build`
- Build output directory: `{{DOCS_BUILD_OUTPUT_DIR}}`, usually `dist`
- Production branch: `{{DEFAULT_BRANCH}}`, usually `main`

## GitHub Actions Requirements

If a generated repository copies `deploy-docs-cloudflare-pages.yml`, configure these in that generated repository:

- `CLOUDFLARE_API_TOKEN` as a GitHub Actions secret
- `CLOUDFLARE_ACCOUNT_ID` as a GitHub Actions variable or secret
- `CLOUDFLARE_PROJECT_NAME` as a GitHub Actions variable

Also review and replace any project-specific placeholders before enabling deployment, including the docs working directory, build command, output directory, and production branch.

## What Not To Commit

Do not commit Cloudflare API tokens, account credentials, `.env` files, generated deployment output, or production-only configuration copied from the Cloudflare dashboard.
