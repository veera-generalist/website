# Personal Portfolio Site — Spec

> Living document. This file owns **what** we build and **why**: requirements, decisions, progress and history. **How** to write the code lives in `CLAUDE.md` and `.claude/rules/`, and each rule lives in exactly one place (see "Which file owns what" in `CLAUDE.md`).

## Progress

- [x] Spec drafted
- [x] Project scaffolded (Next.js 14.2.35, React 18.3, Tailwind 3.4, TypeScript)
- [x] UI layer (shadcn-style Radix components, Tabler icons, framer-motion, sonner)
- [x] Content layer (MDX projects + writing, typed data files)
- [x] Pages & routes (with placeholder content)
- [~] Integrations: PostHog, GTM and Crisp done (env-gated). **Sentry pending.**
- [x] SEO (sitemap, RSS, OG images, metadata)
- [~] AEO/GEO: JSON-LD graph, llms.txt, Markdown mirrors, AI-crawler robots rules and AI-referral tracking done. **IndexNow script pending.**
- [x] Animation teardown of safetywing.com → [docs/animations.md](docs/animations.md)
- [x] Animations: scroll parallax hero, orbit accents, staggered load-in, 3D mega-menu, typing role (see docs/animations.md, "What to adopt")
- [ ] Next animation picks: pointer parallax, tech-stack marquee, Lottie accents (optional)
- [ ] Replace placeholder hero art (SVG layers in `hero-scene.tsx`) with real illustrations
- [x] Coding standards: `.claude/rules/` (8 topic files), Prettier + Tailwind sorting, stricter ESLint, Claude auto-fix hook, husky + lint-staged + commitlint, Vitest + Playwright/axe
- [ ] Real content (profile, projects, experience, résumé, brand colors)
- [ ] Deployed

## 1. Overview

A personal portfolio site: who I am, what I've built, where I've worked, and how to reach me. Its tech stack mirrors https://safetywing.com, and it uses only free tools and free service tiers. The site must build and run without any third-party account or key.

## 2. Goals

- Make a strong first impression: a polished, animated home page in the style of a marketing site.
- Show projects as case studies (problem → approach → result), each written as an MDX file.
- Show experience, skills and a downloadable résumé.
- Make contact effortless: email, social links, optional chat widget.
- Optional **Writing** section (MDX posts) for articles and notes.
- Statically generated, fast, and SEO-friendly.
- **AEO/GEO-ready:** answer engines and generative search (ChatGPT, Claude, Perplexity, Google AI Overviews, Copilot) can crawl, understand and cite the site accurately when someone asks about me or my work. See §10.

### Non-goals

- User accounts, payments, a hosted CMS or a database.

## 3. Tech stack

Reference: SafetyWing's stack as fingerprinted from its live site on 2026-09-29.

| Layer           | SafetyWing                                             | This project                                                                                       | Cost                     |
| --------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------ |
| Framework       | Next.js 14.2.35, App Router, `(marketing)` route group | `next@14.2.35` (pinned)                                                                            | Free (OSS)               |
| UI runtime      | React 18                                               | `react@18`, `react-dom@18`                                                                         | Free                     |
| Language        | TypeScript                                             | TypeScript (strict)                                                                                | Free                     |
| Styling         | Tailwind CSS v3, custom named colors                   | `tailwindcss@3`, `@tailwindcss/typography`                                                         | Free                     |
| Components      | Radix UI, shadcn-style                                 | Hand-written shadcn-style components on Radix, `tailwindcss-animate`                               | Free                     |
| Class utils     | tailwind-variants, tailwind-merge                      | `tailwind-variants`, `tailwind-merge`, `clsx`                                                      | Free                     |
| Icons           | Tabler                                                 | `@tabler/icons-react`                                                                              | Free                     |
| Animation       | framer-motion, Lottie                                  | `framer-motion`, `lottie-react`                                                                    | Free                     |
| Toasts          | sonner                                                 | `sonner` (e.g. "Email copied")                                                                     | Free                     |
| Fonts           | next/font (local + Google)                             | Geist via `next/font/local` (body), Space Grotesk via `next/font/google` (display)                 | Free                     |
| Content         | none visible                                           | MDX: `next-mdx-remote@4`, `gray-matter`, `reading-time`                                            | Free                     |
| Structured data | JSON-LD                                                | `schema-dts` (typed Schema.org JSON-LD)                                                            | Free                     |
| Analytics       | PostHog                                                | `posthog-js`                                                                                       | Free tier (1M events/mo) |
| Error tracking  | Sentry                                                 | `@sentry/nextjs`                                                                                   | Free Developer plan      |
| Tag manager     | Google Tag Manager                                     | `@next/third-parties`                                                                              | Free                     |
| Live chat       | Intercom (paid)                                        | **Crisp**                                                                                          | Free plan                |
| Hosting         | Self-hosted, Google Cloud                              | **Vercel Hobby**; Docker `standalone` build ready for Cloud Run free tier                          | Free                     |
| Package manager | n/a                                                    | npm (Node 24)                                                                                      | Free                     |
| Quality tooling | n/a                                                    | Prettier, ESLint, commitlint, husky + lint-staged, Vitest, Playwright + axe (usage in `CLAUDE.md`) | Free                     |

