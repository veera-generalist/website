---
description: Full quality gate — lint, types, formatting, unit tests, then the Playwright e2e suite (routes, a11y, motion, AEO)
---

Verify the site end to end.

1. Run `npm run check` (lint, typecheck, `format:check`, Vitest). If it fails, stop and report the failure with its output.
2. Stop anything already listening on port 3100 (`pkill -f "next start -p 3100"`), then run `npm run test:e2e`. This builds the production site, serves it on :3100, and runs every spec in `e2e/` against system Chrome.
3. If any e2e test fails, re-run just that spec (`npx playwright test <file> -g "<name>"`) to get the assertion details. Say whether the failure is a real bug or a flaky or incorrect test. Don't loosen a test just to make it pass.
4. Report a pass/fail table, one row per area: lint, types, format, unit, routes, quality/a11y, motion. Quote the output of any failure.
