#!/usr/bin/env node
import { createProject } from '../lib/new.js';

const [command, name, ...extra] = process.argv.slice(2);
if (command !== 'new' || !name || extra.length) {
  console.error('Usage: repoforge new <name>');
  process.exitCode = 2;
} else {
  try {
    console.log(`Created ${await createProject(name)}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
