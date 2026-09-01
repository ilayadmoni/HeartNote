"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateAiText } from "@/actions/ai/generateText";
import { useServerAction } from "@/hooks/useServerAction";

interface AiAssistButtonProps {
  templateId: string;
  fieldKey: string;
  onGenerated: (text: string) => void;
}

export function AiAssistButton({ templateId, fieldKey, onGenerated }: AiAssistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { execute } = useServerAction();

  async function handleGenerate() {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const { text } = await execute(
        generateAiText({ templateId, fieldKey, prompt: prompt.trim() }),
      );
      onGenerated(text);
      setIsOpen(false);
      setPrompt("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "יצירת הטקסט נכשלה";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-xs font-medium text-[#d4826f] hover:text-[#c4735f] transition-colors mb-2"
      >
        <Sparkles size={13} />
        כתיבה עם AI
      </button>
    );
  }

  return (
    <div className="mb-2 rounded-xl border border-[#d4826f]/30 bg-[#fdf6f3] dark:bg-gray-800 dark:border-[#d4826f]/40 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d4826f] mb-2">
        <Sparkles size={13} />
        תארו מה לכתוב, וה-AI יכתוב עבורכם
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="למשל: ברכה חמה לחברה הכי טובה"
          maxLength={200}
          autoFocus
          dir="auto"
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-[#2e3c52] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4826f] focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#d4826f] text-white text-sm font-medium hover:bg-[#c4735f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "צור"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="shrink-0 px-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ביטול
        </button>
      </div>
    </div>
  );
}
