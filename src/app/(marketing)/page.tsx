import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { profile } from "@/data/profile";
import { getPosts, getProjects } from "@/lib/content";
import { faqNode, graph, profilePageNode } from "@/lib/jsonld";
import { formatDate } from "@/lib/utils";

// One-page home: hero → work → about → writing (when there are posts) → contact.
// Case studies keep their own pages at /projects/[slug] (SPEC §4).
export default function HomePage() {
  const projects = getProjects();
  const posts = getPosts().slice(0, 3);

  return (
    <>
      {/* The FAQ is rendered in AboutSection, so FAQPage JSON-LD belongs on this page. */}
      <JsonLd data={graph(profilePageNode("/"), faqNode(profile.faq))} />
      <Hero />

      {projects.length > 0 && (
        <section
          id="work"
          aria-labelledby="work-heading"
          className="container scroll-mt-16 py-20 md:py-28"
        >
          <h2 id="work-heading" className="mb-10 font-display text-3xl font-bold md:text-4xl">
            Selected work
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(({ meta }, i) => (
              <Reveal key={meta.slug} delay={i * 0.08}>
                <ProjectCard project={meta} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <AboutSection />

      {posts.length > 0 && (
        <section
          id="writing"
          aria-labelledby="writing-heading"
          className="container scroll-mt-16 py-20 md:py-28"
        >
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 id="writing-heading" className="font-display text-3xl font-bold md:text-4xl">
              Latest writing
            </h2>
            <Link
              href="/writing"
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold underline-offset-4 hover:underline"
            >
              All posts <IconArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {posts.map(({ meta }) => (
              <li key={meta.slug}>
                <Link
                  href={`/writing/${meta.slug}`}
                  className="flex flex-col gap-1 py-6 transition-colors hover:text-ink-muted md:flex-row md:items-baseline md:justify-between"
                >
                  <span className="font-display text-xl font-bold">{meta.title}</span>
                  <time dateTime={meta.date} className="shrink-0 text-sm text-ink-muted">
                    {formatDate(meta.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactSection />
    </>
  );
}
