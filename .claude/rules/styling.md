---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "tailwind.config.ts"
---

# Styling (Tailwind CSS v3)

- **Tailwind v3 only.** Don't use v4 syntax (`@theme`, `@import "tailwindcss"`) or run the latest shadcn CLI. shadcn-style components are hand-written in `src/components/ui/`.
- **Use the brand color tokens** defined in `tailwind.config.ts` (`theme.extend.colors`). Don't put raw hex colors in JSX. Add a token to `tailwind.config.ts` first. (SVG artwork fills in `hero-scene.tsx` are the exception.)
- **Variants** via `tailwind-variants` (`tv()`, see `button` in `src/components/ui/button.tsx`). **Merging** caller classes via `cn()` from `@/lib/utils`. Don't concatenate class strings conditionally by hand.
- **Mobile-first:** base styles for phones, then `sm:`/`md:`/`lg:` upward. Everything must work at 360px with no horizontal overflow.
- **Layout:** use the `container` class for page gutters. Section spacing is `py-16 md:py-20` (inner pages) or `py-20 md:py-28` (home).
- **Arbitrary values** (`w-[520px]`) only when there's no scale value. Prefer the scale.
- **Class order** is sorted automatically by `prettier-plugin-tailwindcss`, including inside `cn()`, `clsx()` and `tv()`.
