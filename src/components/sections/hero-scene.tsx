import { HeroParallax, ParallaxLayer } from "@/components/motion/hero-parallax";
import { Orbit } from "@/components/motion/orbit";

// Placeholder artwork: swap each layer's SVG for real illustrations (transparent
// PNG/WebP/SVG of equal width) without touching the motion. Decorative only.

// Deterministic star field (x%, y%, radius) so server and client render the same.
const stars: [number, number, number][] = [
  [4, 12, 1.2],
  [9, 34, 0.8],
  [14, 8, 1],
  [19, 22, 1.4],
  [24, 44, 0.8],
  [29, 14, 1],
  [34, 30, 0.8],
  [39, 6, 1.2],
  [44, 24, 1],
  [49, 40, 0.8],
  [53, 10, 1.4],
  [58, 28, 0.8],
  [63, 46, 1],
  [67, 16, 0.8],
  [72, 36, 1.2],
  [76, 6, 1],
  [81, 26, 0.8],
  [86, 42, 1],
  [90, 12, 1.2],
  [95, 32, 0.8],
  [7, 52, 1],
  [37, 56, 0.8],
  [61, 58, 1],
  [88, 54, 0.8],
];

// Staggered load-in for decorative layers only (text never fades — SPEC §10).
const enter =
  "h-full animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both motion-reduce:animate-none";

export function HeroScene() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <HeroParallax>
        {/* Far: glow, stars and an orbiting sun — drifts the most, feels furthest away. */}
        <ParallaxLayer depth={260} className="inset-y-0">
          <div className={enter}>
            <div className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-sun/15 blur-3xl" />
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              {stars.map(([x, y, r]) => (
                <circle
                  key={`${x}-${y}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={r}
                  fill="white"
                  opacity={0.55}
                />
              ))}
            </svg>
            <Orbit
              rx={28}
              ry={12}
              duration={14}
              className="absolute -right-3 top-[9%] md:right-[16%] md:top-[16%]"
            >
              <div className="h-14 w-14 rounded-full bg-sun shadow-[0_0_80px_24px_rgba(242,201,76,0.35)] md:h-24 md:w-24" />
            </Orbit>
          </div>
        </ParallaxLayer>

        {/* Mid: distant hills. */}
        <ParallaxLayer depth={140} className="bottom-0 h-[28%] md:h-[44%]">
          <div className={`${enter} delay-150`}>
            <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
              <path
                fill="#1F2C48"
                d="M0,224 C160,160 320,120 480,150 C640,180 760,260 960,230 C1140,200 1260,120 1440,150 L1440,320 L0,320 Z"
              />
            </svg>
          </div>
        </ParallaxLayer>

        {/* Near: foreground hills plus a small orbiting ring — drifts the least. */}
        <ParallaxLayer depth={40} className="bottom-0 h-[20%] md:h-[32%]">
          <div className={`${enter} delay-300`}>
            <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
              <path
                fill="#2A3A5C"
                d="M0,256 C200,210 360,190 560,230 C760,270 900,300 1100,260 C1260,228 1360,200 1440,210 L1440,320 L0,320 Z"
              />
            </svg>
            <Orbit
              rx={16}
              ry={8}
              duration={10}
              reverse
              className="absolute left-[12%] top-0 hidden md:block"
            >
              <div className="h-6 w-6 rounded-full border-2 border-sun/70 md:h-9 md:w-9" />
            </Orbit>
          </div>
        </ParallaxLayer>
      </HeroParallax>

      {/* Static wave into the next (white) section; layers slide beneath it. */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 z-10 h-10 w-full text-white md:h-16"
      >
        <path
          fill="currentColor"
          d="M0,48 C240,80 480,80 720,56 C960,32 1200,16 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}
