"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { generateAiText } from "@/actions/ai/generateText";
import { useServerAction } from "@/hooks/useServerAction";
import { LimitedInput } from "./LimitedInput";

interface AiAssistButtonProps {
  templateId: string;
  fieldKey: string;
  onGenerated: (text: string) => void;
}

const PROMPT_MAX_LENGTH = 200;

export function AiAssistButton({ templateId, fieldKey, onGenerated }: AiAssistButtonProps): JSX.Element {
  const t = useTranslations("editor");
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
      const message = err instanceof Error ? err.message : t("ai.genericError");
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
        className="inline-flex items-center gap-1 text-caption font-bold text-accent hover:text-accent-hover transition-colors mb-2"
      >
        <Sparkles size={13} />
        {t("ai.trigger")}
      </button>
    );
  }

  return (
    <div className="mb-2 rounded-control border border-accent/30 bg-accent-soft p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-caption font-bold text-accent mb-2.5">
        <Sparkles size={13} />
        {t("ai.prompt")}
      </div>

      <LimitedInput
        value={prompt}
        onChange={setPrompt}
        maxLength={PROMPT_MAX_LENGTH}
        placeholder={t("ai.promptPlaceholder")}
        multiline
        rows={4}
        wrapperClassName="w-full"
        className="w-full px-3 py-2.5 rounded-control border border-line-strong bg-surface-raised text-body-sm sm:text-body-md text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent resize-none"
      />

      <div className="flex flex-col-reverse sm:flex-row gap-2 mt-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-control text-body-sm font-bold text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors"
        >
          {t("ai.cancel")}
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-control bg-accent text-accent-ink text-body-sm font-bold hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("ai.generating")}
            </>
          ) : (
            t("ai.generate")
          )}
        </button>
      </div>
    </div>
  );
}
