"use client";

/**
 * SkipLinks Component
 * Provides keyboard navigation shortcuts for screen reader users
 * Hidden visually but accessible to assistive technologies
 */

import { SKIP_LINKS } from "../constants";

export function SkipLinks() {
  return (
    <nav aria-label="קישורי דילוג" className="sr-only focus-within:not-sr-only">
      <ul className="flex gap-2 p-2 bg-[#2e3c52] fixed top-0 right-0 left-0 z-[100]">
        {SKIP_LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className="
                px-4 py-2 
                bg-[#d4826f] text-white 
                rounded-md font-bold
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2e3c52]
                text-hebrew-heading
              "
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
