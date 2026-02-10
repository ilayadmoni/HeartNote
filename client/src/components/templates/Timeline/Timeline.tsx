"use client";

/**
 * Timeline Component
 * Vertical timeline with animated event cards
 * Uses responsive wrapper pattern per project rules
 */

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TimelineDesktop } from "./Desktop/TimelineDesktop";
import { TimelineMobile } from "./Mobile/TimelineMobile";
import type { TemplateComponentProps, TimelineData } from "../types";

export function Timeline({ data }: TemplateComponentProps<TimelineData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return isMobile ? (
    <TimelineMobile data={data} />
  ) : (
    <TimelineDesktop data={data} />
  );
}
