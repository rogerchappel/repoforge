#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const testFile = path.join(repoRoot, "test/acceptance/v1-generation.test.js");

const result = spawnSync(process.execPath, ["--test", testFile], {
  cwd: repoRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    CI: "1",
    NO_COLOR: "1",
  },
});

if (result.error) {
  throw result.error;
}

process.exit(result.status === null ? 1 : result.status);
