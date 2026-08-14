import { llmTimeoutMs } from "./config";
import type { ChatMessage, Env, OpenAIChatCompletionResponse } from "./types";

export async function generateReply(
  env: Env,
  conversation: ChatMessage[],
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), llmTimeoutMs(env));

  try {
    const baseUrl = env.LLM_BASE_URL.replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.LLM_MODEL,
        messages: conversation,
        temperature: 0.4,
        max_tokens: 900,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json()) as OpenAIChatCompletionResponse;
    if (!response.ok) {
      const detail = payload.error?.message ?? `HTTP ${response.status}`;
      throw new Error(`Model API request failed: ${detail}`);
    }

    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Model API returned an empty response.");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}
