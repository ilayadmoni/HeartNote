---
description: "Analyze and split a large Next.js TypeScript file into modular components, hooks, and utilities while preserving behavior, strict types, and App Router boundaries."
name: "Split Large File Safely"
argument-hint: "Target file path, optional line threshold, and extraction priority"
agent: "agent"
---

Refactor the target file into modular units with minimal behavioral risk.

Inputs:
- Target file: ${input:targetFile}
- Line threshold heuristic: ${input:threshold:150}
- Extraction priority: ${input:priority:components->hooks->utils}

Required workflow:
1. Analyze the file and summarize top-level exports, server/client boundary, and logical sections.
2. Propose a split plan with concrete destination files before editing.
3. Extract independent modules in this order unless context suggests otherwise:
   - utilities
   - hooks
   - UI components
4. Keep route entry files in place when the target is under client/src/app.
5. Preserve TypeScript strictness and existing behavior.
6. Update imports with @/ aliases when appropriate.
7. Run validation from client:
   - npm run type-check
   - npm run lint
8. Report:
   - created/updated files
   - any compatibility decisions
   - verification results

Use this instruction as guardrails during edits:
- [HeartNote UI Refactor Guidelines](../instructions/ui-refactor.instructions.md)

If the file should not be split (for example, cohesion is already high), explain why and propose a minimal alternative cleanup.
