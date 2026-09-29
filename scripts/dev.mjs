import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

const targets = [
  { name: "api", workspace: "@stellan/api", color: "[36m" },
  { name: "web", workspace: "@stellan/web", color: "[35m" },
];

const reset = "[0m";
const children = [];
let shuttingDown = false;

const prefix = (target, chunk) =>
  String(chunk)
    .split(/\r?\n/)
    .filter((line, index, all) => line.length > 0 || index < all.length - 1)
    .map((line) => `${target.color}[${target.name}]${reset} ${line}`)
    .join("\n");

const start = (target) => {
  const child = spawn(`npm run dev --workspace ${target.workspace}`, {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`${prefix(target, chunk)}\n`));
  child.stderr.on("data", (chunk) => process.stderr.write(`${prefix(target, chunk)}\n`));

  child.on("exit", (code) => {
    if (shuttingDown) return;
    console.error(`${target.color}[${target.name}]${reset} exited with code ${code}. Shutting down.`);
    shutdown(code === 0 ? 1 : (code ?? 1));
  });

  children.push(child);
  return child;
};

const shutdown = (code) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = code;
  setTimeout(() => process.exit(code), 1500).unref();
};

if (!existsSync(join(root, "node_modules"))) {
  console.error("Dependencies are missing. Run npm install first.");
  process.exit(1);
}

console.log("Starting API and web together. The contact form needs both.");
console.log("");

for (const target of targets) start(target);

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
