"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  MousePointer2,
  Send,
  Copy,
  Share2,
  MessageCircle,
  Sparkles,
  Settings,
  Link as LinkIcon,
  ChevronLeft,
  Video,
  Phone,
  Plus,
  Camera,
  Mic,
} from "lucide-react";
import { motion, useAnimate } from "framer-motion";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Phase = "preview" | "modal" | "whatsapp";

export function Step4Animation() {
  const [scope, animate] = useAnimate();
  const [phase, setPhase] = useState<Phase>("preview");

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      try {
        // 1. Initial pause
        await wait(500);
        if (!isActive || !scope.current) return;

        // 2. Move cursor to the real send button location (responsive to current height/layout)
        const wrapperEl = scope.current as HTMLElement;
        const sendButtonEl = wrapperEl.querySelector(
          "#send-btn",
        ) as HTMLElement | null;

        if (sendButtonEl) {
          const btnRect = sendButtonEl.getBoundingClientRect();
          const wrapRect = wrapperEl.getBoundingClientRect();
          const targetTop =
            ((btnRect.top + btnRect.height / 2 - wrapRect.top) /
              wrapRect.height) *
            100;
          const targetLeft =
            ((btnRect.left + btnRect.width / 2 - wrapRect.left) /
              wrapRect.width) *
            100;

          await animate(
            "#fake-cursor",
            { top: `${targetTop}%`, left: `${targetLeft}%`, opacity: 1 },
            { duration: 0.8, ease: "easeOut" },
          );
        } else {
          // Fallback if button is temporarily unavailable
          await animate(
            "#fake-cursor",
            { top: "13%", left: "18%", opacity: 1 },
            { duration: 0.8, ease: "easeOut" },
          );
        }
        if (!isActive) return;

        // Click Send button
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#send-btn", { scale: 0.95 }, { duration: 0.1 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.1 });
        await animate("#send-btn", { scale: 1 }, { duration: 0.1 });

        // 3. Switch to Modal phase
        if (!isActive) return;
        setPhase("modal");
        await wait(400); // Wait for render and entrance animation

        // 4. Move cursor to WhatsApp button in the modal
        //    Modal is centered; wa-btn is the larger button on the left (RTL layout)
        await animate(
          "#fake-cursor",
          { top: "68%", left: "34%" },
          { duration: 0.8, ease: "easeInOut" },
        );
        if (!isActive) return;

        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#wa-btn", { scale: 0.95 }, { duration: 0.1 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.1 });

        // 5. Switch to WhatsApp phase
        if (!isActive) return;
        setPhase("whatsapp");
        await wait(600); // Wait for render and staggered bubble entrance

        // 6. Move cursor to the link preview card inside WhatsApp
        await animate(
          "#fake-cursor",
          { top: "53%", left: "34%" },
          { duration: 0.8, ease: "easeInOut" },
        );
        if (!isActive) return;

        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#wa-link", { opacity: 0.8 }, { duration: 0.1 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.1 });

        // 7. End slide
        await wait(1000);
      } catch (e) {
        // Animation interrupted (e.g., component unmounted)
      }
    };

    runSequence();
    return () => {
      isActive = false;
    };
  }, [animate]);

  return (
    <div
      ref={scope}
      className="bg-[#faf9f6] h-full w-full relative overflow-hidden"
    >
      {/* ─── Phase: preview ─── */}
      {phase === "preview" && (
        <div className="h-full w-full flex flex-col items-center justify-center pt-4 sm:pt-8 pb-4 sm:pb-8 relative">
          <motion.button
            id="send-btn"
            className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#d98574] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-md z-10"
          >
            יצירה <Send size={12} className="sm:w-4 sm:h-4" />
          </motion.button>

          {/* Final card preview */}
          <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] text-center w-full max-w-[280px] mx-3 sm:mx-4 border border-rose-50">
            <div className="bg-rose-50 w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-5">
              <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-[#d98574] fill-[#d98574]" />
            </div>
            <h3 className="text-sm sm:text-[17px] text-slate-800 mb-2 leading-snug">
              האם תרצי לצאת איתי לדייט אורלי?
            </h3>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mb-4 sm:mb-6">
              כדאי לך לבחור את התשובה הנכונה...
            </p>
            <div className="flex gap-2 sm:gap-3 w-full">
              <button className="flex-[0.8] py-1.5 sm:py-2.5 bg-gray-100 text-gray-500 rounded-full text-xs sm:text-sm">
                לא
              </button>
              <button className="flex-[1.2] py-1.5 sm:py-2.5 bg-[#d98574] text-white rounded-full text-xs sm:text-sm font-bold flex justify-center items-center gap-1 sm:gap-1.5 shadow-lg shadow-rose-200">
                כן <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Phase: modal ─── */}
      {phase === "modal" && (
        <div className="h-full w-full relative">
          {/* Background card (blurred behind overlay) */}
          <div className="h-full w-full flex flex-col items-center justify-center pt-8 pb-8">
            <button className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#d98574] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-md z-10">
              יצירה <Send size={12} className="sm:w-4 sm:h-4" />
            </button>
            <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] text-center w-full max-w-[280px] mx-3 sm:mx-4 border border-rose-50">
              <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Heart className="w-6 h-6 text-[#d98574] fill-[#d98574]" />
              </div>
              <h3 className="text-[17px] text-slate-800 mb-2 leading-snug">
                האם תרצי לצאת איתי לדייט אורלי?
              </h3>
              <p className="text-[11px] text-slate-500 mb-6">
                כדאי לך לבחור את התשובה הנכונה...
              </p>
              <div className="flex gap-3 w-full">
                <button className="flex-[0.8] py-2.5 bg-gray-100 text-gray-500 rounded-full text-sm">
                  לא
                </button>
                <button className="flex-[1.2] py-2.5 bg-[#d98574] text-white rounded-full text-sm font-bold flex justify-center items-center gap-1.5 shadow-lg shadow-rose-200">
                  כן <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Dark overlay + success modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="bg-white rounded-2xl sm:rounded-[24px] w-full max-w-[300px] mx-3 sm:mx-4 overflow-hidden shadow-2xl"
            >
              {/* Modal header */}
              <div className="bg-[#d98574] text-white text-center py-4 sm:py-6 px-3 sm:px-4 relative">
                <Sparkles className="absolute top-2 sm:top-3 right-2 sm:right-3 w-3 sm:w-4 h-3 sm:h-4 opacity-50" />
                <Sparkles className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-50" />
                <span className="text-2xl sm:text-4xl mb-1 sm:mb-2 block">
                  🎉
                </span>
                <h3 className="font-bold text-base sm:text-lg">
                  הכרטיס נוצר בהצלחה!
                </h3>
              </div>

              {/* Modal body */}
              <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
                <p className="text-[9px] sm:text-[11px] text-slate-500 text-center font-medium">
                  קישור לשיתוף
                </p>
                <div className="flex border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden bg-slate-50">
                  <button className="bg-[#d98574] p-2 sm:p-3 text-white flex items-center justify-center">
                    <Copy size={12} className="sm:w-[15px] sm:h-[15px]" />
                  </button>
                  <div
                    className="p-2 sm:p-2.5 text-[8px] sm:text-[10px] text-slate-500 flex-1 flex items-center border-r border-slate-200"
                    dir="ltr"
                  >
                    <span className="truncate">
                      https://heartnote.co.il/p/064...
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 sm:gap-2 mt-1">
                  <button className="flex-1 bg-slate-700 text-white py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl flex justify-center items-center shadow-sm">
                    <Share2 size={13} className="sm:w-[17px] sm:h-[17px]" />
                  </button>
                  <motion.button
                    id="wa-btn"
                    className="flex-[2.5] bg-[#25D366] text-white py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl flex justify-center items-center gap-1 sm:gap-2 font-bold text-xs sm:text-base shadow-sm"
                  >
                    <MessageCircle
                      size={13}
                      className="sm:w-[17px] sm:h-[17px]"
                    />{" "}
                    WhatsApp
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* ─── Phase: whatsapp ─── */}
      {phase === "whatsapp" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full bg-[#0b141a] flex flex-col"
          dir="rtl"
        >
          {/* Top status and app bar */}
          <div className="bg-gradient-to-b from-[#20344b] to-[#12263b] px-3 sm:px-4 pt-2.5 sm:pt-3 pb-2 sm:pb-2.5 border-b border-white/5">
            <div className="flex items-center justify-between text-white/90 text-[8px] sm:text-[10px] mb-1.5 sm:mb-2">
              <span>1:38</span>
              <span>54%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 text-white">
                <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="text-xs sm:text-sm">2</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-slate-400/40 flex items-center justify-center text-[9px] sm:text-[11px] text-white font-bold">
                  נ
                </div>
                <p className="text-white text-xs sm:text-base font-semibold">
                  אורלי ❤️
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white/90">
                <Video className="w-3 sm:w-4 h-3 sm:h-4" />
                <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div
            className="flex-1 px-2 sm:px-3 py-3 sm:py-4 flex flex-col gap-1.5 sm:gap-2 overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 38%), linear-gradient(120deg, #233444 0%, #182733 40%, #121b24 100%)",
            }}
          >
            {/* Received bubble */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.28 }}
              className="self-start bg-[#202c33] rounded-xl sm:rounded-2xl rounded-tl-sm px-2.5 sm:px-3 py-1.5 sm:py-2 max-w-[220px]"
            >
              <p className="text-white/90 text-xs sm:text-[14px] text-hebrew-body">
                מה קורה שמעון??
              </p>
              <p className="text-white/40 text-[7px] sm:text-[10px] text-left mt-0.5 sm:mt-1">
                0:53
              </p>
            </motion.div>

            {/* Main sent WhatsApp link bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42, duration: 0.32 }}
              className="self-end bg-[#053a6d] rounded-2xl sm:rounded-3xl rounded-tr-md max-w-[292px] overflow-hidden shadow-lg"
            >
              <motion.div
                id="wa-link"
                className="m-1 sm:m-1.5 rounded-xl sm:rounded-2xl overflow-hidden bg-white cursor-pointer"
              >
                {/* Preview image area */}
                <div className="h-[80px] sm:h-[140px] bg-[#f7f6f6] flex items-center justify-center">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-[#17233f] text-2xl sm:text-[44px] leading-none font-extrabold">
                      HeartNote
                    </span>
                    <div className="relative">
                      <Heart className="w-6 sm:w-9 h-6 sm:h-9 text-[#c99383]" />
                      <Settings className="absolute -bottom-0.5 sm:-bottom-1 -right-1 sm:-right-2 w-3 sm:w-4 h-3 sm:h-4 text-[#17233f] fill-[#17233f]" />
                    </div>
                  </div>
                </div>

                {/* Preview metadata */}
                <div className="bg-[#082d56] px-2 sm:px-3 py-1.5 sm:py-2.5 text-right">
                  <p className="text-white text-sm sm:text-[18px] leading-tight text-hebrew-heading">
                    גרד וגלה
                  </p>
                  <p className="text-white/80 text-[9px] sm:text-[12px] text-hebrew-body mt-0.5">
                    פתחו וגלו את ההפתעה!
                  </p>
                  <p
                    className="text-white/85 text-[9px] sm:text-[12px] mt-1 sm:mt-2 flex items-center justify-end gap-0.5 sm:gap-1"
                    dir="ltr"
                  >
                    <LinkIcon className="w-2 sm:w-3 h-2 sm:h-3" />{" "}
                    heartnote.co.il
                  </p>
                </div>
              </motion.div>

              <div className="px-2 sm:px-3 pb-1.5 sm:pb-2 text-right">
                <p className="text-white text-xs sm:text-[14px] leading-snug text-hebrew-body">
                הכנתי לך משהו  ב-HeartNote! 💌
                </p>
                <p
                  className="text-[#53bdeb] text-[8px] sm:text-[13px] mt-0.5 underline"
                  dir="ltr"
                >
                  https://heartnote.co.il/p/65c55294-a898-4e8c-b425-f1cdac3028cd
                </p>
                <p className="text-white/45 text-[7px] sm:text-[10px] text-left mt-0.5 sm:mt-1">
                  0:57 ✓✓
                </p>
              </div>
            </motion.div>

            <div className="self-end bg-[#053a6d] text-white text-xs sm:text-[14px] px-2 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl rounded-tr-md">
              באהבה ממני אלייך{" "}
            </div>
          </div>

          {/* Input row */}
          <div className="px-2 sm:px-3 pb-2 sm:pb-3 pt-1.5 sm:pt-2 bg-[#111b21] border-t border-white/5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button className="w-7 sm:w-9 h-7 sm:h-9 rounded-full bg-[#1f2c34] text-white/80 flex items-center justify-center">
                <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
              </button>
              <div className="flex-1 h-8 sm:h-10 rounded-full bg-[#202c33] text-white/60 px-3 sm:px-4 flex items-center justify-between">
                <span className="text-xs sm:text-sm">היי</span>
                <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
              </div>
              <button className="w-7 sm:w-10 h-7 sm:h-10 rounded-full bg-[#1f2c34] text-white flex items-center justify-center">
                <Mic className="w-3 sm:w-4 h-3 sm:h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fake Cursor */}
      <motion.div
        id="fake-cursor"
        className="absolute z-50 pointer-events-none"
        style={{ top: "80%", left: "85%", opacity: 0 }}
      >
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
