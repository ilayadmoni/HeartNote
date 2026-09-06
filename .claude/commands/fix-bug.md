Read CLAUDE.md before writing any code.

Then fix the bug described in: $ARGUMENTS

Steps:
1. Read the relevant files — understand the code before touching it
2. Identify the root cause (write it out before making any change)
3. Fix only what is broken — do not refactor unrelated code, add comments, or clean up surrounding logic
4. Report:
   - Root cause: what exactly was wrong and why
   - What was changed: file paths and a brief description of each change
   - How to test: the minimal steps to verify the fix works

## Git Rules
- ALWAYS work on the `dev` branch only
- Before starting any task, verify you are on `dev`:
  git checkout dev
  git pull origin dev
- Commit after each logical change with a clear message:
  feat: <description>
  fix: <description>
  chore: <description>
- Push to origin dev when done:
  git push origin dev
- NEVER commit to `main` directly
- NEVER open a PR — the user handles all merges to main
