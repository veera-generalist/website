import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  const posts = getPosts();
  // Freshness signal: static pages take the date of the newest content.
  const latest = [...projects, ...posts]
    .map((e) => e.meta.updated ?? e.meta.date)
    .sort()
    .at(-1);

  // One-page site: the home page holds work, about and contact (SPEC §4).
  const staticPages = ["/", ...(posts.length ? ["/writing"] : [])];

  return [
    ...staticPages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: latest,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...projects.map(({ meta }) => ({
      url: absoluteUrl(`/projects/${meta.slug}`),
      lastModified: meta.updated ?? meta.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...posts.map(({ meta }) => ({
      url: absoluteUrl(`/writing/${meta.slug}`),
      lastModified: meta.updated ?? meta.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
