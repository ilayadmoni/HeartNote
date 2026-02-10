"use client";

/**
 * Preview Frame Page
 * Renders inside an iframe for isolated viewport
 * The iframe viewport IS the phone/desktop screen size
 */

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

// Default data for each template
const DEFAULT_DATA: Record<string, Record<string, unknown>> = {
  "date-invite": {
    question: "?האם תצא/י איתי לדייט",
    yesText: "כן!",
    noText: "לא",
    successMessage: "!יש! איזה כיף",
  },
  "scratch-card": {
    title: "גרד וגלה את ההפתעה",
    prizeContent: "🎁 זכית!",
  },
  timeline: {
    title: "הסיפור שלנו",
    events: [],
  },
  "love-coupons": {
    title: "קופונים מיוחדים",
    coupons: [],
  },
  "relationship-quiz": {
    title: "?כמה את/ה מכיר/ה אותי",
    questions: [],
    scoreMessages: [],
  },
  "open-when": {
    title: "מכתבים מיוחדים",
    envelopes: [],
  },
};

export default function PreviewFramePage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const [data, setData] = useState<Record<string, unknown>>(
    DEFAULT_DATA[templateId] || {},
  );

  // Load data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(`preview_${templateId}`);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // Use default data
      }
    }
  }, [templateId]);

  // Listen for data updates from parent window
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
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
      <div className="h-screen flex items-center justify-center bg-[#faf7f5]">
        <p className="text-gray-400 text-sm">תבנית לא נמצאה</p>
      </div>
    );
  }

  return <Component data={data} />;
}
