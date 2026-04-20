"use client";

import { motion } from "framer-motion";

interface BarFigureProps {
  onClick: () => void;
  primaryColor: string;
}

export function BarFigure({ onClick, primaryColor }: BarFigureProps) {
  return (
    <div className="relative w-64 h-72 flex justify-center items-end">
      <svg viewBox="0 0 250 250" className="w-full h-full overflow-visible">
        <g transform="translate(10, 0)">
          <rect x="45" y="140" width="12" height="90" fill="#1b263b" />
          <rect x="70" y="140" width="12" height="90" fill="#1b263b" />
          <path
            d="M 35,230 L 57,230 C 57,220 45,220 35,230 Z"
            fill="#000"
          />
          <path
            d="M 60,230 L 82,230 C 82,220 70,220 60,230 Z"
            fill="#000"
          />
          <path
            d="M 35,65 L 90,65 L 100,150 L 25,150 Z"
            fill="#415a77"
          />
          <path
            d="M 62,65 L 62,150"
            stroke="#1b263b"
            strokeWidth="2"
          />
          <path
            d="M 35,65 L 50,150 L 55,150 L 45,65 Z"
            fill="#fffcfa"
          />
          <path
            d="M 90,65 L 75,150 L 70,150 L 80,65 Z"
            fill="#fffcfa"
          />
          <path
            d="M 47,120 L 52,120 M 48,130 L 53,130 M 73,120 L 78,120 M 72,130 L 77,130"
            stroke="#415a77"
            strokeWidth="2"
          />
          <line x1="50" y1="150" x2="50" y2="165" stroke="#fffcfa" strokeWidth="2" />
          <line x1="53" y1="150" x2="53" y2="160" stroke="#fffcfa" strokeWidth="2" />
          <line x1="72" y1="150" x2="72" y2="165" stroke="#fffcfa" strokeWidth="2" />
          <line x1="75" y1="150" x2="75" y2="160" stroke="#fffcfa" strokeWidth="2" />
          <circle cx="62" cy="40" r="20" fill="#f2e9e4" />
          <circle cx="55" cy="38" r="2.5" fill="#fff" />
          <circle cx="55" cy="38" r="1.5" fill="#1b263b" />
          <circle cx="70" cy="38" r="2.5" fill="#fff" />
          <circle cx="70" cy="38" r="1.5" fill="#1b263b" />
          <path
            d="M 58,48 Q 62,52 67,48"
            fill="none"
            stroke="#1b263b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 42,30 C 50,20 75,20 82,35 C 85,30 80,10 62,10 C 45,10 40,25 42,30 Z"
            fill="#1b263b"
          />
          <path
            d="M 50,20 C 55,10 70,10 75,20"
            fill="#fff"
            stroke="#415a77"
            strokeWidth="2"
          />
        </g>

        {/* Bimah (Podium) */}
        <path d="M 120,130 L 240,130 L 220,250 L 100,250 Z" fill={primaryColor} />
        <path d="M 120,130 L 240,130 L 230,145 L 110,145 Z" fill="#b07868" />
        <path
          d="M 130,160 L 210,160 L 195,230 L 115,230 Z"
          fill="none"
          stroke="#b07868"
          strokeWidth="3"
        />
        <path
          d="M 125,180 L 150,180 M 180,200 L 200,200 M 115,210 L 130,210"
          stroke="#b07868"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Torah Scroll (Clickable interactive target) */}
        <motion.g onClick={onClick} whileHover={{ scale: 1.15, y: -8 }} whileTap={{ scale: 0.95 }}>
          <motion.rect
            x="135"
            y="90"
            width="80"
            height="45"
            rx="3"
            fill="#fffcfa"
            stroke="#1b263b"
            strokeWidth="2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <path
            d="M 175,90 L 175,135"
            stroke="#1b263b"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <rect x="125" y="75" width="10" height="75" rx="4" fill="#1b263b" />
          <rect x="215" y="75" width="10" height="75" rx="4" fill="#1b263b" />
          <circle cx="130" cy="75" r="6" fill={primaryColor} />
          <circle cx="130" cy="150" r="6" fill={primaryColor} />
          <circle cx="220" cy="75" r="6" fill={primaryColor} />
          <circle cx="220" cy="150" r="6" fill={primaryColor} />
          <path
            d="M 142,100 L 170,100 M 142,110 L 165,110 M 142,120 L 170,120"
            stroke="#415a77"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 180,100 L 210,100 M 180,110 L 205,110 M 180,120 L 210,120"
            stroke="#415a77"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 155,125 L 185,110"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}
