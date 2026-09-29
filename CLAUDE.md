# Portfolio site

A personal portfolio whose tech stack mirrors safetywing.com, using free tools and tiers only, and optimized for AI answer engines (AEO/GEO). Requirements, layout and progress: [SPEC.md](SPEC.md).

## Working rules

- **SPEC.md is a living doc.** When you finish a chunk of work, tick its item in **Progress** and add a dated line to **Changelog**, in the same turn. If the work changes what SPEC describes (routes, structure, content schema, UI), update that section too.
- **Pinned versions, on purpose.** Don't upgrade these without asking:
  - `next@14.2.35`, `react@18`, `tailwindcss@3` (matching SafetyWing)
  - `tailwind-merge@2` and `tailwind-variants@0.3`, because newer majors only support Tailwind v4
  - `prettier-plugin-tailwindcss@0.6` (Tailwind v3 support), `eslint@8` / `eslint-config-prettier@9`
  - `next-mdx-remote@4`, `@next/third-parties@14`

## Which file owns what

Each rule or fact lives in exactly one place. Link to it; don't restate it.

| Concern                                                                                          | Owner                                                                                                         |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| What we build and why: requirements, routes, repo structure, content schema, progress, changelog | `SPEC.md`                                                                                                     |
| How Claude works here: working rules, version pins, done gate                                    | `CLAUDE.md` (this file)                                                                                       |
| Code conventions (judgement calls)                                                               | `.claude/rules/*.md` (below)                                                                                  |
| Mechanical rules: formatting, import order, lint, a11y lint, commit format                       | Tool configs: `.prettierrc.json`, `.eslintrc.json`, `commitlint.config.mjs`, `tsconfig.json`, `.editorconfig` |
| Automation: auto-fix after edits, permissions                                                    | `.claude/settings.json` + `.claude/hooks/`; git hooks in `.husky/` + `lint-staged` in `package.json`          |
| Human setup, scripts, how to edit content                                                        | `README.md`                                                                                                   |
| Motion reference (teardown + recipes)                                                            | `docs/animations.md`                                                                                          |
| Env var names and signup links                                                                   | `.env.example`                                                                                                |
| Personal, machine-specific preferences (nvm PATH, commit etiquette)                              | `~/.claude/CLAUDE.md` (not in the repo)                                                                       |

## Code conventions (`.claude/rules/`)

Path-scoped files load automatically when matching files are read. Their `paths:` frontmatter is the source of truth for scope.

- `typescript.md`: TypeScript and code style
- `git.md`: Conventional Commits and git hygiene
- `react-next.md`: React and Next.js App Router
- `styling.md`: Tailwind v3
- `accessibility.md`: WCAG 2.1 AA
- `motion.md`: animation rules
- `content-aeo.md`: content, SEO and AEO
- `testing.md`: Vitest and Playwright

## Done gate

```bash
npm run check      # lint + typecheck + format:check + unit tests (always)
npm run test:e2e   # production build + Playwright (routes, a11y, motion, AEO) for any UI/route change
```

`/verify` runs both and reports a pass/fail table.
