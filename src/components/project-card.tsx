import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Chips } from "@/components/content-bits";
import type { ProjectMeta } from "@/lib/content";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] bg-ink">
        {project.cover && (
          <Image
            src={project.cover}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-xl font-bold">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="text-ink-muted">{project.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-4">
          <Chips items={project.stack.slice(0, 4)} />
          <IconArrowRight
            size={20}
            aria-hidden
            className="shrink-0 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </article>
  );
}
