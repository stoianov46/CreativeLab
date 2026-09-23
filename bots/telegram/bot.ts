/**
 * Telegram adapter (grammY). Thin: turns updates into flow `Input`s, runs
 * them through shared/runtime.ts, draws the resulting `View` as an inline
 * keyboard. No flow logic lives here.
 *
 * Private chats only — the bot also sits in the staff chat to post leads and
 * must never start an intake conversation there.
 */
import { Bot, InlineKeyboard, Keyboard, type Context } from 'grammy';
import type { Button, FileCandidate, Input, View } from '../shared/flow.js';
import { processInput, type RuntimeDeps } from '../shared/runtime.js';
import { KeyedQueue, RateLimiter, redact } from '../shared/guards.js';
import { getBotDictionary, t } from '../shared/i18n.js';
import { contactEmail, rateLimitWindowMs } from '../shared/config.js';
import { LOCALES, type UserProfile } from '../shared/types.js';

export interface TelegramBotDeps extends RuntimeDeps {
  limiter?: RateLimiter;
}

const MAX_TEXT = 4096;

function keyboard(rows: Button[][]): InlineKeyboard {
  const kb = new InlineKeyboard();
  for (const row of rows) {
    for (const b of row) {
      if (b.kind === 'url') kb.url(b.label, b.url);
      else kb.text(b.label, b.id);
    }
    kb.row();
  }
  return kb;
}

function profileOf(ctx: Context): UserProfile {
  const from = ctx.from;
  if (!from) return {};
  const displayName = [from.first_name, from.last_name].filter(Boolean).join(' ').trim() || undefined;
  return { displayName, telegramUsername: from.username, telegramUserId: from.id };
}

/** Telegram → flow file candidate. Sizes come from Telegram's own `file_size`. */
export function fileFromMessage(msg: NonNullable<Context['message']>): FileCandidate | undefined {
  if (msg.photo?.length) {
    const largest = msg.photo[msg.photo.length - 1];
    return { id: largest.file_id, kind: 'photo', mimeType: 'image/jpeg', sizeBytes: largest.file_size };
  }
  if (msg.document) {
    const d = msg.document;
    return { id: d.file_id, kind: 'document', mimeType: d.mime_type, sizeBytes: d.file_size, fileName: d.file_name };
  }
  if (msg.voice) return { id: msg.voice.file_id, kind: 'voice', mimeType: msg.voice.mime_type, sizeBytes: msg.voice.file_size };
  if (msg.audio) {
    const a = msg.audio;
    return { id: a.file_id, kind: 'audio', mimeType: a.mime_type, sizeBytes: a.file_size, fileName: a.file_name };
  }
  if (msg.video) return { id: msg.video.file_id, kind: 'video', mimeType: msg.video.mime_type, sizeBytes: msg.video.file_size };
  if (msg.video_note) return { id: msg.video_note.file_id, kind: 'video', mimeType: 'video/mp4', sizeBytes: msg.video_note.file_size };
  if (msg.sticker || msg.animation) return { id: 'unsupported', kind: 'unsupported' };
  return undefined;
}

