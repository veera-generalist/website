import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

/** Slugs of the published (non-draft) MDX files in content/<collection>, matching a production build. */
export function slugs(collection: "projects" | "writing"): string[] {
  const dir = path.join(process.cwd(), "content", collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => !/^draft:\s*true\b/m.test(fs.readFileSync(path.join(dir, f), "utf8")))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Collects console errors and uncaught page errors for the life of the page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}
