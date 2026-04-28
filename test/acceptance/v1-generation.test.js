import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const fixtureConfig = path.join(
  repoRoot,
  "fixtures/v1/config-merge/repoforge.config.json",
);
const fixtureScaffold = path.join(repoRoot, "fixtures/v1/scaffold");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function resolveCliCommand() {
  const packageJsonPath = path.join(repoRoot, "package.json");

  if (existsSync(packageJsonPath)) {
    const packageJson = readJson(packageJsonPath);
    const bin = typeof packageJson.bin === "string"
      ? packageJson.bin
      : packageJson.bin && (packageJson.bin.repoforge || Object.values(packageJson.bin)[0]);

    if (bin) {
      const binPath = path.join(repoRoot, bin);
      if (existsSync(binPath)) {
        return [process.execPath, binPath];
      }
    }
  }

  const candidateEntrypoints = [
    "src/cli.js",
    "src/index.js",
    "bin/repoforge.js",
    "scripts/repoforge.js",
    "repoforge.js",
  ];

  const entrypoint = candidateEntrypoints
    .map((candidate) => path.join(repoRoot, candidate))
    .find((candidate) => existsSync(candidate));

  assert.ok(
    entrypoint,
    `No repoforge CLI entrypoint found. Expected package.json bin or one of: ${candidateEntrypoints.join(", ")}`,
  );

  return [process.execPath, entrypoint];
}

function runRepoforge(args, options = {}) {
  const [command, ...baseArgs] = resolveCliCommand();
  const result = spawnSync(command, [...baseArgs, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    timeout: 15_000,
    env: {
      ...process.env,
      CI: "1",
      NO_COLOR: "1",
      GITHUB_TOKEN: "",
      GH_TOKEN: "",
      HTTP_PROXY: "http://127.0.0.1:9",
      HTTPS_PROXY: "http://127.0.0.1:9",
      NO_PROXY: "localhost,127.0.0.1,::1",
    },
    ...options,
  });

  return {
    ...result,
    combinedOutput: `${result.stdout || ""}${result.stderr || ""}`,
  };
}

function makeTempDir() {
  return mkdtempSync(path.join(tmpdir(), "repoforge-v1-"));
}

function writeRunConfig(tempRoot, overrides = {}) {
  const config = {
    ...readJson(fixtureConfig),
    scaffoldDir: fixtureScaffold,
    ...overrides,
  };
  const configPath = path.join(tempRoot, "repoforge.config.json");

  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  return configPath;
}

function listRelativeFiles(root) {
  if (!existsSync(root)) {
    return [];
  }

  const entries = [];
  const pending = [root];

  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of readdirSync(current)) {
      const absolute = path.join(current, entry);
      const relative = path.relative(root, absolute);

      if (statSync(absolute).isDirectory()) {
        pending.push(absolute);
      } else {
        entries.push(relative);
      }
    }
  }

  return entries.sort();
}

test("config parsing fixture documents mergeable V1 inputs", () => {
  const config = readJson(fixtureConfig);

  assert.equal(config.projectDescription, "Description from config fixture");
  assert.equal(config.githubOwner, "config-fixture-owner");
  assert.equal(config.license, "MIT");
  assert.equal(config.git, false);
  assert.equal(config.variables.AUTHOR_NAME, "Config Fixture Author");
  assert.equal(config.variables.USAGE_COMMAND, "node index.js");
});

test("generates a V1 repository into a temporary directory and replaces README variables", () => {
  const tempRoot = makeTempDir();
  const outputDir = path.join(tempRoot, "fixture-v1-app");
  const configPath = writeRunConfig(tempRoot, {
    projectDescription: "Description from generated config",
    variables: {
      ...readJson(fixtureConfig).variables,
      INSTALL_COMMAND: "pnpm install",
      PRIMARY_VERIFICATION_COMMAND: "pnpm test",
    },
  });

  const result = runRepoforge([
    "new",
    "fixture-v1-app",
    "--config",
    configPath,
    "--target-dir",
    outputDir,
  ], { cwd: tempRoot });

  assert.equal(result.status, 0, result.combinedOutput);
  assert.ok(existsSync(outputDir), "expected output directory to be created");

  const readme = readFileSync(path.join(outputDir, "README.md"), "utf8");
  assert.match(readme, /^# fixture-v1-app/m);
  assert.match(readme, /Description from generated config/);
  assert.match(readme, /pnpm install/);
  assert.match(readme, /node index\.js/);
  assert.match(readme, /pnpm test/);
  assert.match(readme, /Config Fixture Author/);
  assert.doesNotMatch(readme, /\{\{[A-Z0-9_]+\}\}/);
});

test("refuses to generate into an existing non-empty directory", () => {
  const tempRoot = makeTempDir();
  const outputDir = path.join(tempRoot, "fixture-v1-app");
  const configPath = writeRunConfig(tempRoot);
  mkdirSync(outputDir);
  writeFileSync(path.join(outputDir, "existing.txt"), "keep me\n");

  const result = runRepoforge([
    "new",
    "fixture-v1-app",
    "--config",
    configPath,
    "--target-dir",
    outputDir,
  ], { cwd: tempRoot });

  assert.notEqual(result.status, 0, "expected non-zero exit for non-empty output directory");
  assert.match(result.combinedOutput, /non-empty|not empty|already exists/i);
  assert.equal(readFileSync(path.join(outputDir, "existing.txt"), "utf8"), "keep me\n");
});

test("--dry-run reports planned generation without writing output", () => {
  const tempRoot = makeTempDir();
  const outputDir = path.join(tempRoot, "fixture-v1-app");
  const configPath = writeRunConfig(tempRoot);

  const result = runRepoforge([
    "new",
    "fixture-v1-app",
    "--config",
    configPath,
    "--target-dir",
    outputDir,
    "--dry-run",
  ], { cwd: tempRoot });

  assert.equal(result.status, 0, result.combinedOutput);
  assert.match(result.combinedOutput, /dry run|would create|planned/i);
  assert.deepEqual(listRelativeFiles(tempRoot), ["repoforge.config.json"]);
});

test("--issue-plan writes an initial issue handoff file", () => {
  const tempRoot = makeTempDir();
  const outputDir = path.join(tempRoot, "fixture-v1-app");
  const configPath = writeRunConfig(tempRoot);

  const result = runRepoforge([
    "new",
    "fixture-v1-app",
    "--config",
    configPath,
    "--target-dir",
    outputDir,
    "--issue-plan",
  ], { cwd: tempRoot });

  assert.equal(result.status, 0, result.combinedOutput);

  const issuePlanPath = path.join(outputDir, ".github", "repoforge-initial-issues.md");
  const issuePlan = readFileSync(issuePlanPath, "utf8");

  assert.match(issuePlan, /# Initial Issue Plan/);
  assert.match(issuePlan, /task: verify generated scaffold/);
  assert.match(issuePlan, /gh issue create/);
  assert.doesNotMatch(issuePlan, /\{\{GITHUB_REPO\}\}/);
});
