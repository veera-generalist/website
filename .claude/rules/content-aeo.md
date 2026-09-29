---
paths:
  - "content/**/*"
  - "src/data/**/*"
  - "src/lib/**/*"
  - "src/app/**/*"
---

# Content, SEO & AEO/GEO

These rules implement SPEC §8–10. The requirements and rationale live there; this file only says how to code them.

- **Read content at build time** via `src/lib/content.ts` and `src/data/*`. Never fetch copy client-side (SPEC §10.1); `e2e/routes.spec.ts` checks it.
- **`src/data/profile.ts` is the single source of identity:** name, bio, socials, email, FAQ, roles. Pages, JSON-LD, llms.txt, RSS and meta tags read from it. Never hard-code the name or bio elsewhere.
- **Every content page gets:**
  1. a JSON-LD node built with `src/lib/jsonld.ts` and wrapped in `graph(...)` (person and website are always included, and every `@id` must resolve)
  2. a Markdown mirror: a builder in `src/lib/markdown.ts`, a route in `src/app/md/*`, and a rewrite in `next.config.mjs`
  3. an entry in `sitemap.ts` and `llms.txt`
- **Answer-first content** follows SPEC §10.4. `tldr` is required in project frontmatter and rendered with `<Tldr>`; dates render with `<PublishedDates>`.
- **Frontmatter** is validated in `src/lib/content.ts`. If you add a field, update SPEC §6 (the canonical schema), the type and normalizer, and the Markdown mirror if the field is visible.
- **`faqNode()` only alongside a rendered `<FaqList>`** with the same items (SPEC §10.3).
- **Integrations:** return early or render `null` when the env var is unset (SPEC §8). Add new env vars to `.env.example` and the SPEC §8 table.
- **Crawler policy** is the `aiBots` / `disallowedBots` arrays in `src/app/robots.ts` (SPEC §10.1). Change it only when the user asks.
