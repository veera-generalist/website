import type { FaqItem } from "@/data/profile";
import { formatDate } from "@/lib/utils";

/** Answer-first summary shown at the top of projects/posts (SPEC §10.4). */
export function Tldr({ children }: { children: string }) {
  return (
    <aside
      aria-label="Summary"
      className="rounded-2xl border-l-4 border-sun bg-mist p-5 text-base leading-relaxed"
    >
      <p>
        <strong className="mr-2 font-semibold">TL;DR</strong>
        {children}
      </p>
    </aside>
  );
}

export function PublishedDates({
  date,
  updated,
  readingTime,
}: {
  date: string;
  updated?: string;
  readingTime?: string;
}) {
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
      <span>
        Published <time dateTime={date}>{formatDate(date)}</time>
      </span>
      {updated && updated !== date && (
        <span>
          Updated <time dateTime={updated}>{formatDate(updated)}</time>
        </span>
      )}
      {readingTime && <span>{readingTime}</span>}
    </p>
  );
}

export function FaqList({ items, title = "FAQ" }: { items: FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-2xl font-bold">
        {title}
      </h2>
      <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {items.map((f) => (
          <div key={f.q} className="py-5">
            <dt className="font-semibold">{f.q}</dt>
            <dd className="mt-2 text-ink-muted">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-ink">
          {item}
        </li>
      ))}
    </ul>
  );
}
