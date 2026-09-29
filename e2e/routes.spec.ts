import { expect, test } from "@playwright/test";
import { slugs } from "./helpers";

const projects = slugs("projects");
const posts = slugs("writing");

const ok: [string, RegExp][] = [
  ["/", /text\/html/],
  ...(posts.length ? ([["/writing", /text\/html/]] as [string, RegExp][]) : []),
  ...projects.map((s) => [`/projects/${s}`, /text\/html/] as [string, RegExp]),
  ...posts.map((s) => [`/writing/${s}`, /text\/html/] as [string, RegExp]),
  ["/feed.xml", /application\/rss\+xml/],
  ["/sitemap.xml", /xml/],
  ["/robots.txt", /text\/plain/],
  ["/llms.txt", /text\/plain/],
  ["/llms-full.txt", /text\/plain/],
  ["/about.md", /text\/markdown/],
  ...projects.map((s) => [`/projects/${s}.md`, /text\/markdown/] as [string, RegExp]),
  ...posts.map((s) => [`/writing/${s}.md`, /text\/markdown/] as [string, RegExp]),
  ["/opengraph-image", /image\/png/],
  ["/icon.svg", /image\/svg\+xml/],
  ["/resume.pdf", /application\/pdf/],
];

for (const [route, type] of ok) {
  test(`${route} → 200 ${type.source}`, async ({ request }) => {
    const res = await request.get(route);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(type);
  });
}

// One-page site (SPEC §4): old standalone pages redirect to their home-page section.
for (const [from, to] of [
  ["/about", "/#about"],
  ["/projects", "/#work"],
  ["/contact", "/#contact"],
]) {
  test(`${from} → 308 ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe(to);
  });
}

const notFound = [
  "/nope",
  "/projects/nope",
  "/projects/nope.md",
  ...(posts.length ? [] : ["/writing"]),
];
for (const route of notFound) {
  test(`${route} → 404`, async ({ request }) => {
    expect((await request.get(route)).status()).toBe(404);
  });
}

test("robots.txt explicitly allows AI crawlers", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
    expect(body).toContain(`User-Agent: ${bot}`);
  }
});

test("page content is in the server HTML (no JS needed)", async ({ request }) => {
  const home = await (await request.get("/")).text();
  expect(home).toContain("<h1");
  expect(home).toMatch(/is a software engineer/);
  for (const id of ["work", "about", "contact"]) expect(home).toContain(`id="${id}"`);
  for (const s of projects) {
    const html = await (await request.get(`/projects/${s}`)).text();
    expect(html).toContain("TL;DR");
  }
});
