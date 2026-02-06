"use client";

/**
 * HowItWorks Component
 * 3-step process section with icons
 */

import { motion } from "framer-motion";
import { MousePointer2, Settings, Send } from "lucide-react";
import { HOW_IT_WORKS_TITLE, HOW_IT_WORKS_SUBTITLE, STEPS } from "../constants";
import type { HowItWorksProps } from "../types";

export function HowItWorks({ className = "" }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className={`py-24 px-4 bg-white dark:bg-gray-900 relative overflow-hidden ${className}`}
    >
      {/* Decorative Gears */}
      <div className="absolute top-10 right-0 opacity-15 pointer-events-none">
        <Settings size={200} className="animate-spin-slow text-[#2e3c52]" />
      </div>
      <div className="absolute bottom-10 left-0 opacity-15 pointer-events-none">
        <Settings
          size={180}
          className="animate-spin-slow-reverse text-[#2e3c52]"
        />
      </div>

      <div className="container mx-auto max-w-7xl text-center relative z-10">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-black text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading"
        >
          {HOW_IT_WORKS_TITLE}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#2e3c52] dark:text-gray-300 mb-16 text-lg text-hebrew-body"
        >
          {HOW_IT_WORKS_SUBTITLE}
        </motion.p>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 right-[16%] left-[16%] h-1 border-t-4 border-dashed border-[#d4826f]/30 z-0" />

          {STEPS.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * StepCard Sub-component
 */
interface StepCardProps {
  step: (typeof STEPS)[0];
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  const getIcon = () => {
    switch (step.icon) {
      case "click":
        return <MousePointer2 className="text-[#d4826f] w-10 h-10" />;
      case "settings":
        return (
          <Settings className="text-[#2e3c52] dark:text-white w-10 h-10" />
        );
      case "send":
        return <Send className="text-gray-500 dark:text-gray-300 w-10 h-10" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (index) {
      case 0:
        return "bg-[#d4826f]/15";
      case 1:
        return "bg-[#2e3c52]/10";
      case 2:
        return "bg-[#2e3c52]/5 dark:bg-white/10";
      default:
        return "bg-gray-100";
    }
  };

  const getBadgeColor = () => {
    switch (index) {
      case 0:
        return "bg-[#d4826f]";
      case 1:
        return "bg-[#2e3c52]";
      case 2:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative flex flex-col items-center group"
    >
      {/* Icon Container */}
      <div className="relative z-10">
        <div
          className={`w-24 h-24 rounded-full ${getBgColor()} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}
        >
          {getIcon()}
        </div>
        {/* Step Number Badge */}
        <div
          className={`absolute top-0 right-0 w-8 h-8 rounded-full ${getBadgeColor()} text-white flex items-center justify-center font-bold shadow-md border-4 border-white dark:border-gray-900`}
        >
          {step.id}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-3 text-hebrew-heading">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-[#2e3c52] dark:text-gray-300 text-sm leading-relaxed max-w-xs mx-auto text-hebrew-body">
        {step.description}
      </p>
    </motion.div>
  );
}
