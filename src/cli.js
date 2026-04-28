import { generateProject, RepoForgeError } from "./generate.js";

const HELP = `Usage:
  repoforge new <name> [--config <path>] [--target-dir <dir>] [--dry-run] [--no-git]

Options:
  --config <path>      Read configuration from a JSON file.
  --target-dir <dir>   Directory where the project should be created.
  --dry-run            Print the planned actions without writing files.
  --no-git             Do not initialize a git repository.
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
      git: parsed.git
    });

    stdout.write(formatResult(result));
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
    git: undefined
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

function formatResult(result) {
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
