import { test, expect, type Page } from "@playwright/test";
import { ROUTES, HEBREW, EM_DASH, shotPath, withLocale, type Locale } from "./helpers";

const LOCALES: Locale[] = ["he", "en"];

const CONSENT = JSON.stringify({
  consent: { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" },
  timestamp: "2026-01-01T00:00:00.000Z",
});

/** Pre-seed a declined cookie consent and light theme so chrome is stable. */
async function seedStorage(page: Page): Promise<void> {
  await page.addInitScript((consent: string) => {
    try {
      window.localStorage.setItem("heartnote_cookie_consent", consent);
      window.localStorage.setItem("heartnote-theme", "light");
    } catch {
      /* storage unavailable */
    }
  }, CONSENT);
}

/** Scroll through the page so whileInView entrances fire before a full-page shot. */
async function sweep(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.4));
    for (let pass = 0; pass < 2; pass += 1) {
      const total = document.documentElement.scrollHeight;
      for (let y = 0; y <= total; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 260));
      }
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle").catch(() => undefined);
  // Pre-hydration loader fades after fonts + load; give animations a beat.
  await page.waitForSelector("#initial-loader.il-hidden", { timeout: 30_000 }).catch(() => undefined);
  await page.waitForSelector("[data-testid=route-loading]", { state: "detached", timeout: 60_000 }).catch(() => undefined);
  await page.waitForFunction(() => (document.body.innerText ?? "").trim().length > 40, undefined, { timeout: 30_000 }).catch(() => undefined);
  await page.waitForTimeout(1200);
  await sweep(page);
}

for (const locale of LOCALES) {
  test.describe(`locale ${locale}`, () => {
    for (const route of ROUTES) {
      test(`${route.name} renders correctly`, async ({ page }, info) => {
        await seedStorage(page);
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
            const skip = "[data-user-content], [dir=auto], [lang]";
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
