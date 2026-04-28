# Security Policy Customization

This template includes a generic `SECURITY.md` so generated repositories start with a safe vulnerability reporting posture.

Before publishing a generated repository, customize the policy for that repository's actual maintenance model, risk profile, and support commitments.

## What to Customize

Update these sections in `SECURITY.md`:

- Supported versions or release lines.
- The private vulnerability reporting path.
- Scope of what is considered a project vulnerability.
- Expected response process.
- Disclosure and advisory process, if applicable.
- Maintainer responsibilities.

## Reporting Path

Do not invent private contact details.

Use one of these options:

- Enable GitHub private vulnerability reporting and direct reporters to the repository's **Security** tab.
- Use an existing, monitored security contact that the project owner has approved.
- If no private channel exists yet, instruct reporters to ask maintainers for a private reporting path without posting sensitive details publicly.

Avoid publishing personal email addresses, client contacts, or private company addresses unless they are intentionally approved for this project.

## Response Expectations

Be honest about maintainer capacity.

Do not imply:

- Paid support.
- Guaranteed fixes.
- Guaranteed response times.
- Production service-level agreements.
- Support for versions the project does not maintain.

If a project needs stronger commitments, define them explicitly and make sure the maintainers can meet them.

## Supported Versions

For libraries, CLIs, and apps with releases, list supported versions clearly.

Example:

```md
| Version | Supported |
| --- | --- |
| 2.x | Yes |
| 1.x | Security fixes only |
| < 1.0 | No |
```

For early-stage projects without releases, state that no versioned releases are supported yet.

## Disclosure Process

For serious projects, define:

- How reports are triaged.
- How maintainers communicate with reporters.
- When patches, advisories, or CVEs may be published.
- Whether coordinated disclosure is requested.
- How users should upgrade or mitigate.

Keep this process realistic. A simple open-source project can start with a small policy and expand it when adoption or risk increases.

## Template Checklist

Before publishing a generated repository:

- Confirm `SECURITY.md` has no placeholder owner names or invented contact details.
- Confirm the reporting path exists and is monitored.
- Confirm the policy does not promise paid support or guaranteed SLAs.
- Confirm supported versions match the actual release process.
- Confirm issue templates tell reporters not to post sensitive vulnerability details publicly.
