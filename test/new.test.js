import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createProject } from '../lib/new.js';

 test('creates a substituted local scaffold with git and setup issues without network', async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'repoforge-new-'));
  try {
    const project = await createProject('fixture-project', { cwd, year: 2026 });
    const readme = await readFile(path.join(project, 'README.md'), 'utf8');
    assert.match(readme, /Fixture Project/);
    assert.doesNotMatch(readme, /\{\{[A-Z0-9_]+\}\}/);
    const issues = await readFile(path.join(project, '.github/ISSUE_TEMPLATE/agent_task.md'), 'utf8');
    assert.match(issues, /Objective/);
    assert.equal((await readFile(path.join(project, '.git/HEAD'), 'utf8')).trim(), 'ref: refs/heads/master');
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test('rejects traversal and existing destinations', async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'repoforge-invalid-'));
  try {
    await assert.rejects(createProject('../escape', { cwd }), /Project name/);
    await createProject('occupied', { cwd });
    await assert.rejects(createProject('occupied', { cwd }), /EEXIST/);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
