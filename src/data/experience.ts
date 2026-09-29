export type Experience = {
  company: string;
  url?: string;
  role: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM; omit for current role
  location?: string;
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: "Current Company",
    url: "https://example.com",
    role: "Senior Software Engineer",
    start: "2023-01",
    location: "Remote",
    highlights: [
      "Led the rebuild of the marketing site on Next.js, cutting page load time by 40%.",
      "Introduced a shared component library used by 4 product teams.",
    ],
  },
  {
    company: "Previous Company",
    role: "Software Engineer",
    start: "2020-06",
    end: "2022-12",
    highlights: [
      "Shipped the customer dashboard used by 10k+ monthly active users.",
      "Set up end-to-end testing and CI, reducing production incidents.",
    ],
  },
];
