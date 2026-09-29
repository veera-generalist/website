import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("hero parallax layers drift in proportion to their depth", async ({ page }) => {
  await page.goto("/");
  // Let the page-entrance slide (template.tsx) and layer load-ins finish first,
  // otherwise their transforms leak into the measurement.
  await page.waitForTimeout(1500);
  const tops = () =>
    page.$$eval(".hero-parallax-layer", (els) =>
      els.map((el) => ({
        depth: Number((el as HTMLElement).style.getPropertyValue("--depth")),
        top: el.getBoundingClientRect().top,
      })),
    );
  const before = await tops();
  await page.evaluate(() => window.scrollTo(0, 450)); // half a viewport
  await page.waitForTimeout(400);
  const after = await tops();
  expect(before.length).toBeGreaterThanOrEqual(3);
  for (const [i, layer] of before.entries()) {
    const drift = after[i].top - layer.top + 450; // movement relative to the page
    expect(Math.abs(drift - layer.depth * 0.5)).toBeLessThan(2);
  }
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("nothing animates and the parallax stays put", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(
      await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === "running").length,
      ),
    ).toBe(0);
    const first = await page.locator(".hero-parallax-layer").first().boundingBox();
    await page.evaluate(() => window.scrollTo(0, 450));
    await page.waitForTimeout(300);
    const second = await page.locator(".hero-parallax-layer").first().boundingBox();
    expect(second!.y - first!.y).toBeCloseTo(-450, 0);
  });
});

test("work mega-menu opens with the 3D scale-in animation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Work" }).hover();
  const viewport = page.locator('div[class*="radix-navigation-menu-viewport-height"]');
  await expect(viewport).toHaveAttribute("data-state", "open");
  const info = await viewport.evaluate((el) => ({
    animation: getComputedStyle(el).animationName,
    perspective: getComputedStyle(el.parentElement!).perspective,
  }));
  expect(info).toEqual({ animation: "scale-in", perspective: "2000px" });
});
