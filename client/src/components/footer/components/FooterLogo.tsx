"use client";

/**
 * FooterLogo Component
 * HeartNote logo styled for dark footer background (always dark mode appearance)
 */

import { Link } from "@/i18n/navigation";

export function FooterLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="HeartNote - דף הבית"
    >
      {/* Heart with Gear Icon */}
      <div className="relative w-8 h-8 md:w-9 md:h-9">
        {/* Heart SVG - Always dark mode style */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="footerHeartGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#d4826f" />
              <stop offset="100%" stopColor="#c4735f" />
            </linearGradient>
          </defs>
          {/* Dark mode heart - coral fill with cream border */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#cb8e7c"
            stroke="#f2e9e4"
            strokeWidth="2.5"
          />
        </svg>

        {/* Animated Gear - positioned at bottom-left of heart */}
        <div className="absolute -bottom-[2%] -left-[2%] w-[55%] h-[55%] flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[90%] h-[90%] animate-spin-slow text-[#f2e9e4]"
            aria-hidden="true"
          >
            <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </div>
      </div>
      {/* Logo Text - Always white for dark background */}
      <span
        className="text-2xl md:text-3xl font-bold text-white"
        style={{ fontFamily: "var(--font-glacial-indifference, sans-serif)" }}
      >
        HeartNote
      </span>
    </Link>
  );
}
