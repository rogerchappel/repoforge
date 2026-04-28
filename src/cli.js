import { generateProject, RepoForgeError } from "./generate.js";
import { planGithubCreation } from "./github.js";
import { planInitialIssues } from "./issues.js";

const HELP = `Usage:
  repoforge new <name> [--config <path>] [--target-dir <dir>] [--dry-run] [--no-git] [--github] [--public|--private] [--issue-plan]

Options:
  --config <path>      Read configuration from a JSON file.
  --target-dir <dir>   Directory where the project should be created.
  --dry-run            Print the planned actions without writing files.
  --no-git             Do not initialize a git repository.
  --github             Plan or run explicit GitHub repository creation.
  --public             Use public visibility when creating a GitHub repository.
  --private            Use private visibility when creating a GitHub repository.
  --issue-plan         Print the initial issue creation plan.
  -h, --help           Show this help message.
`;

export async function runCli(argv, io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const stderr = io.stderr ?? process.stderr;
  const cwd = io.cwd ?? process.cwd();

  try {
    const parsed = parseArgs(argv);

    if (parsed.help) {
      stdout.write(HELP);
      return 0;
    }

    if (parsed.command !== "new") {
      throw new RepoForgeError("INVALID_COMMAND", "Expected command: repoforge new <name>.", {
        command: parsed.command ?? null
      });
    }

    const result = await generateProject({
      cwd,
      projectName: parsed.name,
      configPath: parsed.configPath,
      targetDir: parsed.targetDir,
      dryRun: parsed.dryRun,
      git: parsed.git,
      github: parsed.github,
      public: parsed.public,
      private: parsed.private,
      issuePlan: parsed.issuePlan
    });

    stdout.write(await formatResult(result));
    return 0;
  } catch (error) {
    const structured = normalizeError(error);
    stderr.write(formatError(structured));
    return 1;
  }
}

export function parseArgs(argv) {
  const args = [...argv];

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    return { help: true };
  }

  const command = args.shift();
  const parsed = {
    command,
    name: undefined,
    configPath: undefined,
    targetDir: undefined,
    dryRun: undefined,
    git: undefined,
    github: undefined,
    public: undefined,
    private: undefined,
    issuePlan: undefined
  };

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (arg === "--no-git") {
      parsed.git = false;
      continue;
    }

    if (arg === "--github") {
      parsed.github = true;
      continue;
    }

    if (arg === "--public") {
      parsed.public = true;
      parsed.private = false;
      continue;
    }

    if (arg === "--private") {
      parsed.private = true;
      parsed.public = false;
      continue;
    }

    if (arg === "--issue-plan") {
      parsed.issuePlan = true;
      continue;
    }

    if (arg === "--config") {
      parsed.configPath = readOptionValue(arg, args);
      continue;
    }

    if (arg === "--target-dir") {
      parsed.targetDir = readOptionValue(arg, args);
      continue;
    }

    if (arg?.startsWith("--")) {
      throw new RepoForgeError("UNKNOWN_OPTION", `Unknown option: ${arg}.`, { option: arg });
    }

    if (parsed.name) {
      throw new RepoForgeError("UNEXPECTED_ARGUMENT", `Unexpected argument: ${arg}.`, {
        argument: arg
      });
    }

    parsed.name = arg;
  }

  if (parsed.command === "new" && !parsed.name) {
    throw new RepoForgeError("MISSING_PROJECT_NAME", "Project name is required.");
  }

  return parsed;
}

function readOptionValue(option, args) {
  const value = args.shift();

  if (!value || value.startsWith("--")) {
    throw new RepoForgeError("MISSING_OPTION_VALUE", `Missing value for ${option}.`, { option });
  }

  return value;
}

function normalizeError(error) {
  if (error instanceof RepoForgeError) {
    return error.toJSON();
  }

  return {
    code: "UNEXPECTED_ERROR",
    message: error instanceof Error ? error.message : String(error),
    details: {}
  };
}

async function formatResult(result) {
  const lines = [];

  lines.push(result.dryRun ? "Dry run complete. No files were written." : "Project created.");
  lines.push(`Project: ${result.projectName}`);
  lines.push(`Target: ${result.targetDir}`);
  lines.push(`Scaffold: ${result.scaffoldDir}`);
  lines.push(`Git: ${result.gitInitialized ? "initialized" : "skipped"}`);

  if (result.actions.length > 0) {
    lines.push("Actions:");
    for (const action of result.actions) {
      lines.push(`- ${action}`);
    }
  }

  const githubPlan = planGithubCreation({
    github: result.github.enabled,
    dryRun: result.dryRun || result.github.dryRun,
    name: result.projectSlug,
    owner: result.variables.GITHUB_OWNER,
    description: result.variables.PROJECT_DESCRIPTION,
    public: result.github.public,
    private: result.github.private,
    source: result.targetDir,
    remote: "origin"
  });

  if (githubPlan.enabled) {
    lines.push("GitHub:");
    lines.push(`- ${githubPlan.dryRun ? "planned" : "created"}: ${githubPlan.shellCommand}`);
  }

  const issuePlan = await planInitialIssues({
    issuePlan: result.issuePlan.enabled,
    dryRun: true,
    repo: result.variables.GITHUB_OWNER
      ? `${result.variables.GITHUB_OWNER}/${result.projectSlug}`
      : result.projectSlug,
    context: result.variables
  });

  if (issuePlan.enabled) {
    lines.push("Initial issues:");
    for (const issue of issuePlan.issues) {
      lines.push(`- ${issue.title}`);
    }
    if (result.issuePlanResult?.outputPath) {
      lines.push(`Issue plan file: ${result.issuePlanResult.outputPath}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function formatError(error) {
  const lines = [`repoforge error [${error.code}]: ${error.message}`];
  const detailEntries = Object.entries(error.details ?? {});

  if (detailEntries.length > 0) {
    lines.push("Details:");
    for (const [key, value] of detailEntries) {
      lines.push(`- ${key}: ${String(value)}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
