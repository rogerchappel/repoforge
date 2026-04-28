# Optional Docs Site Template

This directory contains an optional Astro/Starlight documentation site scaffold for generated repositories.

It is not required by the base template. Copy it into a generated repository only when that repository wants hosted or locally built documentation.

## What Is Included

- Astro and Starlight configuration.
- Starter overview, getting started, and contributing pages.
- Placeholder values that match `docs/template-variables.md`.
- Static build output suitable for any static host.

## Use

Recommended generated repository layout:

```text
docs-site/
  astro.config.mjs
  package.json
  src/
```

Copy this directory into the generated repository, then replace every
double-brace placeholder before publishing.

At minimum, update:

- `{{PROJECT_NAME}}`
- `{{PROJECT_DESCRIPTION}}`
- `{{REPOSITORY_URL}}`
- `{{RUNTIME_REQUIREMENT}}`
- `{{PACKAGE_MANAGER}}`
- `{{INSTALL_COMMAND}}`
- `{{PRIMARY_VERIFICATION_COMMAND}}`

From the copied `docs-site/` directory, run:

```sh
npm install
npm run dev
npm run build
```

Keep docs-site dependency updates in their own reviewable changes.

## Deployment

The static build output is `dist/`.

Cloudflare Pages, Netlify, Vercel, GitHub Pages, or another static host can deploy this site. Cloudflare Pages guidance is available in `docs/cloudflare-pages.md`, but Cloudflare is optional.

## Remove If Unused

If the generated repository does not need hosted documentation, remove this
directory rather than leaving stale placeholder content.
