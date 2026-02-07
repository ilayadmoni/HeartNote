"use client";

/**
 * EditorToolbar Component
 * Right sidebar with action icons
 */

import { motion } from "framer-motion";
import { Settings, Type, Image, Sparkles, Music, Send } from "lucide-react";

interface EditorToolbarProps {
  onPublish: () => void;
}

const TOOLS = [
  { icon: Settings, label: "הגדרות", active: true },
  { icon: Type, label: "טקסט", active: false },
  { icon: Image, label: "תמונות", active: false },
  { icon: Music, label: "מוזיקה", active: false },
  { icon: Sparkles, label: "אפקטים", active: false },
];

export function EditorToolbar({ onPublish }: EditorToolbarProps) {
  return (
    <div className="flex flex-col items-center gap-4 h-full">
      {/* Tools */}
      <div className="flex-1 flex flex-col items-center gap-3 pt-4">
        {TOOLS.map((tool, index) => (
          <motion.button
            key={tool.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
              ${
                tool.active
                  ? "bg-[#d4826f] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }
            `}
            title={tool.label}
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
        className="w-12 h-12 mb-4 bg-gradient-to-br from-[#d4826f] to-[#e8917a] text-white rounded-xl flex items-center justify-center shadow-lg"
        title="שליחה"
      >
        <Send size={20} />
      </motion.button>
    </div>
  );
}
