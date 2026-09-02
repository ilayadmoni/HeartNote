"use client";

/**
 * FooterLinkColumn Component
 * Column of links with title for footer
 */

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FooterLinkGroup } from "../types";

interface FooterLinkColumnProps {
  group: FooterLinkGroup;
  className?: string;
}

export function FooterLinkColumn({ group, className = "" }: FooterLinkColumnProps): JSX.Element {
  const t = useTranslations(`footer.groups.${group.groupKey}`);

  return (
    <div className={className}>
      <h3 className="text-cream-100 font-bold mb-4 text-title-sm">{t("title")}</h3>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              className="text-cream-400 hover:text-cream-100 transition-colors duration-200 text-body-sm"
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
