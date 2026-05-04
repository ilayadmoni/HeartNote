"use client";

import { motion } from "framer-motion";

interface BatFigureProps {
  onClick: () => void;
  primaryColor: string;
}

export function BatFigure({ onClick, primaryColor }: BatFigureProps) {
  return (
    <div className="relative w-56 h-72 flex justify-center">
      <svg viewBox="0 0 200 260" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="bat-gown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.18" />
            <stop offset="55%" stopColor={primaryColor} stopOpacity="0.55" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="bat-crown" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="60%" stopColor="#f5c84c" />
            <stop offset="100%" stopColor="#c98a1a" />
          </radialGradient>
          <radialGradient id="bat-skin" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0%" stopColor="#fbe5d6" />
            <stop offset="100%" stopColor="#e9c2a6" />
          </radialGradient>
        </defs>

        {/* Soft floor shadow */}
        <ellipse cx="100" cy="248" rx="62" ry="6" fill={primaryColor} opacity="0.18" />

        {/* Sparkles around */}
        <g opacity="0.8">
          <path d="M 25 80 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 z" fill={primaryColor} opacity="0.5" />
          <path d="M 175 95 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 z" fill={primaryColor} opacity="0.5" />
          <circle cx="30" cy="150" r="2" fill={primaryColor} opacity="0.45" />
          <circle cx="170" cy="160" r="2.5" fill={primaryColor} opacity="0.45" />
          <circle cx="20" cy="200" r="1.8" fill={primaryColor} opacity="0.4" />
          <circle cx="180" cy="210" r="1.8" fill={primaryColor} opacity="0.4" />
        </g>

        {/* Gown — flowing trapezoid with soft curves */}
        <path
          d="M 100,108 C 78,120 60,150 40,232 Q 100,250 160,232 C 140,150 122,120 100,108 Z"
          fill="url(#bat-gown)"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Gown shimmer pleats */}
        <path
          d="M 78,140 Q 75,190 70,232 M 100,128 L 100,242 M 122,140 Q 125,190 130,232"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* Waist sash */}
        <path
          d="M 70,142 Q 100,132 130,142 L 132,150 Q 100,140 68,150 Z"
          fill={primaryColor}
        />
        <circle cx="100" cy="146" r="3.2" fill="#fff3b0" stroke={primaryColor} strokeWidth="1" />

        {/* Bodice */}
        <path
          d="M 82,108 L 118,108 L 114,72 Q 100,66 86,72 Z"
          fill="#fffcfa"
          stroke={primaryColor}
          strokeWidth="2"
        />
        {/* Neckline */}
        <path d="M 90,72 Q 100,80 110,72" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Arms */}
        <path
          d="M 84,108 Q 70,128 72,148"
          fill="none"
          stroke="url(#bat-skin)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 116,108 Q 130,128 128,148"
          fill="none"
          stroke="url(#bat-skin)"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect x="95" y="62" width="10" height="10" rx="3" fill="url(#bat-skin)" />

        {/* Hair — back layer */}
        <path
          d="M 68,52 C 64,90 76,110 86,112 L 114,112 C 124,110 136,90 132,52 C 128,22 110,18 100,18 C 90,18 72,22 68,52 Z"
          fill="#3a2418"
        />

        {/* Face */}
        <circle cx="100" cy="48" r="22" fill="url(#bat-skin)" />

        {/* Hair — front bangs */}
        <path
          d="M 78,40 C 82,28 96,22 100,22 C 104,22 116,28 122,40 C 116,38 110,36 100,36 C 90,36 84,38 78,40 Z"
          fill="#3a2418"
        />

        {/* Eyes */}
        <ellipse cx="91" cy="50" rx="2.4" ry="3" fill="#1b263b" />
        <ellipse cx="109" cy="50" rx="2.4" ry="3" fill="#1b263b" />
        <circle cx="91.7" cy="49" r="0.9" fill="#fff" />
        <circle cx="109.7" cy="49" r="0.9" fill="#fff" />
        {/* Lashes */}
        <path d="M 87,47 q 4,-2 8,0 M 113,47 q -4,-2 -8,0" stroke="#1b263b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <circle cx="83" cy="56" r="3.5" fill={primaryColor} opacity="0.35" />
        <circle cx="117" cy="56" r="3.5" fill={primaryColor} opacity="0.35" />
        {/* Smile */}
        <path
          d="M 93,60 Q 100,66 107,60"
          fill="none"
          stroke="#8a3a3a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Earrings */}
        <circle cx="78" cy="52" r="1.6" fill="#f5c84c" />
        <circle cx="122" cy="52" r="1.6" fill="#f5c84c" />

        {/* Crown — clickable */}
        <motion.g
          className="cursor-pointer"
          style={{ transformOrigin: "100px 18px" }}
          onClick={onClick}
          whileHover={{ scale: 1.18, y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.path
            d="M 74,22 L 84,2 L 100,16 L 116,2 L 126,22 Q 100,28 74,22 Z"
            fill="url(#bat-crown)"
            stroke="#9a6a14"
            strokeWidth="1.2"
            animate={{ filter: ["drop-shadow(0 0 0px #f5c84c)", "drop-shadow(0 0 6px #f5c84c)", "drop-shadow(0 0 0px #f5c84c)"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <circle cx="84" cy="6" r="2.8" fill="#ff6b8a" stroke="#fff" strokeWidth="0.8" />
          <circle cx="100" cy="14" r="3.4" fill={primaryColor} stroke="#fff" strokeWidth="0.8" />
          <circle cx="116" cy="6" r="2.8" fill="#6cc6ff" stroke="#fff" strokeWidth="0.8" />
          {/* Shimmer */}
          <motion.path
            d="M 88,10 l 2,-2 l 1,2 l 2,1 l -2,1 l -1,2 l -2,-1 z"
            fill="#ffffff"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
