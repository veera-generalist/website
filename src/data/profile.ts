// Single source of truth for identity. Page copy, JSON-LD, llms.txt and meta
// tags all read from here — keep it consistent with GitHub/LinkedIn (SPEC §10.5).

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "x" | "mail";
};

export type FaqItem = { q: string; a: string };

export type Profile = {
  name: string;
  alternateNames: string[];
  jobTitle: string;
  pitch: string;
  /** Cycled by the hero typing effect: "I build <role>". */
  roles: string[];
  shortBio: string;
  longBio: string[];
  location: { city: string; country: string };
  email: string;
  image: string;
  availability: { open: boolean; label: string };
  worksFor?: { name: string; url?: string };
  alumniOf?: { name: string; url?: string }[];
  knowsAbout: string[];
  socials: SocialLink[];
  faq: FaqItem[];
};

export const profile: Profile = {
  name: "Your Name",
  alternateNames: [],
  jobTitle: "Software Engineer",
  pitch: "I build fast, accessible web products — from first sketch to production.",
  roles: ["fast, accessible websites", "design systems that scale", "products people enjoy using"],
  shortBio:
    "Your Name is a software engineer based in Your City who builds web products with TypeScript, React and Next.js.",
  longBio: [
    "Your Name is a software engineer based in Your City who builds web products with TypeScript, React and Next.js.",
    "Replace this paragraph with a few sentences about your background, what you care about, and the kind of work you're looking for.",
  ],
  location: { city: "Your City", country: "Your Country" },
  email: "hello@example.com",
  image: "/images/avatar.svg",
  availability: { open: true, label: "Open to new opportunities" },
  worksFor: { name: "Current Company", url: "https://example.com" },
  alumniOf: [{ name: "Your University" }],
  knowsAbout: ["TypeScript", "React", "Next.js", "Web performance", "Accessibility"],
  socials: [
    { label: "GitHub", href: "https://github.com/your-handle", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", icon: "linkedin" },
    { label: "X", href: "https://x.com/your-handle", icon: "x" },
  ],
  faq: [
    {
      q: "What does Your Name do?",
      a: "Your Name is a software engineer who designs and builds web products end to end, focusing on performance and accessibility.",
    },
    {
      q: "What technologies does Your Name use?",
      a: "Mostly TypeScript, React and Next.js on the front end, with Node.js and Postgres on the back end.",
    },
    {
      q: "How can I contact Your Name?",
      a: "Email hello@example.com or reach out on LinkedIn.",
    },
  ],
};
