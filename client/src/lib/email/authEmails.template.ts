/**
 * Shared HTML wrapper for auth transactional emails.
 * Inline CSS only — email clients don't load stylesheets. Brand colors are
 * hardcoded hex (not Tailwind tokens) since this HTML never reaches the app.
 */

import type { Locale } from "@/i18n/locale";

const BRAND = "#D85A30";
const CREAM = "#F5EDE8";
const INK = "#2E3C52";

export function wrapper(
  locale: Locale,
  title: string,
  bodyHtml: string,
  ctaUrl: string,
  ctaLabel: string,
  footnote?: string,
): string {
  const dir = locale === "he" ? "rtl" : "ltr";
  return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${locale}">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: Arial, sans-serif; background-color: ${CREAM}; padding: 40px 20px; margin: 0;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <h1 style="color: ${INK}; font-size: 24px; margin: 0 0 16px; text-align: center;">${title}</h1>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">${bodyHtml}</p>
        <div style="text-align: center;">
          <a href="${ctaUrl}" style="display: inline-block; background: ${BRAND}; color: white; padding: 12px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 16px;">
            ${ctaLabel}
          </a>
        </div>
        ${footnote ? `<p style="color: #9ca3af; font-size: 12px; margin: 32px 0 0; text-align: center;">${footnote}</p>` : ""}
      </div>
    </body>
    </html>
  `;
}
