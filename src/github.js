import { spawn } from "node:child_process";

import { RepoForgeError } from "./config.js";

export function buildGithubCreateArgs(options = {}) {
  const repo = buildRepoSlug(options);
  const visibility = normaliseVisibility(options);
  const args = ["repo", "create", repo, `--${visibility}`];

  if (options.description) {
    args.push("--description", String(options.description));
  }

  if (options.homepage) {
    args.push("--homepage", String(options.homepage));
  }

  if (options.source) {
    args.push("--source", String(options.source));
  }

  if (options.remote) {
    args.push("--remote", String(options.remote));
  }

  if (options.push === true) {
    args.push("--push");
  }

  if (options.disableIssues === true) {
    args.push("--disable-issues");
  }

  if (options.disableWiki === true) {
    args.push("--disable-wiki");
  }

  return args;
}

export function planGithubCreation(options = {}) {
  const explicitGithub = options.github === true;
  const dryRun = options.dryRun !== false;

  if (!explicitGithub) {
    return {
      enabled: false,
      dryRun,
      command: "gh",
      args: [],
      shellCommand: "",
      willCreate: false,
      reason: "GitHub creation is disabled until the github option is true."
    };
  }

  const args = buildGithubCreateArgs(options);

  return {
    enabled: true,
    dryRun,
    command: "gh",
    args,
    shellCommand: ["gh", ...args].map(shellQuote).join(" "),
    willCreate: !dryRun,
    reason: "GitHub creation was explicitly requested."
  };
}

export async function createGithubRepository(options = {}) {
  const plan = planGithubCreation(options);

  if (!plan.enabled || plan.dryRun) {
    return {
      ...plan,
      skipped: true,
      stdout: "",
      stderr: ""
    };
  }

  const result = await runGh(plan.args);

  return {
    ...plan,
    skipped: false,
    ...result
  };
}

function normaliseVisibility(options = {}) {
  if (options.public === true && options.private === true) {
    throw new RepoForgeError(
      "GITHUB_VISIBILITY_CONFLICT",
      "GitHub visibility cannot be both public and private."
    );
  }

  if (options.public === true) {
    return "public";
  }

  if (options.private === true) {
    return "private";
  }

  return "private";
}

function buildRepoSlug(options = {}) {
  const name = requireValue(options.name || options.repo, "Repository name");
  const owner = typeof options.owner === "string" ? options.owner.trim() : "";

  return owner ? `${owner}/${name}` : name;
}

function requireValue(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new RepoForgeError("GITHUB_REPO_REQUIRED", `${name} is required.`);
  }

  return value.trim();
}

function runGh(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("gh", args, {
      stdio: ["ignore", "pipe", "pipe"]
    });
    const stdout = [];
    const stderr = [];

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));

    child.on("error", (error) => {
      reject(
        new RepoForgeError("GH_NOT_AVAILABLE", "Could not start gh.", {
          cause: error.message
        })
      );
    });

    child.on("close", (code) => {
      const output = Buffer.concat(stdout).toString("utf8");
      const errorOutput = Buffer.concat(stderr).toString("utf8");

      if (code === 0) {
        resolve({ code, stdout: output, stderr: errorOutput });
        return;
      }

      reject(
        new RepoForgeError("GITHUB_CREATE_FAILED", "GitHub repository creation failed.", {
          exitCode: code,
          stdout: output,
          stderr: errorOutput
        })
      );
    });
  });
}

function shellQuote(value) {
  const text = String(value);

  if (/^[A-Za-z0-9_/:.=+@%-]+$/.test(text)) {
    return text;
  }

  return `'${text.replace(/'/g, "'\\''")}'`;
}
