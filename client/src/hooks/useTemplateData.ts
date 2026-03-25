/**
 * useTemplateData Hook
 * Manages the structured { templateId, userChoices } state for the editor.
 *
 * userChoices is flexible — it stores any value type (string, number,
 * boolean, array, object) depending on the template's field schema.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type { TemplateUserData } from "@/components/editor/types";

interface UseTemplateDataReturn {
  /** Full structured object: { templateId, userChoices } */
  templateData: TemplateUserData;
  /** Shortcut to templateData.userChoices for passing to preview/sidebar */
  userChoices: Record<string, unknown>;
  /** Update a single field inside userChoices */
  updateChoice: (key: string, value: unknown) => void;
  /** Replace the entire userChoices map (e.g. for bulk reset) */
  setChoices: (choices: Record<string, unknown>) => void;
  /** console.log the structured object for dev-tools inspection */
  logData: (label?: string) => void;
}

export function useTemplateData(
  templateId: string,
  defaultData: Record<string, unknown> = {},
): UseTemplateDataReturn {
  const [state, setState] = useState<TemplateUserData>({
    templateId,
    userChoices: { ...defaultData },
  });

  // Keep a ref for the latest state so logData doesn't go stale
  const stateRef = useRef(state);
  stateRef.current = state;

  // Track which template has been initialized to prevent overwriting
  // async data (e.g. restored drafts) during shallow navigations.
  const initializedForTemplate = useRef<string | null>(null);

  // Reset editor state when switching templates so choices don't bleed across routes.
  // Only fires when navigating to a genuinely DIFFERENT template.
  useEffect(() => {
    if (initializedForTemplate.current !== templateId) {
      setState({
        templateId,
        userChoices: { ...defaultData },
      });
      initializedForTemplate.current = templateId;
    }
  }, [templateId, defaultData]);

  /** Update one key inside userChoices */
  const updateChoice = useCallback((key: string, value: unknown) => {
    setState((prev) => ({
      ...prev,
      userChoices: { ...prev.userChoices, [key]: value },
    }));
  }, []);

  /** Wholesale replacement of userChoices */
  const setChoices = useCallback(
    (choices: Record<string, unknown>) => {
      setState({ templateId, userChoices: { ...choices } });
    },
    [templateId],
  );

  /** Pretty-print to console for dev inspection (no-op in production) */
  const logData = useCallback((label = "שליחה") => {
    if (process.env.NODE_ENV !== "development") return;
    const current = stateRef.current;
    console.group(`[HeartNote] ${label}`);
    console.log("templateId:", current.templateId);
    console.log("userChoices:", current.userChoices);
    console.log("Full object:", JSON.parse(JSON.stringify(current)));
    console.groupEnd();
  }, []);

  return {
    templateData: state,
    userChoices: state.userChoices,
    updateChoice,
    setChoices,
    logData,
  };
}
