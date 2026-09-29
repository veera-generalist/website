---
paths:
  - "src/**/*.test.ts"
  - "e2e/**/*"
  - "src/lib/**/*"
  - "vitest.config.mts"
  - "playwright.config.ts"
---

# Testing

| Layer      | Tool                             | Location                                                   |
| ---------- | -------------------------------- | ---------------------------------------------------------- |
| Unit       | Vitest                           | next to the code: `src/lib/foo.ts` → `src/lib/foo.test.ts` |
| End to end | Playwright (system Chrome) + axe | `e2e/*.spec.ts`                                            |

Scripts are listed in `README.md`; the done gate is in `CLAUDE.md`.

- **Unit-test pure logic** in `src/lib`: content parsing, JSON-LD graph integrity, Markdown generation, utilities. Every new exported lib function gets a test.
- **E2E tests cover what users and crawlers see:** routes and content types, one `<h1>`, no console errors in both motion modes, axe (no serious or critical violations), no overflow at 390px, motion behaviour. New pages or routes get added to `routes.spec.ts` automatically via content slugs; add anything else by hand.
- **Test behaviour, not implementation.** Assert on output, DOM and HTTP, not internal state.
- **Filesystem-dependent code:** point `process.cwd()` at a temp fixture folder and re-import (see `src/lib/content.test.ts`). Don't depend on the real `content/` for edge cases.
- **Timing:** wait for load-in animations to finish before measuring positions (see `motion.spec.ts`). Never use arbitrary sleeps to hide a real race.
