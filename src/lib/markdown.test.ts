import { describe, expect, it } from "vitest";
import { getPosts, getProjects, type ProjectMeta } from "@/lib/content";
import { llmsTxt, projectMarkdown } from "@/lib/markdown";

const meta: ProjectMeta = {
  slug: "demo",
  title: "Demo",
  summary: "Summary.",
  tldr: "Answer-first summary.",
  date: "2025-01",
  stack: ["Next.js"],
  tags: [],
  outcomes: ["Cut load time 40%"],
};

describe("projectMarkdown", () => {
  it("strips MDX imports and JSX components but keeps prose", () => {
    const mdx =
      'import X from "./x"\n\n## Heading\n\n<Figure src="/a.png" alt="a" />\n\nBody text.';
    const md = projectMarkdown(meta, mdx);
    expect(md).not.toContain("import X");
    expect(md).not.toContain("<Figure");
    expect(md).toContain("## Heading");
    expect(md).toContain("Body text.");
  });

  it("leads with the title and the TL;DR, then outcomes", () => {
    const md = projectMarkdown(meta, "");
    expect(md.startsWith("# Demo\n\n> Answer-first summary.")).toBe(true);
    expect(md).toContain("- Cut load time 40%");
  });
});

describe("llmsTxt", () => {
  it("links every project and post to its .md mirror", () => {
    const txt = llmsTxt();
    for (const p of getProjects()) expect(txt).toContain(`/projects/${p.meta.slug}.md`);
    for (const p of getPosts()) expect(txt).toContain(`/writing/${p.meta.slug}.md`);
    expect(txt).toContain("/about.md");
  });
});
