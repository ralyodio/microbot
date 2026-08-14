const required = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_WEBHOOK_SECRET",
  "MICROBOT_WORKER_URL",
];

for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const baseUrl = process.env.MICROBOT_WORKER_URL.replace(/\/+$/, "");
const webhookUrl = `${baseUrl}/telegram`;
const apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`;

const response = await fetch(apiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message"],
    drop_pending_updates: true,
  }),
});

const payload = await response.json();
if (!response.ok || !payload.ok) {
  console.error("Telegram webhook configuration failed.");
  console.error(JSON.stringify(payload));
  process.exit(1);
}

console.log(`Webhook configured for ${webhookUrl}`);
