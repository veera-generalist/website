import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { getPosts } from "@/lib/content";
import { breadcrumbNode, graph } from "@/lib/jsonld";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and notes on building for the web.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getPosts();
  // Writing stays hidden (nav, sitemap, and this page) until there are published posts.
  if (posts.length === 0) notFound();

  return (
    <>
      <JsonLd data={graph(breadcrumbNode([{ name: "Writing", path: "/writing" }]))} />
      <PageHeader eyebrow="Blog" title="Writing">
        <p>Articles and notes on building for the web.</p>
      </PageHeader>
      <section className="container max-w-4xl py-16 md:py-20">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {posts.map(({ meta, readingTime }) => (
            <li key={meta.slug}>
              <article className="py-8">
                <h2 className="font-display text-2xl font-bold">
                  <Link href={`/writing/${meta.slug}`} className="hover:underline">
                    {meta.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  <time dateTime={meta.date}>{formatDate(meta.date)}</time> · {readingTime}
                </p>
                <p className="mt-3 text-ink/80">{meta.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
