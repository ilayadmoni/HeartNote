"use client";

/**
 * UserPageClient Component
 * Renders the template on the public viewer page with:
 * - "Nuclear" grid centering on mobile (100dvh)
 * - Forced Light Mode (templates always render as designed)
 * - Three-tier watermark: white base → watermark at z-10 → transparent template at z-20 with solid cards
 * - Main website Footer at the bottom
 */

import { useEffect } from "react";
import { TemplateRenderer } from "@/components/templates";
import { Footer } from "@/components/footer";

interface UserPageClientProps {
  templateKey: string;
  contentData: Record<string, unknown>;
  isPaid: boolean;
}

export function UserPageClient({
  templateKey,
  contentData,
  isPaid,
}: UserPageClientProps) {
  const componentKey = templateKey
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // ── Force Light Mode on this route ──
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");

    root.classList.remove("dark");
    root.classList.add("light");

    return () => {
      if (wasDark) {
        root.classList.remove("light");
        root.classList.add("dark");
      }
    };
  }, []);

  return (
    <div className="text-slate-900">
      {isPaid ? (
        /* ═══ Paid User — clean render, no watermark ═══ */
        <div className="min-h-[100dvh] lg:min-h-0 grid place-items-center lg:block bg-[#faf7f5]">
          <TemplateRenderer componentKey={componentKey} data={contentData} />
        </div>
      ) : (
        /* ═══ Free User — 3-Tier Watermark Sandwich ═══
         *
         * CSS stacking order within the isolate context:
         *
         * TIER 1  Root          — bg-white, isolate → solid white base
         * TIER 2  Watermark     — absolute z-10 opacity-20, semi-transparent pattern
         * TIER 3  Template      — relative z-20, bg-transparent root lets watermark
         *                         show through; inner cards have bg-white for solidity
         */
        <div className="relative w-full min-h-[450px] bg-white isolate overflow-hidden flex flex-col justify-center items-center">
          {/* TIER 2: Watermark pattern — semi-transparent on solid white base */}
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-20"
            style={{
              backgroundImage: "url('/assets/images/watermarks.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />

          {/* TIER 3: Template — bg-transparent root, content cards are solid white */}
          <div className="relative z-20 w-full">
            <TemplateRenderer
              componentKey={componentKey}
              data={contentData}
            />
          </div>
        </div>
      )}

      {/* Main Website Footer */}
      <Footer />
    </div>
  );
}
