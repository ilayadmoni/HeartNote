"use client";

/**
 * FooterMobile Component
 * Mobile view for the footer - two-column layout for links
 */

import Link from "next/link";
import { FooterLinkColumn, SocialIcons, FooterLogo } from "../components";
import {
  FOOTER_LINKS,
  SOCIAL_LINKS,
  FOOTER_DESCRIPTION,
  COPYRIGHT_TEXT,
  SECURITY_TEXT,
} from "../constants";
import type { FooterProps } from "../types";

export function FooterMobile({ className = "" }: FooterProps) {
  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label="תחתית האתר"
      className={`bg-[#252d3b] text-white pt-10 pb-6 ${className}`}
      dir="rtl"
    >
      <div className="w-full px-4">
        {/* Top Section: Logo, Description & Social */}
        <div className="text-center mb-8">
          {/* Logo - Always dark mode, centered */}
          <div className="flex justify-center mb-4">
            <FooterLogo />
          </div>

          <p className="text-gray-300 text-sm leading-relaxed text-hebrew-body max-w-xs mx-auto">
            {FOOTER_DESCRIPTION}
          </p>

          {/* Social Icons */}
          <SocialIcons links={SOCIAL_LINKS} className="justify-center mt-6" />
        </div>

        {/* Link Columns - Two Column Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {FOOTER_LINKS.map((group) => (
            <FooterLinkColumn
              key={group.title}
              group={group}
              className="text-center"
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Bottom: Copyright - centered */}
        <div className="text-center text-xs text-gray-400">
          <p className="text-hebrew-body">{COPYRIGHT_TEXT}</p>
          {SECURITY_TEXT && (
            <p className="text-hebrew-body mt-1">{SECURITY_TEXT}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
