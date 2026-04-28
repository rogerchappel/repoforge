import { spawn } from "node:child_process";

import { RepoForgeError } from "./config.js";

export async function initGitRepository(targetDir, defaultBranch = "main") {
  await runGit(["init", "--initial-branch", defaultBranch], targetDir);
  return true;
}

function runGit(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"]
    });
    const stderr = [];

    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", (error) => {
      reject(
        new RepoForgeError("GIT_INIT_FAILED", "Could not start git.", {
          cause: error.message
        })
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new RepoForgeError("GIT_INIT_FAILED", "Git initialization failed.", {
          exitCode: code,
          cause: Buffer.concat(stderr).toString("utf8").trim()
        })
      );
    });
  });
}
