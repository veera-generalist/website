# Portfolio

Personal portfolio site. Stack mirrors safetywing.com (Next.js 14, React 18, Tailwind v3, Radix/shadcn, framer-motion), using free tools and service tiers only, and it's optimized for AI answer engines (AEO/GEO). See [SPEC.md](SPEC.md) for the full spec and progress.

## Develop

```bash
npm install
cp .env.example .env.local   # optional — everything works with no env vars
npm run dev                  # http://localhost:3000
```

Checks: `npm run check` (lint, types, formatting, unit tests) and `npm run test:e2e` (Playwright). See [Contributing](#contributing).

## Editing content

| What                           | Where                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------- |
| Name, bio, socials, email, FAQ | `src/data/profile.ts` (single source of truth; feeds pages, JSON-LD and llms.txt) |
| Work history                   | `src/data/experience.ts`                                                          |
| Skills                         | `src/data/skills.ts`                                                              |
| Projects                       | `content/projects/<slug>.mdx`                                                     |
| Posts                          | `content/writing/<slug>.mdx` (Writing hides from nav when empty)                  |
| Résumé                         | `public/resume.pdf`                                                               |
| Brand colors                   | `tailwind.config.ts` (`ink`, `sun`, `mist`)                                       |

### Frontmatter

The full schema for projects and posts, with required fields marked, is in [SPEC.md §6](SPEC.md#6-content-model). Missing required fields fail the build with a message naming the file.

## AI / answer-engine endpoints

- `/llms.txt`, `/llms-full.txt`
- Markdown mirrors: `/about.md`, `/projects/<slug>.md`, `/writing/<slug>.md`
- `/robots.txt` explicitly allows AI crawlers (edit the list in `src/app/robots.ts`)
- JSON-LD graph builders: `src/lib/jsonld.ts`

## Deploy

- **Vercel Hobby (free):** import the repo and set `NEXT_PUBLIC_SITE_URL` to your domain.
- **Docker / Cloud Run:** `docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com -t portfolio .`, then run it on port 8080.

## Contributing

| Script               | What it does                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run check`      | Lint + typecheck + Prettier check + Vitest unit tests                                                  |
| `npm run test:e2e`   | Builds, serves on :3100, runs Playwright (routes, accessibility via axe, motion, AEO) in system Chrome |
| `npm run format`     | Formats everything with Prettier (Tailwind classes sorted)                                             |
| `npm run test:watch` | Vitest in watch mode                                                                                   |

- **Standards:** coding conventions live in [`.claude/rules/`](.claude/rules/), one file per topic (TypeScript, React/Next, styling, accessibility, motion, content/AEO, testing, git). Claude Code loads them automatically, and they're plain Markdown for humans too.
- **Commits:** Conventional Commits, enforced by commitlint. Format and examples: [`.claude/rules/git.md`](.claude/rules/git.md).
- **Git hooks** (husky): pre-commit runs ESLint `--fix` + Prettier on staged files; commit-msg runs commitlint. If you use nvm, hooks load it via `~/.config/husky/init.sh`.
