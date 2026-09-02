"use client";

import { MousePointer2 } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { useStep4Sequence } from "../hooks/useStep4Sequence";
import { Step4PreviewPhase } from "./Step4PreviewPhase";
import { Step4ModalPhase } from "./Step4ModalPhase";
import { Step4WhatsAppPhase } from "./Step4WhatsAppPhase";

export function Step4Animation(): JSX.Element {
  const [scope, animate] = useAnimate();
  const phase = useStep4Sequence(scope, animate);

  return (
    <div ref={scope} className="bg-surface-sunken h-full w-full relative overflow-hidden">
      {phase === "preview" && <Step4PreviewPhase />}
      {phase === "modal" && <Step4ModalPhase />}
      {phase === "whatsapp" && <Step4WhatsAppPhase />}

      <motion.div id="fake-cursor" className="absolute z-50 pointer-events-none" style={{ top: "80%", left: "85%", opacity: 0 }}>
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
