# Optional Docs Site Template

This directory contains an optional Astro/Starlight documentation site scaffold for generated repositories.

It is not required by the base template. Copy it into a generated repository only when that repository wants hosted or locally built documentation.

## What Is Included

- Astro and Starlight configuration.
- Starter overview, getting started, and contributing pages.
- Starlight's built-in not-found page, emitted as `dist/404.html`.
- Placeholder values that match `docs/template-variables.md`.
- Static build output suitable for any static host.

## Use

Recommended generated repository layout:

```text
docs-site/
  astro.config.mjs
  package-lock.json
  package.json
  src/
```

Copy this directory into the generated repository, then replace every
double-brace placeholder before publishing.

At minimum, update:

- `{{PROJECT_NAME}}`
- `{{PROJECT_DESCRIPTION}}`
- `{{REPOSITORY_URL}}`
- `{{DOCS_URL}}`
- `{{RUNTIME_REQUIREMENT}}`
- `{{PACKAGE_MANAGER}}`
- `{{INSTALL_COMMAND}}`
- `{{PRIMARY_VERIFICATION_COMMAND}}`

From the copied `docs-site/` directory, run:

```sh
npm ci
npm run dev
npm run build
```

`{{DOCS_URL}}` must be the absolute public URL where the documentation will be
served, including any path prefix (for example,
`https://example.com/project/`). Astro uses it to generate canonical URLs and
the sitemap. Use the final deployment URL before publishing the site.

The scaffold pins its direct Astro and Starlight versions and commits the npm
lockfile so clean installs resolve the reviewed dependency graph. Keep docs-site
dependency updates in their own reviewable changes. To update them, edit the
explicit versions in `package.json`, run `npm install` to refresh
`package-lock.json`, inspect both manifest and lockfile changes, then run
`npm ci` and `npm run build` from a clean copy before merging.

Starlight owns the `/404` route. Do not add a `404.mdx` content entry or a
`src/pages/404.astro` page alongside the integration; either would define a
second route and conflict with Starlight's built-in page.

## Deployment

The static build output is `dist/`.

Cloudflare Pages, Netlify, Vercel, GitHub Pages, or another static host can deploy this site. Cloudflare Pages guidance is available in `docs/cloudflare-pages.md`, but Cloudflare is optional.

## Remove If Unused

If the generated repository does not need hosted documentation, remove this
directory rather than leaving stale placeholder content.
