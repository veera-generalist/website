import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { slugs, trackErrors } from "./helpers";

const pages = [
  "/",
  ...slugs("projects")
    .slice(0, 1)
    .map((s) => `/projects/${s}`),
];

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test.describe(`motion: ${reducedMotion}`, () => {
    test.use({ contextOptions: { reducedMotion } });

    for (const route of pages) {
      test(`${route} has no console errors and exactly one h1`, async ({ page }) => {
        const errors = trackErrors(page);
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        expect(errors).toEqual([]);
        await expect(page.locator("h1")).toHaveCount(1);
      });
    }
  });
}

test("hero CTA scrolls to the work section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "View my work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});

for (const width of [1440, 390]) {
  test(`header is just the name and "Get in touch" at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const links = page.locator("header a:visible");
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute("href", "/");
    await expect(links.nth(1)).toHaveAttribute("href", "/#contact");
    await expect(links.nth(1)).toHaveText(/Get in touch/);
    await expect(page.locator("header button")).toHaveCount(0);
  });
}

for (const route of pages) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(serious).toEqual([]);
  });

  test(`${route} has no horizontal overflow at 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test(`${route} JSON-LD @id references all resolve`, async ({ page }) => {
    await page.goto(route);
    const dangling = await page.evaluate(() => {
      const out: string[] = [];
      for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
        const graph = JSON.parse(s.textContent ?? "{}")["@graph"] ?? [];
        const defined = new Set(graph.map((n: { "@id"?: string }) => n["@id"]).filter(Boolean));
        const walk = (v: unknown) => {
          if (Array.isArray(v)) return v.forEach(walk);
          if (v && typeof v === "object") {
            const o = v as Record<string, unknown>;
            const keys = Object.keys(o);
            if (keys.length === 1 && typeof o["@id"] === "string" && !defined.has(o["@id"]))
              out.push(o["@id"]);
            keys.forEach((k) => walk(o[k]));
          }
        };
        walk(graph);
      }
      return out;
    });
    expect(dangling).toEqual([]);
  });
}
