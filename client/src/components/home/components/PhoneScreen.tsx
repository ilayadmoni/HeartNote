"use client";

/**
 * PhoneScreen Component
 * Date invitation card UI with dodging "לא" button
 */

import { Heart } from "lucide-react";

interface PhoneScreenProps {
  isDodging?: boolean;
}

export function PhoneScreen({ isDodging = false }: PhoneScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#f8f6f3]" dir="rtl">
      {/* App bar */}
      <div className="bg-[#f2e9e4] px-3 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
        <Heart size={16} className="text-[#d4826f]" fill="#d4826f" />  
          <span className="text-[#1b263b] text-[11px] font-bold text-english-heading">HeartNote</span>
          <span className="text-[11px]"></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-400/60" />
          <span className="text-grey text-[20px]">☰</span>
        </div>
      </div>

      {/* Sub-bar */}
      <div className="bg-white px-3 py-1.5 flex items-center justify-between border-b border-gray-100">
        <span className="text-[10px] font-bold text-[#2e3c52] text-hebrew-heading">הזמנה לדייט</span>
        <div className="bg-[#d4826f] text-white text-[7px] px-2 py-0.5 rounded-full">
          שליחה 
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 gap-2">
     

        <div className="bg-pink-50 p-1.5 rounded-lg">
          <Heart size={16} className="text-[#d4826f]" fill="#d4826f" />
        </div>

        {/* Invitation card */}
        <div className="bg-white rounded-xl shadow-sm p-4 w-full text-center">
          <p className="text-[12px] font-bold text-[#2e3c52] mb-1 text-hebrew-heading">
            בא לך לצאת איתי לדייט?
          </p>
          <p className="text-[8px] text-gray-400 mb-3 text-hebrew-body">
            כדאי לך לבחור את התשובה הנכונה
          </p>

          <div className="flex gap-3 justify-center items-center">
            <button
              className="text-[10px] text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 bg-white"
              style={{
                transform: `translateX(${isDodging ? -22 : 0}px)`,
                opacity: isDodging ? 0.4 : 1,
                transition: "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s ease",
              }}
            >
              לא
            </button>
            <button className="text-[10px] text-white bg-[#d4826f] px-4 py-1.5 rounded-full flex items-center gap-1">
              כן <Heart size={10} fill="white" /> 
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 px-3 py-1.5 flex items-center justify-center gap-1">
        <span className="text-[8px] font-bold text-[#2e3c52] text-english-heading">HeartNote</span>
        <span className="text-[7px] text-gray-400 text-english-body">Created using</span>
        <span className="text-[9px]"></span>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#2e3c52] px-3 py-1.5 flex items-center justify-center">
        <span className="text-[8px] text-white text-hebrew-body">ערוך מאפיינים ⌃</span>
      </div>
    </div>
  );
}
