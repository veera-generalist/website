"use client";

import { motion } from "framer-motion";

// Re-mounts on every navigation, giving each page a subtle slide-in. Transform only —
// never opacity 0 — so server HTML is visible before hydration (LCP, no-JS crawlers).
// Skipped automatically for reduced-motion users via MotionProvider.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
