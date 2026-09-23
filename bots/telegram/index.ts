import 'dotenv/config';
import express from 'express';
import { webhookCallback } from 'grammy';
import { createTelegramBot, registerCommands } from './bot.js';
import { createSessionStore } from '../shared/session-store.js';
import { notifyStaff } from '../shared/notify.js';
import { safeEqual } from '../shared/guards.js';
import {
  telegramBotToken,
  telegramMode,
  telegramPort,
  telegramStaffChatId,
  telegramWebhookPath,
  telegramWebhookSecret,
  telegramWebhookUrl,
} from '../shared/config.js';

const token = telegramBotToken();
if (!token) {
  console.error('[telegram] TELEGRAM_BOT_TOKEN is not set — see bots/.env.example.');
  process.exit(1);
}
if (!telegramStaffChatId()) {
  console.warn('[telegram] TELEGRAM_STAFF_CHAT_ID is not set — users will be told their request could not be delivered.');
}

const bot = createTelegramBot(token, { store: createSessionStore(), notify: (lead) => notifyStaff(lead) });
bot.catch((err) => console.error('[telegram] Unhandled bot error:', err.message));

async function main(): Promise<void> {
  await registerCommands(bot);

  if (telegramMode() === 'polling') {
    await bot.api.deleteWebhook();
    await bot.start({ onStart: (info) => console.log(`[telegram] @${info.username} started (long polling).`) });
    return;
  }

  const secret = telegramWebhookSecret();
  if (!secret || !/^[A-Za-z0-9_-]{16,256}$/.test(secret)) {
    console.error('[telegram] TELEGRAM_MODE=webhook needs TELEGRAM_WEBHOOK_SECRET (16–256 chars of A-Z a-z 0-9 _ -).');
    process.exit(1);
  }

  const path = telegramWebhookPath();
  const app = express();
  app.disable('x-powered-by');
  app.get('/healthz', (_req, res) => {
    res.send('ok');
  });
  app.post(
    path,
    (req, res, next) => {
      // Reject anything that isn't Telegram before parsing the body.
      if (!safeEqual(req.get('X-Telegram-Bot-Api-Secret-Token') ?? '', secret)) {
        res.sendStatus(401);
        return;
      }
      next();
    },
    express.json({ limit: '1mb' }),
    webhookCallback(bot, 'express', { secretToken: secret })
  );

  const url = telegramWebhookUrl();
  if (url) {
    await bot.api.setWebhook(url, { secret_token: secret, allowed_updates: ['message', 'callback_query'] });
    console.log(`[telegram] Webhook registered with Telegram.`);
  } else {
    console.warn('[telegram] TELEGRAM_WEBHOOK_URL not set — assuming the webhook is already registered (see README).');
  }

  await bot.init();
  app.listen(telegramPort(), () => console.log(`[telegram] @${bot.botInfo.username} listening on :${telegramPort()}${path} (webhook).`));
}

main().catch((err) => {
  console.error('[telegram] Failed to start:', (err as Error).message);
  process.exit(1);
});
