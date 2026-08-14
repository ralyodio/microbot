import type { Env } from "./types";

const REQUIRED_SECRETS = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_WEBHOOK_SECRET",
  "LLM_API_KEY",
  "LLM_BASE_URL",
  "LLM_MODEL",
  "ALLOWED_TELEGRAM_USER_IDS",
] as const;

export function assertConfiguration(env: Env): void {
  for (const key of REQUIRED_SECRETS) {
    if (!env[key] || !env[key].trim()) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }

  const endpoint = new URL(env.LLM_BASE_URL);
  if (endpoint.protocol !== "https:") {
    throw new Error("LLM_BASE_URL must use HTTPS in deployed environments.");
  }
}

export function isAllowedUser(env: Env, telegramUserId: number): boolean {
  const allowedIds = env.ALLOWED_TELEGRAM_USER_IDS.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return allowedIds.includes(String(telegramUserId));
}

export function maxHistoryMessages(env: Env): number {
  const parsed = Number.parseInt(env.MAX_HISTORY_MESSAGES ?? "12", 10);
  if (!Number.isSafeInteger(parsed)) return 12;
  return Math.max(2, Math.min(parsed, 30));
}

export function llmTimeoutMs(env: Env): number {
  const parsed = Number.parseInt(env.LLM_TIMEOUT_MS ?? "25000", 10);
  if (!Number.isSafeInteger(parsed)) return 25_000;
  return Math.max(5_000, Math.min(parsed, 55_000));
}
