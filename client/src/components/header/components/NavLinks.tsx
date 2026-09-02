"use client";

/**
 * NavLinks Component
 * Navigation links for the header
 */

import { Link } from "@/i18n/navigation";
import type { NavLinksProps } from "../types";

export function NavLinks({
  items,
  className = "",
  onItemClick,
}: NavLinksProps) {
  return (
    <nav className={className} aria-label="ניווט ראשי">
      <ul className="flex items-center gap-6 lg:gap-8">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className="
                text-sm
                text-[#2e3c52] dark:text-gray-200
                hover:text-[#c4735f] dark:hover:text-[#e8917a]
                transition-colors duration-200
                whitespace-nowrap
                text-hebrew-heading
              "
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
