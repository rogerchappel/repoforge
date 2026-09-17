# Dependency Policy

This template starts with Dependabot updates for GitHub Actions only.

## Baseline policy

- Dependabot checks workflow action versions weekly.
- Dependency pull requests should be small and reviewed like any other change.
- Avoid major dependency upgrades in the same commit as feature work.
- Do not add package-manager Dependabot entries until the generated repository has a real
  package manifest.

## Adding Node/npm updates later

After a generated repository adds `package.json`, extend `.github/dependabot.yml` with npm:

```yaml
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    commit-message:
      prefix: chore
```

Run the project's smallest relevant verification before merging dependency
updates. For Node projects, that usually means lint, tests, typecheck, and build
when those scripts exist.

## Optional docs-site scaffold

`templates/docs-site/` uses exact direct dependency versions and commits
`package-lock.json`. This makes the scaffold's clean install reproducible and
allows its smoke check and deployment example to use `npm ci`.

Update the docs-site graph deliberately:

1. Change the explicit Astro and Starlight versions in
   `templates/docs-site/package.json`.
2. Run `npm install` in `templates/docs-site/` to regenerate the lockfile.
3. Review the manifest and transitive lockfile diff together.
4. Run `npm ci` and `npm run build` in a clean copy, or run
   `bash scripts/validate-template.sh` from the repository root.

Do not replace supported versions with floating tags such as `latest`, and do
not merge a manifest update without its matching lockfile change.
