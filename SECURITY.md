# Security guidance for microbot

microbot is designed as a narrow Telegram-to-LLM gateway. It deliberately has no shell execution, local filesystem tools, MCP servers, long polling, or unrestricted public access.

## Required deployment controls

| Control | Requirement |
|---|---|
| Telegram token | Store only as the `TELEGRAM_BOT_TOKEN` Worker Secret. Revoke it in BotFather if exposed. |
| Webhook secret | Generate a random 1–256 character value for `TELEGRAM_WEBHOOK_SECRET`; supply the identical value to Telegram's `setWebhook` `secret_token` parameter. |
| Model API key | Store only as the `LLM_API_KEY` Worker Secret. Apply a provider spending limit. |
| Access | Set `ALLOWED_TELEGRAM_USER_IDS` to explicit numeric IDs. Never use a wildcard. |
| Source control | Keep `.dev.vars`, `.env`, exported account configuration, tokens, and database dumps out of Git. |
| Chat scope | This release intentionally ignores groups and channels; it accepts private chats only. |

## Handling an incident

If a token or API key is exposed, immediately revoke or rotate it at its provider, update the matching Cloudflare Worker Secret, and redeploy. If you suspect unauthorised Telegram activity, remove the webhook using `deleteWebhook`, rotate the bot token in BotFather, then configure a new secret and webhook.

## Known boundaries

Cloudflare Workers Secrets prevent secret values from appearing in the dashboard and Wrangler after they are set, but they do not prevent an authorised Worker deployment from using those secrets. Only trusted maintainers should have permission to edit or deploy this Worker.
