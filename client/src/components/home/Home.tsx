"use client";

/**
 * Home Component
 * Main home page with responsive wrapper
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HomeDesktop } from "./Desktop/HomeDesktop";
import { HomeMobile } from "./Mobile/HomeMobile";
import type { HomeProps } from "./types";

export function Home(props: HomeProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <HomeMobile {...props} /> : <HomeDesktop {...props} />;
}
