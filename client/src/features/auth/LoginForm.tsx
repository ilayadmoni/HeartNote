"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { useAuth } from "./useAuth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10"
    >
      <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
        Sign In
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <Button type="submit" className="w-full mt-6" isLoading={loading}>
        Sign In
      </Button>
    </motion.form>
  );
}
