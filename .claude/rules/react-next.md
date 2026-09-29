---
paths:
  - "src/app/**/*"
  - "src/components/**/*"
---

# React & Next.js (App Router, Next 14)

- **Server components by default.** Add `"use client"` only to leaf components that need state, effects, event handlers or browser APIs. Keep them small, and pass data down as props from a server parent.
- **Page data** comes from build-time reads (see `content-aeo.md`), never client-side fetching.
- **Static by default:** dynamic routes export `generateStaticParams` and `dynamicParams = false`. Machine routes (`route.ts`) export `dynamic = "force-static"`.
- **Metadata** via the `metadata` export or `generateMetadata`. Always set `alternates.canonical`; content pages also set `alternates.types["text/markdown"]` to their `.md` mirror.
- Use `next/link` for internal links and `next/image` for images (explicit `width`/`height` or `fill` + `sizes`). Put `priority` only on the LCP image.
- In Next 14, `params` is a plain object (not a Promise). Type it as `{ params: { slug: string } }`.
- **Component shape:** props typed inline or as a local `type Props`; `forwardRef` only for primitives in `src/components/ui/`; one exported component per file, plus small private helpers.
- **Folder placement:** `components/ui` = design-system primitives; `components/layout` = header/footer; `components/sections` = home-page and shared page sections; `components/motion` = animation primitives; route-private components live beside their route (e.g. next to `projects/[slug]/page.tsx`).
