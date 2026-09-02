/**
 * FooterLinkColumn Component
 * Column of links with title for footer
 */

import { Link } from "@/i18n/navigation";
import type { FooterLinkGroup } from "../types";

interface FooterLinkColumnProps {
  group: FooterLinkGroup;
  className?: string;
}

export function FooterLinkColumn({
  group,
  className = "",
}: FooterLinkColumnProps) {
  return (
    <div className={className}>
      <h3 className="text-white font-bold mb-4 text-hebrew-heading">
        {group.title}
      </h3>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm text-hebrew-body"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
