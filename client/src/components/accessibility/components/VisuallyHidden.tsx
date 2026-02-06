/**
 * VisuallyHidden Component
 * Hides content visually but keeps it accessible to screen readers
 */

import type { VisuallyHiddenProps } from "../types";

export function VisuallyHidden({
  children,
  as: Component = "span",
}: VisuallyHiddenProps) {
  return <Component className="sr-only">{children}</Component>;
}
