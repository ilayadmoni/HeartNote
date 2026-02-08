"use client";

/**
 * QuestionsEditor Component
 * Timeline-style editor for quiz questions — up to 10 items
 * Each item: question text, 3 wrong answers, 1 correct answer (correctIndex)
 */

import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/components/templates/types";

const MAX_QUESTIONS = 10;

interface QuestionsEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export function QuestionsEditor({ questions = [], onChange }: QuestionsEditorProps) {
  const canAddMore = questions.length < MAX_QUESTIONS;

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

function QuestionItem({ question, index, onRemove, onUpdateField, onUpdateOption }: QuestionItemProps) {
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
          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          title="מחק שאלה"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Question text */}
      <input
        type="text"
        value={question.question}
        onChange={(e) => onUpdateField(question.id, "question", e.target.value)}
        placeholder="טקסט השאלה"
        className={inputClass}
        dir="auto"
      />

      {/* Correct answer */}
      <div>
        <label className="text-[10px] text-green-600 dark:text-green-400 font-bold text-hebrew-body">
          ✓ תשובה נכונה
        </label>
        <input
          type="text"
          value={question.options[question.correctIndex] || ""}
          onChange={(e) => onUpdateOption(question.id, question.correctIndex, e.target.value)}
          placeholder="התשובה הנכונה"
          className={`${inputClass} border-green-300 dark:border-green-700`}
          dir="auto"
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
            <input
              type="text"
              value={opt}
              onChange={(e) => onUpdateOption(question.id, oi, e.target.value)}
              placeholder="תשובה שגויה"
              className={`${inputClass} border-red-200 dark:border-red-800`}
              dir="auto"
            />
          </div>
        );
      })}
    </motion.div>
  );
}
