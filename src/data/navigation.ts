export type NavItem = { label: string; href: string; description?: string };

// One-page site: most items are anchors on the home page (SPEC §4). The "/#…" form
// works from any page, including case studies.
export const mainNav: NavItem[] = [
  { label: "Work", href: "/#work", description: "Case studies of things I've built" },
  { label: "About", href: "/#about", description: "Background, experience and skills" },
  { label: "Writing", href: "/writing", description: "Articles and notes" },
  { label: "Contact", href: "/#contact", description: "Get in touch" },
];
