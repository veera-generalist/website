---
paths:
  - "src/components/motion/**/*"
  - "src/components/sections/**/*"
  - "src/app/template.tsx"
  - "src/app/globals.css"
  - "tailwind.config.ts"
---

# Motion

Reference: `docs/animations.md` (the SafetyWing teardown and recipes).

- **Never animate above-the-fold text from `opacity: 0`.** The hero `<h1>` doesn't animate at all. Other hero text may rise (transform only). Decoration may fade.
- **Every animation has a reduced-motion path:**
  - CSS: `motion-safe:`/`motion-reduce:` or a `prefers-reduced-motion` media query.
  - framer-motion: handled globally by `MotionProvider` (`reducedMotion="user"`).
- **Never branch rendered markup on `useReducedMotion()`.** It's `false` on the server, which causes hydration errors. Reading it inside an effect is fine.
- **CSS first, JS as fallback:** continuous motion (parallax, orbits, marquees) uses CSS (scroll timelines, `offset-path`, keyframes); JS only when the browser lacks support or for pointer/spring effects. Drive CSS variables with motion values rather than re-rendering React.
- **Animate `transform`/`translate`/`opacity` only.** Never animate layout properties (`top`, `height`, `width`), except Radix accordion height.
- **Durations:** micro interactions 150–300ms; entrances 500–1000ms; stagger 100–150ms. Ease-out for entrances.
- **Content stays server-rendered:** animated wrappers must not hide content from the HTML or from crawlers.
- Add new keyframes to `tailwind.config.ts` (`keyframes` + `animation`), not in ad-hoc `<style>` tags.
- Any new animation gets a check in `e2e/motion.spec.ts`.
