"use client";

/**
 * StoryDemo Component
 * Instagram-style interactive demo with auto-advance and RTL navigation
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, Copy, Share2, MessageCircle, Sparkles, Check, X } from "lucide-react";
import { StoryProgress } from "./components/StoryProgress";

const storySteps = [
  {
    id: 1,
    title: "1. בוחרים תבנית",
    description: "מתוך גלריית תבניות אינטראקטיביות",
    cardContent: (
      <div className="bg-[#faf9f6] h-full w-full flex flex-col pt-24 px-4 pb-4">
        <h3 className="text-xl font-bold text-slate-800 text-center mb-1 drop-shadow-sm">בחרו את החוויה הבאה</h3>
        <p className="text-xs text-slate-500 text-center mb-6">תבניות אינטראקטיביות שנוצרו באהבה</p>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative mt-4 transform transition-transform hover:scale-105">
          <div className="absolute top-3 right-3 bg-[#10b981] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm">חינם</div>
          <div className="flex justify-center items-center h-20 mb-2">
             <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex gap-3 shadow-inner">
                <div className="bg-gray-200 text-gray-400 px-4 py-1.5 rounded-md text-xs font-medium">לא</div>
                <div className="bg-[#d98574] text-white px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1">כן <Heart className="w-3 h-3 fill-current" /></div>
             </div>
          </div>
          <h4 className="text-center font-bold text-slate-800 text-lg mb-1">הזמנה לדייט</h4>
          <p className="text-center text-xs text-slate-500 mb-5 px-2 leading-relaxed">כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה! 💘</p>
          <div className="bg-[#d98574] text-white text-center py-2.5 rounded-xl font-medium text-sm shadow-md shadow-rose-200">התחילו ליצור</div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "2. עורכים אישית",
    description: "משנים טקסט וצבעים בקלות",
    cardContent: (
      <div className="bg-[#faf9f6] h-full w-full flex items-center justify-center px-5 pt-32 pb-8">
        <div className="w-full max-w-[320px] max-h-[580px] bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center overflow-y-auto">
          <div className="flex justify-center items-center mb-6 border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-800">מאפיינים</span>
          </div>
          <div className="mb-5 text-center">
            <label className="text-[11px] text-slate-500 block mb-1.5 font-medium">שאלה</label>
            <div className="border-[1.5px] rounded-xl p-3 text-sm text-slate-800 border-[#d98574] bg-rose-50/30 relative shadow-sm text-center">
              היי את פנויה מחר בערב ב9 לדייט?
              <span className="absolute bottom-3 inline-block w-0.5 h-4 bg-slate-800 ml-1 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 text-center">31/35</div>
          </div>
          <div className="mb-6 text-center">
            <label className="text-[11px] text-slate-500 block mb-1.5 font-medium">הודעת הצלחה</label>
            <div className="border rounded-xl p-3 text-sm text-slate-800 border-slate-200 bg-slate-50 text-center">
              ידעתי שתגידי כן מחכה לך!
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-3 font-medium text-center">צבע ראשי</label>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="w-8 h-8 rounded-full bg-[#d98574] ring-2 ring-offset-2 ring-[#d98574] relative flex justify-center items-center shadow-sm"><Check className="w-4 h-4 text-white" /></div>
              <div className="w-8 h-8 rounded-full bg-pink-200 shadow-sm"></div>
              <div className="w-8 h-8 rounded-full bg-purple-200 shadow-sm"></div>
              <div className="w-8 h-8 rounded-full bg-blue-300 shadow-sm"></div>
              <div className="w-8 h-8 rounded-full bg-green-200 shadow-sm"></div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-3">סלמון</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3. יוצרים את התבנית",
    description: "רואים בדיוק איך זה ייראה",
    cardContent: (
      <div className="bg-[#faf9f6] h-full w-full flex flex-col items-center justify-center relative pt-32 pb-8">
        <div className="bg-white p-7 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] text-center w-full max-w-[280px] max-h-[480px] z-10 mx-4 border border-rose-50">
          <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5">
             <Heart className="w-6 h-6 text-[#d98574] fill-[#d98574]" />
          </div>
          <h3 className="text-[17px] font-bold text-slate-800 mb-2 leading-snug">היי את פנויה מחר בערב ב9 לדייט?</h3>
          <p className="text-[11px] text-slate-500 mb-6">כדאי לך לבחור את התשובה הנכונה...</p>
          <div className="flex gap-3 w-full">
            <button className="flex-[0.8] py-2.5 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">לא</button>
            <button className="flex-[1.2] py-2.5 bg-[#d98574] text-white rounded-full text-sm font-bold flex justify-center items-center gap-1.5 shadow-lg shadow-rose-200">
              כן <Heart className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "4. מפיצים למי שאוהבים",
    description: "שולחים בקליק בוואטסאפ או בקישור",
    cardContent: (
      <div className="bg-[#faf9f6] h-full w-full flex flex-col items-center justify-center px-5 pt-32 pb-8">
        <div className="bg-white rounded-[24px] w-full max-w-[320px] max-h-[560px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          <div className="bg-[#d98574] text-white text-center py-7 px-4 relative">
            <Sparkles className="absolute top-4 right-4 w-5 h-5 opacity-50" />
            <Sparkles className="absolute bottom-4 left-4 w-4 h-4 opacity-50" />
            <span className="text-4xl mb-3 block drop-shadow-md">🎉</span>
            <h3 className="font-bold text-xl drop-shadow-sm">הכרטיס נוצר בהצלחה!</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <p className="text-[11px] text-slate-500 text-center font-medium">קישור לשיתוף</p>
            <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm focus-within:border-[#d98574] transition-colors">
               <button className="bg-[#d98574] p-3.5 text-white hover:bg-[#c97564] flex items-center justify-center"><Copy size={16}/></button>
               <div className="p-3 text-[11px] text-slate-500 flex-1 flex items-center border-r border-slate-200" dir="ltr">
                 <span className="truncate w-40">https://heartnote.co.il/p/064...</span>
               </div>
            </div>
            <div className="flex gap-2.5 mt-2">
               <button className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl flex justify-center items-center shadow-sm"><Share2 size={18}/></button>
               <button className="flex-[2.5] bg-[#25D366] hover:bg-[#1ebd5a] text-white py-3 rounded-xl flex justify-center items-center gap-2 font-bold shadow-sm"><MessageCircle size={18}/> WhatsApp</button>
            </div>
            <button className="mt-2 text-xs text-slate-400 text-center py-2 hover:text-slate-600">סגור וחזור לעמוד הבית</button>
          </div>
        </div>
      </div>
    )
  }
];

const AUTO_ADVANCE_DURATION = 6000; // 6 seconds
const PROGRESS_INTERVAL = 50; // Update progress every 50ms

export function StoryDemo() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance logic with auto-exit on last slide
  useEffect(() => {
    const progressIncrement = (PROGRESS_INTERVAL / AUTO_ADVANCE_DURATION) * 100;
    
    const timer = setInterval(() => {
      // Skip progress update while paused
      if (isPaused) return;
      
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;
        
        // Move to next step when progress reaches 100%
        if (newProgress >= 100) {
          if (currentStep < storySteps.length - 1) {
            setCurrentStep((s) => s + 1);
            return 0;
          } else {
            // Last slide finished - auto-exit to homepage
            router.push("/");
            return 100;
          }
        }
        
        return newProgress;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(timer);
  }, [currentStep, isPaused, router]);

  // Navigation handlers (RTL-aware)
  const goToNext = useCallback(() => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep((s) => s + 1);
      setProgress(0);
    } else {
      // Last slide - exit to home
      router.push("/");
    }
  }, [currentStep, router]);

  const goToPrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setProgress(0);
    }
  }, [currentStep]);

  // RTL Navigation zones (left = next, right = previous)
  const handleLeftClick = () => goToNext();
  const handleRightClick = () => goToPrevious();

  // Close and return home
  const handleClose = () => {
    router.push("/");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPrevious();
      if (e.key === "ArrowLeft") goToNext();
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrevious]);

  // Pause/Resume handlers for Instagram-style touch hold
  const handlePauseStart = () => setIsPaused(true);
  const handlePauseEnd = () => setIsPaused(false);

  return (
    <div className="fixed inset-0 z-50 bg-[#1c2636]/95 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6" dir="rtl">
      <div 
        className="relative w-full h-full sm:w-[420px] sm:h-[800px] sm:max-h-[85vh] overflow-visible"
      >
        {/* Close Button (outside frame - desktop only) */}
        <button
          onClick={handleClose}
          className="hidden sm:block absolute sm:-top-7 sm:-left-96 z-[80] text-white/90 hover:text-white bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm"
          aria-label="סגור"
        >
          <X size={18} />
        </button>

 

        {/* Clean Rectangular Container */}
        <div className="relative w-full h-full bg-white sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* Top Gradient for Progress Bars visibility */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-5 px-4 bg-gradient-to-b from-black/60 via-black/20 to-transparent pb-10 pointer-events-none">
          <StoryProgress
            totalSteps={storySteps.length}
            currentStep={currentStep}
            progress={progress}
          />
          <div className="mt-3 text-center">
            <h2 className="text-white text-sm font-bold drop-shadow-md">{storySteps[currentStep].title}</h2>
            <p className="text-white/80 text-xs drop-shadow-sm">{storySteps[currentStep].description}</p>
          </div>
        </div>
        
        {/* Invisible Touch/Click zones for Left/Right navigation */}
        <button
          onClick={handleRightClick}
          disabled={currentStep === 0}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer disabled:cursor-not-allowed"
          aria-label="הקודם"
          style={{ background: "transparent" }}
        />
        <button
          onClick={handleLeftClick}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer"
          aria-label="הבא"
          style={{ background: "transparent" }}
        />
        
          {/* Main Slide Content Wrapper */}
          <div 
            className="flex-1 relative overflow-hidden bg-[#faf9f6] select-none"
            onPointerDown={handlePauseStart}
            onPointerUp={handlePauseEnd}
            onPointerLeave={handlePauseEnd}
          >
            <div key={currentStep} className="absolute inset-0 flex items-center justify-center text-center">
            {storySteps[currentStep].cardContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
