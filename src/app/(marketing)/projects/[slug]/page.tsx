import { IconArrowLeft, IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Chips, PublishedDates, Tldr } from "@/components/content-bits";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { PageHeader } from "@/components/page-header";
import { button } from "@/components/ui/button";
import { getProject, getProjects } from "@/lib/content";
import { breadcrumbNode, graph, projectNode } from "@/lib/jsonld";

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.meta.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  const { meta } = project;
  const path = `/projects/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.tldr,
    keywords: [...meta.stack, ...meta.tags],
    alternates: { canonical: path, types: { "text/markdown": `${path}.md` } },
    openGraph: {
      type: "article",
      url: path,
      title: meta.title,
      description: meta.tldr,
      publishedTime: meta.date,
      modifiedTime: meta.updated ?? meta.date,
    },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const { meta, content } = project;

  return (
    <article>
      <JsonLd
        data={graph(
          projectNode(meta),
          breadcrumbNode([{ name: meta.title, path: `/projects/${meta.slug}` }]),
        )}
      />
      <PageHeader eyebrow="Case study" title={meta.title}>
        <p>{meta.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <PublishedDates date={meta.date} updated={meta.updated} />
          <Link
            href="/#work"
            className="inline-flex items-center gap-1 text-sm font-semibold text-sun underline-offset-4 hover:underline"
          >
            <IconArrowLeft size={16} aria-hidden /> All work
          </Link>
        </div>
      </PageHeader>

      <div className="container max-w-4xl py-12 md:py-16">
        {meta.cover && (
          <Image
            src={meta.cover}
            alt={`${meta.title} preview`}
            width={1600}
            height={1000}
            priority
            className="-mt-24 mb-12 w-full rounded-3xl bg-ink shadow-2xl md:-mt-28"
          />
        )}

        <Tldr>{meta.tldr}</Tldr>

        <dl className="mt-10 grid gap-6 border-y border-ink/10 py-8 sm:grid-cols-3">
          {meta.role && (
            <div>
              <dt className="text-sm text-ink-muted">Role</dt>
              <dd className="mt-1 font-semibold">{meta.role}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-sm text-ink-muted">Stack</dt>
            <dd className="mt-2">
              <Chips items={meta.stack} />
            </dd>
          </div>
        </dl>

        {meta.outcomes && meta.outcomes.length > 0 && (
          <section aria-labelledby="outcomes" className="mt-10">
            <h2 id="outcomes" className="font-display text-2xl font-bold">
              Outcomes
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {meta.outcomes.map((o) => (
                <li key={o} className="rounded-2xl bg-mist p-4 font-medium">
                  {o}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(meta.links?.live || meta.links?.github) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {meta.links.live && (
              <a
                href={meta.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className={button({ variant: "dark" })}
              >
                <IconExternalLink size={18} aria-hidden /> Visit live site
              </a>
            )}
            {meta.links.github && (
              <a
                href={meta.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={button({ variant: "outline" })}
              >
                <IconBrandGithub size={18} aria-hidden /> Source code
              </a>
            )}
          </div>
        )}

        <div className="prose prose-lg prose-slate mt-12 max-w-none prose-headings:font-display prose-a:text-ink prose-a:underline-offset-4">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </div>
    </article>
  );
}
