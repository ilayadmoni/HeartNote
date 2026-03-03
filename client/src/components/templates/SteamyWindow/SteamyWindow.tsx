"use client";

/**
 * SteamyWindow Component
 * Responsive wrapper — delegates to Desktop or Mobile layout
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SteamyWindowDesktop } from "./Desktop/SteamyWindowDesktop";
import { SteamyWindowMobile } from "./Mobile/SteamyWindowMobile";
import type { TemplateComponentProps, SteamyWindowData } from "./types";

export function SteamyWindow({
  data,
}: TemplateComponentProps<SteamyWindowData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <SteamyWindowMobile data={data} />
  ) : (
    <SteamyWindowDesktop data={data} />
  );
}
