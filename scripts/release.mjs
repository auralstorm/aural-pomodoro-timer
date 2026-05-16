import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const version = process.argv[2];

if (!version) {
  console.error("Usage: pnpm release <version>");
  console.error("Example: pnpm release 0.2.0");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error(`Invalid version format: "${version}"`);
  console.error("Expected semver like 1.0.0 or 1.0.0-beta.1");
  process.exit(1);
}

const tag = `v${version}`;

const run = (cmd) => {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd: root, stdio: "inherit" });
};

// --- 1. Update package.json ---
const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
pkg.version = version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`  updated package.json → ${version}`);

// --- 2. Update src-tauri/tauri.conf.json ---
const tauriConfPath = resolve(root, "src-tauri/tauri.conf.json");
const tauriConf = JSON.parse(readFileSync(tauriConfPath, "utf-8"));
tauriConf.version = version;
writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + "\n");
console.log(`  updated tauri.conf.json → ${version}`);

// --- 3. Update src-tauri/Cargo.toml ---
const cargoPath = resolve(root, "src-tauri/Cargo.toml");
let cargo = readFileSync(cargoPath, "utf-8");
cargo = cargo.replace(
  /^(version\s*=\s*)"[^"]*"/m,
  `$1"${version}"`,
);
writeFileSync(cargoPath, cargo);
console.log(`  updated Cargo.toml → ${version}`);

// --- 4. Git commit + tag + push ---
console.log("\nCommitting and tagging...\n");
run(`git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml`);
run(`git commit -m "release: ${tag}"`);
run(`git tag ${tag}`);

console.log("\nPushing to remote...\n");
run(`git push`);
run(`git push origin ${tag}`);

// --- 5. Done ---
const remote = execSync("git remote get-url origin", { cwd: root, encoding: "utf-8" }).trim();
const repoUrl = remote.replace(/\.git$/, "").replace(/^git@github\.com:/, "https://github.com/");
console.log(`\n  Release ${tag} pushed successfully!`);
console.log(`  GitHub Actions will build and publish the release.`);
console.log(`  Track progress: ${repoUrl}/actions`);
console.log(`  Release page:   ${repoUrl}/releases/tag/${tag}\n`);
