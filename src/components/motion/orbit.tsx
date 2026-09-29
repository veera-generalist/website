import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Closed elliptical path starting at the element's origin (SafetyWing hero clouds).
const orbitPath = (rx: number, ry: number) =>
  `path("M 0 0 A ${rx} ${ry} 0 1 1 0 ${2 * ry} A ${rx} ${ry} 0 1 1 0 0")`;

/** Floats its child along a small ellipse forever. Pure CSS; motion-safe only. */
export function Orbit({
  rx = 24,
  ry = 10,
  duration = 10,
  reverse = false,
  className,
  children,
}: {
  rx?: number;
  ry?: number;
  duration?: number;
  reverse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const style = {
    offsetPath: orbitPath(rx, ry),
    offsetAnchor: "0 0",
    offsetRotate: "0deg",
    animationDuration: `${duration}s`,
    animationDirection: reverse ? "reverse" : "normal",
  } as CSSProperties;

  return (
    <div
      style={style}
      className={cn("motion-safe:animate-[follow-path_10s_linear_infinite]", className)}
    >
      {children}
    </div>
  );
}
