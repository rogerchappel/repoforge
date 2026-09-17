# Template Variables

Template files use double-brace placeholders such as `{{PROJECT_NAME}}`. Replace
these values after creating a new repository, or keep them only in files that
remain reusable templates.

## Common Variables

| Placeholder | Replace with | Example value type |
| --- | --- | --- |
| `{{PROJECT_NAME}}` | Human-readable project name. | `my-project` or `My Project` |
| `{{PROJECT_DESCRIPTION}}` | One-sentence description of the repository purpose. | Product, library, or tool summary |
| `{{AUTHOR_NAME}}` | Person or organisation that owns the copyright or maintains the project. | Maintainer or company name |
| `{{GITHUB_OWNER}}` | GitHub user or organisation that owns the repository. | Repository namespace |
| `{{YEAR}}` | Copyright year for the generated repository. | Four-digit year |
| `{{LICENSE}}` | SPDX-style license identifier or license name used by the project. | `MIT`, `Apache-2.0`, or another chosen license |

## Additional Variables Used By Templates

| Placeholder | Replace with |
| --- | --- |
| `{{AUTHOR_EMAIL}}` | Public maintainer email, if the project publishes one. |
| `{{BRANCH_NAME}}` | Branch name for a review pack or task handoff. |
| `{{CLOUDFLARE_PROJECT_NAME}}` | Cloudflare project name, when Cloudflare deployment is used. |
| `{{CURRENT_MAJOR_VERSION}}` | Current supported major version for security policy examples. |
| `{{DEFAULT_BRANCH}}` | Default branch for the generated repository, usually `main`. |
| `{{DISCLOSURE_POLICY}}` | Coordinated disclosure policy text for security reports. |
| `{{DOCS_BUILD_COMMAND}}` | Command that builds the generated repository documentation site. |
| `{{DOCS_BUILD_OUTPUT_DIR}}` | Build output directory for the generated repository documentation site. |
| `{{DOCS_URL}}` | Public documentation URL. |
| `{{GITHUB_REPO}}` | GitHub repository name without the owner. |
| `{{HOMEPAGE_URL}}` | Public homepage or product URL. |
| `{{INSTALL_COMMAND}}` | Install command shown in generated documentation. |
| `{{IN_SCOPE_SECURITY_ITEM_1}}` | First in-scope security reporting area. |
| `{{IN_SCOPE_SECURITY_ITEM_2}}` | Second in-scope security reporting area. |
| `{{IN_SCOPE_SECURITY_ITEM_3}}` | Third in-scope security reporting area. |
| `{{LAST_RELEASE_TAG}}` | Previous release tag used in changelog comparison links. |
| `{{MAINTAINER_NAME}}` | Primary maintainer named in agent instructions. |
| `{{NODE_VERSION}}` | Node.js version used by the project. |
| `{{PACKAGE_DESCRIPTION}}` | One-sentence package description for package metadata and README files. |
| `{{PACKAGE_MANAGER}}` | Package manager used by the project. |
| `{{PACKAGE_NAME}}` | Package name used in package metadata or publish targets. |
| `{{PR_URL_OR_NUMBER}}` | Pull request URL or number for review packs. |
| `{{PRIMARY_VERIFICATION_COMMAND}}` | Main local verification command for agents and maintainers. |
| `{{REPOSITORY_SPECIFIC_AGENT_NOTES}}` | Extra instructions that only apply to the generated repository. |
| `{{REPOSITORY_URL}}` | Canonical repository URL. |
| `{{REPO_NAME}}` | Repository name for review packs. |
| `{{RESPONSE_EXPECTATIONS}}` | Expected response process for security reports. |
| `{{RUNTIME_REQUIREMENT}}` | Runtime prerequisite shown in generated documentation. |
| `{{TASK_SUMMARY}}` | Short task summary for review packs. |
| `{{USAGE_COMMAND}}` | Smallest useful command or example that shows how to use the generated repository. |
| `{{VULNERABILITY_REPORTING_INSTRUCTIONS}}` | Where and how to report vulnerabilities. |

## Replacement Check

After customising a generated repository, run:

```sh
rg '\{\{[A-Z0-9_]+\}\}'
```

Every match should either be replaced with a project-specific value or be in a
file that is intentionally still a reusable template.
