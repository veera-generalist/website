"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll-reveal wrapper. Content is always server-rendered into the HTML;
// only the entrance is animated (SPEC §10.1). Reduced motion is handled globally by
// MotionProvider (y is skipped, just a fade) so server and client markup always match.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
