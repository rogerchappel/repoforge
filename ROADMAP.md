# Roadmap

This roadmap describes likely direction, not a binding delivery promise. Items
may change as maintainers learn from users, contributors, and implementation
constraints.

## Now

- Keep the template useful for small open-source projects that need clear
  repository hygiene from day one.
- Maintain lightweight docs and templates that help generated repositories work well
  with human maintainers and coding agents.
- Keep setup requirements minimal and avoid assuming one runtime, package
  manager, or publishing target.
- Keep validation checks aligned with the files this template actually ships.

## Next

- Tighten template validation where it can catch stale placeholders, missing
  docs, or broken Markdown without becoming a full generator.
- Expand examples only when a generated repository pattern is reusable.
- Refine optional publishing guidance for common project shapes without making
  any one ecosystem mandatory.

## Later

- Consider a small generator or checklist-driven setup flow if manual template
  customisation becomes repetitive.
- Consider richer docs-site and package scaffolds once the core repository
  discipline remains stable.
- Consider GitHub label or issue seeding automation if repeated setup work
  justifies it.

## Not Planned

- A full application implementation inside this template.
- Mandatory npm publishing, Cloudflare deployment, or language-specific project
  structure.
- Project-specific release dates before a generated repository has its own
  release plan.

## Roadmap Review

Review this roadmap before major releases and after meaningful contributor
feedback. Move completed work into `CHANGELOG.md` and remove items that no
longer match the project direction.
