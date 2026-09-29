import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { FaqItem } from "@/data/profile";

const CONTENT_DIR = path.join(process.cwd(), "content");
const isProd = process.env.NODE_ENV === "production";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  tldr: string;
  date: string;
  updated?: string;
  outcomes?: string[];
  role?: string;
  stack: string[];
  tags: string[];
  cover?: string;
  links?: { live?: string; github?: string };
  featured?: boolean;
  draft?: boolean;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  tldr?: string;
  faq?: FaqItem[];
  tags: string[];
  draft?: boolean;
};

type Entry<T> = { meta: T; content: string; readingTime: string };

function readCollection<T extends { slug: string; date: string; draft?: boolean }>(
  collection: "projects" | "writing",
  normalize: (slug: string, data: Record<string, unknown>) => T,
): Entry<T>[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        meta: normalize(slug, data),
        content,
        readingTime: readingTime(content).text,
      };
    })
    .filter((entry) => !(isProd && entry.meta.draft))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

function required(data: Record<string, unknown>, key: string, slug: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value) {
    throw new Error(`content/${slug}: missing required frontmatter field "${key}"`);
  }
  return value;
}

// gray-matter parses unquoted YYYY-MM-DD as a Date; normalize back to a string.
function dateString(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : undefined;
}

function normalizeProject(slug: string, data: Record<string, unknown>): ProjectMeta {
  const d: Record<string, unknown> & { updated?: string } = {
    ...data,
    date: dateString(data.date),
    updated: dateString(data.updated),
  };
  return {
    slug,
    title: required(d, "title", `projects/${slug}`),
    summary: required(d, "summary", `projects/${slug}`),
    tldr: required(d, "tldr", `projects/${slug}`),
    date: required(d, "date", `projects/${slug}`),
    updated: d.updated,
    outcomes: (d.outcomes as string[]) ?? [],
    role: d.role as string | undefined,
    stack: (d.stack as string[]) ?? [],
    tags: (d.tags as string[]) ?? [],
    cover: d.cover as string | undefined,
    links: d.links as ProjectMeta["links"],
    featured: Boolean(d.featured),
    draft: Boolean(d.draft),
  };
}

function normalizePost(slug: string, data: Record<string, unknown>): PostMeta {
  const d: Record<string, unknown> & { updated?: string } = {
    ...data,
    date: dateString(data.date),
    updated: dateString(data.updated),
  };
  return {
    slug,
    title: required(d, "title", `writing/${slug}`),
    date: required(d, "date", `writing/${slug}`),
    updated: d.updated,
    description: required(d, "description", `writing/${slug}`),
    tldr: d.tldr as string | undefined,
    faq: d.faq as FaqItem[] | undefined,
    tags: (d.tags as string[]) ?? [],
    draft: Boolean(d.draft),
  };
}

export function getProjects() {
  return readCollection("projects", normalizeProject);
}

export function getFeaturedProjects(limit = 3) {
  return getProjects()
    .filter((p) => p.meta.featured)
    .slice(0, limit);
}

export function getProject(slug: string) {
  return getProjects().find((p) => p.meta.slug === slug) ?? null;
}

export function getPosts() {
  return readCollection("writing", normalizePost);
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.meta.slug === slug) ?? null;
}
