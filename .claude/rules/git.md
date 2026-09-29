# Git & commits

- **Conventional Commits,** enforced by commitlint in `.husky/commit-msg`: `type(scope): summary`
  - types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
  - scope (optional) = area: `hero`, `nav`, `content`, `aeo`, `motion`, `deps`, …
  - summary: imperative, lower-case, no trailing period, ≤ 72 chars. Example: `feat(hero): add scroll-timeline parallax`
- **One logical change per commit.** Formatting-only changes go in their own `style:` commit.
- **The pre-commit hook** runs lint-staged (ESLint fix + Prettier on staged files). Never bypass hooks with `--no-verify`. If a hook fails, fix the cause.
- **Never commit** `.env*` (except `.env.example`), build output, test reports or `.playwright-mcp/`.
