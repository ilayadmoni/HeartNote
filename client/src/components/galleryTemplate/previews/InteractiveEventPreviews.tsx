"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function BirthdayCandlesInteractivePreview() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#faf7f5]">
      <div className="relative h-28 w-32">
        <div className="absolute left-1/2 top-[13px] z-[1] flex -translate-x-1/2 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex h-10 w-4 flex-col items-center justify-end">
              <motion.span
                className="text-[#ffde59] drop-shadow-[0_0_7px_rgba(255,222,89,0.8)]"
                animate={{ scale: [1, 1.14, 0.96, 1] }}
                transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.12 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </motion.span>
              <span className="h-7 w-1.5 rounded-t-sm border border-gray-200 bg-[#f5f0e8]" />
            </span>
          ))}
        </div>
        <Image
          src="/assets/images/birthday-interactive/birthday-cake.svg"
          alt="עוגת יום הולדת עם נרות"
          fill
          sizes="128px"
          className="object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
}

export function WeddingGlassInteractivePreview() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#faf7f5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,130,111,0.12),transparent_66%)]" />
      <div className="relative h-full w-40 max-w-[88%]">
        <Image
          src="/assets/images/wedding-interactive/wedding-1.svg"
          alt="חתונה תחת החופה"
          fill
          sizes="160px"
          className="object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}

export function HolidayRoshHashanahInteractivePreview() {
  return (
    <HolidayArtPreview
      label="ראש השנה"
      src="/assets/images/holiday-interactive/frames/rosh-hashanah/rh- 4.svg"
    />
  );
}

export function HolidayPassoverInteractivePreview() {
  return (
    <HolidayArtPreview
      label="פסח"
      src="/assets/images/holiday-interactive/reference/passover.svg"
    />
  );
}

export function HolidayPurimInteractivePreview() {
  return (
    <HolidayArtPreview
      label="פורים"
      src="/assets/images/holiday-interactive/frames/purim/purim3.svg"
    />
  );
}

export function HolidayShavuotInteractivePreview() {
  return (
    <HolidayArtPreview
      label="שבועות"
      src="/assets/images/holiday-interactive/frames/shavuot/shavuot3.svg"
    />
  );
}

export function HolidaySukkotInteractivePreview() {
  return (
    <HolidayArtPreview
      label="סוכות"
      src="/assets/images/holiday-interactive/frames/sukkot/sukkot3.svg"
    />
  );
}

export function HolidayHanukkahInteractivePreview() {
  return (
    <HolidayArtPreview
      label="חנוכה"
      src="/assets/images/holiday-interactive/frames/hanukkah/hanukkah4.svg"
    />
  );
}

function HolidayArtPreview({ label, src }: {
  label: string;
  src: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <div className="relative h-24 w-32 overflow-hidden rounded-2xl border border-white/80 bg-[#fff8ef] p-1.5 shadow-md">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#faf2e8]">
          <Image
            src={src}
            alt=""
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
        <p className="absolute inset-x-0 bottom-1 text-center text-[8px] font-bold text-navy-700">
          {label}
        </p>
      </div>
    </div>
  );
}
