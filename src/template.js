const DEFAULTS = {
  PROJECT_DESCRIPTION: "Generated with RepoForge.",
  GITHUB_OWNER: "",
  LICENSE: "MIT",
  DEFAULT_BRANCH: "main"
};

export function buildTemplateVariables(options) {
  const year = options.year ?? new Date().getFullYear();
  const variables = {
    PROJECT_NAME: options.projectName,
    PROJECT_SLUG: options.projectSlug,
    GITHUB_REPO: options.projectSlug,
    PROJECT_DESCRIPTION: options.projectDescription ?? DEFAULTS.PROJECT_DESCRIPTION,
    GITHUB_OWNER: options.githubOwner ?? DEFAULTS.GITHUB_OWNER,
    LICENSE: options.license ?? DEFAULTS.LICENSE,
    YEAR: String(year),
    DEFAULT_BRANCH: options.defaultBranch ?? DEFAULTS.DEFAULT_BRANCH,
    ...stringifyVariables(options.variables ?? {})
  };

  return variables;
}

export function applyTemplateVariables(input, variables) {
  let output = input;

  for (const [key, value] of Object.entries(variables)) {
    output = output.replaceAll(`{{${key}}}`, String(value));
  }

  return output;
}

function stringifyVariables(variables) {
  return Object.fromEntries(
    Object.entries(variables).map(([key, value]) => [key, value == null ? "" : String(value)])
  );
}
