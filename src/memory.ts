import type { ChatMessage } from "./types";

export async function loadRecentMessages(
  db: D1Database,
  chatId: number,
  limit: number,
): Promise<ChatMessage[]> {
  const { results } = await db
    .prepare(
      `SELECT role, content
       FROM conversation_messages
       WHERE chat_id = ?
       ORDER BY id DESC
       LIMIT ?`,
    )
    .bind(chatId, limit)
    .all<{ role: "user" | "assistant"; content: string }>();

  return [...results]
    .reverse()
    .map((message) => ({ role: message.role, content: message.content }));
}

export async function saveMessage(
  db: D1Database,
  chatId: number,
  telegramUserId: number,
  role: "user" | "assistant",
  content: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO conversation_messages (chat_id, telegram_user_id, role, content)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(chatId, telegramUserId, role, content)
    .run();
}

export async function clearConversation(db: D1Database, chatId: number): Promise<void> {
  await db
    .prepare("DELETE FROM conversation_messages WHERE chat_id = ?")
    .bind(chatId)
    .run();
}
