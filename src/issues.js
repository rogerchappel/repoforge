import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { RepoForgeError } from "./config.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DEFAULT_ISSUE_PLAN = path.join(
  repoRoot,
  "templates",
  "issues",
  "initial-issues.json"
);

export async function loadIssuePlan(planPath = DEFAULT_ISSUE_PLAN) {
  let raw;
  try {
    raw = await readFile(planPath, "utf8");
  } catch (error) {
    throw new RepoForgeError("ISSUE_PLAN_READ_FAILED", "Could not read issue plan.", {
      planPath,
      cause: error.message
    });
  }

  try {
    return validateIssuePlan(JSON.parse(raw), planPath);
  } catch (error) {
    if (error instanceof RepoForgeError) {
      throw error;
    }

    throw new RepoForgeError("ISSUE_PLAN_INVALID_JSON", "Issue plan must be valid JSON.", {
      planPath,
      cause: error.message
    });
  }
}

export function validateIssuePlan(plan, source = "issue plan") {
  if (!plan || typeof plan !== "object" || !Array.isArray(plan.issues)) {
    throw new RepoForgeError("ISSUE_PLAN_INVALID", `${source} must contain an issues array.`);
  }

  return {
    ...plan,
    issues: plan.issues.map((issue, index) => validateIssue(issue, index, source))
  };
}

export async function planInitialIssues(options = {}) {
  const dryRun = options.dryRun !== false;

  if (options.issuePlan !== true) {
    return {
      enabled: false,
      dryRun,
      source: options.planPath || DEFAULT_ISSUE_PLAN,
      count: 0,
      issues: [],
      commands: []
    };
  }

  const plan = options.plan
    ? validateIssuePlan(options.plan, "inline issue plan")
    : await loadIssuePlan(options.planPath);
  const context = options.context || {};
  const issues = plan.issues.map((issue) => renderIssue(issue, context));

  return {
    enabled: true,
    dryRun,
    source: options.planPath || DEFAULT_ISSUE_PLAN,
    count: issues.length,
    issues,
    commands: issues.map((issue) => buildIssueCreateCommand(issue, options.repo))
  };
}

export function renderIssue(issue, context = {}) {
  return {
    id: issue.id,
    title: replaceVariables(issue.title, context),
    labels: issue.labels,
    body: renderIssueBody(issue.body, issue.checklist, context)
  };
}

export function buildIssueCreateArgs(issue, repo) {
  const args = ["issue", "create", "--title", issue.title, "--body", issue.body];

  if (repo) {
    args.push("--repo", repo);
  }

  for (const label of issue.labels) {
    args.push("--label", label);
  }

  return args;
}

export function buildIssueCreateCommand(issue, repo) {
  const args = buildIssueCreateArgs(issue, repo);

  return {
    command: "gh",
    args,
    shellCommand: ["gh", ...args].map(shellQuote).join(" ")
  };
}

function validateIssue(issue, index, source) {
  if (!issue || typeof issue !== "object") {
    throw new RepoForgeError(
      "ISSUE_PLAN_INVALID",
      `${source} issue ${index + 1} must be an object.`
    );
  }

  if (typeof issue.title !== "string" || issue.title.trim() === "") {
    throw new RepoForgeError(
      "ISSUE_PLAN_INVALID",
      `${source} issue ${index + 1} requires a title.`
    );
  }

  return {
    id: issue.id || `issue-${index + 1}`,
    title: issue.title.trim(),
    labels: Array.isArray(issue.labels) ? issue.labels.map(String) : [],
    body: issue.body || {},
    checklist: Array.isArray(issue.checklist) ? issue.checklist.map(String) : []
  };
}

function renderIssueBody(body, checklist, context) {
  const sections = [];

  if (body.summary) {
    sections.push(["## Summary", replaceVariables(body.summary, context)].join("\n\n"));
  }

  if (Array.isArray(body.sections)) {
    for (const section of body.sections) {
      sections.push(renderSection(section, context));
    }
  }

  if (checklist.length > 0) {
    sections.push(
      [
        "## Checklist",
        checklist.map((item) => `- [ ] ${replaceVariables(item, context)}`).join("\n")
      ].join("\n\n")
    );
  }

  return `${sections.filter(Boolean).join("\n\n")}\n`;
}

function renderSection(section, context) {
  if (!section || typeof section !== "object") {
    return "";
  }

  const heading = section.heading ? `## ${section.heading}` : "";
  const text = section.text ? replaceVariables(section.text, context) : "";
  const items = Array.isArray(section.items)
    ? section.items.map((item) => `- ${replaceVariables(item, context)}`).join("\n")
    : "";

  return [heading, text, items].filter(Boolean).join("\n\n");
}

function replaceVariables(value, context) {
  return String(value).replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(context, key)) {
      return String(context[key]);
    }

    return match;
  });
}

function shellQuote(value) {
  const text = String(value);

  if (/^[A-Za-z0-9_/:.=+@%-]+$/.test(text)) {
    return text;
  }

  return `'${text.replace(/'/g, "'\\''")}'`;
}
