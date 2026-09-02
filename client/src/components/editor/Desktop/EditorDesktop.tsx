"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { FieldRenderer } from "../components/FieldRenderer";
import { useEditorState } from "../hooks/useEditorState";
import type { TemplateEditorProps } from "../types";

export function EditorDesktop({ templateId }: TemplateEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const router = useRouter();
  const editor = useEditorState(templateId);
  const {
    config, data, handleChange,
    isPublishing, isSubscriptionLoading, isRestoringDraft,
    handlePublish,
  } = editor;

  // Desktop-only: match sidebar height to preview height
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    const updateHeight = () => {
      if (previewRef.current) setPreviewHeight(previewRef.current.offsetHeight);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [data]);

  if (!config) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface-sunken">
        <div className="text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-ink-muted">{t("shell.templateNotFound")}</p>
          <button
            onClick={() => router.push("/gallery")}
            className="mt-4 px-4 py-2 bg-accent hover:bg-accent-hover text-accent-ink rounded-pill transition-colors"
          >
            {t("shell.backToGallery")}
          </button>
        </div>
      </div>
    );
  }

  if (isRestoringDraft) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-surface-sunken/80">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-4 text-body-lg font-medium text-ink-muted">{t("shell.restoringDraft")}</p>
      </div>
    );
  }

  const isLoading = isPublishing || isSubscriptionLoading;
  const templateTitle = config.title ?? (config.titleKey ? t(config.titleKey) : "");

  return (
    <div className="min-h-[200px] xl:min-h-[calc(100vh-16rem)] bg-surface-sunken flex flex-col">
      {/* Header bar */}
      <div className="flex-shrink-0 bg-surface-sunken border-b border-line px-6 py-3 flex items-center justify-between">
        <h1 className="text-title-sm font-bold text-ink">
          {templateTitle}
        </h1>
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

      {/* Preview + Sidebar */}
      <div className="flex-1 flex p-6 gap-6 items-stretch">
        <main className="flex-1 min-h-[390px] 2xl:min-h-[650px] flex flex-col">
          <EditorPreview ref={previewRef} templateId={templateId} data={data} />
        </main>
        <aside
          className="w-80 bg-surface-raised border border-line rounded-card overflow-y-auto flex-shrink-0 shadow-card"
          style={{ height: previewHeight ? `${previewHeight}px` : "auto" }}
        >
          <EditorSidebar
            config={config}
            data={data}
            onChange={handleChange}
          />
        </aside>
      </div>

      <FieldRenderer
        {...editor}
        templateId={templateId}
        templateName={templateTitle}
      />
    </div>
  );
}
