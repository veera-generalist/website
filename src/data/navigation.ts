export type NavItem = { label: string; href: string };

// Footer links. One-page site: most are anchors on the home page (SPEC §4); the "/#…"
// form works from any page, including case studies.
export const footerNav: NavItem[] = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/#contact" },
];
