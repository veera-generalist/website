import { IconDownload } from "@tabler/icons-react";
import Image from "next/image";
import { FaqList } from "@/components/content-bits";
import { Reveal } from "@/components/motion/reveal";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { SkillsGrid } from "@/components/sections/skills-grid";
import { SocialLinks } from "@/components/social-links";
import { button } from "@/components/ui/button";
import { profile } from "@/data/profile";

// Home-page About section (replaces the old /about page; /about now redirects here).
export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-16 bg-mist">
      <div className="container grid max-w-5xl gap-12 py-20 md:grid-cols-[1fr_2fr] md:py-28">
        <Reveal className="flex flex-col items-start gap-6">
          <Image
            src={profile.image}
            alt={`Portrait of ${profile.name}`}
            width={320}
            height={320}
            className="aspect-square w-full max-w-[240px] rounded-3xl bg-white object-cover"
          />
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-ink-muted">Based in</dt>
              <dd className="font-medium">
                {profile.location.city}, {profile.location.country}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Status</dt>
              <dd className="font-medium">{profile.availability.label}</dd>
            </div>
          </dl>
          <a href="/resume.pdf" className={button({ variant: "dark" })} download>
            <IconDownload size={18} aria-hidden /> Download résumé
          </a>
          <SocialLinks className="-ml-2" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="about-heading" className="font-display text-3xl font-bold md:text-4xl">
            About me
          </h2>
          {/* First paragraph = short, citable bio (SPEC §10.4). */}
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/90">
            {profile.longBio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="container grid max-w-5xl gap-16 pb-20 md:pb-28 lg:grid-cols-2">
        <Reveal>
          <h3 className="mb-8 font-display text-2xl font-bold">Experience</h3>
          <ExperienceTimeline />
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="mb-8 font-display text-2xl font-bold">Skills</h3>
          <SkillsGrid />
        </Reveal>
      </div>

      <div className="container max-w-3xl pb-20 md:pb-28">
        <FaqList items={profile.faq} title="Frequently asked questions" />
      </div>
    </section>
  );
}
