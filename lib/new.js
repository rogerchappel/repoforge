import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'ignore' });
    child.once('error', reject);
    child.once('close', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
  });
}

export async function createProject(name, { cwd = process.cwd(), templateDir = path.join(root, 'templates'), year = new Date().getFullYear() } = {}) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || name === '.' || name === '..') {
    throw new Error('Project name must contain only letters, numbers, dots, underscores, and hyphens, and cannot be . or ..');
  }
  const destination = path.resolve(cwd, name);
  if (destination === path.resolve(cwd) || destination.startsWith(`${path.resolve(cwd)}${path.sep}`) === false) throw new Error('Project destination must be inside the current directory');
  await mkdir(destination, { recursive: false });
  try {
    for (const entry of await readdir(templateDir, { withFileTypes: true })) {
      if (entry.name === 'README.md') continue;
      if (entry.name === 'github') { await cp(path.join(templateDir, entry.name), path.join(destination, '.github'), { recursive: true }); continue; }
      if (entry.name === 'readme') { await mkdir(path.join(destination, 'readme'), { recursive: true }); continue; }
      await cp(path.join(templateDir, entry.name), path.join(destination, entry.name), { recursive: true, errorOnExist: true });
    }
    await cp(path.join(templateDir, 'readme', 'README.template.md'), path.join(destination, 'README.md'));
    const projectName = name.replace(/[-_.]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const values = { PROJECT_NAME: projectName, PROJECT_DESCRIPTION: `${projectName} project`, AUTHOR_NAME: 'Your Name', GITHUB_OWNER: 'your-github-name', YEAR: String(year), LICENSE: 'MIT', INSTALL_COMMAND: 'npm install', USAGE_COMMAND: 'npm test', PRIMARY_VERIFICATION_COMMAND: 'npm test' };
    async function visit(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) await visit(file);
        else {
          const content = await readFile(file, 'utf8');
          await writeFile(file, content.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => values[key] ?? match));
        }
      }
    }
    await visit(destination);
    await run('git', ['init', '--quiet'], destination);
    return destination;
  } catch (error) {
    // Keep the partially-created directory for inspection rather than deleting user data.
    throw new Error(`Could not finish creating ${destination}: ${error.message}`, { cause: error });
  }
}
