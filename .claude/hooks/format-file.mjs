// PostToolUse hook (Write|Edit): format the file Claude just wrote.
// .ts/.tsx → eslint --fix, then prettier; other supported files → prettier only.
// Never blocks: any failure is swallowed and the hook always exits 0.
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const BIN = path.join(ROOT, "node_modules/.bin");
const PRETTIER = /\.(tsx?|jsx?|mjs|cjs|json|css|md|mdx|ya?ml)$/;
const ESLINT = /\.tsx?$/;
const SKIP =
  /(^|\/)(node_modules|\.next|\.next-e2e|public|\.playwright-mcp|playwright-report|test-results|coverage)\//;

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const file = JSON.parse(input)?.tool_input?.file_path;
    if (!file) return;
    const rel = path.relative(ROOT, path.resolve(file));
    if (rel.startsWith("..") || SKIP.test(rel) || !PRETTIER.test(rel)) return;

    // The .bin scripts use `#!/usr/bin/env node`; put this hook's own node on PATH
    // since Claude Code may launch hooks without nvm loaded.
    const env = {
      ...process.env,
      PATH: `${path.dirname(process.execPath)}:${process.env.PATH ?? ""}`,
    };
    const run = (bin, args) => {
      try {
        execFileSync(path.join(BIN, bin), args, {
          cwd: ROOT,
          env,
          stdio: "ignore",
          timeout: 20_000,
        });
      } catch {
        // Unfixable lint errors or parse errors: leave them for `npm run check`.
      }
    };
    if (ESLINT.test(rel)) run("eslint", ["--fix", rel]);
    run("prettier", ["--write", "--log-level", "silent", rel]);
  } catch {
    // Malformed hook payload: nothing to do.
  }
});
