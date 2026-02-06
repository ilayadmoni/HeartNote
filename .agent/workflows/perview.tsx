השיחה נפתחה. כבר קראת הודעה אחת.

דילוג לתוכן
שימוש ב-Gmail עם קוראי מסך
5 מתוך 10,290
(ללא נושא)
דואר נכנס

ניצן בן פורת
קבצים מצורפים
יום ה׳, 5 בפבר׳, 19:09 ‎(לפני 19 שעות)‎
אני



--
ניצן בן פורת
0546199544
 קובץ מצורף אחד
  •  נסרק על ידי Gmail
import React, { useState, useEffect } from 'react';
import { Heart, Settings, Calendar, Gift, Smile, User, Check, X, Crown, ArrowLeft, Menu, Star, Sparkles, Layers, Tool, Image as ImageIcon, Type, Music, Share2, LogIn, Lock, Wand2, RefreshCw, Copy, Loader2, Moon, Sun, MousePointer2, Send, Instagram, CreditCard } from 'lucide-react';

/* HeartNote - Digital Factory for Greeting Cards
  Design System & Configuration
*/

const COLORS = {
  midnight: '#1B263B',
  slate: '#415A77',
  clay: '#CB8E7C',
  sand: '#F2E9E4',
  white: '#FFFFFF',
  lightClay: '#E6C6BD',
};

