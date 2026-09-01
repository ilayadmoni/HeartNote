"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateAiText } from "@/actions/ai/generateText";
import { useServerAction } from "@/hooks/useServerAction";
import { LimitedInput } from "./LimitedInput";

interface AiAssistButtonProps {
  templateId: string;
  fieldKey: string;
  onGenerated: (text: string) => void;
}

const PROMPT_MAX_LENGTH = 200;

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
    <div className="mb-2 rounded-xl border border-[#d4826f]/30 bg-[#fdf6f3] dark:bg-gray-800 dark:border-[#d4826f]/40 p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d4826f] mb-2.5">
        <Sparkles size={13} />
        תארו מה לכתוב, וה-AI יכתוב עבורכם
      </div>

      <LimitedInput
        value={prompt}
        onChange={setPrompt}
        maxLength={PROMPT_MAX_LENGTH}
        placeholder="למשל: ברכה חמה לחברה הכי טובה"
        multiline
        rows={4}
        wrapperClassName="w-full"
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm sm:text-base text-[#2e3c52] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4826f] focus:border-transparent resize-none"
      />

      <div className="flex flex-col-reverse sm:flex-row gap-2 mt-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ביטול
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4826f] text-white text-sm font-medium hover:bg-[#c4735f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              יוצר טקסט...
            </>
          ) : (
            "צור טקסט"
          )}
        </button>
      </div>
    </div>
  );
}
