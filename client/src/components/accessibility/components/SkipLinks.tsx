"use client";

/**
 * SkipLinks Component
 * Provides keyboard navigation shortcuts for screen reader users
 * Hidden visually but accessible to assistive technologies
 */

import { useTranslations } from "next-intl";
import { SKIP_LINKS } from "../constants";

export function SkipLinks(): JSX.Element {
  const t = useTranslations("common.a11y");
  return (
    <nav aria-label={t("skipLinksNav")} className="sr-only focus-within:not-sr-only">
      <ul className="flex gap-2 p-2 bg-navy-900 fixed top-0 start-0 end-0 z-[100]">
        {SKIP_LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className="
                px-4 py-2
                bg-accent text-accent-ink
                rounded-control font-bold
                focus:outline-none focus:ring-2 focus:ring-cream-100 focus:ring-offset-2 focus:ring-offset-navy-900
              "
            >
              {t(link.labelKey)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
