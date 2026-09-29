import { describe, expect, it } from "vitest";
import type { ProjectMeta } from "@/lib/content";
import {
  breadcrumbNode,
  faqNode,
  graph,
  ids,
  postNode,
  profilePageNode,
  projectNode,
} from "@/lib/jsonld";

const project: ProjectMeta = {
  slug: "demo",
  title: "Demo",
  summary: "A demo project.",
  tldr: "Built a demo.",
  date: "2025-01",
  stack: ["Next.js"],
  tags: ["Web"],
};

// Collect every {"@id": …} reference and every node @id in a graph.
function idsIn(value: unknown, refs: Set<string>, defined: Set<string>, isNode = false) {
  if (Array.isArray(value)) return value.forEach((v) => idsIn(v, refs, defined, isNode));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 1 && typeof obj["@id"] === "string") refs.add(obj["@id"]);
    else if (isNode && typeof obj["@id"] === "string") defined.add(obj["@id"]);
    keys.forEach((k) => idsIn(obj[k], refs, defined));
  }
}

describe("graph", () => {
  it("always includes the person and website nodes", () => {
    const g = graph();
    const types = (g["@graph"] as { "@type": string }[]).map((n) => n["@type"]);
    expect(types).toEqual(["Person", "WebSite"]);
  });

  it("has no dangling @id references on any page type", () => {
    const pages = [
      graph(profilePageNode("/")),
      graph(projectNode(project), breadcrumbNode([{ name: "Demo", path: "/projects/demo" }])),
      graph(
        postNode({ slug: "p", title: "P", date: "2026-01-01", description: "d", tags: [] }),
        faqNode([{ q: "Q?", a: "A." }]),
      ),
    ];
    for (const g of pages) {
      const refs = new Set<string>();
      const defined = new Set<string>();
      (g["@graph"] as unknown[]).forEach((node) => idsIn(node, refs, defined, true));
      expect([...refs].filter((r) => !defined.has(r))).toEqual([]);
    }
  });
});

describe("projectNode", () => {
  it("is a CreativeWork without a repo, SoftwareSourceCode with one", () => {
    expect(projectNode(project)["@type"]).toBe("CreativeWork");
    const withRepo = projectNode({ ...project, links: { github: "https://github.com/x/y" } });
    expect(withRepo).toMatchObject({
      "@type": "SoftwareSourceCode",
      codeRepository: "https://github.com/x/y",
    });
  });

  it("credits the person and falls back dateModified to date", () => {
    expect(projectNode(project)).toMatchObject({
      creator: { "@id": ids.person },
      dateModified: "2025-01",
    });
  });
});
