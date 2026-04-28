import { constants } from "node:fs";
import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { RepoForgeError } from "./config.js";
import { applyTemplateVariables } from "./template.js";

export async function pathExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function assertDirectoryAvailable(targetDir) {
  if (!(await pathExists(targetDir))) {
    return;
  }

  const targetStat = await stat(targetDir);
  if (!targetStat.isDirectory()) {
    throw new RepoForgeError("TARGET_EXISTS", "Target path already exists and is not a directory.", {
      targetDir
    });
  }

  const entries = await readdir(targetDir);
  if (entries.length > 0) {
    throw new RepoForgeError("TARGET_NOT_EMPTY", "Target directory already exists and is not empty.", {
      targetDir
    });
  }
}

export async function copyDirectory(sourceDir, targetDir, { variables }) {
  const sourceStat = await stat(sourceDir).catch((error) => {
    throw new RepoForgeError("SCAFFOLD_READ_FAILED", "Could not read scaffold directory.", {
      scaffoldDir: sourceDir,
      cause: error.message
    });
  });

  if (!sourceStat.isDirectory()) {
    throw new RepoForgeError("SCAFFOLD_INVALID", "Scaffold path must be a directory.", {
      scaffoldDir: sourceDir
    });
  }

  await mkdir(targetDir, { recursive: true });
  await copyEntries(sourceDir, targetDir, variables);
}

async function copyEntries(sourceDir, targetDir, variables) {
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, applyTemplateVariables(entry.name, variables));

    if (entry.isDirectory()) {
      await mkdir(targetPath, { recursive: true });
      await copyEntries(sourcePath, targetPath, variables);
      continue;
    }

    if (entry.isFile()) {
      await copyFileWithTemplates(sourcePath, targetPath, variables);
      continue;
    }

    throw new RepoForgeError("UNSUPPORTED_SCAFFOLD_ENTRY", "Scaffold contains an unsupported entry.", {
      scaffoldEntry: sourcePath
    });
  }
}

async function copyFileWithTemplates(sourcePath, targetPath, variables) {
  const buffer = await readFile(sourcePath);

  await mkdir(path.dirname(targetPath), { recursive: true });

  if (isProbablyBinary(buffer)) {
    await writeFile(targetPath, buffer);
    return;
  }

  const rendered = applyTemplateVariables(buffer.toString("utf8"), variables);
  await writeFile(targetPath, rendered, "utf8");
}

function isProbablyBinary(buffer) {
  return buffer.includes(0);
}
