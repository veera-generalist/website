import { Chips } from "@/components/content-bits";
import { skills } from "@/data/skills";

export function SkillsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {skills.map((group) => (
        <div key={group.name} className="rounded-2xl border border-ink/10 p-6">
          <h4 className="font-semibold">{group.name}</h4>
          <div className="mt-3">
            <Chips items={group.items} />
          </div>
        </div>
      ))}
    </div>
  );
}
