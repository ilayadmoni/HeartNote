"use client";

/**
 * QuestionsEditor Component
 * Timeline-style editor for quiz questions — up to 10 items.
 * Each item: question text, 3 wrong answers, 1 correct answer (correctIndex).
 * Validation helpers live in QuestionsEditorValidation.ts; the single-item
 * card lives in QuestionItem.tsx (150-line file cap).
 */

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { QuizQuestion } from "@/components/templates/types";
import { QuestionItem } from "./QuestionItem";

export { isQuestionValid, validateQuizQuestions, areAllQuestionsValid } from "./QuestionsEditorValidation";

const MAX_QUESTIONS = 10;
const MIN_QUESTIONS = 1;

interface QuestionsEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export function QuestionsEditor({ questions = [], onChange }: QuestionsEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const canAddMore = questions.length < MAX_QUESTIONS;
  const canRemove = questions.length > MIN_QUESTIONS;

  const addQuestion = () => {
    if (!canAddMore) return;
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    };
    onChange([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    if (!canRemove) return;
    onChange(questions.filter((q) => q.id !== id));
  };

  const updateField = (id: string, field: string, value: unknown) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const updateOption = (id: string, optIndex: number, value: string) => {
    onChange(
      questions.map((q) => {
        if (q.id !== id) return q;
        const opts = [...q.options];
        opts[optIndex] = value;
        return { ...q, options: opts };
      }),
    );
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {questions.map((q, index) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={index}
            onRemove={removeQuestion}
            canRemove={canRemove}
            onUpdateField={updateField}
            onUpdateOption={updateOption}
          />
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addQuestion}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-body-sm font-bold text-accent bg-accent-soft hover:bg-accent-soft/70 rounded-control transition-colors"
        >
          <Plus size={16} />
          <span>{t("quiz.addQuestion", { count: questions.length, max: MAX_QUESTIONS })}</span>
        </motion.button>
      )}
    </div>
  );
}
