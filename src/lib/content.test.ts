import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

// content.ts resolves ./content from process.cwd() at import time, so each test
// points cwd at a temp fixture folder and re-imports the module.
async function loadWith(files: Record<string, string>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-test-"));
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, "content", rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, "content", rel), body);
  }
  vi.spyOn(process, "cwd").mockReturnValue(dir);
  vi.resetModules();
  return import("@/lib/content");
}

const post = (title: string, date: string, extra = "") =>
  `---\ntitle: ${title}\ndate: ${date}\ndescription: About ${title}\n${extra}---\n\nBody.`;

afterEach(() => vi.restoreAllMocks());

describe("getPosts", () => {
  it("sorts newest first and normalizes YAML dates to strings", async () => {
    const { getPosts } = await loadWith({
      "writing/old.mdx": post("Old", "2024-01-05"),
      "writing/new.mdx": post("New", "2026-02-10"),
    });
    const posts = getPosts();
    expect(posts.map((p) => p.meta.slug)).toEqual(["new", "old"]);
    expect(posts[0].meta.date).toBe("2026-02-10");
    expect(posts[0].readingTime).toMatch(/min read/);
  });

  it("throws a helpful error when required frontmatter is missing", async () => {
    const { getPosts } = await loadWith({
      "writing/broken.mdx": "---\ntitle: Broken\ndate: 2026-01-01\n---\nBody",
    });
    expect(() => getPosts()).toThrow(
      /writing\/broken: missing required frontmatter field "description"/,
    );
  });

  it("returns an empty list when the folder doesn't exist", async () => {
    const { getPosts } = await loadWith({});
    expect(getPosts()).toEqual([]);
  });
});

describe("getFeaturedProjects", () => {
  it("returns only featured projects", async () => {
    const project = (title: string, featured: boolean) =>
      `---\ntitle: ${title}\nsummary: s\ntldr: t\ndate: 2025-01\nfeatured: ${featured}\n---\nBody`;
    const { getFeaturedProjects } = await loadWith({
      "projects/a.mdx": project("A", true),
      "projects/b.mdx": project("B", false),
    });
    expect(getFeaturedProjects().map((p) => p.meta.slug)).toEqual(["a"]);
  });
});

describe("list fields", () => {
  it("throws a helpful error when a list field is a plain string", async () => {
    const { getProjects } = await loadWith({
      "projects/typo.mdx":
        "---\ntitle: T\nsummary: s\ntldr: t\ndate: 2025-01\nstack: Node.js\n---\n",
    });
    expect(() => getProjects()).toThrow(
      /projects\/typo: frontmatter field "stack" must be a list of strings/,
    );
  });

  it("defaults missing list fields to empty", async () => {
    const { getPosts } = await loadWith({ "writing/p.mdx": post("P", "2026-01-01") });
    expect(getPosts()[0].meta.tags).toEqual([]);
  });
});
