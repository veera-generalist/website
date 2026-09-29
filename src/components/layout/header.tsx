"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

// Minimal header for the one-page site (SPEC §7): name → home, "Get in touch" → #contact.
// Section links live in the hero CTAs and the footer, so there's no nav menu here.
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex w-full justify-center text-white transition duration-200",
        scrolled ? "bg-ink/95 shadow-lg backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-bold hover:opacity-80">
          {profile.name}
        </Link>
        <Link href="/#contact" className={button({ size: "sm", className: "shrink-0" })}>
          Get in touch <IconArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </header>
  );
}
