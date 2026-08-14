# Contributing to microbot

Thank you for considering a contribution. microbot aims to remain a small, secure, Cloudflare-native Telegram AI bot.

## Before you start

Open an issue before making a large feature proposal. Features that introduce shell execution, arbitrary local filesystem access, long polling, or public-by-default access are intentionally outside the current scope and need a clear security case.

## Local workflow

Install dependencies and run the checks before opening a pull request:

```bash
npm install
npm run check
npm test
```

Use `.dev.vars.example` as the source for local configuration. Do not commit `.dev.vars`, `.env`, Telegram bot tokens, webhook secrets, model API keys, D1 exports, or Cloudflare account configuration containing sensitive values.

## Pull requests

Keep pull requests focused. Explain the problem, describe the change, add or update tests when behavior changes, and update `README.md` or `SECURITY.md` when user-facing behavior or security boundaries change.

## Commit style

Use short imperative messages such as `feat: add conversation expiration` or `fix: reject malformed webhook payloads`.
