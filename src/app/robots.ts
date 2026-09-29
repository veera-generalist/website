import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// AI search/assistant crawlers explicitly allowed (SPEC §10.1). To opt out of a
// crawler, move it to `disallowedBots`.
const aiBots = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];
const disallowedBots: string[] = [];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiBots, allow: "/" },
      ...(disallowedBots.length ? [{ userAgent: disallowedBots, disallow: "/" }] : []),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
