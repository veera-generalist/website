import { profile } from "@/data/profile";
import { getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getPosts()
    .map(({ meta }) => {
      const url = absoluteUrl(`/writing/${meta.slug}`);
      return `    <item>
      <title>${escapeXml(meta.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(meta.date).toUTCString()}</pubDate>
      <description>${escapeXml(meta.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(profile.name)} — Writing</title>
    <link>${absoluteUrl("/writing")}</link>
    <description>${escapeXml(profile.pitch)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
