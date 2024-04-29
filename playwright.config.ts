import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

export const STORAGE_STATE = "./auth/session.json";

const neetoPlaywrightReporterConfig = {
  ciBuildId: new Date().toUTCString(),
  apiKey: "vsdQxxAg9DuBmGguegoLDPo17J52hDd9GqmwNxFX3vutyP4Y",
  projectKey: "348r5mcZp2UTDFK5njVZuihT",
  baseURL: "https://connect.neetoplaydash.net",
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // ["@bigbinary/neeto-playwright-reporter", neetoPlaywrightReporterConfig],
    ["html"],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout:100_000,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://akash-parida-iiit-bh.neetoplanner.net",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    video: "on",
    screenshot: "on",
    testIdAttribute: "data-test-id",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "login",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/login.setup.ts",
    },
    {
      name: "teardown",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/global.teardown.ts",
    },
    {
      name: "Logged In tests",
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      dependencies: ["login"],
      teardown: "teardown",
      testMatch: "**/*.spec.ts",
    },
  ],
});