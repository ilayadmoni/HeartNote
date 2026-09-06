"use client";

import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectAnchor } from "./useSelect";
import type { SelectOption } from "./Select.types";

interface SelectMenuProps {
  id: string;
  listId: string;
  options: SelectOption[];
  value: string;
  activeIndex: number;
  anchor: SelectAnchor;
  listRef: React.RefObject<HTMLUListElement>;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}

/**
 * Portalled listbox popover. Rendered into `document.body` with a fixed anchor so
 * scrollable or clipping ancestors (e.g. the editor sidebar) can't cut it off.
 */
export function SelectMenu({
  id,
  listId,
  options,
  value,
  activeIndex,
  anchor,
  listRef,
  onHover,
  onPick,
}: SelectMenuProps): JSX.Element | null {
  if (typeof document === "undefined") return null;

  return createPortal(
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      style={{
        position: "fixed",
        top: anchor.top,
        insetInlineStart: anchor.insetInlineStart,
        width: anchor.width,
        transform: anchor.openUp ? "translateY(-100%)" : undefined,
      }}
      className="z-50 max-h-[264px] overflow-y-auto p-1 rounded-control border border-line bg-surface-raised shadow-lift animate-scale-in"
    >
      {options.map((option, i) => {
        const isSelected = option.value === value;
        return (
          <li
            key={option.value}
            id={`${id}-option-${i}`}
            role="option"
            aria-selected={isSelected}
            data-active={i === activeIndex}
            onPointerEnter={() => onHover(i)}
            onClick={() => onPick(i)}
            className={cn(
              "min-h-[2.75rem] px-3 flex items-center gap-2 rounded-[10px] cursor-pointer",
              "text-body-sm text-ink transition-colors duration-fast ease-out-quint",
              i === activeIndex && "bg-surface-sunken",
              isSelected && "bg-accent-soft text-accent font-bold",
            )}
          >
            <span className="flex-1 truncate">{option.label}</span>
            {isSelected && (
              <Check size={14} strokeWidth={3} aria-hidden="true" className="shrink-0" />
            )}
          </li>
        );
      })}
    </ul>,
    document.body,
  );
}
