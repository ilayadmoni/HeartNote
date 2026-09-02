"use client";

/**
 * Preview Frame Page
 * Renders inside an iframe for isolated viewport
 * The iframe viewport IS the phone/desktop screen size
 */

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DateInvite,
  ScratchCard,
  Timeline,
  LoveCoupons,
  RelationshipQuiz,
  OpenWhen,
} from "@/components/templates";

// Template component map
const TEMPLATE_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: unknown }>
> = {
  "date-invite": DateInvite as React.ComponentType<{ data: unknown }>,
  "scratch-card": ScratchCard as React.ComponentType<{ data: unknown }>,
  timeline: Timeline as React.ComponentType<{ data: unknown }>,
  "love-coupons": LoveCoupons as React.ComponentType<{ data: unknown }>,
  "relationship-quiz": RelationshipQuiz as React.ComponentType<{
    data: unknown;
  }>,
  "open-when": OpenWhen as React.ComponentType<{ data: unknown }>,
};

export default function PreviewFramePage(): JSX.Element {
  const t = useTranslations("gallery");
  const params = useParams();
  const templateId = params.templateId as string;

  const defaultData = useMemo<Record<string, Record<string, unknown>>>(
    () => ({
      "date-invite": {
        question: t("previewFrame.dateInvite.question"),
        yesText: t("previewFrame.dateInvite.yes"),
        noText: t("previewFrame.dateInvite.no"),
        successMessage: t("previewFrame.dateInvite.success"),
      },
      "scratch-card": {
        title: t("previewFrame.scratchCard.title"),
        prizeContent: `🎁 ${t("previewFrame.scratchCard.prizeContent")}`,
      },
      timeline: { title: t("previewFrame.timeline.title"), events: [] },
      "love-coupons": { title: t("previewFrame.loveCoupons.title"), coupons: [] },
      "relationship-quiz": {
        title: t("previewFrame.relationshipQuiz.title"),
        questions: [],
        scoreMessages: [],
      },
      "open-when": { title: t("previewFrame.openWhen.title"), envelopes: [] },
    }),
    [t],
  );

  const [data, setData] = useState<Record<string, unknown>>({});

  // Load data from sessionStorage, falling back to translated defaults
  useEffect(() => {
    const stored = sessionStorage.getItem(`preview_${templateId}`);
    if (stored) {
      try {
        setData(JSON.parse(stored));
        return;
      } catch {
        // Fall through to default data
      }
    }
    setData(defaultData[templateId] ?? {});
  }, [templateId, defaultData]);

  // Listen for data updates from parent window
  useEffect(() => {
    function handleMessage(event: MessageEvent): void {
      if (event.data?.type === "UPDATE_DATA") {
        setData(event.data.data);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Poll for data changes in sessionStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem(`preview_${templateId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setData((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
              return parsed;
            }
            return prev;
          });
        } catch {
          // Ignore
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [templateId]);

  const Component = TEMPLATE_COMPONENTS[templateId];

  if (!Component) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-surface">
        <p className="text-body-sm text-ink-subtle">{t("states.previewNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-[100dvh]">
      <Component data={data} />
    </div>
  );
}
