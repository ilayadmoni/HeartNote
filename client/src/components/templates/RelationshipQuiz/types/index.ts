/**
 * RelationshipQuiz Types
 * Re-exports shared types + local component props
 */

export type {
  RelationshipQuizData,
  QuizQuestion,
  QuizScoreMessage,
  TemplateComponentProps,
} from "@/components/templates/types";

export type AnswerState = "none" | "correct" | "wrong";

export interface QuizViewProps {
  data: import("@/components/templates/types").RelationshipQuizData;
}