## 4. Pages & routes

**One-page site.** The home page holds the Work, About and Contact sections; each case study keeps its own page for linking, sharing and AI citations. All pages sit in the `(marketing)` route group, sharing the header and footer. The header nav is anchor links (`/#work`, `/#about`), plus a "Get in touch" button (`/#contact`).

| Route                                                    | Rendering   | Content                                                                                                                                                                                                                                             |
| -------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                      | Static      | Hero (name, role, typing roles, short bio, CTAs) over a scroll-parallax scene → `#work` (all projects) → `#about` (bio, photo, résumé, experience, skills, FAQ) → latest writing (only when posts exist) → `#contact` (email, copy button, socials) |
| `/about`, `/projects`, `/contact`                        | Redirect    | 308 to `/#about`, `/#work`, `/#contact` (the old standalone pages)                                                                                                                                                                                  |
| `/projects/[slug]`                                       | SSG         | Case study: cover, role, timeline, stack, links (live/GitHub), MDX body                                                                                                                                                                             |
| `/writing`                                               | Static      | Post list; 404 and hidden from nav and sitemap until there are published (non-draft) posts                                                                                                                                                          |
| `/writing/[slug]`                                        | SSG         | MDX post in `prose` article                                                                                                                                                                                                                         |
| `/resume.pdf`                                            | Static file | In `public/`                                                                                                                                                                                                                                        |
| `/feed.xml`                                              | Static      | RSS for writing                                                                                                                                                                                                                                     |
| `/sitemap.xml`, `/robots.txt`                            | Static      | All pages, projects, posts; `lastmod` from `updated`; AI crawlers explicitly allowed                                                                                                                                                                |
| `/llms.txt`                                              | Static      | llms.txt index: who I am + links to every page's Markdown mirror                                                                                                                                                                                    |
| `/llms-full.txt`                                         | Static      | Full site content as one Markdown file                                                                                                                                                                                                              |
| `/projects/[slug].md`, `/writing/[slug].md`, `/about.md` | Static      | Markdown mirror of each page, for LLM ingestion                                                                                                                                                                                                     |
| 404 / errors                                             | n/a         | Branded pages; errors will be reported to Sentry once it's wired (see Progress)                                                                                                                                                                     |

## 5. Project structure

This is the canonical map of the repo. Conventions for where _new_ files go are in `.claude/rules/react-next.md`.

