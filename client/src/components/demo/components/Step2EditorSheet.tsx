"use client";

import { Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  questionText: string;
  successText: string;
  colorActive: boolean;
}

export function Step2EditorSheet({ questionText, successText, colorActive }: Props) {
  return (
    <motion.div
      id="editor-sheet"
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl px-5 pt-4 pb-6 z-30"
      style={{ y: "100%" }}
    >
      <div className="flex justify-center mb-3">
        <div className="w-10 h-1 bg-slate-200 rounded-full" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button type="button" className="text-xs text-hebrew-small text-[#d98574] flex items-center gap-1">
          <ChevronDown className="w-3.5 h-3.5" />
          סגור עריכה
        </button>
        <span className="text-[10px] text-hebrew-small text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          תוקף היצירה: 12/03/2026
        </span>
      </div>

      <div className="mb-3">
        <label className="text-[11px] text-hebrew-small text-slate-500 block mb-1.5">שאלה</label>
        <motion.div
          id="question-input"
          className="border-[1.5px] rounded-xl p-3 text-sm text-hebrew-body text-slate-800 border-slate-200 bg-white shadow-sm text-center min-h-[44px]"
        >
          {questionText}
          <span className="inline-block w-0.5 h-4 bg-slate-800 ml-1 animate-pulse align-middle" />
        </motion.div>
        <div className="text-[10px] text-slate-400 mt-1 text-end">{questionText.length}/35</div>
      </div>

      <div className="mb-4">
        <label className="text-[11px] text-hebrew-small text-slate-500 block mb-1.5">הודעת הצלחה</label>
        <motion.div
          id="success-input"
          className="border rounded-xl p-3 text-sm text-hebrew-body text-slate-800 border-slate-200 bg-slate-50 text-center min-h-[44px]"
        >
          {successText}
        </motion.div>
      </div>

      <div>
        <label className="text-[11px] text-hebrew-small text-slate-500 block mb-2 text-center">צבע ראשי</label>
        <div className="flex flex-wrap gap-3 justify-center">
          <div
            id="color-salmon"
            className="w-8 h-8 rounded-full bg-[#d98574] flex items-center justify-center shadow-sm ring-2 ring-[#d98574] ring-offset-2"
          >
            {colorActive && <Check className="w-4 h-4 text-white" />}
          </div>
          <div className="w-8 h-8 rounded-full bg-pink-200 shadow-sm" />
          <div className="w-8 h-8 rounded-full bg-purple-200 shadow-sm" />
          <div className="w-8 h-8 rounded-full bg-blue-300 shadow-sm" />
          <div className="w-8 h-8 rounded-full bg-green-200 shadow-sm" />
        </div>
        <p className="text-center text-[10px] text-hebrew-small text-slate-400 mt-2">סלמון</p>
      </div>
    </motion.div>
  );
}