export function createTelegramBot(token: string, deps: TelegramBotDeps): Bot {
  const bot = new Bot(token);
  const queue = new KeyedQueue();
  const limiter = deps.limiter ?? new RateLimiter();
  const lastWarned = new Map<number, number>();
  /** chats currently showing our "share phone" reply keyboard */
  const replyKeyboardShown = new Set<number>();

  // Private chats only.
  bot.use(async (ctx, next) => {
    if (ctx.chat?.type !== 'private') return;
    await next();
  });

  // Per-user rate limit.
  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (userId == null) return;
    if (limiter.allow(String(userId))) return next();
    const lang = LOCALES.find((l) => ctx.from?.language_code?.startsWith(l)) ?? 'en';
    const text = getBotDictionary(lang).rateLimited;
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text }).catch(() => undefined);
      return;
    }
    const now = Date.now();
    if (now - (lastWarned.get(userId) ?? 0) > rateLimitWindowMs()) {
      lastWarned.set(userId, now);
      await ctx.reply(text).catch(() => undefined);
    }
  });

  async function show(ctx: Context, chatId: number, view: View): Promise<void> {
    const text = view.text.length > MAX_TEXT ? `${view.text.slice(0, MAX_TEXT - 1)}…` : view.text;
    const markup = keyboard(view.rows);

    if (view.photoUrl) {
      await ctx.api.sendChatAction(chatId, 'upload_photo').catch(() => undefined);
      // Optional example photo; a missing/broken image must never block the step.
      await ctx.api.sendPhoto(chatId, view.photoUrl).catch(() => undefined);
    }

    // Edit the tapped message in place when possible (fewer bubbles, feels app-like).
    const cbMsg = ctx.callbackQuery?.message;
    const canEdit = !view.photoUrl && !view.requestPhone && !replyKeyboardShown.has(chatId) && cbMsg && 'text' in cbMsg && cbMsg.text;
    if (canEdit) {
      try {
        await ctx.api.editMessageText(chatId, cbMsg.message_id, text, { parse_mode: 'HTML', reply_markup: markup, link_preview_options: { is_disabled: true } });
        return;
      } catch {
        // "message is not modified", too old, etc. — fall through and send a new one.
      }
    } else if (cbMsg) {
      await ctx.api.editMessageReplyMarkup(chatId, cbMsg.message_id).catch(() => undefined);
    }

    if (replyKeyboardShown.has(chatId) && !view.requestPhone) {
      // Remove the "share phone" reply keyboard, then attach the inline keyboard to the same message.
      const sent = await ctx.api.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: { remove_keyboard: true }, link_preview_options: { is_disabled: true } });
      replyKeyboardShown.delete(chatId);
      await ctx.api.editMessageReplyMarkup(chatId, sent.message_id, { reply_markup: markup }).catch(() => undefined);
      return;
    }

    await ctx.api.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: markup, link_preview_options: { is_disabled: true } });

    if (view.requestPhone && !replyKeyboardShown.has(chatId)) {
      const d = getBotDictionary(view.locale);
      await ctx.api.sendMessage(chatId, d.sharePhoneHint, {
        reply_markup: new Keyboard().requestContact(d.sharePhone).resized().oneTime(),
      });
      replyKeyboardShown.add(chatId);
    }
  }

  async function dispatch(ctx: Context, input: Input): Promise<void> {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;
    await queue.run(String(chatId), async () => {
      await ctx.api.sendChatAction(chatId, 'typing').catch(() => undefined);
      try {
        const { view } = await processInput(deps, 'telegram', `tg:${chatId}`, input, profileOf(ctx), async () => {
          await ctx.api.sendChatAction(chatId, 'typing').catch(() => undefined);
        });
        await show(ctx, chatId, view);
      } catch (err) {
        console.error(`[telegram] update failed for chat ${redact(chatId)}:`, (err as Error).message);
        const lang = LOCALES.find((l) => ctx.from?.language_code?.startsWith(l)) ?? 'en';
        await ctx.reply(t(lang, 'errorGeneric', { email: contactEmail() })).catch(() => undefined);
      }
    });
  }

  bot.command('start', (ctx) => dispatch(ctx, { type: 'start', payload: ctx.match?.toString().trim() || undefined }));
  bot.command('language', (ctx) => dispatch(ctx, { type: 'action', id: 'nav:lang' }));
  bot.command('back', (ctx) => dispatch(ctx, { type: 'action', id: 'nav:back' }));
  bot.command('restart', (ctx) => dispatch(ctx, { type: 'action', id: 'nav:restart' }));

  bot.on('callback_query:data', async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => undefined);
    await dispatch(ctx, { type: 'action', id: ctx.callbackQuery.data });
  });

  bot.on('message:contact', (ctx) => dispatch(ctx, { type: 'contact', phone: ctx.message.contact.phone_number }));

  bot.on('message:text', (ctx) => dispatch(ctx, { type: 'text', text: ctx.message.text }));

  bot.on('message', async (ctx) => {
    const file = fileFromMessage(ctx.message);
    // Anything else (location, poll, …) is "unknown input" → re-prompt the current step.
    await dispatch(ctx, file ? { type: 'file', file } : { type: 'text', text: '' });
  });

  return bot;
}

/** Localised command menu (shown by Telegram next to the input field). */
export async function registerCommands(bot: Bot): Promise<void> {
  for (const lang of LOCALES) {
    const d = getBotDictionary(lang);
    const commands = [
      { command: 'start', description: d.cmdStart },
      { command: 'language', description: d.cmdLanguage },
      { command: 'back', description: d.cmdBack },
      { command: 'restart', description: d.cmdRestart },
    ];
    await bot.api.setMyCommands(commands, lang === 'en' ? {} : { language_code: lang }).catch((err) => {
      console.error(`[telegram] setMyCommands(${lang}) failed:`, (err as Error).message);
    });
  }
}
