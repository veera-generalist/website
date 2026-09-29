import { IconMail } from "@tabler/icons-react";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/social-links";
import { button } from "@/components/ui/button";
import { profile } from "@/data/profile";

// Home-page Contact section (replaces the old /contact page; /contact now redirects here).
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 bg-sun py-20 text-ink md:py-28"
    >
      <Reveal className="container max-w-3xl text-center">
        <h2
          id="contact-heading"
          className="text-balance font-display text-3xl font-bold md:text-4xl"
        >
          Let&apos;s build something together
        </h2>
        <p className="mt-4 text-lg text-ink/80">
          {profile.availability.open
            ? "I'm currently open to new roles and freelance projects. Email is the fastest way to reach me; I usually reply within a couple of days."
            : "I'm not taking on new work right now, but I'm always happy to chat."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${profile.email}`} className={button({ variant: "dark", size: "lg" })}>
            <IconMail size={18} aria-hidden /> {profile.email}
          </a>
          <CopyEmail email={profile.email} variant="ghost" size="lg" />
        </div>
        <SocialLinks className="mt-6 justify-center" size={24} />
      </Reveal>
    </section>
  );
}
