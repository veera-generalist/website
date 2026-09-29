# SafetyWing animation teardown and rebuild guide

Scanned 2026-09-29. Sources: SafetyWing's CSS and JS bundles, plus a live Playwright pass (system Chrome, 1440×900) over `/`, `/nomad-insurance`, `/nomad-citizen`, `/ambassador` and `/remote-health`. The pass scrolled each page step by step and recorded `document.getAnimations()`, inline-style mutations, Lottie players and hover states.

## What powers the motion

| Layer                                                                    | Used for                                                                     | Library                                                    |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **CSS scroll-driven animations** (`view-timeline`, `animation-timeline`) | Multi-layer parallax scenes                                                  | None; plain CSS, with a framer-motion `useScroll` fallback |
| **tailwindcss-animate** (`animate-in fade-in slide-in-from-bottom-*`)    | Load-in and in-view reveals, Radix menus and accordions                      | `tailwindcss-animate`                                      |
| **framer-motion**                                                        | Scroll reveals, pointer parallax, springs, the parallax fallback             | `framer-motion`                                            |
| **Lottie** (lottie-web SVG renderer)                                     | Illustrated micro-scenes: birds, a flag, steam, sparkles, 20+ coverage icons | `lottie-react`, lazy-loaded                                |
| **CSS `offset-path`**                                                    | Clouds drifting on elliptical orbits                                         | None                                                       |
| **react-fast-marquee**                                                   | Infinite logo/stat ticker                                                    | `react-fast-marquee`                                       |
| **typed.js-style effect**                                                | A typing placeholder in the FAQ search box                                   | `typed.js` (or about 30 lines of custom code)              |

The main site runs Next 14.2.35. `/remote-health` is a **separate app** on Next 16.3.4 with styled-components, but it uses the **same** parallax technique.

The biggest takeaway: **SafetyWing's richest effect is not a JS library.** The parallax is CSS scroll-driven animation, and JavaScript only steps in for browsers without it (Firefox and older Safari).

---

## Catalog

### 1. Multi-layer scroll parallax: the signature effect

**Where:** the home hero variant ("Global freedom and safety…", captured from the bundle; A/B tested, not currently served) and `/remote-health` (live).

**What it looks like:** an illustrated scene split into layers (sky gradient, distant background, midground art, near and far bushes). As you scroll, each layer moves at a different speed, which creates depth.

**How they build it:**

- A `<Parallax>` container gets `view-timeline: --parallax-scroll block` and `container-type: size`.
- Each `<Parallax.Layer parallax={0.9}>` runs a `parallax-scroll` keyframe on that timeline: `translate: 0 calc((1 - var(--layer-parallax)) * var(--parallax-travel))`.
  - `parallax: 1` means the layer moves with the page.
  - Values below 1 lag behind, so the layer feels far away.
  - Values above 1 (for example `1.05` on foreground bushes) move faster, so the layer feels close.
- `--parallax-travel = (100vh + container height) / 2`. `animation-range` is adjusted by `data-scroll-align=top|center|bottom`.
- **Fallback:** `CSS.supports("animation-timeline","view()")` returns false in Firefox. There, framer-motion `useScroll({ target, offset: ["start end","end start"] })` computes `--layer-scroll` on each frame, and the CSS uses that value instead.
- Every prop is responsive as a `{ base, sm, md, lg, xl }` object, compiled into a cascade of CSS variables (`--layer-parallax-md`, and so on).
- Layers render as `background-image` divs sized by width, height and scale variables, and are **preloaded with `img.decode()`**. Then they fade in with a spring (`--layer-appear`), so nothing pops in half-loaded.
- `prefers-reduced-motion: reduce` sets `animation-name: none`.

