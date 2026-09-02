"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Eye, Edit2, Send, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { FieldRenderer } from "../components/FieldRenderer";
import { useEditorState } from "../hooks/useEditorState";
import type { TemplateEditorProps } from "../types";

export function EditorMobile({ templateId }: TemplateEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const locale = useLocale();
  const router = useRouter();
  const editor = useEditorState(templateId);
  const {
    config, data, handleChange,
    isPublishing, isSubscriptionLoading, isRestoringDraft,
    handlePublish,
  } = editor;

  // Mobile-only: tab switcher between preview and edit
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  if (!config) {
    return (
      <div className="flex items-center justify-center bg-surface-sunken p-4">
        <div className="text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-ink-muted">{t("shell.templateNotFound")}</p>
          <button
            onClick={() => router.push("/gallery")}
            className="mt-4 px-4 py-2 bg-accent hover:bg-accent-hover text-accent-ink rounded-pill"
          >
            {t("shell.backToGallery")}
          </button>
        </div>
      </div>
    );
  }

  if (isRestoringDraft) {
    return (
      <div className="flex w-full flex-col items-center justify-center bg-surface-sunken/80">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-4 text-body-lg font-medium text-ink-muted">{t("shell.restoringDraft")}</p>
      </div>
    );
  }

  const isLoading = isPublishing || isSubscriptionLoading;
  const templateTitle = config.title ?? (config.titleKey ? t(config.titleKey) : "");
  const BackIcon = locale === "he" ? ChevronRight : ChevronLeft;

  return (
    <div className="flex flex-col bg-surface-sunken">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-line bg-surface-raised">
        <button
          onClick={() => router.push("/gallery")}
          className="inline-flex items-center gap-1.5 bg-transparent text-accent hover:text-accent-hover font-normal text-body-md px-1.5 py-[11px] border-none transition-colors duration-150"
        >
          <BackIcon size={14} strokeWidth={2} />
          <span>{t("shell.back")}</span>
        </button>
        <button
          onClick={handlePublish}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover hover:-translate-y-px active:scale-[0.97] text-accent-ink font-medium text-body-md px-5 py-[11px] rounded-pill transition-colors duration-150 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <span>{isLoading ? t("shell.loading") : t("toolbar.publish")}</span>
          {isLoading
            ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Send size={14} strokeWidth={2} />
          }
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex mx-4 my-3 p-1 rounded-control bg-accent-soft">
        {(["preview", "edit"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center text-caption py-2 px-2 rounded-control transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab
                ? "font-bold bg-surface-raised text-accent shadow-soft"
                : "font-medium text-ink-subtle hover:text-accent"
            }`}
          >
            {tab === "preview" ? <><span>{t("shell.previewTab")}</span><Eye size={14} /></> : <><span>{t("shell.editTab")}</span><Edit2 size={14} /></>}
          </button>
        ))}
      </div>

      {/* Both tabs mounted to preserve state — one hidden */}
      <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
        <div className={activeTab === "edit" ? "block" : "hidden"}>
          <EditorSidebar
            config={config}
            data={data}
            onChange={handleChange}
          />
        </div>
        <div className={activeTab === "preview" ? "block" : "hidden"}>
          <EditorPreview templateId={templateId} data={data} isMobile />
        </div>
      </div>

      <FieldRenderer
        {...editor}
        templateId={templateId}
        templateName={templateTitle}
      />
    </div>
  );
}