// CSS Styles with Dark Mode Variables
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap');

  :root {
    --font-hebrew: 'Open Sans', sans-serif;
    --font-english: 'Glacial Indifference', 'Josefin Sans', sans-serif;

    /* Light Theme Variables */
    --bg-main: ${COLORS.sand};
    --bg-card: ${COLORS.white};
    --bg-ui: ${COLORS.midnight};
    --bg-input: ${COLORS.white};
    --text-main: ${COLORS.midnight}; /* Dark Blue */
    --text-sec: ${COLORS.slate};    /* Slate Blue */
    --text-on-ui: #FFFFFF;
    --border-color: #e5e7eb;
    --accent: ${COLORS.clay};
    --shadow-color: rgba(0, 0, 0, 0.1);
    --icon-bg-1: rgba(203, 142, 124, 0.15);
    --icon-bg-2: rgba(65, 90, 119, 0.1);
    --icon-bg-3: rgba(27, 38, 59, 0.05);
  }

  [data-theme='dark'] {
    /* Dark Theme Variables */
    --bg-main: #0B111D;      /* Deep Dark Blue */
    --bg-card: #161F2F;      /* Midnight Blue */
    --bg-ui: #2A3B55;        /* Lighter Slate for UI elements */
    --bg-input: #1F2937;     /* Dark Gray for Inputs */
    
    /* Adjusted Text Colors for Better Contrast */
    --text-main: #94A3B8;    /* Slate 400 - Softer than white */
    --text-sec: #CBD5E1;     /* Slate 300 - Readable small text */
    --text-on-ui: #F8FAFC;
    
    --border-color: #374151;
    --accent: ${COLORS.clay};
    --shadow-color: rgba(0, 0, 0, 0.5);
    
    /* High contrast backgrounds for icons in dark mode */
    --icon-bg-1: rgba(203, 142, 124, 0.3); 
    --icon-bg-2: rgba(148, 163, 184, 0.2);
    --icon-bg-3: rgba(255, 255, 255, 0.15);
  }

  .text-midnight { color: var(--text-main) !important; transition: color 0.3s; }
  .text-slate { color: var(--text-sec) !important; transition: color 0.3s; }
  .text-slate-dark { color: var(--text-sec) !important; transition: color 0.3s; }
  .text-clay { color: var(--accent) !important; }
  
  .bg-midnight { background-color: var(--bg-ui) !important; transition: background-color 0.3s; }
  .bg-slate { background-color: var(--bg-ui) !important; transition: background-color 0.3s; }
  .bg-clay { background-color: var(--accent) !important; }
  .bg-sand, .bg-soft-sand { background-color: var(--bg-main) !important; transition: background-color 0.3s; }
  
  body {
    font-family: var(--font-hebrew);
    background-color: var(--bg-main);
    color: var(--text-main);
    transition: background-color 0.3s, color 0.3s;
  }

  .bg-white { background-color: var(--bg-card) !important; transition: background-color 0.3s; }
  
  input, textarea {
    background-color: var(--bg-input) !important;
    color: var(--text-main) !important;
    border-color: var(--border-color) !important;
  }
  input::placeholder, textarea::placeholder {
    color: var(--text-sec) !important;
    opacity: 0.6;
  }

  .bg-gray-50, .bg-gray-100 { 
    background-color: var(--bg-main) !important; 
    filter: brightness(0.95);
  }
  [data-theme='dark'] .bg-gray-50, [data-theme='dark'] .bg-gray-100 { 
     background-color: rgba(255,255,255,0.05) !important;
     filter: none;
  }

  .border-gray-100, .border-gray-200 { border-color: var(--border-color) !important; transition: border-color 0.3s; }
  .border-card-bg { border-color: var(--bg-card) !important; transition: border-color 0.3s; }
  .shadow-lg, .shadow-xl, .shadow-2xl, .shadow-md, .shadow-sm { shadow-color: var(--shadow-color) !important; }

  [data-theme='dark'] .nav-glass {
    background-color: rgba(11, 17, 29, 0.85) !important;
    border-bottom-color: var(--border-color);
  }
  
  [data-theme='dark'] .text-midnight.brand-font { color: #fff !important; }
  
  .bg-step-1 { background-color: var(--icon-bg-1); }
  .bg-step-2 { background-color: var(--icon-bg-2); }
  .bg-step-3 { background-color: var(--icon-bg-3); }

  .force-dark-text { color: #1B263B !important; }

  .brand-font { font-family: var(--font-english); }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-hebrew);
    font-weight: 800;
  }

  .conveyor-belt {
    background-image: repeating-linear-gradient(
      90deg,
      ${COLORS.slate} 0px,
      ${COLORS.slate} 10px,
      transparent 10px,
      transparent 40px
    );
    background-size: 80px 10px;
    animation: moveBelt 2s linear infinite;
  }

  @keyframes moveBelt {
    from { background-position: 0 0; }
    to { background-position: -80px 0; }
  }

  .float-item { animation: float 3s ease-in-out infinite; }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .gear-spin { animation: spin 10s linear infinite; }
  .gear-spin-reverse { animation: spin 15s linear infinite reverse; }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .modal-overlay { animation: fadeIn 0.3s ease-out forwards; }
  .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .shimmer {
    background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-size: 1000px 100%;
    animation: shimmer 1s infinite linear;
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

// --- API Helpers ---

const generateGreeting = async (prompt, tone) => {
  const apiKey = ""; 
  const systemPrompt = `You are a creative copywriter for a greeting card app called HeartNote. 
  Write a short, engaging, and personalized greeting in Hebrew based on the user's request.
  Keep it under 30 words.
  Tone: ${tone}.
  Output only the greeting text, nothing else.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "???? ????? ??????... ??? ???!";
  } catch (error) {
    console.error("AI Error:", error);
    return "?????? ?????? ??? (????? ??????). ??? ??? ????? ????.";
  }
};

// --- Previews ---

const PreviewDateInvite = () => (
  <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <div className="bg-white p-3 rounded-xl shadow-sm w-full max-w-[180px] text-center">
      <p className="text-xs font-bold text-midnight mb-2">???? ?????</p>
      <div className="flex gap-2 justify-center">
        <div className="h-6 w-10 bg-green-500 rounded-md flex items-center justify-center text-[8px] text-white">??!</div>
        <div className="h-6 w-10 bg-gray-300 rounded-md flex items-center justify-center text-[8px] text-gray-500 opacity-50 transform translate-x-1 translate-y-1">??</div>
      </div>
    </div>
    <div className="absolute bottom-6 left-12 transform rotate-12">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#1B263B" stroke="white" strokeWidth="2"/></svg>
    </div>
  </div>
);

const PreviewScratch = () => (
  <div className="h-full w-full bg-white flex flex-col items-center justify-center p-4 relative">
    <div className="w-full h-24 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-clay">??? ???? ????</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 40% 100%, 60% 50%, 0 40%)'}}>
             <div className="w-full h-full flex items-center justify-center opacity-30 text-[8px] force-dark-text">??? ???</div>
      </div>
    </div>
  </div>
);

const PreviewTimeline = () => (
  <div className="h-full w-full bg-gray-50 flex items-center justify-center p-4">
    <div className="flex flex-col items-center gap-2 relative">
      <div className="absolute top-2 bottom-2 w-0.5 bg-slate/30"></div>
      <div className="z-10 bg-white p-1 rounded-full border border-slate shadow-sm">
        <Heart size={10} className="text-clay" />
      </div>
      <div className="z-10 bg-white p-1 rounded-full border border-slate shadow-sm">
        <User size={10} className="text-slate" />
      </div>
      <div className="z-10 bg-white p-1 rounded-full border border-slate shadow-sm">
        <Star size={10} className="text-midnight" />
      </div>
    </div>
  </div>
);

const PreviewCoupons = () => (
  <div className="h-full w-full bg-soft-sand flex items-center justify-center p-4">
    <div className="w-32 h-16 bg-white border-2 border-dashed border-clay rounded-lg flex flex-col items-center justify-center shadow-md transform -rotate-3">
      <span className="text-[8px] font-bold text-slate uppercase tracking-wider">????? ????</span>
      <span className="text-[10px] font-bold text-midnight mt-1">???? ?????</span>
    </div>
    <div className="absolute w-32 h-16 bg-white border-2 border-dashed border-clay rounded-lg shadow-sm transform rotate-6 -z-10 opacity-60"></div>
  </div>
);

const TEMPLATES_DATA = [
    { 
      id: 1, 
      title: '?????? ????????', 
      desc: '????? ??????????? ??? ????? ?"??" ???? ??????. ?? ???? ???? ???.', 
      category: 'love', 
      tag: '??? ??', 
      isPremium: false,
      component: <PreviewDateInvite />
    },
    { 
      id: 2, 
      title: '????? ???-??', 
      desc: '???? ???? ?????? ??????? ?????? ?? ???? ????? ????.', 
      category: 'fun', 
      isPremium: true,
      component: <PreviewScratch />
    },
    { 
      id: 3, 
      title: '??? ???? ????', 
      desc: '??? ??????? ??? ???????? ???????: ?????? ???????, ????? ?????? ?????.', 
      category: 'love', 
      isPremium: false,
      component: <PreviewTimeline />
    },
    { 
      id: 4, 
      title: '??????? ???????', 
      desc: '???? ??????? ???????. ???? ????? ???? ??? ????? ???? ???? ?????!', 
      category: 'family', 
      isPremium: true,
      component: <PreviewCoupons />
    },
];

// --- Components ---

const HeartNoteLogo = ({ isFooter = false, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-2 cursor-pointer group select-none w-fit" dir="ltr">
    <span 
      className={`font-bold text-3xl tracking-tight brand-font ${isFooter ? 'text-white' : 'text-midnight'}`} 
      style={{ fontFamily: 'Glacial Indifference, sans-serif' }}
    >
      HeartNote
    </span>
    <div className="relative w-11 h-11 transform group-hover:scale-105 transition-transform duration-300">
       <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-sm">
         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
               fill="#F2E9E4" stroke="#CB8E7C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
       <div className="absolute -bottom-1 -left-2 bg-white rounded-full p-[2px] shadow-sm">
         <Settings className="text-midnight w-6 h-6 gear-spin" strokeWidth={2.5} /> 
       </div>
    </div>
  </div>
);

const LoginModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay p-4">
    <div className="absolute inset-0 bg-midnight/60 backdrop-blur-sm" onClick={onClose}></div>
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden modal-content flex flex-col">
      <div className="h-2 bg-gradient-to-r from-midnight to-clay"></div>
      <button onClick={onClose} className="absolute top-4 left-4 text-slate hover:text-midnight">
        <X size={24} />
      </button>
      
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-soft-sand rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <LogIn className="text-midnight" size={28} />
        </div>
        <h2 className="text-2xl font-bold text-midnight mb-2 brand-font">Welcome Back</h2>
        <p className="text-midnight mb-6">?????? ????? ??? ?????? ?????</p>

        <form className="space-y-4 text-right" dir="rtl">
          <div>
            <label className="block text-sm font-bold text-midnight mb-1">??????</label>
            <input type="email" className="w-full p-3 rounded-xl border outline-none transition-all" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-midnight mb-1">?????</label>
            <input type="password" className="w-full p-3 rounded-xl border outline-none transition-all" placeholder="••••••••" />
          </div>
          
          <button type="button" className="w-full py-3 mt-4 bg-midnight text-white rounded-xl font-bold hover:bg-slate transition-colors shadow-lg">
            ???????
          </button>
        </form>
        
        <p className="mt-6 text-sm text-slate-dark">
          ??? ??? ?????? <a href="#" className="text-clay font-bold hover:underline">?????? ?????</a>
        </p>
      </div>
    </div>
  </div>
);

const AIWriterPanel = ({ onApply, onClose }) => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState('????');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!topic && !details) return;
    setIsLoading(true);
    setResult('');
    
    const promptText = `???? ???? ?????: ${topic || '????'}. ????? ??????: ${details}`;
    
    try {
      const text = await generateGreeting(promptText, tone);
      setResult(text);
    } catch (e) {
      setResult("????? ?????? ?????");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-0 right-0 w-full h-full bg-white z-50 p-6 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-midnight flex items-center gap-2">
          <Wand2 className="text-clay" size={20} />
          ?? ???? (AI)
        </h3>
        <button onClick={onClose}><X className="text-slate" size={20} /></button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        <div>
          <label className="block text-xs font-bold text-slate-dark mb-1">??? ?? ????? ??????</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-xl border outline-none" 
            placeholder="?????: ??? ????? ????, ???? ?????..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-dark mb-1">????? ????? ??????</label>
          <textarea 
            className="w-full p-3 rounded-xl border outline-none" 
            rows="2"
            placeholder="?????: ????? ??, ?????? ???? ?? ????..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-dark mb-1">?????</label>
          <div className="flex gap-2 flex-wrap">
            {['????', '?????', '????', '??????', '????'].map(t => (
              <button 
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${tone === t ? 'bg-midnight text-white border-midnight' : 'bg-white text-slate border-gray-200 hover:border-slate'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isLoading || (!topic && !details)}
          className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${isLoading || (!topic && !details) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-clay to-pink-500 hover:shadow-lg'}`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
          {isLoading ? '?????? ?????...' : '??? ???? ?????'}
        </button>

        {result && (
          <div className="mt-6 bg-soft-sand p-4 rounded-xl border border-clay/20 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-clay uppercase">?????? ???:</span>
              <div className="flex gap-2">
                <button onClick={handleGenerate} className="text-slate hover:text-midnight" title="??? ???"><RefreshCw size={14} /></button>
              </div>
            </div>
            <p className="text-midnight text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
            <button 
              onClick={() => { onApply(result); onClose(); }}
              className="w-full mt-3 py-2 bg-white border border-clay text-clay hover:bg-clay hover:text-white rounded-lg text-sm font-bold transition-colors"
            >
              ????? ????? ???
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EditorModal = ({ template, onClose }) => {
  const [activeText, setActiveText] = useState("??? ???? ????");
  const [showAIWriter, setShowAIWriter] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay">
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Editor Container */}
      <div className="bg-sand w-full h-full md:w-[95%] md:h-[90%] md:rounded-3xl shadow-2xl relative z-10 overflow-hidden modal-content flex flex-col md:flex-row">
        
        {/* Sidebar - Tools */}
        <div className="w-full md:w-24 bg-white border-l border-gray-200 flex flex-row md:flex-col items-center py-3 md:py-4 gap-4 md:gap-6 shrink-0 z-20 shadow-sm overflow-x-auto md:overflow-visible px-4 md:px-0 no-scrollbar">
          <div className="md:mb-4 p-2 hidden md:block">
            <Settings className="text-midnight gear-spin" size={32} />
          </div>
          
          <div className="flex flex-row md:flex-col gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
            <button className="p-3 rounded-xl bg-clay/10 text-clay hover:bg-clay hover:text-white transition-all group relative flex-1 md:flex-none flex justify-center">
              <Type size={24} />
              <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-midnight text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">????</span>
            </button>
            <button className="p-3 rounded-xl hover:bg-gray-100 text-slate hover:text-midnight transition-all flex-1 md:flex-none flex justify-center">
              <ImageIcon size={24} />
            </button>
            <button className="p-3 rounded-xl hover:bg-gray-100 text-slate hover:text-midnight transition-all flex-1 md:flex-none flex justify-center">
              <Music size={24} />
            </button>
            <button className="p-3 rounded-xl hover:bg-gray-100 text-slate hover:text-midnight transition-all flex-1 md:flex-none flex justify-center">
              <Sparkles size={24} />
            </button>
            <div className="w-full h-px bg-gray-200 my-2 hidden md:block"></div>
            <button className="p-3 rounded-xl hover:bg-gray-100 text-slate hover:text-midnight transition-all flex-1 md:flex-none flex justify-center">
              <Layers size={24} />
            </button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
          {/* Header */}
          <div className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-slate"><ArrowLeft size={20} /></button>
              <div>
                <h3 className="font-bold text-midnight text-base md:text-lg">{template?.title || '?????'}</h3>
                <span className="text-xs text-slate-dark hidden md:inline">????? ????? ??????? ?-10:42</span>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
               <button className="px-3 md:px-4 py-2 rounded-lg text-slate-dark font-medium hover:bg-gray-100 text-sm md:text-base hidden sm:block">????? ??????</button>
               <button className="px-4 md:px-6 py-2 rounded-lg bg-midnight text-white font-bold shadow-md hover:bg-slate flex items-center gap-2 text-sm md:text-base">
                 <Share2 size={16} />
                 <span>?????</span>
               </button>
            </div>
          </div>

          {/* Canvas Workspace */}
          <div className="flex-1 flex items-center justify-center p-0 md:p-8 overflow-y-auto" style={{backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            <div className="relative w-full h-full md:w-[320px] md:h-[600px] bg-white md:rounded-[3rem] md:border-[8px] border-none md:border-midnight shadow-none md:shadow-2xl flex flex-col overflow-hidden">
              
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-midnight rounded-b-xl z-20"></div>
              
              <div className="flex-1 w-full h-full relative">
                 {template?.component ? React.cloneElement(template.component) : (
                   <div className="flex items-center justify-center h-full text-slate-dark">??? ?????</div>
                 )}
                 
                 {/* Editing Overlays Mockup */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-clay border-dashed w-3/4 h-auto min-h-[6rem] p-2 rounded flex items-center justify-center bg-white/80 backdrop-blur-sm cursor-move group shadow-sm z-30">
                   <p className="text-center font-bold text-midnight text-lg break-words w-full px-2">{activeText}</p>
                   <div className="absolute -top-3 -right-3 w-6 h-6 bg-clay rounded-full text-white flex items-center justify-center cursor-pointer shadow-sm"><Settings size={12}/></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 shrink-0 overflow-y-auto relative">
          
          {showAIWriter ? (
            <AIWriterPanel onApply={(text) => { setActiveText(text); setShowAIWriter(false); }} onClose={() => setShowAIWriter(false)} />
          ) : (
            <div className="p-6">
              <h4 className="font-bold text-midnight mb-6">????????</h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-dark uppercase tracking-wider">???? ????</label>
                    <button 
                      onClick={() => setShowAIWriter(true)}
                      className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full hover:shadow-md transition-all"
                    >
                      <Sparkles size={10} />
                      AI ?? ????
                    </button>
                  </div>
                  <textarea 
                    className="w-full p-3 rounded-xl border outline-none" 
                    rows="3" 
                    value={activeText}
                    onChange={(e) => setActiveText(e.target.value)}
                  ></textarea>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 block">?????</label>
                   <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-full bg-midnight cursor-pointer ring-2 ring-offset-2 ring-midnight"></div>
                     <div className="w-8 h-8 rounded-full bg-clay cursor-pointer"></div>
                     <div className="w-8 h-8 rounded-full bg-slate cursor-pointer"></div>
                     <div className="w-8 h-8 rounded-full bg-pink-400 cursor-pointer"></div>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                   <label className="text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 block">???????</label>
                   <div className="grid grid-cols-2 gap-2">
                     <div className="p-3 border border-clay bg-clay/5 rounded-lg text-center text-xs font-bold text-clay cursor-pointer">?????</div>
                     <div className="p-3 border border-gray-200 rounded-lg text-center text-xs text-slate-dark hover:bg-gray-50 cursor-pointer">?????</div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ onOpenLogin, isDarkMode, toggleTheme, setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleNavClick = (pageName) => {
    setPage(pageName);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToHowItWorks = () => {
    setPage('home');
    setIsOpen(false);
    setTimeout(() => {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="w-full bg-white/80 nav-glass backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <HeartNoteLogo onClick={() => handleNavClick('home')} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse text-midnight font-medium">
            <button onClick={() => handleNavClick('gallery')} className="hover:text-clay transition-colors">?????? ???????</button>
            <button onClick={() => handleNavClick('pricing')} className="hover:text-clay transition-colors">??????? ???????</button>
            <button onClick={handleScrollToHowItWorks} className="hover:text-clay transition-colors">??? ?? ????</button>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-midnight hover:bg-gray-100 transition-colors"
              title={isDarkMode ? "???? ???? ???" : "???? ???? ????"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button 
              onClick={onOpenLogin}
              className="px-6 py-2 rounded-full border-2 border-midnight text-midnight font-medium hover:bg-slate hover:text-white hover:border-slate transition-all duration-300"
            >
              ???????
            </button>
            <button 
              className="px-6 py-2 rounded-full font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              style={{ backgroundColor: COLORS.clay }}
            >
              ??? ???? ?????
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-midnight hover:bg-gray-100 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-midnight p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full left-0 right-0 top-20">
          <button onClick={() => handleNavClick('gallery')} className="block w-full text-right py-3 px-2 text-lg text-midnight font-medium border-b border-gray-100 active:bg-gray-50">?????? ???????</button>
          <button onClick={() => handleNavClick('pricing')} className="block w-full text-right py-3 px-2 text-lg text-midnight font-medium border-b border-gray-100 active:bg-gray-50">??????? ???????</button>
          <button onClick={handleScrollToHowItWorks} className="block w-full text-right py-3 px-2 text-lg text-midnight font-medium border-b border-gray-100 active:bg-gray-50">??? ?? ????</button>
          <div className="flex flex-col gap-3 mt-4 px-2">
            <button 
              onClick={() => { setIsOpen(false); onOpenLogin(); }}
              className="w-full py-3 rounded-xl border-2 border-midnight text-midnight font-bold active:bg-gray-100"
            >
              ???????
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl text-white font-bold shadow-md active:opacity-90" 
              style={{ backgroundColor: COLORS.clay }}
            >
              ??? ???? ?????
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ setPage }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 px-4">
      {/* Background Decor - Optimized for mobile */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
        <Settings size={200} className="md:w-[400px] md:h-[400px] gear-spin text-slate" />
      </div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 opacity-5">
        <Settings size={150} className="md:w-[300px] md:h-[300px] gear-spin-reverse text-midnight" />
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-right z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm mb-6 border border-gray-200">
            <Sparkles size={16} className="text-clay" />
            <span className="text-sm font-semibold text-slate-dark">???? ?????? ???????? ????</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black leading-tight text-midnight mb-6">
            ?????? ????? <br/>
            <span className="relative">
              ????? ??????
              <svg className="absolute w-full h-3 -bottom-1 right-0 text-clay opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99999C48.0674 2.87274 135.207 -1.69532 197.973 3.65345" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span> ????.
          </h1>
          <p className="text-lg lg:text-xl text-midnight mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium opacity-90 px-4 lg:px-0">
            ??? ????? ??????? ?????????, ??????? ??????? ???? ??? ??? ???????. ???? ?????, ?????? ?????, ?????!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              onClick={() => { setPage('gallery'); window.scrollTo(0,0); }}
              className="px-8 py-4 rounded-full text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{ backgroundColor: COLORS.clay }}
            >
              ?????? ?? ?????? – ?????? ????
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        {/* Visual Metaphor: Digital Assembly Line */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl relative mt-8 lg:mt-0">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
            {/* Machine Header */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 opacity-20">
               {[1,2,3].map(i => <div key={i} className="w-16 h-2 rounded-full bg-slate"></div>)}
            </div>

            <div className="h-64 flex flex-col items-center justify-center relative mt-4">
              
              {/* The Items on the Belt */}
              <div className="flex justify-between w-full px-4 absolute top-10 z-10">
                <div className="float-item bg-soft-sand p-2 md:p-3 rounded-2xl shadow-md border border-gray-200">
                  <Heart className="text-clay h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="float-item delay-100 bg-soft-sand p-2 md:p-3 rounded-2xl shadow-md border border-gray-200" style={{animationDelay: '0.5s'}}>
                  <Layers className="text-slate h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="float-item delay-200 bg-soft-sand p-2 md:p-3 rounded-2xl shadow-md border border-gray-200" style={{animationDelay: '1s'}}>
                   <Gift className="text-midnight h-6 w-6 md:h-8 md:w-8" />
                </div>
              </div>

              {/* The Machine Processing Area */}
              <div className="w-full h-24 md:h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-slate/30 mt-12 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent z-10 animate-pulse"></div>
                 <span className="text-slate-dark font-bold z-20 bg-white px-4 py-1 rounded shadow-sm">Processing...</span>
              </div>

              {/* The Conveyor Belt */}
              <div className="w-full h-3 bg-gray-300 mt-6 rounded-full relative overflow-hidden border border-gray-400">
                <div className="absolute inset-0 conveyor-belt opacity-50"></div>
              </div>

              {/* Finished Product */}
              <div className="absolute -bottom-6 right-4 bg-midnight text-white px-4 py-2 rounded-t-xl text-xs font-bold shadow-lg transform rotate-3">
                ????? ??????!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TemplateCard = ({ template, onSelect }) => {
  return (
    <div onClick={() => onSelect(template)} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-clay/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full">
      {/* Visual Header */}
      <div className="h-40 w-full relative bg-gray-50 border-b border-gray-100">
        {template.component}
        
        {template.isPremium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-1.5 rounded-full shadow-md z-20">
            <Crown size={14} fill="currentColor" />
          </div>
        )}
        
        {template.tag && (
          <div className="absolute top-3 right-3 bg-midnight text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-20">
            {template.tag}
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-midnight/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="text-white border border-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-midnight transition-colors">
            ???? ????
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-midnight group-hover:text-clay transition-colors">{template.title}</h3>
        </div>
        <p className="text-midnight text-sm leading-relaxed mb-4">{template.desc}</p>
        
        {template.isPremium && (
           <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs font-semibold text-yellow-600">
             <Crown size={12} />
             <span>???? ?????? ?????? ????????</span>
           </div>
        )}
      </div>
    </div>
  );
};

const GalleryTeaser = ({ setPage, onSelectTemplate }) => {
  const featuredTemplates = TEMPLATES_DATA.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-midnight mb-4">????? ???????</h2>
          <p className="text-midnight font-medium max-w-2xl mx-auto">??? ??? ????????? ??? ????????? ????. ?? ??? ???? ?????!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
          ))}
        </div>

        <div className="flex justify-center">
            <button 
              onClick={() => { setPage('gallery'); window.scrollTo(0,0); }}
              className="px-8 py-4 rounded-full text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 bg-midnight"
            >
              ??? ??????? ??????
              <ArrowLeft size={20} />
            </button>
         </div>
      </div>
    </section>
  );
};

const Gallery = ({ onSelectTemplate }) => {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: '???' },
    { id: 'love', label: '?????? ?????' },
    { id: 'bday', label: '??? ?????' },
    { id: 'family', label: '????? ??????' },
    { id: 'fun', label: '?????' },
  ];

  const filtered = filter === 'all' ? TEMPLATES_DATA : TEMPLATES_DATA.filter(t => t.category === filter);

  return (
    <section id="gallery" className="py-24 px-4 bg-white relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-midnight mb-4">???? ?? ?????? ???? ????</h2>
          <p className="text-midnight font-medium max-w-2xl mx-auto">?????? ???? ??????? ?? ???? ??????? ??????? ?????? ?????.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 
                ${filter === cat.id 
                  ? 'text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-slate-dark hover:bg-gray-200'}`}
              style={filter === cat.id ? { backgroundColor: COLORS.clay } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingTeaser = ({ setPage }) => {
  return (
    <section className="py-20 px-4 bg-sand text-center relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
            style={{backgroundImage: 'radial-gradient(#1B263B 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
       </div>

       <div className="max-w-4xl mx-auto relative z-10">
         <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm mb-6 border border-gray-100">
            <Crown size={16} className="text-clay" />
            <span className="text-sm font-bold text-midnight">????? ?? ??????</span>
         </div>
         
         <h2 className="text-3xl lg:text-5xl font-black text-midnight mb-6">???? ?? ?????? ?????? ??????</h2>
         <p className="text-lg text-slate-dark mb-10 max-w-2xl mx-auto">
           ????? ???? ??????? ??? ?????? "??? ????" ?????? ??? ???. ?????? ????? ?????? ???? ?????.
         </p>
         
         <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setPage('pricing'); window.scrollTo(0,0); }}
              className="px-8 py-4 rounded-full text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 bg-midnight"
            >
              ??? ??????? ????????
              <ArrowLeft size={20} />
            </button>
         </div>
       </div>
    </section>
  );
};

const PricingTable = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-sand min-h-screen">
      <div className="max-w-7xl mx-auto">
         <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-midnight mb-4">??????? ?????</h2>
          <p className="text-midnight font-medium max-w-2xl mx-auto">???? ?? ????? ???????? ????? ????. ???? ???? ??? ???.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow relative">
             <h3 className="text-xl font-bold text-midnight mb-2">???? ?????</h3>
             <div className="text-4xl font-black text-midnight mb-6">0 ?</div>
             <ul className="space-y-4 mb-8 text-midnight text-sm">
               <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> ???? ?-5 ?????? ????</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> ????? ???? ????</li>
               <li className="flex items-center gap-2 text-slate"><Lock size={16} /> ???? HeartNote ?? ??????</li>
               <li className="flex items-center gap-2 text-slate"><Lock size={16} /> ??? ?????? ??????</li>
             </ul>
             <button className="w-full py-3 rounded-xl border-2 border-slate text-slate-dark font-bold hover:bg-slate hover:text-white transition-colors">??? ????? ????</button>
          </div>

          {/* Premium Plan - Highlighted */}
          <div className="p-8 rounded-3xl shadow-2xl relative transform md:scale-105 z-10 text-white border-4 border-white" style={{ backgroundColor: COLORS.clay }}>
             <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white text-clay border border-clay px-4 py-1 rounded-full text-xs font-bold shadow-md">?????</div>
             <h3 className="text-xl font-bold text-white mb-2">???? ?????</h3>
             <div className="text-5xl font-black text-white mb-2">29 ?</div>
             <span className="text-gray-100 text-sm block mb-6">?????</span>
             
             <ul className="space-y-4 mb-8 text-white text-sm">
               <li className="flex items-center gap-2"><Check size={16} className="text-white" /> ???? ??? ???????</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-white" /> ???? ???? ??????</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-white" /> ????? ?????? ??????</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-white" /> ?????? ???</li>
             </ul>
             <button className="w-full py-4 rounded-xl bg-white text-clay font-bold hover:bg-midnight hover:text-white transition-colors shadow-lg">???? ????? ?????</button>
          </div>

          {/* Business Plan */}
           <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow">
             <h3 className="text-xl font-bold text-midnight mb-2">??? ?????</h3>
             <div className="text-4xl font-black text-midnight mb-6">59 ?</div>
             <ul className="space-y-4 mb-8 text-midnight text-sm">
               <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> ??? ???? ???</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> ?????????? ?????</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> ?????? ????</li>
               <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> ????? ???????? 24/7</li>
             </ul>
             <button className="w-full py-3 rounded-xl border-2 border-slate text-slate-dark font-bold hover:bg-slate hover:text-white transition-colors">??? ????? ????</button>
          </div>

        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden bg-white">
      {/* Decorative Gears (Background) */}
      <div className="absolute top-10 right-0 opacity-5 pointer-events-none">
         <Settings size={200} className="gear-spin text-midnight" />
      </div>
      <div className="absolute bottom-10 left-0 opacity-5 pointer-events-none">
         <Settings size={180} className="gear-spin-reverse text-midnight" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl lg:text-4xl font-black text-midnight mb-4">??? ?? ?????</h2>
        <p className="text-slate-dark mb-16 text-lg">????? ????? ?????? ?????? ????? ???????</p>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 right-[16%] left-[16%] h-1 border-t-4 border-dashed border-clay/30 z-0"></div>

          {/* Step 1 */}
          <div className="relative flex flex-col items-center group">
             {/* Icon Container */}
            <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-step-1 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
                    <MousePointer2 className="text-clay w-10 h-10" />
                </div>
                {/* Badge */}
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-clay text-white flex items-center justify-center font-bold shadow-md border-4 border-card-bg">1</div>
            </div>
            
            <h3 className="text-xl font-bold text-midnight mb-3">?????? ?????</h3>
            <p className="text-slate-dark text-sm leading-relaxed max-w-xs mx-auto">
              ???? ????? ???? ?????? ???? - ?? ??? ????? ???????? ????????
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center group">
             {/* Icon Container */}
            <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-step-2 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
                    <Settings className="text-midnight w-10 h-10" />
                </div>
                {/* Badge */}
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-midnight text-white flex items-center justify-center font-bold shadow-md border-4 border-card-bg">2</div>
            </div>
            
            <h3 className="text-xl font-bold text-midnight mb-3">??????? ?????</h3>
            <p className="text-slate-dark text-sm leading-relaxed max-w-xs mx-auto">
              ?????? ????, ?????? ??????? ?????? ????? ?????? ????? ????
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center group">
             {/* Icon Container */}
            <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-step-3 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
                     <Send className="text-slate w-10 h-10" />
                </div>
                {/* Badge */}
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-slate text-white flex items-center justify-center font-bold shadow-md border-4 border-card-bg">3</div>
            </div>
            
            <h3 className="text-xl font-bold text-midnight mb-3">?????? ????????</h3>
            <p className="text-slate-dark text-sm leading-relaxed max-w-xs mx-auto">
              ???? ??? ????? ????? ????? ?????? ??? ????????
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = ({ setPage }) => (
  <footer className="bg-midnight text-slate pt-16 pb-8 px-4 border-t border-slate/30">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
        
        {/* Logo & Socials Side */}
        <div className="flex flex-col gap-6">
          <HeartNoteLogo isFooter={true} onClick={() => { setPage('home'); window.scrollTo(0,0); }} />
          <p className="text-slate text-sm max-w-xs">
            ???? ?????? ???????? ????. ?????? ????, ?????? ????????? ?????? ?????.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-clay flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-clay/20" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-clay flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-clay/20" aria-label="TikTok">
              {/* Custom TikTok SVG since it's not always in standard sets */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Sections */}
        <div className="flex flex-wrap gap-12 md:gap-24">
          <div>
            <h4 className="text-white font-bold mb-4 brand-font">HeartNote</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => { setPage('home'); window.scrollTo(0,0); }} className="text-slate hover:text-clay transition-colors">?????</button></li>
              <li><button onClick={() => { setPage('home'); window.scrollTo(0,0); }} className="text-slate hover:text-clay transition-colors">??? ?? ????</button></li>
              <li><button onClick={() => { setPage('home'); window.scrollTo(0,0); }} className="text-slate hover:text-clay transition-colors">??? ???</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">?????</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-slate hover:text-clay transition-colors">??????? ??????</a></li>
              <li><a href="#" className="text-slate hover:text-clay transition-colors">???? ?????</a></li>
              <li><a href="#" className="text-slate hover:text-clay transition-colors">????? ??????</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center md:text-right text-xs text-slate pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© {new Date().getFullYear()} HeartNote Factory. ?? ??????? ??????. ???? ?????.</span>
        <span className="hidden md:inline text-[10px]">Secure 256-bit SSL Encryption</span>
      </div>
    </div>
  </footer>
);

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Router Logic
  const renderContent = () => {
    switch(currentPage) {
      case 'gallery':
        return (
          <div className="animate-in fade-in zoom-in duration-300">
            <Gallery onSelectTemplate={setSelectedTemplate} />
          </div>
        );
      case 'pricing':
        return (
          <div className="animate-in fade-in zoom-in duration-300">
            <PricingTable />
          </div>
        );
      default: // home
        return (
          <>
            <Hero setPage={setCurrentPage} />
            <GalleryTeaser setPage={setCurrentPage} onSelectTemplate={setSelectedTemplate} />
            <PricingTeaser setPage={setCurrentPage} />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen selection:bg-clay selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {selectedTemplate && <EditorModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}

      <Navigation 
        onOpenLogin={() => setShowLogin(true)} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        setPage={setCurrentPage}
      />
      
      {renderContent()}
      
      <Footer setPage={setCurrentPage} />
    </div>
  );
};

export default App;
קוד HEARTNOTE.txt
מציג את קוד HEARTNOTE.txt.