```
content/{projects,writing}/*.mdx     # site content (schema: §6)
public/                              # resume.pdf, images/
docs/animations.md                   # SafetyWing motion teardown + recipes
e2e/*.spec.ts                        # Playwright: routes, quality/a11y, motion
.claude/                             # Claude Code: rules/, hooks/, commands/, settings.json
src/
  app/
    layout.tsx  template.tsx         # fonts + providers; page-entrance slide
    (marketing)/                     # header + footer layout; one-page home, projects/[slug], writing
    md/{about,projects,writing}/     # Markdown mirrors, served as *.md via next.config.mjs rewrites
    feed.xml/ llms.txt/ llms-full.txt/  sitemap.ts robots.ts opengraph-image.tsx
    not-found.tsx error.tsx global-error.tsx
  components/
    ui/          # hand-written shadcn-style primitives (button, sheet, navigation-menu)
    layout/      # header, mobile-nav, footer
    sections/    # hero, hero-scene, about-section, contact-section, experience-timeline, skills-grid
    motion/      # hero-parallax, orbit, reveal, typing-text
    providers/   # posthog-provider, motion-provider
    mdx/         # MDX component overrides
    *.tsx        # shared bits: page-header, project-card, content-bits, json-ld, og-card, …
  data/          # profile.ts (identity), experience.ts, skills.ts, navigation.ts
  lib/           # content.ts, jsonld.ts, markdown.ts, utils.ts (+ *.test.ts)
```

## 6. Content model

This section is the canonical content schema. The types and normalizers in `src/lib/content.ts` must match it.

### Projects: `content/projects/<slug>.mdx`

```yaml
---
title: string # required
summary: string # required, one line for cards/SEO
date: YYYY-MM # required, used for ordering
updated: YYYY-MM-DD # optional; drives dateModified + sitemap lastmod
tldr: string # required; 1–2 sentence answer-first summary (AEO)
outcomes: string[] # quantified results, e.g. "Cut load time 40%"
role: string # e.g. "Solo developer"
stack: string[] # e.g. ["Next.js", "Postgres"]
tags: string[] # for filtering
cover: string # path in /public/images
links: { live?: url, github?: url }
featured: boolean # show on home page
draft: boolean # excluded from production
---
```

### Writing: `content/writing/<slug>.mdx`

```yaml
---
title: string
date: YYYY-MM-DD
updated: YYYY-MM-DD    # optional
description: string
tldr: string           # optional answer-first summary
faq: { q: string, a: string }[]   # optional; rendered + FAQPage JSON-LD
tags: string[]
draft: boolean
---
```

### Typed data (`src/data/*.ts`)

Profile, experience and skills are plain TypeScript objects with exported types, not MDX, so they're type-checked. `profile.ts` is the **single source of truth for my identity**: name, alternate names, job title, location, short and long bio, `sameAs` profile URLs, `knowsAbout` topics, and a short FAQ ("What does <name> do?", "What stack does <name> use?"). The page copy, JSON-LD, llms.txt and meta tags all read from it, so they never drift apart.

`src/lib/content.ts` exports `getProjects()`, `getFeaturedProjects()`, `getProject(slug)`, `getPosts()` and `getPost(slug)`. All are sorted by date descending and exclude drafts in production.

## 7. UI & design

- **Header:** fixed, transparent over the hero and solid on scroll. Desktop: a Radix NavigationMenu with a Work mega-menu (3D tilt-in) and an About anchor, plus the "Get in touch" button. Mobile: a Sheet menu with Work, About and Contact (and Writing when there are posts).
- **Hero:** static `<h1>` (name + role), typing roles line, short bio and two CTAs, over a three-layer scroll-parallax scene with orbiting accents. The artwork is placeholder SVG until real illustrations arrive.
- **Project cards:** cover image, title, summary, stack chips, and hover lift.
- **Experience:** vertical timeline.
- **Theme:** named brand colors in `tailwind.config.ts` (`ink`, `sun`, `mist`). Light mode first; a dark mode toggle is optional.
- **Motion:** SafetyWing-style signature motion (see `docs/animations.md`). Shipped: CSS root scroll-timeline parallax with a framer-motion fallback, `offset-path` orbits, staggered load-ins, typing roles, the mega-menu tilt, and the page-entrance slide. Planned: pointer parallax, a tech-stack marquee, and Lottie accents. Implementation rules: `.claude/rules/motion.md`.
- **Responsive:** mobile-first, usable from 360px with no horizontal overflow.
- **Accessibility:** WCAG 2.1 AA. Rules in `.claude/rules/accessibility.md`, gated by the axe scan in `e2e/quality.spec.ts`.

