"use client";

/**
 * NavLinks Component
 * Desktop navigation links with an accent underline on the active route.
 */

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavLinksProps } from "../types";

export function NavLinks({ items, className = "", onItemClick }: NavLinksProps): JSX.Element {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className={className} aria-label={t("menu")}>
      <ul className="flex items-center gap-6 lg:gap-8">
        {items.map((item) => {
          const isActive = item.href !== "/" && pathname?.startsWith(item.href.split("#")[0]);
          return (
            <li key={item.id} className="relative">
              <Link
                href={item.href}
                onClick={onItemClick}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative inline-block py-2 text-body-sm font-bold whitespace-nowrap transition-colors duration-base",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {t(item.labelKey)}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-0.5 rounded-pill bg-accent transition-opacity duration-base",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
