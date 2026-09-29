import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Pin the site URL so absolute-URL assertions are stable regardless of local env.
    env: { NEXT_PUBLIC_SITE_URL: "https://example.test" },
  },
});
