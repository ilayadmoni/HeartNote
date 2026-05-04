"use client";

import { motion } from "framer-motion";

interface BarFigureProps {
  onClick: () => void;
  primaryColor: string;
}

export function BarFigure({ onClick, primaryColor }: BarFigureProps) {
  return (
    <div className="relative w-64 h-72 flex justify-center items-end">
      <svg viewBox="0 0 250 260" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="bar-suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3a5e" />
            <stop offset="100%" stopColor="#1b263b" />
          </linearGradient>
          <linearGradient id="bar-bimah" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="bar-skin" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0%" stopColor="#fbe5d6" />
            <stop offset="100%" stopColor="#e9c2a6" />
          </radialGradient>
          <linearGradient id="bar-scroll" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="100%" stopColor="#f0e1c2" />
          </linearGradient>
        </defs>

        {/* Floor shadow */}
        <ellipse cx="125" cy="252" rx="90" ry="6" fill="#000" opacity="0.18" />

        {/* Sparkles */}
        <g opacity="0.7">
          <path d="M 30 60 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" fill={primaryColor} opacity="0.55" />
          <path d="M 220 50 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" fill={primaryColor} opacity="0.55" />
          <circle cx="20" cy="120" r="2" fill={primaryColor} opacity="0.5" />
          <circle cx="232" cy="130" r="2" fill={primaryColor} opacity="0.5" />
        </g>

        {/* Boy figure */}
        <g transform="translate(10, 0)">
          {/* Legs */}
          <rect x="44" y="138" width="14" height="92" rx="4" fill="url(#bar-suit)" />
          <rect x="69" y="138" width="14" height="92" rx="4" fill="url(#bar-suit)" />
          {/* Shoes */}
          <path d="M 34,232 L 60,232 Q 60,222 47,222 Q 36,222 34,232 Z" fill="#0f1420" />
          <path d="M 59,232 L 85,232 Q 85,222 72,222 Q 61,222 59,232 Z" fill="#0f1420" />
          <line x1="34" y1="230" x2="60" y2="230" stroke="#fff" strokeWidth="0.6" opacity="0.3" />
          <line x1="59" y1="230" x2="85" y2="230" stroke="#fff" strokeWidth="0.6" opacity="0.3" />

          {/* Suit jacket */}
          <path
            d="M 32,68 Q 63,58 91,68 L 102,150 Q 63,160 22,150 Z"
            fill="url(#bar-suit)"
            stroke="#0f1420"
            strokeWidth="1.2"
          />
          {/* Lapels */}
          <path d="M 32,68 L 56,86 L 50,150 L 33,150 Z" fill="#0f1420" opacity="0.5" />
          <path d="M 91,68 L 67,86 L 73,150 L 90,150 Z" fill="#0f1420" opacity="0.5" />

          {/* Tallit (prayer shawl) — draped */}
          <path
            d="M 18,72 Q 62,60 105,72 L 100,86 Q 62,76 23,86 Z"
            fill="#fffcfa"
            stroke={primaryColor}
            strokeWidth="1.2"
          />
          <path
            d="M 22,80 L 101,80"
            stroke={primaryColor}
            strokeWidth="1.2"
            strokeDasharray="3,2"
          />
          {/* Tallit fringe stripes */}
          <line x1="22" y1="84" x2="101" y2="84" stroke={primaryColor} strokeWidth="0.6" />

          {/* Shirt + tie */}
          <path d="M 56,68 L 67,68 L 65,90 L 58,90 Z" fill="#fffcfa" />
          <path d="M 58,72 L 65,72 L 62,86 L 61,86 Z" fill={primaryColor} />

          {/* Buttons */}
          <circle cx="62" cy="100" r="1.6" fill="#f5c84c" />
          <circle cx="62" cy="115" r="1.6" fill="#f5c84c" />
          <circle cx="62" cy="130" r="1.6" fill="#f5c84c" />

          {/* Neck */}
          <rect x="57" y="56" width="11" height="10" rx="3" fill="url(#bar-skin)" />

          {/* Head */}
          <circle cx="62" cy="40" r="20" fill="url(#bar-skin)" />

          {/* Hair */}
          <path
            d="M 42,32 C 46,18 80,16 84,32 C 84,28 78,12 62,12 C 46,12 42,28 42,32 Z"
            fill="#2a1a10"
          />
          <path d="M 44,30 Q 60,22 82,30" stroke="#1b0f08" strokeWidth="1.2" fill="none" />

          {/* Kippah */}
          <path
            d="M 49,18 Q 62,8 75,18 Q 70,15 62,15 Q 54,15 49,18 Z"
            fill={primaryColor}
            stroke="#0f1420"
            strokeWidth="0.8"
          />
          <circle cx="62" cy="14" r="1.4" fill="#f5c84c" />

          {/* Eyes */}
          <ellipse cx="55" cy="40" rx="2.2" ry="2.6" fill="#1b263b" />
          <ellipse cx="69" cy="40" rx="2.2" ry="2.6" fill="#1b263b" />
          <circle cx="55.6" cy="39.2" r="0.8" fill="#fff" />
          <circle cx="69.6" cy="39.2" r="0.8" fill="#fff" />

          {/* Brows */}
          <path d="M 52,34 q 3,-1.5 6,0 M 66,34 q 3,-1.5 6,0" stroke="#1b0f08" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Smile */}
          <path
            d="M 56,48 Q 62,52 68,48"
            fill="none"
            stroke="#8a3a3a"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Cheek blush */}
          <circle cx="50" cy="46" r="2.4" fill={primaryColor} opacity="0.3" />
          <circle cx="74" cy="46" r="2.4" fill={primaryColor} opacity="0.3" />
        </g>

        {/* Bimah (Podium) */}
        <path d="M 120,134 L 240,134 L 220,250 L 100,250 Z" fill="url(#bar-bimah)" />
        <path d="M 120,134 L 240,134 L 230,148 L 110,148 Z" fill="#b07868" />
        <rect x="118" y="148" width="124" height="2" fill="#8a5a48" opacity="0.6" />
        <path
          d="M 130,164 L 210,164 L 195,228 L 115,228 Z"
          fill="none"
          stroke="#b07868"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Star of David on bimah */}
        <g transform="translate(160, 196)" opacity="0.85">
          <path d="M 0,-10 L 8.6,5 L -8.6,5 Z" fill="none" stroke="#fff3b0" strokeWidth="1.5" />
          <path d="M 0,10 L -8.6,-5 L 8.6,-5 Z" fill="none" stroke="#fff3b0" strokeWidth="1.5" />
        </g>

        {/* Torah Scroll — clickable */}
        <motion.g
          className="cursor-pointer"
          style={{ transformOrigin: "175px 110px" }}
          onClick={onClick}
          whileHover={{ scale: 1.12, y: -8 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow ring */}
          <motion.circle
            cx="175"
            cy="112"
            r="58"
            fill={primaryColor}
            opacity="0.18"
            animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Scroll body */}
          <rect
            x="135"
            y="86"
            width="80"
            height="50"
            rx="4"
            fill="url(#bar-scroll)"
            stroke="#8a5a48"
            strokeWidth="1.5"
          />
          {/* Center divider */}
          <line x1="175" y1="86" x2="175" y2="136" stroke="#8a5a48" strokeWidth="1.2" strokeDasharray="3,2" />
          {/* Hebrew-like text glyphs */}
          <path
            d="M 142,98 L 170,98 M 142,108 L 168,108 M 142,118 L 170,118 M 142,128 L 165,128"
            stroke="#1b263b"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 180,98 L 210,98 M 180,108 L 208,108 M 180,118 L 210,118 M 180,128 L 205,128"
            stroke="#1b263b"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Wooden rollers */}
          <rect x="124" y="74" width="12" height="76" rx="6" fill="#8a5a48" />
          <rect x="214" y="74" width="12" height="76" rx="6" fill="#8a5a48" />
          {/* Roller caps (gold finials) */}
          <circle cx="130" cy="74" r="7" fill="#f5c84c" stroke="#9a6a14" strokeWidth="1" />
          <circle cx="130" cy="150" r="7" fill="#f5c84c" stroke="#9a6a14" strokeWidth="1" />
          <circle cx="220" cy="74" r="7" fill="#f5c84c" stroke="#9a6a14" strokeWidth="1" />
          <circle cx="220" cy="150" r="7" fill="#f5c84c" stroke="#9a6a14" strokeWidth="1" />
          {/* Shimmer */}
          <motion.path
            d="M 150,92 l 3,-3 l 1.5,3 l 3,1.5 l -3,1.5 l -1.5,3 l -3,-1.5 z"
            fill="#fff"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
