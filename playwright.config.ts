import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: `config/.env.${process.env.TEST_ENV || "staging"}` });
dotenv.config({ path: "config/.env" });

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "https://www.saucedemo.com",
    headless: process.env.HEADLESS !== "false",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/api/**",
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: "**/api/**",
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: "**/api/**",
    },
    {
      name: "api",
      testMatch: "**/api/**/*.spec.ts",
    },
  ],

  outputDir: "test-results/",

  globalSetup: undefined,
  globalTeardown: undefined,
});
