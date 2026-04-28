import { access, readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONFIG_FILE = "repoforge.config.json";

export class RepoForgeError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "RepoForgeError";
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

export async function loadConfig({ cwd, configPath }) {
  const resolvedPath = configPath
    ? path.resolve(cwd, configPath)
    : path.join(cwd, DEFAULT_CONFIG_FILE);

  const exists = await fileExists(resolvedPath);

  if (!exists) {
    if (configPath) {
      throw new RepoForgeError("CONFIG_NOT_FOUND", "Config file was not found.", {
        configPath: resolvedPath
      });
    }

    return { config: {}, configPath: null };
  }

  let raw;
  try {
    raw = await readFile(resolvedPath, "utf8");
  } catch (error) {
    throw new RepoForgeError("CONFIG_READ_FAILED", "Could not read config file.", {
      configPath: resolvedPath,
      cause: error.message
    });
  }

  try {
    return { config: JSON.parse(raw), configPath: resolvedPath };
  } catch (error) {
    throw new RepoForgeError("CONFIG_INVALID_JSON", "Config file must be valid JSON.", {
      configPath: resolvedPath,
      cause: error.message
    });
  }
}

export function mergeOptions(config, cliOptions) {
  const variables = {
    ...(isObject(config.variables) ? config.variables : {})
  };

  return {
    projectName: cliOptions.projectName ?? config.projectName ?? config.name,
    projectDescription: config.projectDescription ?? config.description,
    githubOwner: config.githubOwner ?? config.owner,
    license: config.license,
    year: config.year,
    defaultBranch: config.defaultBranch,
    targetDir: cliOptions.targetDir ?? config.targetDir,
    scaffoldDir: config.scaffoldDir,
    dryRun: cliOptions.dryRun ?? Boolean(config.dryRun),
    git: cliOptions.git ?? config.git ?? true,
    variables
  };
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
