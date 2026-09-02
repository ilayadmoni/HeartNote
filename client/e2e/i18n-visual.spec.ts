import { test, expect, type Page } from "@playwright/test";
import { ROUTES, HEBREW, EM_DASH, shotPath, withLocale, type Locale } from "./helpers";

const LOCALES: Locale[] = ["he", "en"];

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle").catch(() => undefined);
  // Pre-hydration loader fades after fonts + load; give animations a beat.
  await page.waitForSelector("#initial-loader.il-hidden", { timeout: 30_000 }).catch(() => undefined);
  await page.waitForSelector("[data-testid=route-loading]", { state: "detached", timeout: 60_000 }).catch(() => undefined);
  await page.waitForFunction(() => (document.body.innerText ?? "").trim().length > 40, undefined, { timeout: 30_000 }).catch(() => undefined);
  await page.waitForTimeout(1200);
}

for (const locale of LOCALES) {
  test.describe(`locale ${locale}`, () => {
    for (const route of ROUTES) {
      test(`${route.name} renders correctly`, async ({ page }, info) => {
        await page.goto(withLocale(locale, route.path));
        await settle(page);

        const html = page.locator("html");
        await expect(html).toHaveAttribute("lang", locale);
        await expect(html).toHaveAttribute("dir", locale === "he" ? "rtl" : "ltr");

        const hreflangs = await page.locator("link[rel=alternate][hreflang]").count();
        if (route.seo) expect(hreflangs, "hreflang alternates").toBeGreaterThanOrEqual(3);

        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(1);

        const text = await page.evaluate(() => document.body.innerText);
        expect(text.includes(EM_DASH), "em dash present").toBeFalsy();

        if (locale === "en" && route.checkUntranslated) {
          const chrome = await page.evaluate(() => {
            const skip = "[data-user-content], [dir=auto]";
            const nodes = Array.from(document.body.querySelectorAll("h1,h2,h3,p,a,button,label,span,li"));
            return nodes
              .filter((n) => !n.closest(skip))
              .map((n) => n.textContent ?? "")
              .join("\n");
          });
          const leaks = chrome.match(HEBREW) ?? [];
          expect(leaks.length, `untranslated Hebrew on ${route.path}: ${chrome.slice(0, 200)}`).toBe(0);
        }

        await page.screenshot({ path: shotPath(info.project.name, locale, route.name), fullPage: true });
      });
    }
  });
}