## 8. Integrations

Every integration is **optional**: if its env var is unset it doesn't load, and nothing errors.

| Service | Env var(s)                                                                    | Behavior                                                                    |
| ------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| PostHog | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`                         | Pageviews + AI-referral session tagging; CTA/résumé-download events planned |
| Sentry  | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` (build, optional) | Client + server errors                                                      |
| GTM     | `NEXT_PUBLIC_GTM_ID`                                                          | GTM container                                                               |
| Crisp   | `NEXT_PUBLIC_CRISP_WEBSITE_ID`                                                | Chat widget so visitors can message me                                      |
| Site    | `NEXT_PUBLIC_SITE_URL`                                                        | Canonical URLs, sitemap, RSS                                                |

All keys are listed in `.env.example`, with signup links.

## 9. SEO & performance

- `metadata` defaults in the root layout, and `generateMetadata` for each project and post.
- Generated Open Graph images (`opengraph-image.tsx`) for the site, each project and each post.
- JSON-LD graph: see §10.
- Target Lighthouse score of 90 or more in all four categories on `/` and a project page.

## 10. AEO / GEO (answer & generative engine optimization)

Goal: when someone asks an AI assistant or AI search engine about me, my skills or my projects, it can find, parse, trust and cite this site.

### 10.1 Crawlability

- **All content lives in server-rendered HTML** (SSG). No text is fetched client-side or requires JS, since most AI crawlers don't execute JS. framer-motion only animates content that's already in the HTML.
- `robots.ts` explicitly **allows** AI search and assistant crawlers: `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `Bingbot`, `CCBot`. The allow list lives in one config array, so the policy is easy to change.
- Vercel's firewall/bot protection is left **off** for AI crawlers.
- Sitemap `lastmod` uses real `updated` dates, as a freshness signal.

### 10.2 Machine-readable content

- `/llms.txt`, following the llms.txt proposal: an H1 with my name, a blockquote summary, then sections linking to the Markdown mirror of every page (About, Projects, Writing, Contact).
- `/llms-full.txt`: the entire site's content concatenated as clean Markdown.
- A **Markdown mirror** of every content page (`/about.md`, `/projects/<slug>.md`, `/writing/<slug>.md`), generated from the same MDX and data files. Each HTML page links to its mirror with `<link rel="alternate" type="text/markdown">`.

### 10.3 Structured data (JSON-LD via `schema-dts`)

One connected `@graph` per page, with stable `@id`s (`<site>/#person`, `<site>/#website`):

- `Person`: name, alternateName, jobTitle, description, image, url, email, address (city/country), `sameAs` (GitHub, LinkedIn, X...), `knowsAbout`, `worksFor`, `alumniOf`.
- `WebSite` (publisher → `#person`), with `ProfilePage` (mainEntity → `#person`) on `/`.
- Project pages: `CreativeWork` or `SoftwareSourceCode` (creator → `#person`, codeRepository, dateCreated, dateModified, keywords).
- Posts: `BlogPosting` (author → `#person`, datePublished, dateModified).
- `BreadcrumbList` on every nested page.
- `FAQPage` wherever a FAQ is rendered visibly (the home About section, and posts with `faq`). The JSON-LD always matches the visible content.

### 10.4 Content patterns (writing for extraction)

- **Answer-first:** each project and post opens with its `tldr`, shown visibly as a summary box.
- Question-style H2s where natural ("What problem did this solve?", "Which stack did I use and why?").
- Concrete, quotable facts: numbers, dates, named technologies and named employers. Avoid vague claims.
- Visible "Published / Updated" dates on projects and posts.
- An About section whose first paragraph is a short, third-person-friendly bio (the likeliest snippet to be cited), plus a visible FAQ.
- Strict semantic HTML (see `.claude/rules/accessibility.md`).

### 10.5 Entity consistency & authority

