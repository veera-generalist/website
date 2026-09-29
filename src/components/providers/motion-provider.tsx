"use client";

import { MotionConfig } from "framer-motion";

// Honour prefers-reduced-motion for every framer-motion animation: transforms are
// skipped, opacity still fades. Components must not branch their markup on
// useReducedMotion() themselves: it's false on the server, which causes hydration mismatches.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
