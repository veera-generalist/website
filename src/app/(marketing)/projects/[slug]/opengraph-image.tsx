import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";
import { getProject, getProjects } from "@/lib/content";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.meta.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  return new ImageResponse(
    <OgCard
      eyebrow="Case study"
      title={project?.meta.title ?? "Project"}
      subtitle={project?.meta.summary ?? ""}
    />,
    size,
  );
}
