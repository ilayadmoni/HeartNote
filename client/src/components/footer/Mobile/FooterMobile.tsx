"use client";

/**
 * FooterMobile Component
 * Mobile layout: centered brand block, then a two-column link grid.
 */

import { useTranslations } from "next-intl";
import { FooterLinkColumn, SocialIcons, FooterLogo } from "../components";
import { FOOTER_LINKS, SOCIAL_LINKS } from "../constants";
import type { FooterProps } from "../types";

export function FooterMobile({ className = "" }: FooterProps): JSX.Element {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label={tCommon("a11y.footer")}
      className={`bg-navy-900 text-cream-100 pt-10 pb-6 ${className}`}
    >
      <div className="px-gutter">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FooterLogo />
          </div>

          <p className="text-cream-300 text-body-sm leading-relaxed max-w-xs mx-auto">
            {t("description")}
          </p>

          <SocialIcons links={SOCIAL_LINKS} className="justify-center mt-6" />
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {FOOTER_LINKS.map((group) => (
            <FooterLinkColumn key={group.groupKey} group={group} className="text-center" />
          ))}
        </div>

        <div className="h-px bg-cream-100/10 mb-6" />

        <div className="text-center text-caption text-cream-400">
          <p>{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
