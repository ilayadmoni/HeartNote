"use client";

import { TextCardContent } from "@/types";

interface TextCardEditorProps {
  content: TextCardContent;
  onChange: (content: TextCardContent) => void;
}

export function TextCardEditor({ content, onChange }: TextCardEditorProps) {
  return (
    <div className="w-full">
      <textarea
        value={content.text}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        className="w-full min-h-[200px] p-4 rounded-xl border border-gray-200 dark:border-white/10 
                   bg-white/50 dark:bg-white/5 backdrop-blur-sm resize-none
                   text-gray-900 dark:text-white placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Start writing..."
      />
    </div>
  );
}