- The same name, headline and bio as on GitHub, LinkedIn and other profiles, which all link back to the site.
- `rel="me"` on social links (this also enables Mastodon/IndieWeb verification).
- Free webmaster tools: submit the sitemap to **Google Search Console** and **Bing Webmaster Tools** (Bing's index feeds ChatGPT search and Copilot).
- **IndexNow (pending):** a key file in `public/`, and `scripts/indexnow.mjs` pings changed URLs after each deploy (free; Bing, Yandex and others).

### 10.6 Measurement

- PostHog: tag sessions whose referrer or `utm_source` is an AI source (`chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com`, `gemini.google.com`) with an `ai_referral` property, plus a saved insight "Visits from AI assistants".
- Periodically ask the major assistants "Who is <name>?" and "<name> projects". Record the results in the Changelog and correct any inaccuracies at the source.

## 11. Deployment

- Primary: Vercel Hobby (free; personal, non-commercial use fits the terms). Connect the repo; no config needed. Custom domain optional.
- Alternative: `output: "standalone"` plus a `Dockerfile`, for Google Cloud Run (as SafetyWing self-hosts on GCP).

## 12. Acceptance criteria

Checked items are verified automatically by `npm run check` / `npm run test:e2e` (the covering test is named). Unchecked items aren't verified yet.

- [x] Pinned stack: `npm ls next react tailwindcss` shows 14.2.35 / 18.x / 3.x.
- [x] Lint, typecheck, formatting and unit tests pass (`npm run check`).
- [x] `npm run build` succeeds with **no** env vars set; project and post pages are SSG.
- [x] Every page, project, post, `.md` mirror and machine route returns 200 with the right content type; old pages 308 to their sections; unknown routes 404 (`e2e/routes.spec.ts`).
- [x] Header anchors scroll to their home sections; one `/#contact` link on desktop, Contact in the mobile menu (`e2e/quality.spec.ts`).
- [x] Adding a new `.mdx` project or post publishes it with no code changes (routes and tests pick up slugs from `content/`).
- [x] Editing `src/data/profile.ts` updates the name, bio and socials site-wide (single identity source).
- [x] Page text is in the server HTML without JS; `/robots.txt` allows the AI crawlers (`e2e/routes.spec.ts`).
- [x] JSON-LD `@id`s link into one graph on every page (`src/lib/jsonld.test.ts`, `e2e/quality.spec.ts`).
- [x] Every project page shows a TL;DR and Published/Updated dates.
- [x] No serious or critical axe violations, exactly one `<h1>`, no console errors (in both motion modes) and no overflow at 390px (`e2e/quality.spec.ts`).
- [x] Parallax, reduced motion and the mega-menu behave as specified (`e2e/motion.spec.ts`).
- [x] Two sample projects and one sample post (draft) included; no create-next-app boilerplate left.
- [ ] The nav is fully keyboard-operable (Radix provides it, but there's no explicit test yet).
- [ ] Each integration activates when its env var **is** set (the no-op path is verified; the active path isn't).
- [ ] JSON-LD passes Google's Rich Results Test and the Schema.org validator (external tools; check once deployed).
- [ ] Lighthouse ≥ 90 in all four categories on `/` and a project page (check once deployed).

## 13. Open questions

- Name, role/title, one-line pitch, and social links (GitHub, LinkedIn, X, etc.).
- Projects to feature (title, summary, links, screenshots).
- Work experience and skills.
- Brand colors and fonts (or a reference site you like).
- Include the Writing section at launch, or add it later?
- Contact: email only, or also a form? (A free form service such as Formspree would add a dependency.)
- Custom domain?

## Changelog

- **2026-09-29**: Switched to a **one-page site**. Home now holds Work, About (bio, experience, skills, FAQ, résumé) and Contact as anchored sections. The standalone `/about`, `/projects` and `/contact` pages are removed and 308-redirect to their sections. Case studies keep `/projects/[slug]` with an "All work" back link. The nav is Work · About, plus the "Get in touch" button. `ProfilePage` and FAQ JSON-LD moved to `/`. The sample post is now a draft, so Writing (nav, sitemap, `/writing`) stays hidden until there are real posts. The sitemap and llms.txt are updated; tests cover redirects, anchors and the hidden Writing section (38 e2e).
- **2026-09-29**: Removed the duplicate "Contact" nav link on desktop; the "Get in touch" button covers it. It stays in the mobile menu, where the button is hidden, and in the footer. Covered by a header test in `e2e/quality.spec.ts`.
- **2026-09-29**: Cleanup. Replaced the create-next-app favicon with a brand `src/app/icon.svg` (placeholder until there's a logo; covered by `routes.spec.ts`), removed the unused Geist Mono font and `class-variance-authority`, and dropped a redundant permission. `lottie-react` is kept for the planned Lottie accents.
- **2026-09-29**: Consistency pass. SPEC now owns only what and why; removed the Implementation notes, whose items were duplicated in CLAUDE.md and the rules. Refreshed stale sections: §3 components/fonts/quality tooling, §4 hero, §5 real structure, §7 shipped vs planned motion, §8 PostHog, §10.5 IndexNow pending. §12 acceptance criteria now show verification status and which test covers each. Added an ownership map in `CLAUDE.md`; removed duplicate rules across CLAUDE.md, rules, README, docs and user-level config.

- **2026-09-29**: Coding standards and quality gates. Written standards live in `.claude/rules/` (path-scoped topic files); `CLAUDE.md` is trimmed to point at them. Tooling: Prettier 3 + `prettier-plugin-tailwindcss@0.6`; ESLint adds jsx-a11y recommended, import/order, consistent-type-imports, no-default-export (except Next special files) and eslint-config-prettier; PostToolUse hook `.claude/hooks/format-file.mjs`; husky pre-commit (lint-staged) and commit-msg (commitlint, Conventional Commits). Tests: Vitest unit tests for `src/lib` (15) and a Playwright e2e suite in system Chrome with axe (52: routes, a11y, console errors in both motion modes, overflow, JSON-LD, parallax, menu). `npm run check` / `npm run test:e2e`; `/verify` updated. Also bumped `@types/node` to 24 (matches runtime) and set tsconfig `target: ES2017`.
- **2026-09-29**: Hero animations shipped: CSS scroll-timeline parallax (3 layers, framer-motion `useScroll` fallback), `offset-path` orbiting sun and ring, transform-only staggered text entrance, typing roles (`profile.roles`), and a 3D-tilt mega-menu. Fixed hydration mismatches under reduced motion by moving to a global `MotionConfig reducedMotion="user"` (`MotionProvider`). Verified with Playwright MCP: parallax drifts 130/70/20px at 450px of scroll (native and fallback); reduced motion freezes everything; no console errors; no overflow at 390px; hero text present without JS.
- **2026-09-29**: Moved the Playwright MCP server from the project `.mcp.json` to user scope (`~/.claude.json`), so it's available in every project. Removed the project `.mcp.json`.
- **2026-09-29**: Added Claude Code config: `CLAUDE.md` (project rules), `.claude/settings.json` (safe-command allowlist, `.env` read deny), `.mcp.json` (Playwright MCP) and the `/verify` command.
- **2026-09-29**: Animation teardown of safetywing.com (static bundle analysis and a live Playwright scan of 5 pages). Findings and rebuild recipes are in `docs/animations.md`. Also found that `/remote-health` is a separate Next 16.3.4 + styled-components app.
- **2026-09-29**: Built the site skeleton with placeholder content. All routes return 200. The build is fully static (25 pages). Lint and tsc pass. JSON-LD graphs verified (no dangling `@id`s). Page text confirmed present without JS. Checked the layout at 1440px and 390px.
- **2026-09-29**: Added AEO/GEO (§10): AI-crawler robots rules, llms.txt/llms-full.txt, Markdown mirrors, a connected JSON-LD graph (`schema-dts`), answer-first content fields (`tldr`, `faq`, `updated`), IndexNow, and AI-referral tracking.
- **2026-09-29**: Repurposed the spec from a blog to a personal portfolio: projects, about/experience, contact and optional writing. Stack unchanged.
- **2026-09-29**: Initial spec. Stack fingerprinted from safetywing.com.
