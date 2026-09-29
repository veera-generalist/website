import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  // Dates in frontmatter are YYYY-MM or YYYY-MM-DD; parse as UTC to avoid TZ drift.
  const [y, m, d] = date.split("-").map(Number);
  const value = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    ...(d ? { day: "numeric" } : {}),
    timeZone: "UTC",
  });
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
