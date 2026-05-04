"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { FieldRenderer } from "../components/FieldRenderer";
import { useEditorState } from "../hooks/useEditorState";
import type { TemplateEditorProps } from "../types";

export function EditorDesktop({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const editor = useEditorState(templateId);
  const {
    config, data, handleChange, handleFileReady,
    user, isPublishing, isSubscriptionLoading, isRestoringDraft,
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
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
        <div className="text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-gray-600 dark:text-gray-400 text-hebrew-body">תבנית לא נמצאה</p>
          <button
            onClick={() => router.push("/gallery")}
            className="mt-4 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-hebrew-body transition-colors"
          >
            חזרה לגלריה
          </button>
        </div>
      </div>
    );
  }

  if (isRestoringDraft) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50/80">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-lg font-medium text-gray-700">משחזר את היצירה שלך...</p>
      </div>
    );
  }

  const isLoading = isPublishing || isSubscriptionLoading;

  return (
    <div className="min-h-[200px] xl:min-h-[calc(100vh-16rem)] bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Header bar */}
      <div className="flex-shrink-0 bg-[#faf7f5] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          {config.title}
        </h1>
        <button
          onClick={handlePublish}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-[#C47A5A] hover:bg-[#a86244] hover:-translate-y-px active:scale-[0.97] text-white font-medium text-[15px] text-hebrew-heading px-5 py-[11px] rounded-[10px] transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <span>{isLoading ? "טוען..." : "יצירה"}</span>
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
          className="w-80 bg-faf7f5 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-y-auto flex-shrink-0"
          style={{ height: previewHeight ? `${previewHeight}px` : "auto" }}
        >
          <EditorSidebar
            config={config}
            data={data}
            onChange={handleChange}
            userId={user?.id}
            onFileReady={handleFileReady}
          />
        </aside>
      </div>

      <FieldRenderer
        {...editor}
        templateId={templateId}
        templateName={config.title}
      />
    </div>
  );
}
