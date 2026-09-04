"use client";

/**
 * DateInvite Component
 * Premium romantic "Will you go out with me?" experience
 * Uses responsive wrapper pattern per project rules
 */

import { useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DateInviteDesktop } from "./Desktop/DateInviteDesktop";
import { DateInviteMobile } from "./Mobile/DateInviteMobile";
import type { TemplateComponentProps, DateInviteData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function DateInvite({ data }: TemplateComponentProps<DateInviteData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [answered, setAnswered] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  const handleYes = useCallback(() => {
    setAnswered(true);
    // Generate color variations based on primaryColor
    const colors = [
      primaryColor,
      `${primaryColor}cc`,
      "#faf7f5",
      "#ff6b8a",
      "#ff8fa3",
    ];
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
  }, [primaryColor]);

  const handleReset = useCallback(() => {
    setAnswered(false);
    setNoPosition({ x: 0, y: 0 });
    setDodgeCount(0);
  }, []);

  const handleNoHover = useCallback(() => {
    // Constrained to stay within card bounds; radius grows slightly each dodge, capped
    const escalation = Math.min(dodgeCount, 6);
    const radiusX = (isMobile ? 100 : 180) + escalation * (isMobile ? 12 : 18);
    const radiusY = (isMobile ? 60 : 100) + escalation * (isMobile ? 8 : 12);
    setNoPosition({
      x: (Math.random() - 0.5) * radiusX,
      y: (Math.random() - 0.5) * radiusY,
    });
    setDodgeCount((count) => count + 1);
  }, [isMobile, dodgeCount]);

  const sharedProps = {
    data,
    answered,
    noPosition,
    onYes: handleYes,
    onReset: handleReset,
    onNoHover: handleNoHover,
  };

  if (!mounted) return null;

  return isMobile ? (
    <DateInviteMobile {...sharedProps} />
  ) : (
    <DateInviteDesktop {...sharedProps} />
  );
}
