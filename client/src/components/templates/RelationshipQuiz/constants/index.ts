/**
 * RelationshipQuiz Constants
 * Score thresholds, animation variants, default messages
 */

/** Default score messages when user provides none */
export const DEFAULT_SCORE_MESSAGES = [
  { minScore: 80, message: "מכירים אותי מושלם! 😍" },
  { minScore: 50, message: "כמעט מושלם..." },
  { minScore: 0, message: "כל הכבוד על הניסיון!" },
];

/** Get the right score message for a percentage */
export function getScoreMessage(
  percentage: number,
  messages: { minScore: number; message: string }[],
): { message: string } {
  const pool = messages.length > 0 ? messages : DEFAULT_SCORE_MESSAGES;
  const sorted = [...pool].sort((a, b) => b.minScore - a.minScore);
  for (const msg of sorted) {
    if (percentage >= msg.minScore) {
      return msg;
    }
  }
  return { message: "כל הכבוד על הניסיון!" };
}

/** Max questions the editor allows */
export const MAX_QUESTIONS = 10;
