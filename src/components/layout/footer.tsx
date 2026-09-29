import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { footerNav } from "@/data/navigation";
import { profile } from "@/data/profile";

export function Footer({ showWriting }: { showWriting: boolean }) {
  const nav = footerNav.filter((item) => showWriting || item.href !== "/writing");

  return (
    <footer className="bg-ink text-white">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-bold">{profile.name}</p>
          <p className="mt-2 text-sm text-white/70">{profile.pitch}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/resume.pdf" className="hover:underline">
                Résumé
              </a>
            </li>
            <li>
              <a href="/llms.txt" className="hover:underline">
                llms.txt
              </a>
            </li>
          </ul>
        </nav>
        <SocialLinks className="-ml-2" />
      </div>
      <div className="border-t border-white/10">
        <p className="container py-6 text-xs text-white/60">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
