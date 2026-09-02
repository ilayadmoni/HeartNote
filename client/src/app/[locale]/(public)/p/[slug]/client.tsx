"use client";

/**
 * UserPageClient Component
 * Renders the template on the public viewer page with:
 * - Forced Light Mode (templates always render as designed)
 * - Gentle watermark for free-tier creations, with a "Made with HeartNote" caption
 * - WhatsApp / copy-link share row
 * - Main website Footer at the bottom
 */

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { TemplateRenderer } from "@/components/templates";
import { Footer } from "@/components/footer";
import { Link } from "@/i18n/navigation";
import { ShareSection } from "./ShareSection";

interface UserPageClientProps {
  templateKey: string;
  contentData: Record<string, unknown>;
  isPaid: boolean;
  creationId: string;
}

export function UserPageClient({
  templateKey,
  contentData,
  isPaid,
  creationId,
}: UserPageClientProps) {
  const t = useTranslations("share");
  const searchParams = useSearchParams();
  const rawCode = searchParams?.get("code") ?? null;
  const verificationCode = rawCode && /^[0-9]{4}$/.test(rawCode) ? rawCode : null;
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
    <div className="min-h-[100dvh] flex flex-col bg-surface">
      <div className="relative flex-1 flex flex-col items-center py-section-sm px-gutter isolate overflow-hidden">
        {!isPaid && (
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]"
            style={{
              backgroundImage: "url('/assets/images/watermarks.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 w-full max-w-[700px]">
          <TemplateRenderer
            componentKey={componentKey}
            data={contentData}
            creationId={creationId}
            verificationCode={verificationCode}
          />
        </div>

        <div className="relative z-10 w-full max-w-[700px]">
          <ShareSection templateName={templateKey} />
        </div>

        {!isPaid && (
          <p className="relative z-10 text-center text-caption text-ink-subtle mt-2">
            <Link href="/" className="hover:text-ink transition-colors">
              {t("madeWith")}
            </Link>
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
