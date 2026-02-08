"use client";

/**
 * DateInvite Component
 * Premium romantic "Will you go out with me?" experience
 * Uses responsive wrapper pattern per project rules
 */

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DateInviteDesktop } from "./Desktop/DateInviteDesktop";
import { DateInviteMobile } from "./Mobile/DateInviteMobile";
import type { TemplateComponentProps, DateInviteData } from "../types";

export function DateInvite({ data }: TemplateComponentProps<DateInviteData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [answered, setAnswered] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const handleYes = useCallback(() => {
    setAnswered(true);
    const colors = ["#d4826f", "#e8917a", "#faf7f5", "#ff6b8a", "#ff8fa3"];
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.3, y: 0.5 },
      colors,
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.7, y: 0.5 },
      colors,
    });
  }, []);

  const handleReset = useCallback(() => {
    setAnswered(false);
    setNoPosition({ x: 0, y: 0 });
  }, []);

  const handleNoHover = useCallback(() => {
    setNoPosition({
      x: (Math.random() - 0.5) * (isMobile ? 60 : 120),
      y: (Math.random() - 0.5) * (isMobile ? 30 : 60),
    });
  }, [isMobile]);

  const sharedProps = {
    data,
    answered,
    noPosition,
    onYes: handleYes,
    onReset: handleReset,
    onNoHover: handleNoHover,
  };

  return isMobile ? (
    <DateInviteMobile {...sharedProps} />
  ) : (
    <DateInviteDesktop {...sharedProps} />
  );
}
