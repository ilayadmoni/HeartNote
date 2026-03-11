"use client";

import { Heart } from "lucide-react";

interface Props {
  questionText: string;
}

export function Step2PreviewCard({ questionText }: Props) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] text-center w-full max-w-[260px] border border-rose-50">
      <div className="bg-rose-50 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Heart className="w-5 h-5 text-[#d98574] fill-[#d98574]" />
      </div>
      <h3 className="text-[16px] text-hebrew-heading text-slate-800 mb-2 leading-snug">
        {questionText}
      </h3>
      <p className="text-[11px] text-hebrew-small text-slate-500 mb-5">
        כדאי לך לבחור את התשובה הנכונה...
      </p>
      <div className="flex gap-3 w-full">
        <button
          type="button"
          className="flex-[0.8] py-2.5 bg-gray-100 text-gray-500 rounded-full text-sm text-hebrew-body"
          aria-label="לא"
        >
          לא
        </button>
        <button
          type="button"
          className="flex-[1.2] py-2.5 bg-[#d98574] text-white rounded-full text-sm text-hebrew-body font-bold flex justify-center items-center gap-1.5 shadow-lg shadow-rose-200"
          aria-label="כן"
        >
          כן <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
}
