"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navLinkClass,
} from "@/components/ui/navigation-menu";
import { mainNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export type HeaderProject = { slug: string; title: string; summary: string };

export function Header({
  projects,
  showWriting,
}: {
  projects: HeaderProject[];
  showWriting: boolean;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = mainNav.filter((item) => showWriting || item.href !== "/writing");
  // On desktop the "Get in touch" button is the way to #contact, so the nav link would
  // duplicate it. The mobile menu keeps Contact because the button is hidden below lg.
  const desktopNav = nav.filter((item) => item.href !== "/#contact");
  // Anchor items have no route of their own; "Work" is active on case-study pages.
  const isActive = (href: string) =>
    href === "/#work"
      ? pathname.startsWith("/projects/")
      : !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex w-full justify-center text-white transition duration-200",
        scrolled ? "bg-ink/95 shadow-lg backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 font-display text-lg font-bold hover:opacity-80">
          {profile.name}
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {desktopNav.map((item) =>
              item.href === "/#work" && projects.length > 0 ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger data-active={isActive(item.href) ? "" : undefined}>
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[520px] gap-1 p-3">
                      {projects.map((p) => (
                        <li key={p.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/projects/${p.slug}`}
                              className="block rounded-xl p-3 transition-colors hover:bg-mist"
                            >
                              <span className="block font-semibold">{p.title}</span>
                              <span className="mt-1 line-clamp-2 block text-sm text-ink-muted">
                                {p.summary}
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/#work"
                            className="flex items-center gap-1 rounded-xl p-3 text-sm font-semibold hover:bg-mist"
                          >
                            All work <IconArrowRight size={16} aria-hidden />
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild active={isActive(item.href)}>
                    <Link href={item.href} className={navLinkClass}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <Link
          href="/#contact"
          className={button({ size: "sm", className: "ml-auto hidden shrink-0 lg:inline-flex" })}
        >
          Get in touch <IconArrowRight size={16} aria-hidden />
        </Link>

        <MobileNav items={nav} />
      </div>
    </header>
  );
}
