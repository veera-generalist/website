---
paths:
  - "src/app/**/*"
  - "src/components/**/*"
---

# Accessibility (WCAG 2.1 AA)

`jsx-a11y` catches the mechanical issues and the Playwright axe scan (`e2e/quality.spec.ts`) gates serious and critical violations. These are the judgement calls:

- **Semantic HTML first:** `<header>`, `<nav>`, `<main id="main">`, `<article>`, `<section aria-labelledby>`, `<time dateTime>`, `<dl>` for label/value pairs. Use a `<button>` for actions and an `<a>` for navigation.
- **Exactly one `<h1>` per page,** with headings in order and none skipped.
- **Every interactive element is keyboard reachable,** with a visible focus ring (global `:focus-visible` style). Never remove outlines without a replacement.
- **Images:** meaningful `alt` text that describes the content, not "image of". Decorative images and SVGs get `alt=""` or `aria-hidden`.
- **Icon-only controls** need an `sr-only` label (see `SocialLinks`).
- **Visual-only content** (typing animations, orbit decorations) is `aria-hidden`, with an `sr-only` text equivalent when it carries meaning (see `hero.tsx`).
- **Contrast:** body text ≥ 4.5:1 and large text ≥ 3:1. On `ink` backgrounds, keep secondary text at `text-white/60` or brighter.
- **Links that open a new tab** use `rel="noopener noreferrer"`. External profile links also use `rel="me"`.
