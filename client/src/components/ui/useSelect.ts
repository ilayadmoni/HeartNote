"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Fixed-position anchor rect so the popover escapes scrollable/overflow-hidden parents. */
export interface SelectAnchor {
  top: number;
  insetInlineStart: number;
  width: number;
  openUp: boolean;
}

const MAX_POPOVER_HEIGHT = 264;
const GAP = 6;

export function useSelect(optionCount: number, selectedIndex: number) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [anchor, setAnchor] = useState<SelectAnchor | null>(null);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < MAX_POPOVER_HEIGHT && r.top > spaceBelow;
    setAnchor({
      top: openUp ? r.top - GAP : r.bottom + GAP,
      // Inline-start offset works for both directions once the popover is RTL-aware.
      insetInlineStart: document.dir === "rtl" ? window.innerWidth - r.right : r.left,
      width: r.width,
      openUp,
    });
  }, []);

  const open = useCallback(() => {
    measure();
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  }, [measure, selectedIndex]);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const onReflow = () => measure();
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);
    return () => {
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
    };
  }, [isOpen, measure]);

  useEffect(() => {
    if (!isOpen) return;
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    // Optional call: not every environment implements scrollIntoView (jsdom).
    active?.scrollIntoView?.({ block: "nearest" });
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const step = useCallback(
    (delta: number) => setActiveIndex((i) => Math.min(optionCount - 1, Math.max(0, i + delta))),
    [optionCount],
  );

  return { triggerRef, listRef, isOpen, open, close, anchor, activeIndex, setActiveIndex, step };
}
