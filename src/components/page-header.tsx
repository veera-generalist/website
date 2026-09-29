import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Dark band at the top of inner pages; the transparent header sits over it.
export function PageHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-ink pb-16 pt-32 text-white md:pb-20 md:pt-40", className)}>
      <div className="container max-w-4xl">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-sun">{eyebrow}</p>
        )}
        <h1 className="mt-3 text-balance font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {children && <div className="mt-5 text-lg text-white/80">{children}</div>}
      </div>
    </section>
  );
}
