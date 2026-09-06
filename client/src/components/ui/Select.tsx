"use client";

import { useId, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelect } from "./useSelect";
import { SelectMenu } from "./SelectMenu";
import type { SelectProps } from "./Select.types";

const OPEN_KEYS = ["Enter", " ", "ArrowDown", "ArrowUp"];

/**
 * Listbox replacing the native `<select>` so the closed control and the open menu
 * both follow the design tokens instead of the OS renderer.
 */
export function Select({
  options,
  value,
  onChange,
  label,
  placeholder,
  error,
  disabled,
  className,
  "aria-label": ariaLabel,
}: SelectProps): JSX.Element {
  const id = useId();
  const listId = `${id}-listbox`;
  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const { triggerRef, listRef, isOpen, open, close, anchor, activeIndex, setActiveIndex, step } =
    useSelect(options.length, selectedIndex);

  const commit = (index: number): void => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (!isOpen) {
      if (OPEN_KEYS.includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        step(e.key === "ArrowDown" ? 1 : -1);
        break;
      case "Home":
      case "End":
        e.preventDefault();
        setActiveIndex(e.key === "Home" ? 0 : options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-body-sm font-bold text-ink">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        // Must sit on the focused element, not the listbox — the button keeps focus.
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full min-h-[3rem] px-4 flex items-center gap-2 text-start cursor-pointer",
          "rounded-control border bg-surface-raised text-ink text-body-md",
          "transition-colors duration-base ease-out-quint",
          "border-line-strong hover:border-ink-subtle",
          "focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25",
          isOpen && "border-accent ring-2 ring-accent/25",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25",
          disabled && "opacity-50 cursor-not-allowed hover:border-line-strong",
          className,
        )}
      >
        <span className={cn("flex-1 truncate", !selected && "text-ink-subtle")}>
          {selected?.label ?? placeholder ?? ""}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-ink-subtle transition-transform duration-base ease-out-quint",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {error && (
        <p role="alert" className="text-caption text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {isOpen && anchor && (
        <SelectMenu
          id={id}
          listId={listId}
          options={options}
          value={value}
          activeIndex={activeIndex}
          anchor={anchor}
          listRef={listRef}
          onHover={setActiveIndex}
          onPick={commit}
        />
      )}
    </div>
  );
}
