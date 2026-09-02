/**
 * Pure validation helpers for the relationship-quiz "questions" field.
 * Message strings are supplied by the caller (a translator bound to the
 * `editor` namespace) so these stay framework-agnostic and testable.
 */

import type { QuizQuestion } from "@/components/templates/types";

export type QuizTranslator = (key: string, values?: Record<string, string | number>) => string;

/** True when a single question has non-empty text, options, and a valid correctIndex. */
export function isQuestionValid(question: QuizQuestion): boolean {
  if (!question.question || question.question.trim() === "") return false;
  for (const option of question.options) {
    if (!option || option.trim() === "") return false;
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) return false;
  return true;
}

export function validateQuizQuestions(
  questions: QuizQuestion[],
  t: QuizTranslator,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!questions || questions.length === 0) {
    return { isValid: false, errors: [t("quiz.atLeastOne")] };
  }

  questions.forEach((q, index) => {
    const num = index + 1;
    if (!q.question || q.question.trim() === "") {
      errors.push(t("quiz.fillDetails", { num }));
    }
    q.options.forEach((opt, optIndex) => {
      if (!opt || opt.trim() === "") {
        if (optIndex === q.correctIndex) {
          errors.push(t("quiz.correctEmpty", { num }));
        } else {
          errors.push(t("quiz.wrongEmpty", { num, index: optIndex + 1 }));
        }
      }
    });
    if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      errors.push(t("quiz.noCorrectSelected", { num }));
    }
  });

  return { isValid: errors.length === 0, errors };
}

/** Quick check if all questions are valid (for button enable/disable) */
export function areAllQuestionsValid(questions: QuizQuestion[]): boolean {
  if (!questions || questions.length === 0) return false;
  return questions.every(isQuestionValid);
}
