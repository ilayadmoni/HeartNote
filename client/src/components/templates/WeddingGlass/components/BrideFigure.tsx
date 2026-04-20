"use client";

import type { SVGProps } from "react";

export function BrideFigure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 150 250" className="w-full h-full overflow-visible" {...props}>
      {/* Veil Back */}
      <path
        d="M 75,10 C 120,30 140,100 130,220 C 100,200 90,150 75,100"
        fill="#fffcfa"
        opacity="0.6"
      />

      {/* Dress Layers */}
      <path
        d="M 75,70 C 50,100 10,200 5,240 L 145,240 C 140,200 100,100 75,70 Z"
        fill="#fffcfa"
        stroke="#e0e0e0"
        strokeWidth="2"
      />
      <path
        d="M 30,240 Q 75,200 120,240"
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="2"
      />
      <path
        d="M 40,150 Q 75,130 110,150"
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="1.5"
        strokeDasharray="4,4"
      />

      {/* Torso */}
      <path d="M 60,70 Q 75,100 90,70 Z" fill="#fffcfa" stroke="#e0e0e0" strokeWidth="2" />

      {/* Head */}
      <circle cx="75" cy="40" r="20" fill="#f2e9e4" />

      {/* Hair */}
      <path d="M 55,30 C 55,5 95,5 95,30 C 95,60 105,75 110,80 C 110,80 90,65 75,40" fill="#cb8e7c" />
      <path d="M 55,30 C 45,50 40,70 35,80 C 35,80 50,60 65,40" fill="#cb8e7c" />

      {/* Face */}
      <circle cx="68" cy="38" r="2" fill="#1b263b" />
      <circle cx="82" cy="38" r="2" fill="#1b263b" />
      <circle cx="62" cy="44" r="3" fill="#cb8e7c" opacity="0.4" />
      <circle cx="88" cy="44" r="3" fill="#cb8e7c" opacity="0.4" />
      <path
        d="M 71,48 Q 75,52 79,48"
        fill="none"
        stroke="#1b263b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Bouquet */}
      <circle cx="75" cy="110" r="18" fill="#cb8e7c" />
      <circle cx="65" cy="105" r="10" fill="#b07868" />
      <circle cx="85" cy="105" r="10" fill="#b07868" />
      <circle cx="75" cy="120" r="10" fill="#b07868" />
    </svg>
  );
}
