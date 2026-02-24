"use client";

/**
 * FooterDesktop Component
 * Desktop view for the footer - RTL layout with logo on right, links on left
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

export function FooterDesktop({ className = "" }: FooterProps) {
  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label="תחתית האתר"
      className={`bg-[#252d3b] text-white pt-12 pb-6 ${className}`}
      dir="rtl"
    >
      <div className="w-full px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex justify-between items-start gap-8">
          {/* Right Side: Brand & Description (RTL) */}
          <div className="max-w-sm">
            {/* Logo - Always dark mode */}
            <div className="mb-4">
              <FooterLogo />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed text-hebrew-body">
              {FOOTER_DESCRIPTION}
            </p>

            {/* Social Icons */}
            <SocialIcons links={SOCIAL_LINKS} className="mt-6" />
          </div>

          {/* Left Side: Link Columns (RTL - so they appear on left) */}
          <div className="flex gap-16">
            {FOOTER_LINKS.map((group) => (
              <FooterLinkColumn key={group.title} group={group} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mt-10 mb-6" />

        {/* Bottom Row: Copyright & Security */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <p className="text-hebrew-body">{COPYRIGHT_TEXT}</p>
          <p className="text-hebrew-body">{SECURITY_TEXT}</p>
        </div>
      </div>
    </footer>
  );
}
