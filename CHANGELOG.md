# Changelog

All notable changes to this project are documented in this file.

## [0.1.0] - 2026-08-14

### Added

- Cloudflare Workers TypeScript runtime.
- Telegram webhook endpoint with secret-header verification.
- Explicit Telegram user allowlist and private-chat-only scope.
- OpenAI-compatible chat-completions integration.
- D1-backed bounded conversation memory.
- `/start`, `/help`, and `/reset` Telegram commands.
- Local development guidance, security guidance, CI, tests, and GitHub contribution documents.

### Security

- No shell execution, MCP, local files, long polling, or public wildcard access.
- All production credentials are designed for Cloudflare Workers Secrets.
