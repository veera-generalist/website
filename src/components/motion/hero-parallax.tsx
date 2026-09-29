"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { className?: string; children: ReactNode };

// Browsers without CSS scroll timelines (Firefox, older Safari): drive --p (0→1
// over the first viewport of scroll) from framer-motion instead. Same approach
// as SafetyWing's Parallax fallback.
function FallbackParallax({ className, children }: Props) {
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, (y) =>
    typeof window === "undefined" ? 0 : Math.min(y / window.innerHeight, 1),
  );
  return (
    <motion.div className={className} style={{ "--p": p } as unknown as CSSProperties}>
      {children}
    </motion.div>
  );
}

/** Container for hero parallax layers. Native CSS does the work where supported. */
export function HeroParallax({ className, children }: Props) {
  const reduce = useReducedMotion();
  const [native, setNative] = useState(true);
  useEffect(() => setNative(CSS.supports("animation-timeline", "scroll()")), []);

  const classes = cn("pointer-events-none absolute inset-0", className);
  if (native || reduce) return <div className={classes}>{children}</div>;
  return <FallbackParallax className={classes}>{children}</FallbackParallax>;
}

/**
 * One parallax layer. `depth` = px the layer drifts down over the first viewport
 * of scroll: larger feels further away. Keep it ≥ 0 so layers never lift off the
 * section's bottom edge.
 */
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
      className={cn("hero-parallax-layer absolute inset-x-0", className)}
      style={{ "--depth": depth } as CSSProperties}
    >
      {children}
    </div>
  );
}
