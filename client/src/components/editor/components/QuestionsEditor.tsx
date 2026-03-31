"use client";

/**
 * QuestionsEditor Component
 * Timeline-style editor for quiz questions — up to 10 items
 * Each item: question text, 3 wrong answers, 1 correct answer (correctIndex)
 */

import { Plus, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";

const MAX_QUESTIONS = 10;
const MIN_QUESTIONS = 1;

/**
 * Validates a single quiz question
 * Returns true if the question is complete and valid
 */
export function isQuestionValid(question: QuizQuestion): boolean {
  // 1. Question text must not be empty
  if (!question.question || question.question.trim() === "") {
    return false;
  }

  // 2. All answer options must not be empty
  for (const option of question.options) {
    if (!option || option.trim() === "") {
      return false;
    }
  }

  // 3. correctIndex must be a valid index within options array
  if (
    question.correctIndex < 0 ||
    question.correctIndex >= question.options.length
  ) {
    return false;
  }

  return true;
}

/**
 * Validates the entire questions array for a quiz
 * Returns { isValid: boolean, errors: string[] }
 */
export function validateQuizQuestions(questions: QuizQuestion[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Must have at least one question
  if (!questions || questions.length === 0) {
    return { isValid: false, errors: ["חייבת להיות לפחות שאלה אחת"] };
  }

  questions.forEach((q, index) => {
    const questionNum = index + 1;

    // Check question text
    if (!q.question || q.question.trim() === "") {
      errors.push(`שאלה ${questionNum} : אנא מלא את הפרטים של השאלה`);
    }

    // Check all options
    q.options.forEach((opt, optIndex) => {
      if (!opt || opt.trim() === "") {
        if (optIndex === q.correctIndex) {
          errors.push(`שאלה ${questionNum}: התשובה הנכונה ריקה`);
        } else {
          errors.push(`שאלה ${questionNum}: תשובה שגויה ${optIndex + 1} ריקה`);
        }
      }
    });

    // Check correctIndex is valid
    if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      errors.push(`שאלה ${questionNum}: לא נבחרה תשובה נכונה`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Quick check if all questions are valid (for button enable/disable)
 */
export function areAllQuestionsValid(questions: QuizQuestion[]): boolean {
  if (!questions || questions.length === 0) return false;
  return questions.every(isQuestionValid);
}

interface QuestionsEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export function QuestionsEditor({ questions = [], onChange }: QuestionsEditorProps) {
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
    // Prevent removing the last question to avoid empty state crash
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
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-[#d4826f] bg-[#d4826f]/10 hover:bg-[#d4826f]/20 rounded-xl transition-colors text-hebrew-body"
        >
          <Plus size={16} />
          <span>הוסף שאלה ({questions.length}/{MAX_QUESTIONS})</span>
        </motion.button>
      )}
    </div>
  );
}

/** Single question editing card */
interface QuestionItemProps {
  question: QuizQuestion;
  index: number;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, field: string, value: unknown) => void;
  onUpdateOption: (id: string, optIndex: number, value: string) => void;
}

function QuestionItem({ question, index, onRemove, canRemove, onUpdateField, onUpdateOption }: QuestionItemProps & { canRemove: boolean }) {
  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50 text-hebrew-body";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 text-hebrew-body">
          שאלה {index + 1}
        </span>
        <button
          onClick={() => onRemove(question.id)}
          disabled={!canRemove}
          className={`p-1 transition-colors rounded-md ${
            canRemove
              ? "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
          }`}
          title={canRemove ? "מחק שאלה" : "חייבת להיות לפחות שאלה אחת"}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Question text */}
      <LimitedInput
        value={question.question}
        onChange={(v) => onUpdateField(question.id, "question", v)}
        maxLength={CHAR_LIMITS.QUESTION}
        placeholder="טקסט השאלה"
        className={inputClass}
      />

      {/* Correct answer */}
      <div>
        <label className="text-[10px] text-green-600 dark:text-green-400 font-bold text-hebrew-body">
          ✓ תשובה נכונה
        </label>
        <LimitedInput
          value={question.options[question.correctIndex] || ""}
          onChange={(v) => onUpdateOption(question.id, question.correctIndex, v)}
          maxLength={CHAR_LIMITS.ANSWER}
          placeholder="התשובה הנכונה"
          className={`${inputClass} border-green-300 dark:border-green-700`}
        />
      </div>

      {/* Wrong answers */}
      {question.options.map((opt, oi) => {
        if (oi === question.correctIndex) return null;
        return (
          <div key={oi}>
            <label className="text-[10px] text-red-400 dark:text-red-400 font-bold text-hebrew-body">
              ✗ תשובה שגויה {oi > question.correctIndex ? oi : oi + 1}
            </label>
            <LimitedInput
              value={opt}
              onChange={(v) => onUpdateOption(question.id, oi, v)}
              maxLength={CHAR_LIMITS.ANSWER}
              placeholder="תשובה שגויה"
              className={`${inputClass} border-red-200 dark:border-red-800`}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
