"use client";

import { useEffect } from "react";
import { Heart, MousePointer2 } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { TemplatePreview } from "../../galleryTemplate/components/TemplatePreview";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Step1Animation() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      await wait(500);
      if (!isActive) return;

      // Just start the cursor a bit off and move slowly to the button (slow motion click)
      await animate("#fake-cursor", { top: "80%", left: "50%", opacity: 1 }, { duration: 0.1 });
      if (!isActive || !scope.current) return;

      const wrapperEl = scope.current as HTMLElement;
      const buttonEl = wrapperEl.querySelector("#date-btn") as HTMLElement | null;

      if (buttonEl) {
        const btnRect = buttonEl.getBoundingClientRect();
        const wrapRect = wrapperEl.getBoundingClientRect();
        const targetTop = ((btnRect.top + btnRect.height / 2 - wrapRect.top) / wrapRect.height) * 100;
        const targetLeft = ((btnRect.left + btnRect.width / 2 - wrapRect.left) / wrapRect.width) * 100;

        await animate(
          "#fake-cursor",
          { top: `${targetTop}%`, left: `${targetLeft}%` },
          { duration: 1.5, ease: "easeInOut" } // Slow motion to click point
        );
      }
      if (!isActive) return;

      await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
      await animate("#date-btn", { scale: 0.95, backgroundColor: "#c97564" }, { duration: 0.12 });
      await Promise.all([
        animate("#fake-cursor", { scale: 1 }, { duration: 0.12 }),
        animate("#date-btn", { scale: 1, backgroundColor: "#d98574" }, { duration: 0.2 }),
      ]);

      await wait(500);
    };

    runSequence();

    return () => {
      isActive = false;
    };
  }, [animate, scope]);

  return (
    <div ref={scope} className="bg-[#faf9f6] h-full w-full flex flex-col pt-4 pb-4 overflow-hidden relative">
      <div className="px-4">
        <h3 className="text-xl text-hebrew-heading text-slate-800 text-center mb-1">בחרו את החוויה הבאה</h3>
        <p className="text-xs text-hebrew-small text-slate-500 text-center mb-4">תבניות אינטראקטיביות שנוצרו באהבה</p>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-hebrew-small text-xs px-3 py-1.5 rounded-full bg-[#d98574] text-white whitespace-nowrap">הכל ✨</span>
          <span className="text-hebrew-small text-xs px-3 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 whitespace-nowrap">רומנטי 💕</span>
          <span className="text-hebrew-small text-xs px-3 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 whitespace-nowrap">משחקים 🎮</span>
          <span className="text-hebrew-small text-xs px-3 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 whitespace-nowrap">זכרונות 📸</span>
          <span className="text-hebrew-small text-xs px-3 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 whitespace-nowrap">מתנות 🎁</span>
        </div>
      </div>

      <motion.div
        id="templates-wrapper"
        className="px-5 pt-3 pb-8 flex flex-col gap-6"
      >
        {/* Card 1: Date Invite */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col relative w-full">
          {/* Top Graphic Area */}
          <div className="relative h-[170px] bg-[#e6e2de] flex items-center justify-center p-4">
            <div className="absolute top-4 right-4 bg-[#22c55e] text-white text-[12px] font-bold px-3 py-1 rounded-full z-10 shadow-sm leading-none">חינם</div>
            <div className="h-full w-full flex items-center justify-center scale-90">
              <TemplatePreview componentKey="DateInvite" />
            </div>
          </div>
          {/* Bottom Content Area */}
          <div className="p-5 flex flex-col text-right">
            <h4 className="text-[#d98574] text-hebrew-heading text-[22px] font-bold mb-2 leading-none">הזמנה לדייט</h4>
            <p className="text-[14px] text-hebrew-body text-slate-600 mb-5 leading-relaxed">
              כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה! 💕
            </p>
            <motion.button
              id="date-btn"
              type="button"
              className="w-full bg-[#d98574] text-white text-center py-3 rounded-2xl text-hebrew-heading text-[16px] font-bold shadow-sm"
              aria-label="התחילו ליצור הזמנה לדייט"
            >
              התחילו ליצור
            </motion.button>
          </div>
        </div>

        {/* Card 2: Scratch Card */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col relative w-full">
          <div className="relative h-[170px] bg-[#e6e2de] flex items-center justify-center p-4">
            <div className="absolute top-4 right-4 bg-slate-800 text-white text-[12px] font-bold px-3 py-1 rounded-full z-10 shadow-sm leading-none">חדש</div>
            <div className="h-full w-full flex items-center justify-center scale-90">
              <TemplatePreview componentKey="ScratchCard" />
            </div>
          </div>
          <div className="p-5 flex flex-col text-right">
            <h4 className="text-[#d98574] text-hebrew-heading text-[22px] font-bold mb-2 leading-none">כרטיס גירוד</h4>
            <p className="text-[14px] text-hebrew-body text-slate-600 mb-5 leading-relaxed">
              גרדו כדי לגלות את ההפתעה! הפתרונות המקוריים ביותר מתחבאים מתחת לשכבה. 🎁
            </p>
            <div className="w-full bg-[#d98574] text-white text-center py-3 rounded-2xl text-hebrew-heading text-[16px] font-bold shadow-sm">התחילו ליצור</div>
          </div>
        </div>

        {/* Card 3: Timeline */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col relative w-full">
          <div className="relative h-[170px] bg-[#e6e2de] flex items-center justify-center p-4">
            <div className="absolute top-4 right-4 bg-[#22c55e] text-white text-[12px] font-bold px-3 py-1 rounded-full z-10 shadow-sm leading-none">חינם</div>
            <div className="h-full w-full flex items-center justify-center scale-90">
              <TemplatePreview componentKey="Timeline" />
            </div>
          </div>
          <div className="p-5 flex flex-col text-right">
            <h4 className="text-[#d98574] text-hebrew-heading text-[22px] font-bold mb-2 leading-none">ציר הזמן</h4>
            <p className="text-[14px] text-hebrew-body text-slate-600 mb-5 leading-relaxed">
              מסע נוסטלגי דרך הרגעים המיוחדים שלכם: התחלה, נשיקה ראשונה והיום. ✨
            </p>
            <div className="w-full bg-[#d98574] text-white text-center py-3 rounded-2xl text-hebrew-heading text-[16px] font-bold shadow-sm">התחילו ליצור</div>
          </div>
        </div>

        {/* Card 4: Wheel */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col relative w-full">
          <div className="relative h-[170px] bg-[#e6e2de] flex items-center justify-center p-4">
            <div className="absolute top-4 right-4 bg-[#22c55e] text-white text-[12px] font-bold px-3 py-1 rounded-full z-10 shadow-sm leading-none">חינם</div>
            <div className="h-24 w-full max-w-[150px] bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <div className="text-slate-700 text-4xl">🎡</div>
            </div>
          </div>
          <div className="p-5 flex flex-col text-right">
            <h4 className="text-[#d98574] text-hebrew-heading text-[22px] font-bold mb-2 leading-none">גלגל החלטות</h4>
            <p className="text-[14px] text-hebrew-body text-slate-600 mb-5 leading-relaxed">
              לא יודעים מה לעשות? סובבו את הגלגל ותנו לגורל להחליט בשבילכם לאן יוצאים. 🎯
            </p>
            <div className="w-full bg-[#d98574] text-white text-center py-3 rounded-2xl text-hebrew-heading text-[16px] font-bold shadow-sm">התחילו ליצור</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        id="fake-cursor"
        className="absolute z-50 pointer-events-none"
        style={{ top: "80%", left: "80%", opacity: 0 }}
      >
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
