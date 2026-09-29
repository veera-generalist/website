import { describe, expect, it } from "vitest";
import { absoluteUrl, cn, formatDate } from "@/lib/utils";

describe("formatDate", () => {
  it("formats month-only dates without a day", () => {
    expect(formatDate("2025-03")).toBe("Mar 2025");
  });

  it("formats full dates in UTC, so there's no timezone drift", () => {
    expect(formatDate("2026-09-29")).toBe("Sep 29, 2026");
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
  });
});

describe("absoluteUrl", () => {
  it("resolves paths against the site URL", () => {
    expect(absoluteUrl("/projects/x")).toBe("https://example.test/projects/x");
    expect(absoluteUrl()).toBe("https://example.test/");
  });
});

describe("cn", () => {
  it("merges conflicting Tailwind classes, last one wins", () => {
    expect(cn("p-4", "p-2", false && "hidden")).toBe("p-2");
  });
});
