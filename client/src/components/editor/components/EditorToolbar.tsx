"use client";

/**
 * EditorToolbar Component
 * Right sidebar with action icons
 */

import { motion } from "framer-motion";
import { Settings, Type, Image, Sparkles, Music, Send } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditorToolbarProps {
  onPublish: () => void;
}

const TOOLS = [
  { icon: Settings, labelKey: "toolbar.settings", active: true },
  { icon: Type, labelKey: "toolbar.text", active: false },
  { icon: Image, labelKey: "toolbar.images", active: false },
  { icon: Music, labelKey: "toolbar.music", active: false },
  { icon: Sparkles, labelKey: "toolbar.effects", active: false },
] as const;

export function EditorToolbar({ onPublish }: EditorToolbarProps): JSX.Element {
  const t = useTranslations("editor");
  return (
    <div className="flex flex-col items-center gap-4 h-full">
      {/* Tools */}
      <div className="flex-1 flex flex-col items-center gap-3 pt-4">
        {TOOLS.map((tool, index) => (
          <motion.button
            key={tool.labelKey}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-10 h-10 rounded-control flex items-center justify-center transition-colors duration-base ease-out-quint
              ${
                tool.active
                  ? "bg-accent text-accent-ink"
                  : "bg-surface-sunken text-ink-muted hover:bg-line"
              }
            `}
            title={t(tool.labelKey)}
          >
            <tool.icon size={20} />
          </motion.button>
        ))}
      </div>

      {/* Publish Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPublish}
        className="w-12 h-12 mb-4 bg-accent text-accent-ink rounded-control flex items-center justify-center shadow-glow-sm"
        title={t("toolbar.publish")}
      >
        <Send size={20} />
      </motion.button>
    </div>
  );
}
