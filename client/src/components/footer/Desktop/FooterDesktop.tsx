"use client";

/**
 * FooterDesktop Component
 * Desktop layout: brand + description on one side, link columns on the other.
 * Order follows document flow (logical props), so it mirrors correctly in LTR.
 */

import { useTranslations } from "next-intl";
import { FooterLinkColumn, SocialIcons, FooterLogo } from "../components";
import { FOOTER_LINKS, SOCIAL_LINKS } from "../constants";
import type { FooterProps } from "../types";

export function FooterDesktop({ className = "" }: FooterProps): JSX.Element {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label={tCommon("a11y.footer")}
      className={`bg-navy-900 text-cream-100 pt-12 pb-6 ${className}`}
    >
      <div className="section-shell">
        <div className="flex justify-between items-start gap-8">
          <div className="max-w-sm">
            <div className="mb-4">
              <FooterLogo />
            </div>

            <p className="text-cream-300 text-body-sm leading-relaxed">{t("description")}</p>

            <SocialIcons links={SOCIAL_LINKS} className="mt-6" />
          </div>

          <div className="flex gap-16">
            {FOOTER_LINKS.map((group) => (
              <FooterLinkColumn key={group.groupKey} group={group} />
            ))}
          </div>
        </div>

        <div className="h-px bg-cream-100/10 mt-10 mb-6" />

        <div className="flex items-center justify-between text-caption text-cream-400">
          <p>{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
