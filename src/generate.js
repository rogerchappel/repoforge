import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadConfig, mergeOptions, RepoForgeError } from "./config.js";
import { assertDirectoryAvailable, copyDirectory, pathExists } from "./fs.js";
import { initGitRepository } from "./git.js";
import { createGithubRepository } from "./github.js";
import { writeInitialIssuesFile } from "./issues.js";
import { buildTemplateVariables } from "./template.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_SCAFFOLD_DIR = path.join(repoRoot, "scaffold", "agentic-oss-template");

export { RepoForgeError };

export async function generateProject(options) {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const { config, configPath } = await loadConfig({
    cwd,
    configPath: options.configPath
  });
  const merged = mergeOptions(config, options);

  const projectName = validateProjectName(merged.projectName);
  const projectSlug = slugifyProjectName(projectName);
  const targetDir = resolveTargetDir(cwd, merged.targetDir, projectSlug);
  const scaffoldDir = path.resolve(cwd, merged.scaffoldDir ?? DEFAULT_SCAFFOLD_DIR);
  const dryRun = Boolean(merged.dryRun);
  const shouldInitGit = Boolean(merged.git) && !dryRun;
  const github = {
    enabled: Boolean(merged.github),
    public: Boolean(merged.public),
    private: Boolean(merged.private),
    dryRun
  };
  const issuePlan = {
    enabled: Boolean(merged.issuePlan)
  };
  const variables = buildTemplateVariables({
    ...merged,
    projectName,
    projectSlug
  });
  const actions = [];

  await assertSafeTargetPath(cwd, targetDir);
  await assertDirectoryAvailable(targetDir);
  actions.push(`create directory ${targetDir}`);
  actions.push(`copy scaffold ${scaffoldDir}`);
  actions.push("replace template variables");

  if (shouldInitGit) {
    actions.push("initialize git repository");
  }

  if (github.enabled) {
    actions.push("create GitHub repository with gh");
  }

  if (issuePlan.enabled) {
    actions.push("generate initial issue plan");
  }

  if (dryRun) {
    return {
      dryRun,
      projectName,
      projectSlug,
      targetDir,
      scaffoldDir,
      configPath,
      variables,
      gitInitialized: false,
      github,
      issuePlan,
      githubResult: null,
      issuePlanResult: null,
      actions
    };
  }

  if (!(await pathExists(scaffoldDir))) {
    throw new RepoForgeError("SCAFFOLD_NOT_FOUND", "Scaffold directory was not found.", {
      scaffoldDir
    });
  }

  await copyDirectory(scaffoldDir, targetDir, { variables });

  let gitInitialized = false;
  if (shouldInitGit) {
    gitInitialized = await initGitRepository(targetDir, variables.DEFAULT_BRANCH);
  }

  let githubResult = null;
  if (github.enabled) {
    githubResult = await createGithubRepository({
      github: true,
      dryRun: false,
      name: projectSlug,
      owner: variables.GITHUB_OWNER,
      description: variables.PROJECT_DESCRIPTION,
      public: github.public,
      private: github.private,
      source: targetDir,
      remote: "origin"
    });
  }

  let issuePlanResult = null;
  if (issuePlan.enabled) {
    issuePlanResult = await writeInitialIssuesFile({
      targetDir,
      repo: variables.GITHUB_OWNER ? `${variables.GITHUB_OWNER}/${projectSlug}` : projectSlug,
      context: variables
    });
  }

  return {
    dryRun,
    projectName,
    projectSlug,
    targetDir,
    scaffoldDir,
    configPath,
    variables,
    gitInitialized,
    github,
    issuePlan,
    githubResult,
    issuePlanResult,
    actions
  };
}

function validateProjectName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new RepoForgeError("INVALID_PROJECT_NAME", "Project name must be a non-empty string.");
  }

  const trimmed = name.trim();

  if (trimmed === "." || trimmed === ".." || trimmed.includes("/") || trimmed.includes("\\")) {
    throw new RepoForgeError("INVALID_PROJECT_NAME", "Project name must not be a path.", {
      projectName: name
    });
  }

  if (/[\u0000-\u001f\u007f]/u.test(trimmed)) {
    throw new RepoForgeError("INVALID_PROJECT_NAME", "Project name contains control characters.", {
      projectName: name
    });
  }

  return trimmed;
}

function slugifyProjectName(projectName) {
  const slug = projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  if (!slug || slug === "." || slug === "..") {
    throw new RepoForgeError("INVALID_PROJECT_NAME", "Project name cannot produce a safe slug.", {
      projectName
    });
  }

  return slug;
}

function resolveTargetDir(cwd, configuredTargetDir, projectSlug) {
  const target = configuredTargetDir
    ? path.resolve(cwd, configuredTargetDir)
    : path.join(cwd, projectSlug);

  return path.normalize(target);
}

async function assertSafeTargetPath(cwd, targetDir) {
  if (targetDir === cwd) {
    throw new RepoForgeError("UNSAFE_TARGET_DIR", "Target directory must not be the current directory.", {
      targetDir
    });
  }

  if (targetDir === path.parse(targetDir).root) {
    throw new RepoForgeError("UNSAFE_TARGET_DIR", "Target directory must not be the filesystem root.", {
      targetDir
    });
  }
}
