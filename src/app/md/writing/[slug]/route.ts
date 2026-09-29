import { getPost, getPosts } from "@/lib/content";
import { postMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.meta.slug }));
}

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(postMarkdown(post.meta, post.content), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
