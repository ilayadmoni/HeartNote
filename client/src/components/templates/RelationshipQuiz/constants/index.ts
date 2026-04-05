/**
 * RelationshipQuiz Constants
 * Score thresholds, animation variants, default messages
 */

/**
 * Get the feedback message for a given percentage score
 * Uses explicit if/else chain to guarantee correct tier matching
 * @param percentage - Score percentage (0-100)
 * @returns The corresponding Hebrew feedback message
 */
export function getScoreMessageByPercentage(percentage: number): string {
  // Ensure percentage is within bounds
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));

  if (pct >= 91) {
    return "החבר/ה הכי טוב/ה בעולם! טלפתיה מוחלטת, ציון מושלם! 👑🏆";
  } else if (pct >= 81) {
    return "מדהים! אין ספק שאנחנו חברי אמת. כמעט 100%! ❤️";
  } else if (pct >= 71) {
    return "וואו, כמעט מושלם! את/ה מכיר/ה את השריטות שלי כמעט כמוני. 🤩";
  } else if (pct >= 61) {
    return "מרשים! אנחנו חברים טובים ורואים את זה. מתי קובעים שוב? 😎";
  } else if (pct >= 51) {
    return "יפה מאוד! את/ה בהחלט מכיר/ה אותי לא רע בכלל. 😊";
  } else if (pct >= 41) {
    return "חצי כוח! אנחנו חברים סבבה, אבל אפשר להעמיק את הקשר. 🤝";
  } else if (pct >= 31) {
    return "לא רע, אבל יש לנו עוד הרבה מה ללמוד אחד על השני. 🤔";
  } else if (pct >= 21) {
    return "התחלה סבירה, אבל ציפיתי ליותר! הזמן שלנו יחד דורש שדרוג. 📈";
  } else if (pct >= 11) {
    return "טוב, לפחות ידעת איך קוראים לי... נראה לי. 😬 יש הרבה מקום לשיפור!";
  } else {
    // 0% to 10%
    return "אוי ואבוי... אנחנו בכלל מכירים? 😅 נראה לי שצריך לקבוע קפה דחוף לחזור לעניינים!";
  }
}

/** Default score messages with decile percentage ranges (neutral Hebrew) */
export const DEFAULT_SCORE_MESSAGES = [
  { minScore: 91, message: "החבר/ה הכי טוב/ה בעולם! טלפתיה מוחלטת, ציון מושלם! 👑🏆" },
  { minScore: 81, message: "מדהים! אין ספק שאנחנו חברי אמת. כמעט 100%! ❤️" },
  { minScore: 71, message: "וואו, כמעט מושלם! את/ה מכיר/ה את השריטות שלי כמעט כמוני. 🤩" },
  { minScore: 61, message: "מרשים! אנחנו חברים טובים ורואים את זה. מתי קובעים שוב? 😎" },
  { minScore: 51, message: "יפה מאוד! את/ה בהחלט מכיר/ה אותי לא רע בכלל. 😊" },
  { minScore: 41, message: "חצי כוח! אנחנו חברים סבבה, אבל אפשר להעמיק את הקשר. 🤝" },
  { minScore: 31, message: "לא רע, אבל יש לנו עוד הרבה מה ללמוד אחד על השני. 🤔" },
  { minScore: 21, message: "התחלה סבירה, אבל ציפיתי ליותר! הזמן שלנו יחד דורש שדרוג. 📈" },
  { minScore: 11, message: "טוב, לפחות ידעת איך קוראים לי... נראה לי. 😬 יש הרבה מקום לשיפור!" },
  { minScore: 0, message: "אוי ואבוי... אנחנו בכלל מכירים? 😅 נראה לי שצריך לקבוע קפה דחוף לחזור לעניינים!" },
];

/** 
 * Get the right score message for a percentage
 * @deprecated Use getScoreMessageByPercentage for guaranteed tier matching
 */
export function getScoreMessage(
  percentage: number,
  messages: { minScore: number; message: string }[],
): { message: string } {
  // If custom messages provided and not empty, use them
  if (messages && messages.length > 0) {
    const sorted = [...messages].sort((a, b) => b.minScore - a.minScore);
    for (const msg of sorted) {
      if (percentage >= msg.minScore) {
        return msg;
      }
    }
  }
  
  // Otherwise use the explicit if/else chain for guaranteed correct tier
  return { message: getScoreMessageByPercentage(percentage) };
}

/** Min/Max questions the editor allows */
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
