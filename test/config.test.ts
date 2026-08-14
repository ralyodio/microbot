import { describe, expect, it } from "vitest";
import { isAllowedUser, maxHistoryMessages } from "../src/config";
import type { Env } from "../src/types";

function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    DB: {} as D1Database,
    TELEGRAM_BOT_TOKEN: "test-token",
    TELEGRAM_WEBHOOK_SECRET: "test-secret",
    LLM_API_KEY: "test-key",
    LLM_BASE_URL: "https://example.com/v1",
    LLM_MODEL: "test-model",
    ALLOWED_TELEGRAM_USER_IDS: "100, 200",
    ...overrides,
  };
}

describe("microbot configuration", () => {
  it("only authorizes configured Telegram user IDs", () => {
    const env = makeEnv();
    expect(isAllowedUser(env, 100)).toBe(true);
    expect(isAllowedUser(env, 200)).toBe(true);
    expect(isAllowedUser(env, 300)).toBe(false);
  });

  it("bounds conversation history to a safe range", () => {
    expect(maxHistoryMessages(makeEnv({ MAX_HISTORY_MESSAGES: "1" }))).toBe(2);
    expect(maxHistoryMessages(makeEnv({ MAX_HISTORY_MESSAGES: "20" }))).toBe(20);
    expect(maxHistoryMessages(makeEnv({ MAX_HISTORY_MESSAGES: "999" }))).toBe(30);
    expect(maxHistoryMessages(makeEnv({ MAX_HISTORY_MESSAGES: "invalid" }))).toBe(12);
  });
});
