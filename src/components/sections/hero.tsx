import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { TypingText } from "@/components/motion/typing-text";
import { button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { HeroScene } from "./hero-scene";

// Text entrance is transform-only (no fade), so it's visible in the server HTML and
// never delays LCP. The <h1> itself doesn't animate at all (SPEC §10 guardrail).
const rise =
  "animate-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none";

export function Hero() {
  return (
    <section className="relative isolate overflow-clip bg-ink text-white">
      <HeroScene />
      <div className="container relative max-w-5xl pb-40 pt-36 md:pb-72 md:pt-44">
        {profile.availability.open && (
          <p
            className={`${rise} inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            {profile.availability.label}
          </p>
        )}
        <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-[1.05] md:text-7xl">
          Hi, I&apos;m {profile.name}. <span className="text-sun">{profile.jobTitle}.</span>
        </h1>
        <p
          className={`${rise} mt-5 min-h-[2.6em] font-display text-2xl text-white/90 delay-100 sm:min-h-[1.3em] md:text-3xl`}
        >
          <span className="sr-only">I build {profile.roles.join(", ")}.</span>
          <span aria-hidden>I build </span>
          <span className="text-sun">
            <TypingText phrases={profile.roles} />
          </span>
        </p>
        {/* Plain-language bio in the first screen: likeliest text for AI answers to cite. */}
        <p className={`${rise} mt-5 max-w-2xl text-lg text-white/75 delay-200 md:text-xl`}>
          {profile.shortBio}
        </p>
        <div className={`${rise} mt-10 flex flex-wrap gap-3 delay-300`}>
          <Link href="/#work" className={button({ size: "lg" })}>
            View my work <IconArrowRight size={18} aria-hidden />
          </Link>
          <Link
            href="/#contact"
            className={button({ variant: "outline", size: "lg", className: "backdrop-blur" })}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
