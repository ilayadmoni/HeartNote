/**
 * RelationshipQuiz Constants
 * Score thresholds, animation variants, default messages
 */

/** Default score messages when user provides none */
export const DEFAULT_SCORE_MESSAGES = [
  { minScore: 80, message: "מכירים אותי מושלם! 😍", emoji: "🎉" },
  { minScore: 50, message: "כמעט מושלם...", emoji: "😊" },
  { minScore: 0, message: "כל הכבוד על הניסיון!", emoji: "💪" },
];

/** Get the right score message for a percentage */
export function getScoreMessage(
  percentage: number,
  messages: { minScore: number; message: string; emoji?: string }[],
): { message: string; emoji?: string } {
  const pool = messages.length > 0 ? messages : DEFAULT_SCORE_MESSAGES;
  const sorted = [...pool].sort((a, b) => b.minScore - a.minScore);
  for (const msg of sorted) {
    if (percentage >= msg.minScore) {
      return msg;
    }
  }
  return { message: "כל הכבוד על הניסיון!", emoji: "💪" };
}

/** Max questions the editor allows */
export const MAX_QUESTIONS = 10;
