import { getProject, getProjects } from "@/lib/content";
import { projectMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.meta.slug }));
}

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return new Response("Not found", { status: 404 });
  return new Response(projectMarkdown(project.meta, project.content), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
