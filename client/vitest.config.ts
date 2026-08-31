import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // The React plugin is what enables JSX in .tsx test files and wires up the
  // React 17+ automatic runtime (so no `import React` is needed). The older
  // `esbuild.jsxInject` approach silently stopped working under Vitest 4's
  // rolldown pipeline, which failed every JSX test file at parse time.
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
