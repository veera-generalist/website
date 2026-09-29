# TypeScript & code style

Formatting, import order, unused code and type-only imports are enforced by Prettier and ESLint. Don't restate them; just run `npm run check`.

- **Strict types.** No `any`. Use `unknown` and narrow it, or write the real type. No non-null `!` unless the invariant is local and obvious.
- **Named exports only.** Default exports are allowed only where Next.js requires them (`page`, `layout`, `template`, `error`, `not-found`, `opengraph-image`, `sitemap`, `robots`) and in config files.
- **Naming:** files and folders use `kebab-case`; components use `PascalCase`; functions and variables use `camelCase`; true constants use `SCREAMING_SNAKE_CASE` only when module-level and primitive.
- **No barrel files** (`index.ts` re-exports). Import from the defining module via `@/…`.
- **Types next to their data.** Export the type from the module that owns the data (`ProjectMeta` in `src/lib/content.ts`, `Profile` in `src/data/profile.ts`). Don't create a global `types.ts`.
- **Env vars** are read in exactly one place per integration (the provider or config module). Everything else imports from there.
- **Pure over clever.** Small functions, early returns, no premature abstraction. Three similar lines beat a helper used once.
- **Comments explain _why_,** not _what_: constraints, trade-offs, links to SPEC sections. Match the surrounding comment density.
- **Errors:** throw with a message that names the file or input at fault (see `required()` in `src/lib/content.ts`). Never swallow errors silently, except in best-effort code like analytics or hooks, and comment why.
