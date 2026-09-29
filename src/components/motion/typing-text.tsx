"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Types and deletes each phrase in turn (the typed.js effect on SafetyWing's search box).
 * Renders the full first phrase on the server, so there's no empty flash or layout
 * shift before hydration. Decorative: pair it with an sr-only static sentence.
 */
export function TypingText({
  phrases,
  speed = 55,
  hold = 1800,
}: {
  phrases: string[];
  speed?: number;
  hold?: number;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(phrases[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce || phrases.length < 2) return;
    const full = phrases[index];
    const done = !deleting && length === full.length;
    const t = setTimeout(
      () => {
        if (done) return setDeleting(true);
        if (deleting && length === 0) {
          setDeleting(false);
          setIndex((index + 1) % phrases.length);
          return;
        }
        setLength(length + (deleting ? -1 : 1));
      },
      done ? hold : deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [reduce, phrases, index, length, deleting, speed, hold]);

  return (
    <span aria-hidden>
      {phrases[index]?.slice(0, length)}
      <span className="ml-0.5 inline-block w-[2px] animate-blink bg-current motion-reduce:animate-none">
        &nbsp;
      </span>
    </span>
  );
}
