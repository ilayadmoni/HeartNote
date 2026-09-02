import { defineConfig, devices } from "@playwright/test";

/**
 * Visual + i18n verification matrix. Expects the dev server on :3000
 * (start it separately; `reuseExistingServer` avoids a second instance).
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/results",
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "./e2e/report" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    screenshot: "off",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  ],
});
