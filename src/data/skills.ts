export type SkillGroup = { name: string; items: string[] };

export const skills: SkillGroup[] = [
  { name: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { name: "Backend", items: ["Node.js", "Postgres", "REST", "GraphQL"] },
  { name: "Tooling", items: ["Git", "Docker", "Vercel", "Google Cloud"] },
];
