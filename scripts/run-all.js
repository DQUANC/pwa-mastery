#!/usr/bin/env node

/**
 * run-all.js
 *
 * Runs a given npm script in every project under projects/ that defines it.
 * Projects that don't have the script yet are silently skipped — this lets
 * new projects be scaffolded without breaking CI until they add their own
 * scripts.
 *
 * Usage (called from root package.json scripts):
 *   node scripts/run-all.js test
 *   node scripts/run-all.js lint
 *   node scripts/run-all.js typecheck
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scriptName = process.argv[2];

if (!scriptName) {
  console.error('Usage: node scripts/run-all.js <script-name>');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const projectsDir = path.join(repoRoot, 'projects');

if (!fs.existsSync(projectsDir)) {
  console.log(`No projects/ directory found — nothing to run for "${scriptName}".`);
  process.exit(0);
}

const projectFolders = fs
  .readdirSync(projectsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (projectFolders.length === 0) {
  console.log(`No sub-projects found under projects/ — nothing to run for "${scriptName}".`);
  process.exit(0);
}

let anyRan = false;
let anyFailed = false;

for (const folder of projectFolders) {
  const projectPath = path.join(projectsDir, folder);
  const pkgPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    continue;
  }

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch {
    console.warn(`  [${folder}] Could not parse package.json — skipping.`);
    continue;
  }

  if (!pkg.scripts || !pkg.scripts[scriptName]) {
    console.log(`  [${folder}] No "${scriptName}" script defined — skipping.`);
    continue;
  }

  console.log(`\n--- Running "${scriptName}" in projects/${folder} ---`);
  anyRan = true;

  // Install sub-project dependencies before running the script.
  // Use `npm ci` when a lockfile is present (reproducible CI installs),
  // otherwise fall back to `npm install`.
  const hasLockfile = fs.existsSync(path.join(projectPath, 'package-lock.json'));
  const installCmd = hasLockfile ? 'npm ci' : 'npm install';

  try {
    console.log(`  [${folder}] Installing dependencies (${installCmd})...`);
    execSync(installCmd, { cwd: projectPath, stdio: 'inherit' });
  } catch {
    console.error(`  [${folder}] Dependency install FAILED — skipping "${scriptName}".`);
    anyFailed = true;
    continue;
  }

  try {
    execSync(`npm run ${scriptName}`, {
      cwd: projectPath,
      stdio: 'inherit',
    });
    console.log(`  [${folder}] "${scriptName}" passed.`);
  } catch {
    console.error(`  [${folder}] "${scriptName}" FAILED.`);
    anyFailed = true;
  }
}

if (!anyRan) {
  console.log(`\nNo projects defined a "${scriptName}" script. Nothing ran.`);
}

if (anyFailed) {
  process.exit(1);
}