**Rebuild:** see [Recipe A](#recipe-a--scroll-driven-parallax). It needs layered artwork: transparent PNG, WebP or SVG with the same width.

### 2. Clouds orbiting on an ellipse

**Where:** the home hero variant.

The two cloud images move in slow ellipses in opposite directions:

```css
offset-path: path("M 0 0 A 24 10 0 1 1 0 20 A 24 10 0 1 1 0 0"); /* ellipse, radii x=24 y=10 */
offset-anchor: 0 0;
offset-rotate: 0deg;
animation: follow-path 10s linear infinite; /* second cloud: … infinite reverse */
@keyframes follow-path {
  to {
    offset-distance: 100%;
  }
}
```

The orbit gets a smaller radius on mobile (`x=10, y=6`), and it only runs under `motion-safe:`.
**Rebuild:** [Recipe B](#recipe-b--orbiting-float). It's cheap and GPU-friendly.

### 3. Staggered load-in reveals

**Where:** `/` (live) and `/ambassador`.

The hero columns, buttons and art fade in on load, in a timed sequence:

```
delay-700  duration-500 animate-in fade-in
delay-1000 duration-500 animate-in fade-in slide-in-from-bottom-9
delay-200  duration-500 animate-in fade-in slide-in-from-bottom-full   (illustration pieces)
duration-500 animate-in fade-in slide-in-from-bottom-4 [animation-delay:1200ms]
```

This is pure `tailwindcss-animate`, which we already have.

### 4. Scroll-into-view reveals

**Where:** every page.

Two mechanisms are in use:

- **On `/`:** sections start `invisible` or `opacity-0`. An IntersectionObserver switches them to `visible` or `opacity-100` and adds `animate-in fade-in slide-in-from-bottom-10`, with `delay-200` on later siblings for a stagger.
- **On `/nomad-insurance` and `/nomad-citizen`:** framer-motion `whileInView`, animating from `opacity:0; transform:translateY(40px)` to `opacity:1; transform:none`. This is the same as our `Reveal` component.

### 5. Pointer-reactive parallax

**Where:** the `/nomad-insurance` hero (the wave layer).

Layered hero images follow the mouse by a few pixels (for example `translateX(-19.9px) translateY(-29.9px)`). Each layer uses a different multiplier, so they appear to sit at different depths. The multiplier on Y is 3× the one on X. It updates on every pointer move (over 1,800 style writes in the scan), which suggests framer-motion `useSpring` motion values rather than React state.
**Rebuild:** [Recipe C](#recipe-c--pointer-parallax).

### 6. Pulsing hotspots

**Where:** `/nomad-insurance` (dots on the illustrated map).

A filled circle with a `::before` halo that scales up and back:

```
before:absolute before:inset-0 before:rounded-full before:bg-fountain/40 before:animate-scale
@keyframes scale { 0%,100% { transform: scale(1) } 50% { transform: scale(1.5) } }   /* 1.2s ease infinite */
```

### 7. Lottie micro-animations

**Where:** `/nomad-insurance` (20 players in view at once) and the home hero variant (ship birds, a flag).

A registry maps names to dynamic imports (`palmTreeLeft: () => import(...)`, `steam`, `sparkles`, `bouncingDots`, `hospitalization`, …). The player itself is `next/dynamic(..., { ssr: false })`. The JSON loads only when a component mounts, and never on the server. Players sit in absolutely positioned boxes placed by percentage over a static illustration, so the art stays crisp and only the moving bits are Lottie.
**Rebuild:** [Recipe D](#recipe-d--lazy-lottie).

### 8. Typing placeholder

**Where:** the "Ask us anything" search on the product pages.

It cycles through example questions ("Is driving a scooter covered") with a blinking `|` cursor (`typed-cursor`, a 0.7s blink). The element is `pointer-events-none` and overlays the input. **Rebuild:** [Recipe E](#recipe-e--typing-placeholder).

### 9. Infinite marquee

**Where:** `/ambassador` (a stats and quotes strip, 16 items).

It uses `react-fast-marquee` with a 56s loop and pauses on hover. It's easy to hand-roll with CSS (Recipe F).

### 10. Mega-menu with 3D tilt

**Where:** the global nav.

Radix NavigationMenu. The viewport opens with `scale-in` (`rotateX(-30deg) scale(.9)` to flat, 0.2s) inside `perspective: 2000px`. Content slides between menus with `data-[motion=from-start|from-end]` classes, and the chevron rotates 180°. Tooltips use `slide-up-fade` (0.4s, `cubic-bezier(.16,1,.3,1)`).
**We already have** the Radix and data-motion part. To match SafetyWing we only need the `scale-in` keyframe and the perspective (Recipe G).

### 11. Accordions (FAQ)

Radix Accordion using `accordion-down` and `accordion-up` keyframes, which animate `height` from 0 to `var(--radix-accordion-content-height)` in 0.2s ease-out. This is standard shadcn.

### 12. Remote Health extras (a separate app)

- **Idle sway:** a floating vehicle rocks gently (`Layer__Sway`, a 6s infinite keyframe).
- **Spring-driven CSS variables:** JavaScript writes `--spring` and `--initial-y` onto a blob SVG and a quote section, and CSS maps them to transforms. This is the same pattern as `--layer-appear`.
- **Number flipper:** `--current: 1.414` animates between country counts (a CountryFlipper).
- **Appear:** cards and tags fade up over 650ms when they enter the viewport.

### 13. Small stuff

- A bouncing "Discover more ↓" arrow (`animate-bounce`).
- Button, link and icon hovers: Tailwind `transition` at 150–200ms, `cubic-bezier(.4,0,.2,1)`.
- Wavy SVG section dividers between sections. These are static shapes.

---

## Implemented in this repo

| Effect                                                                | Where                                                                                                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Hero parallax (root scroll timeline, 0→100vh; JS fallback sets `--p`) | `src/app/globals.css` (`.hero-parallax-layer`), `src/components/motion/hero-parallax.tsx`, `src/components/sections/hero-scene.tsx` |
| Orbiting accents                                                      | `src/components/motion/orbit.tsx`                                                                                                   |
| Staggered load-in (decor fades; text only rises, never fades)         | `hero-scene.tsx` (`enter`), `hero.tsx` (`rise`)                                                                                     |
| Typing roles                                                          | `src/components/motion/typing-text.tsx`, `profile.roles`                                                                            |
| ~~3D mega-menu~~                                                      | Removed with the header nav (one-page site); recoverable from commit `2b3741e`                                                      |
| Reduced motion (framer)                                               | `src/components/providers/motion-provider.tsx`                                                                                      |

The hero uses a **root** scroll timeline (`scroll(root)`, range `0 100vh`) rather than Recipe A's `view()` timeline, because the hero is always at the top of the page.

## Recipes for this stack (Next 14, Tailwind v3, framer-motion)

### Recipe A — Scroll-driven parallax

```css
/* globals.css */
.parallax {
  --parallax-travel: calc((100vh + 100cqh) / 2);
  container-type: size;
  view-timeline: --parallax block;
}
.parallax-layer {
  --y: calc((1 - var(--depth, 1)) * var(--scroll, 0) * var(--parallax-travel) * -1);
  transform: translate3d(0, var(--y), 0);
  will-change: transform;
}
@supports (animation-timeline: view()) {
  .parallax-layer {
    animation: parallax linear both;
    animation-timeline: --parallax;
  }
}
@keyframes parallax {
  from {
    translate: 0 calc((1 - var(--depth, 1)) * var(--parallax-travel) * -1);
  }
  to {
    translate: 0 calc((1 - var(--depth, 1)) * var(--parallax-travel));
  }
}
@media (prefers-reduced-motion: reduce) {
  .parallax-layer {
    animation: none;
    --scroll: 0;
  }
}
```

```tsx
// components/motion/parallax.tsx
"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Parallax({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(true);
  useEffect(() => setNative(CSS.supports("animation-timeline", "view()")), []);
  // Fallback for Firefox and older Safari: drive --scroll (1 → -1) from framer-motion.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scroll = useTransform(scrollYProgress, (p) => 1 - 2 * p);
  return (
    <motion.div
      ref={ref}
      className={`parallax relative overflow-clip ${className ?? ""}`}
      style={native ? undefined : ({ "--scroll": scroll } as unknown as CSSProperties)}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxLayer({
  depth,
  className,
  children,
}: {
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`parallax-layer absolute inset-x-0 ${className ?? ""}`}
      style={{ "--depth": depth } as CSSProperties}
    >
      {children}
    </div>
  );
}
```

Usage: `<ParallaxLayer depth={0.75}>` for far art, `depth={0.9}` for the midground and `depth={1.05}` for the foreground. Keep text in normal flow outside the layers, so it's in the HTML and never moves unpredictably.

### Recipe B — Orbiting float

```tsx
const orbit = (x: number, y: number) =>
  `path("M 0 0 A ${x} ${y} 0 1 1 0 ${2 * y} A ${x} ${y} 0 1 1 0 0")`;
<img
  src="/images/cloud.webp"
  alt=""
  style={
    { offsetPath: orbit(24, 10), offsetAnchor: "0 0", offsetRotate: "0deg" } as React.CSSProperties
  }
  className="motion-safe:animate-[follow-path_10s_linear_infinite]"
/>;
```

```ts
// tailwind.config.ts → theme.extend.keyframes
"follow-path": { to: { offsetDistance: "100%" } },
```

### Recipe C — Pointer parallax

```tsx
"use client";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export function PointerParallax({
  children,
  strength = 20,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(
    useTransform(mx, (v) => v * strength),
    { stiffness: 80, damping: 20 },
  );
  const y = useSpring(
    useTransform(my, (v) => v * strength * 1.5),
    { stiffness: 80, damping: 20 },
  );
  return (
    <div
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative"
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
```

Use a different `strength` per layer. Springs write to motion values, not React state, so moving the mouse never re-renders React.

### Recipe D — Lazy Lottie

```tsx
// components/motion/lottie.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const registry = {
  wave: () => import("@/animations/wave.json").then((m) => m.default),
  sparkles: () => import("@/animations/sparkles.json").then((m) => m.default),
} as const;

export function LottieAnim({
  name,
  className,
}: {
  name: keyof typeof registry;
  className?: string;
}) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    registry[name]().then(setData);
  }, [name]);
  return (
    <div className={className} aria-hidden>
      {data && <Lottie animationData={data} loop autoplay />}
    </div>
  );
}
```

There are free animations on LottieFiles. Check each one's license, and keep files small (under 50 KB each).

### Recipe E — Typing placeholder

```tsx
"use client";
import { useEffect, useState } from "react";
export function TypingText({
  phrases,
  speed = 60,
  hold = 1600,
}: {
  phrases: string[];
  speed?: number;
  hold?: number;
}) {
  const [i, setI] = useState(0),
    [n, setN] = useState(0),
    [del, setDel] = useState(false);
  useEffect(() => {
    const full = phrases[i];
    const t = setTimeout(
      () => {
        if (!del && n === full.length) return setDel(true);
        if (del && n === 0) {
          setDel(false);
          setI((i + 1) % phrases.length);
          return;
        }
        setN(n + (del ? -1 : 1));
      },
      !del && n === full.length ? hold : del ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [n, del, i, phrases, speed, hold]);
  return (
    <span aria-hidden>
      {phrases[i].slice(0, n)}
      <span className="animate-[blink_0.7s_step-end_infinite]">|</span>
    </span>
  );
}
```

For the portfolio this could cycle the hero role: "I build / design systems / fast websites / accessible UIs". Keep the full sentence in an `sr-only` span for screen readers and crawlers.

### Recipe F — CSS marquee (no dependency)

```tsx
<div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
  {[0, 1].map((k) => (
    <ul
      key={k}
      aria-hidden={k === 1}
      className="flex shrink-0 animate-[marquee_40s_linear_infinite] gap-12 pr-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
    >
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  ))}
</div>
```

Add the keyframe `marquee: { to: { transform: "translateX(-100%)" } }`. It suits a tech-stack or logo strip.

### Recipe G — Mega-menu 3D open

```ts
// tailwind keyframes
"scale-in":  { "0%": { opacity: "0.5", transform: "rotateX(-30deg) scale(.9)" }, "100%": { opacity: "1", transform: "rotateX(0) scale(1)" } },
"scale-out": { "0%": { opacity: "1", transform: "rotateX(0) scale(1)" }, "100%": { opacity: "0", transform: "rotateX(-10deg) scale(.95)" } },
```

On the NavigationMenu viewport, replace `zoom-in-95`/`zoom-out-95` with `data-[state=open]:animate-[scale-in_.2s_ease] data-[state=closed]:animate-[scale-out_.2s_ease]`, and add `[perspective:2000px]` on its wrapper.

---

## What to adopt for the portfolio

| Priority | Effect                                                      | Why                                                                          | Cost                                                                               |
| -------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ★★★      | **Scroll parallax hero** (A), plus **orbiting accents** (B) | It's SafetyWing's signature effect, it's mostly CSS, and it works on the LCP | Needs 3–4 layered artwork files; SVG shapes or gradient blobs work as placeholders |
| ★★★      | **Staggered load-in** (§3) and **in-view reveals** (§4)     | We already have the dependencies; this just tunes delays and slide distances | Low                                                                                |
| ★★       | **Mega-menu 3D tilt** (G)                                   | Makes the menu feel like SafetyWing's                                        | Very low                                                                           |
| ★★       | **Typing role in hero** (E)                                 | Personality, and no dependency                                               | Low                                                                                |
| ★★       | **Pointer parallax** on the hero art or avatar (C)          | Adds depth on desktop                                                        | Low                                                                                |
| ★        | Tech-stack **marquee** (F)                                  | A nice strip under the hero                                                  | Very low                                                                           |
| ★        | **Lottie accents** (D)                                      | Only worth it with good animation files                                      | Medium (depends on the assets)                                                     |
| ★        | Pulsing hotspots (§6)                                       | Could mark highlights on a project screenshot                                | Very low                                                                           |

**Guardrails:** these are enforced as project rules in `.claude/rules/motion.md`.
