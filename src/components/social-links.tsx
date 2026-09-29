import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconMail } from "@tabler/icons-react";
import { profile, type SocialLink } from "@/data/profile";
import { cn } from "@/lib/utils";

const icons: Record<SocialLink["icon"], typeof IconMail> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  x: IconBrandX,
  mail: IconMail,
};

export function SocialLinks({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {profile.socials.map((s) => {
        const Icon = icons[s.icon];
        return (
          <li key={s.href}>
            {/* rel="me" links profiles to this site's identity (SPEC §10.5). */}
            <a
              href={s.href}
              rel="me noopener noreferrer"
              target="_blank"
              className="inline-flex rounded-full p-2 transition-opacity hover:opacity-70"
            >
              <Icon size={size} aria-hidden />
              <span className="sr-only">{s.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
