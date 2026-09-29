import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  // System Chrome: no browser download needed.
  projects: [{ name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
  webServer: {
    // Separate distDir: safe to run while `npm run dev` is using .next.
    command: `NEXT_DIST_DIR=.next-e2e npm run build && NEXT_DIST_DIR=.next-e2e npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // A production build can take minutes on a busy machine (dev server, browsers open).
    timeout: 600_000,
  },
});
