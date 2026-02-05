"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl relative z-10"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          HeartNote
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Organize your thoughts with beautiful, flexible cards.
          <br />
          <span className="text-lg text-gray-500">
            A modern note-taking experience.
          </span>
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative elements - contained within viewport */}
      <motion.div
        className="absolute top-20 -left-20 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 -right-20 md:right-20 w-48 md:w-96 h-48 md:h-96 bg-secondary-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </main>
  );
}
