import type { Env } from "./types";

const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

function splitMessage(text: string): string[] {
  if (text.length <= TELEGRAM_MAX_MESSAGE_LENGTH) return [text];

  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > TELEGRAM_MAX_MESSAGE_LENGTH) {
    let splitAt = remaining.lastIndexOf("\n", TELEGRAM_MAX_MESSAGE_LENGTH);
    if (splitAt < TELEGRAM_MAX_MESSAGE_LENGTH / 2) {
      splitAt = remaining.lastIndexOf(" ", TELEGRAM_MAX_MESSAGE_LENGTH);
    }
    if (splitAt < TELEGRAM_MAX_MESSAGE_LENGTH / 2) {
      splitAt = TELEGRAM_MAX_MESSAGE_LENGTH;
    }

    parts.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) parts.push(remaining);
  return parts;
}

export async function sendTelegramMessage(
  env: Env,
  chatId: number,
  text: string,
): Promise<void> {
  const endpoint = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  for (const part of splitMessage(text)) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: part,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Telegram sendMessage failed: ${detail}`);
    }
  }
}
