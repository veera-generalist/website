import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FaqList, PublishedDates, Tldr } from "@/components/content-bits";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { PageHeader } from "@/components/page-header";
import { getPost, getPosts } from "@/lib/content";
import { breadcrumbNode, faqNode, graph, postNode } from "@/lib/jsonld";

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.meta.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const { meta } = post;
  const path = `/writing/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    alternates: { canonical: path, types: { "text/markdown": `${path}.md` } },
    openGraph: {
      type: "article",
      url: path,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      modifiedTime: meta.updated ?? meta.date,
      tags: meta.tags,
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const { meta, content, readingTime } = post;

  return (
    <article>
      <JsonLd
        data={graph(
          postNode(meta),
          breadcrumbNode([
            { name: "Writing", path: "/writing" },
            { name: meta.title, path: `/writing/${meta.slug}` },
          ]),
          ...(meta.faq?.length ? [faqNode(meta.faq)] : []),
        )}
      />
      <PageHeader title={meta.title}>
        <p>{meta.description}</p>
        <div className="mt-6">
          <PublishedDates date={meta.date} updated={meta.updated} readingTime={readingTime} />
        </div>
      </PageHeader>

      <div className="container max-w-3xl py-12 md:py-16">
        {meta.tldr && <Tldr>{meta.tldr}</Tldr>}
        <div className="prose prose-lg prose-slate mt-10 max-w-none prose-headings:font-display prose-a:text-ink prose-a:underline-offset-4">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
        {meta.faq && meta.faq.length > 0 && (
          <div className="mt-16">
            <FaqList items={meta.faq} />
          </div>
        )}
      </div>
    </article>
  );
}
