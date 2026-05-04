"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit2, Send, ChevronRight } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { FieldRenderer } from "../components/FieldRenderer";
import { useEditorState } from "../hooks/useEditorState";
import type { TemplateEditorProps } from "../types";

export function EditorMobile({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const editor = useEditorState(templateId);
  const {
    config, data, handleChange, handleFileReady,
    user, isPublishing, isSubscriptionLoading, isRestoringDraft,
    handlePublish,
  } = editor;

  // Mobile-only: tab switcher between preview and edit
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  if (!config) {
    return (
      <div className="flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 p-4">
        <div className="text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-gray-600 dark:text-gray-400 text-hebrew-body">תבנית לא נמצאה</p>
          <button
            onClick={() => router.push("/gallery")}
            className="mt-4 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-hebrew-body"
          >
            חזרה לגלריה
          </button>
        </div>
      </div>
    );
  }

  if (isRestoringDraft) {
    return (
      <div className="flex w-full flex-col items-center justify-center bg-gray-50/80">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-lg font-medium text-gray-700">משחזר את היצירה שלך...</p>
      </div>
    );
  }

  const isLoading = isPublishing || isSubscriptionLoading;

  return (
    <div className="flex flex-col bg-[#faf7f5] dark:bg-gray-900">
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b"
        style={{ backgroundColor: "var(--header-bg)", borderColor: "var(--header-border)" }}
      >
        <button
          onClick={() => router.push("/gallery")}
          className="inline-flex items-center gap-1.5 bg-transparent text-[#9a6a52] hover:text-[#4a2e1e] font-normal text-[15px] text-hebrew-body px-1.5 py-[11px] border-none transition-colors duration-150"
        >
          <ChevronRight size={14} strokeWidth={2} />
          <span>חזרה</span>
        </button>
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

      {/* Tab bar */}
      <div className="flex mx-4 my-3 p-1 rounded-xl bg-coral-50 dark:bg-navy-800">
        {(["preview", "edit"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center text-xs py-2 px-2 rounded-lg transition-colors text-hebrew-small flex items-center justify-center gap-1.5 ${
              activeTab === tab
                ? "font-bold bg-white dark:bg-navy-700 text-coral-600 dark:text-coral-400 shadow-sm"
                : "font-medium text-navy-400 dark:text-gray-400 hover:text-coral-500"
            }`}
          >
            {tab === "preview" ? <><span>תצוגה מקדימה</span><Eye size={14} /></> : <><span>עריכה</span><Edit2 size={14} /></>}
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
            userId={user?.id}
            onFileReady={handleFileReady}
          />
        </div>
        <div className={activeTab === "preview" ? "block" : "hidden"}>
          <EditorPreview templateId={templateId} data={data} isMobile />
        </div>
      </div>

      <FieldRenderer
        {...editor}
        templateId={templateId}
        templateName={config.title}
      />
    </div>
  );
}
