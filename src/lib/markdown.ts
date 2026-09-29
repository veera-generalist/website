// Markdown renderings of pages for LLM ingestion (SPEC §10.2): the .md mirrors,
// /llms.txt and /llms-full.txt all come from here.
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { getPosts, getProjects, type PostMeta, type ProjectMeta } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

// Strip MDX-only syntax (imports/exports, JSX components) so the output is plain Markdown.
function mdxToMarkdown(source: string) {
  return source
    .replace(/^(import|export)\s.*$/gm, "")
    .replace(/<[A-Z][\s\S]*?\/>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function frontmatterLines(lines: [string, string | undefined][]) {
  return lines
    .filter(([, v]) => v)
    .map(([k, v]) => `- **${k}:** ${v}`)
    .join("\n");
}

export function aboutMarkdown() {
  const jobs = experience
    .map(
      (e) =>
        `### ${e.role}, ${e.company} (${e.start} – ${e.end ?? "present"})\n` +
        e.highlights.map((h) => `- ${h}`).join("\n"),
    )
    .join("\n\n");

  return [
    `# About ${profile.name}`,
    `> ${profile.shortBio}`,
    profile.longBio.join("\n\n"),
    frontmatterLines([
      ["Role", profile.jobTitle],
      ["Location", `${profile.location.city}, ${profile.location.country}`],
      ["Email", profile.email],
      ["Availability", profile.availability.label],
      ["Profiles", profile.socials.map((s) => `[${s.label}](${s.href})`).join(", ")],
    ]),
    `## Experience\n\n${jobs}`,
    `## Skills\n\n${skills.map((g) => `- **${g.name}:** ${g.items.join(", ")}`).join("\n")}`,
    `## FAQ\n\n${profile.faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}`,
  ].join("\n\n");
}

export function projectMarkdown(meta: ProjectMeta, content: string) {
  return [
    `# ${meta.title}`,
    `> ${meta.tldr}`,
    frontmatterLines([
      ["Author", profile.name],
      ["Role", meta.role],
      ["Published", meta.date],
      ["Updated", meta.updated],
      ["Stack", meta.stack.join(", ")],
      ["Live", meta.links?.live],
      ["Source", meta.links?.github],
      ["URL", absoluteUrl(`/projects/${meta.slug}`)],
    ]),
    meta.outcomes?.length ? `## Outcomes\n\n${meta.outcomes.map((o) => `- ${o}`).join("\n")}` : "",
    mdxToMarkdown(content),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function postMarkdown(meta: PostMeta, content: string) {
  return [
    `# ${meta.title}`,
    `> ${meta.tldr ?? meta.description}`,
    frontmatterLines([
      ["Author", profile.name],
      ["Published", meta.date],
      ["Updated", meta.updated],
      ["URL", absoluteUrl(`/writing/${meta.slug}`)],
    ]),
    mdxToMarkdown(content),
    meta.faq?.length ? `## FAQ\n\n${meta.faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** /llms.txt — index following https://llmstxt.org */
export function llmsTxt() {
  const projects = getProjects();
  const posts = getPosts();

  return [
    `# ${profile.name}`,
    `> ${profile.shortBio} ${profile.pitch}`,
    `This is the personal portfolio of ${profile.name} (${profile.jobTitle}). Every page is available as Markdown by appending \`.md\` to its URL; the full site is at ${absoluteUrl("/llms-full.txt")}.`,
    `## About\n\n- [About ${profile.name}](${absoluteUrl("/about.md")}): bio, experience, skills and FAQ\n- [Contact](${absoluteUrl("/#contact")}): ${profile.email}`,
    projects.length
      ? `## Projects\n\n${projects
          .map(
            (p) =>
              `- [${p.meta.title}](${absoluteUrl(`/projects/${p.meta.slug}.md`)}): ${p.meta.summary}`,
          )
          .join("\n")}`
      : "",
    posts.length
      ? `## Writing\n\n${posts
          .map(
            (p) =>
              `- [${p.meta.title}](${absoluteUrl(`/writing/${p.meta.slug}.md`)}): ${p.meta.description}`,
          )
          .join("\n")}`
      : "",
    `## Optional\n\n${profile.socials.map((s) => `- [${s.label}](${s.href})`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** /llms-full.txt — the whole site as one Markdown document. */
export function llmsFullTxt() {
  const sections = [
    aboutMarkdown(),
    ...getProjects().map((p) => projectMarkdown(p.meta, p.content)),
    ...getPosts().map((p) => postMarkdown(p.meta, p.content)),
  ];
  return sections.join("\n\n---\n\n");
}
