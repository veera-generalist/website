import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";
import { getPost, getPosts } from "@/lib/content";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.meta.slug }));
}

export default function OpengraphImage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return new ImageResponse(
    <OgCard
      eyebrow="Writing"
      title={post?.meta.title ?? "Post"}
      subtitle={post?.meta.description ?? ""}
    />,
    size,
  );
}
