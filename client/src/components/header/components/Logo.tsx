"use client";

/**
 * Logo Component
 * HeartNote brand logo with animated spinning gear
 * Uses layered PNG images for the logo and gear
 */

import Link from "next/link";
import Image from "next/image";
import type { LogoProps } from "../types";

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center ${className}`}
      aria-label="HeartNote - דף הבית"
    >
      {/* Logo Container with layered images */}
      <div className="relative h-12 w-44 md:h-12 md:w-52">
        {/* Main Logo (Heart + Text) */}
        <Image
          src="/assets/images/HeartNoteLogoWithoutWheel.png"
          alt="HeartNote"
          fill
          className="object-contain object-right"
          priority
        />

        {/* Animated Gear Wheel - positioned at bottom-left of heart */}
        <div className="absolute z-10 top-[28%] right-[6%] w-[13%] h-[52%]">
          <Image
            src="/assets/images/HeartNoteLogoWheel.png"
            alt=""
            fill
            className="object-contain animate-spin-slow"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
