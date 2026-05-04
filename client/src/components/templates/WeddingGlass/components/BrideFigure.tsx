"use client";

import Image from "next/image";

export function BrideFigure() {
  return (
    <Image
      src="/assets/images/weddingtemplate/bride_static.svg"
      alt=""
      fill
      draggable={false}
      className="object-contain object-bottom select-none pointer-events-none drop-shadow-md"
      sizes="(max-width: 768px) 128px, 160px"
      unoptimized
    />
  );
}
