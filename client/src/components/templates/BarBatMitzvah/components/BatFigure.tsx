"use client";

import { motion } from "framer-motion";

interface BatFigureProps {
  onClick: () => void;
  primaryColor: string;
}

export function BatFigure({ onClick, primaryColor }: BatFigureProps) {
  return (
    <div className="relative w-56 h-72 flex justify-center">
      <svg viewBox="0 0 200 250" className="w-full h-full overflow-visible">
        <path
          d="M 100,100 C 60,130 30,200 20,240 L 180,240 C 170,200 140,130 100,100 Z"
          fill="#fffcfa"
          stroke={primaryColor}
          strokeWidth="3"
        />
        <path
          d="M 60,160 Q 80,200 70,240 M 140,160 Q 120,200 130,240 M 100,140 L 100,240"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeDasharray="5,5"
        />
        <path
          d="M 75,100 L 125,100 L 115,60 L 85,60 Z"
          fill="#fffcfa"
          stroke={primaryColor}
          strokeWidth="3"
        />
        <path
          d="M 70,100 L 130,100"
          stroke={primaryColor}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 100,100 L 120,130 M 100,100 L 80,130"
          stroke={primaryColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="100" cy="45" r="22" fill="#f2e9e4" />
        <path
          d="M 78,30 C 50,40 50,110 50,110 C 50,110 65,70 85,50 C 95,20 122,30 150,110 C 150,110 150,40 122,30 Z"
          fill="#1b263b"
        />
        <circle cx="90" cy="45" r="2.5" fill="#fff" />
        <circle cx="90" cy="45" r="1.5" fill="#1b263b" />
        <circle cx="110" cy="45" r="2.5" fill="#fff" />
        <circle cx="110" cy="45" r="1.5" fill="#1b263b" />
        <circle cx="82" cy="52" r="4" fill={primaryColor} opacity="0.4" />
        <circle cx="118" cy="52" r="4" fill={primaryColor} opacity="0.4" />
        <path
          d="M 93,55 Q 100,62 107,55"
          fill="none"
          stroke="#1b263b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Crown (Clickable interactive target) */}
        <motion.g
          className="cursor-pointer origin-center"
          onClick={onClick}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.path
            d="M 75,20 L 85,0 L 100,15 L 115,0 L 125,20 Z"
            fill={primaryColor}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M 75,20 L 125,20"
            stroke="#b07868"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <circle cx="85" cy="5" r="3" fill="#fffcfa" />
          <circle cx="100" cy="18" r="4" fill="#fffcfa" />
          <circle cx="115" cy="5" r="3" fill="#fffcfa" />
        </motion.g>
      </svg>
    </div>
  );
}
