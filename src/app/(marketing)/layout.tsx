import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getFeaturedProjects, getPosts } from "@/lib/content";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const projects = getFeaturedProjects(4).map(({ meta }) => ({
    slug: meta.slug,
    title: meta.title,
    summary: meta.summary,
  }));
  const showWriting = getPosts().length > 0;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header projects={projects} showWriting={showWriting} />
      <main id="main">{children}</main>
      <Footer showWriting={showWriting} />
    </>
  );
}
