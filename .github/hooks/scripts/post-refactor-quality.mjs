#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const readStdin = async () => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

const emit = (obj) => {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
};

const run = (cmd, args, cwd) => {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
};

const main = async () => {
  const raw = (await readStdin()) || "";
  const text = raw.toLowerCase();

  // Heuristic trigger: run checks after tool calls that look like refactor/split/extract
  // activity touching client/src or explicitly referencing modular refactor skills.
  const looksLikeRefactor =
    /refactor|split|extract|modular|nextjs-modular-file-split/.test(text);
  const touchesUiCode = /client[\\\/]src[\\\/](app|components)[\\/]/.test(text);
  const likelyWriteTool = /apply_patch|create_file|vscode_renameSymbol|insert|str_replace|rename/.test(text);

  if (!(looksLikeRefactor && touchesUiCode && likelyWriteTool)) {
    emit({ continue: true });
    return;
  }

  const workspaceRoot = process.cwd();
  const clientDir = path.join(workspaceRoot, "client");

  if (!fs.existsSync(clientDir)) {
    emit({
      continue: true,
      systemMessage: "post-refactor-quality hook skipped: client directory not found.",
    });
    return;
  }

  const typeCheckCode = run("npm", ["run", "type-check"], clientDir);
  if (typeCheckCode !== 0) {
    emit({
      continue: false,
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        decision: "block",
        reason: "Type-check failed after refactor operation.",
      },
      systemMessage: "Type-check failed after refactor operation. Fix errors before continuing.",
    });
    process.exit(2);
  }

  const lintCode = run("npm", ["run", "lint"], clientDir);
  if (lintCode !== 0) {
    emit({
      continue: false,
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        decision: "block",
        reason: "Lint failed after refactor operation.",
      },
      systemMessage: "Lint failed after refactor operation. Fix lint issues before continuing.",
    });
    process.exit(2);
  }

  emit({
    continue: true,
    systemMessage: "Post-refactor quality checks passed (type-check + lint).",
  });
};

main().catch((error) => {
  emit({
    continue: true,
    systemMessage: `post-refactor-quality hook warning: ${String(error)}`,
  });
  process.exit(0);
});
