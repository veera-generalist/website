import { experience } from "@/data/experience";
import { formatDate } from "@/lib/utils";

export function ExperienceTimeline() {
  return (
    <ol className="relative border-l-2 border-ink/10">
      {experience.map((job) => (
        <li key={`${job.company}-${job.start}`} className="mb-10 ml-6 last:mb-0">
          <span
            aria-hidden
            className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-sun"
          />
          <h4 className="font-display text-lg font-bold">
            {job.role} ·{" "}
            {job.url ? (
              <a href={job.url} className="underline-offset-4 hover:underline">
                {job.company}
              </a>
            ) : (
              job.company
            )}
          </h4>
          <p className="mt-1 text-sm text-ink-muted">
            <time dateTime={job.start}>{formatDate(job.start)}</time> –{" "}
            {job.end ? <time dateTime={job.end}>{formatDate(job.end)}</time> : "Present"}
            {job.location && ` · ${job.location}`}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink/90">
            {job.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
