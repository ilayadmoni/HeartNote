import "server-only";

/**
 * Minimal client for any OpenAI-compatible chat-completions endpoint.
 *
 * Both OpenAI (`https://api.openai.com/v1`) and OpenRouter
 * (`https://openrouter.ai/api/v1`) implement the same `/chat/completions`
 * shape, so swapping providers is just changing AI_API_URL/AI_MODEL/AI_API_KEY
 * — no code change. See .env.example for both configurations.
 */

const SYSTEM_PROMPT =
  "אתה עוזר כתיבה לברכות דיגיטליות בעברית. " +
  "כתוב טקסט קצר, חם ואישי בעברית בלבד, בהתאם לבקשת המשתמש. " +
  "החזר את הטקסט בלבד, בלי מרכאות, בלי הסברים, בלי כותרות.";

export class AiGenerationError extends Error {}

export async function generateGreetingText(
  userPrompt: string,
  maxChars: number,
): Promise<string> {
  const apiUrl = process.env.AI_API_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;

  if (!apiUrl || !apiKey || !model) {
    throw new AiGenerationError("AI provider not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  let response: Response;
  try {
    response = await fetch(`${apiUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Optional OpenRouter attribution headers — ignored by OpenAI.
        ...(process.env.NEXT_PUBLIC_SITE_URL
          ? { "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL, "X-Title": "HeartNote" }
          : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT} אורך מקסימלי: ${maxChars} תווים.` },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });
  } catch (err) {
    throw new AiGenerationError(
      err instanceof Error && err.name === "AbortError" ? "AI request timed out" : "AI request failed",
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new AiGenerationError(`AI provider returned ${response.status}`);
  }

  const json = await response.json();
  const text: unknown = json?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new AiGenerationError("AI provider returned empty content");
  }

  return text.trim().slice(0, maxChars);
}
