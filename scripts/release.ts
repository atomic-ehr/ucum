#!/usr/bin/env bun

import { $ } from "bun";
import { readFileSync, writeFileSync } from "fs";

const args = process.argv.slice(2);
const versionType = args[0] || "patch"; // patch, minor, major

if (!["patch", "minor", "major"].includes(versionType)) {
  console.error("Usage: bun run scripts/release.ts [patch|minor|major]");
  process.exit(1);
}

async function release() {
  try {
    // Ensure we're on main branch
    const branch = await $`git branch --show-current`.text();
    if (branch.trim() !== "main") {
      console.error("❌ Must be on main branch to release");
      process.exit(1);
    }

    // Ensure working directory is clean
    const status = await $`git status --porcelain`.text();
    if (status.trim()) {
      console.error("❌ Working directory must be clean");
      process.exit(1);
    }

    // Run tests
    console.log("🧪 Running tests...");
    await $`bun test`;

    // Run typecheck
    console.log("🔍 Type checking...");
    await $`bun run typecheck`;

    // Update version
    console.log(`📦 Bumping ${versionType} version...`);
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    const [major, minor, patch] = pkg.version.split(".").map(Number);
    
    let newVersion;
    switch (versionType) {
      case "major":
        newVersion = `${major + 1}.0.0`;
        break;
      case "minor":
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case "patch":
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    pkg.version = newVersion;
    writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

    // Check if version already exists on npm
    try {
      const publishedVersion = await $`npm view ${pkg.name}@${newVersion} version`.text();
      if (publishedVersion.trim() === newVersion) {
        console.error(`❌ Version ${newVersion} is already published to npm`);
        // Revert package.json
        await $`git checkout package.json`;
        process.exit(1);
      }
    } catch (error) {
      // Version doesn't exist, which is what we want
    }

    // Commit version bump
    await $`git add package.json`;
    await $`git commit -m "chore: release v${newVersion}"`;
    await $`git tag v${newVersion}`;

    // Build
    console.log("🏗️  Building...");
    await $`bun run build`;
    await $`bun run build:types`;

    // Publish (skip prepublishOnly since we already built)
    console.log("🚀 Publishing to npm...");
    await $`npm publish --access public --ignore-scripts`;

    // Push to git
    console.log("📤 Pushing to git...");
    await $`git push`;
    await $`git push --tags`;

    console.log(`✅ Successfully released v${newVersion}`);
    console.log(`\n📝 Note: GitHub Actions will also attempt to publish when the tag is pushed.`);
    console.log(`   Make sure NPM_TOKEN is set in your GitHub repository secrets.`);
  } catch (error) {
    console.error("❌ Release failed:", error);
    process.exit(1);
  }
}

release();