/**
 * Forwards a finished Lead to the shared staff Telegram chat — used by BOTH
 * bots (WhatsApp leads land in the same Telegram inbox). Plain Bot API calls
 * over fetch; every user-supplied value is HTML-escaped.
 *
 * Attachments: Telegram files are re-sent to the staff chat by file_id;
 * WhatsApp media is downloaded via a resolver supplied by the WhatsApp
 * adapter and uploaded. A failed attachment forward never fails the lead —
 * the summary message is what counts, and it lists every attachment.
 *
 * Logging: only a redacted lead reference and error codes — never names,
 * contacts or descriptions.
 */
import type { Attachment, Lead } from './types.js';
import { budgetLabel, locationLabel, serviceLabel, subServiceLabel, timelineLabel } from './data.js';
import { escapeHtml } from './flow.js';
import { telegramBotToken, telegramStaffChatId } from './config.js';
import { redact } from './guards.js';

export function leadRef(lead: Lead): string {
  return redact(`${lead.channel}:${lead.contact}:${lead.timestamp}`);
}

function describeAttachment(a: Attachment, i: number): string {
  if (a.kind === 'link') return `${i + 1}. 🔗 ${escapeHtml(a.id)}`;
  const meta = [a.fileName, a.mimeType, a.sizeBytes != null ? `${Math.round(a.sizeBytes / 1024)} KB` : undefined].filter(Boolean).join(', ');
  return `${i + 1}. ${a.kind}${meta ? ` (${escapeHtml(meta)})` : ''}`;
}

/** Staff message — always in English labels (staff-facing), values in the user's words. */
export function formatLeadMessage(lead: Lead): string {
  const e = escapeHtml;
  const profile = lead.profile;
  const tgUser = profile.telegramUsername ? `@${profile.telegramUsername}` : profile.telegramUserId ? `tg://user?id=${profile.telegramUserId}` : undefined;
  const lines: Array<string | null> = [
    `🆕 <b>New lead — ${lead.channel === 'telegram' ? 'Telegram' : 'WhatsApp'}</b> · ${lead.stage}`,
    '',
    `<b>Service:</b> ${e(serviceLabel('en', lead.service))} <code>${e(lead.service)}</code>`,
    `<b>Project type:</b> ${e(subServiceLabel('en', lead.service, lead.subService))} <code>${e(lead.subService)}</code>`,
    `<b>Location:</b> ${e(locationLabel('en', lead.location))} <code>${e(lead.location)}</code>`,
    `<b>Budget:</b> ${lead.budget ? e(budgetLabel('en', lead.budget)) : '— (skipped)'}`,
    `<b>Timeline:</b> ${lead.timeline ? e(timelineLabel('en', lead.timeline)) : '— (skipped)'}`,
    '',
    `<b>Description:</b>\n${e(lead.description)}`,
    '',
    `<b>Name:</b> ${e(lead.name)}`,
    `<b>Contact:</b> ${e(lead.contact)}`,
    tgUser ? `<b>Telegram:</b> ${e(tgUser)}` : null,
    profile.phone && profile.phone !== lead.contact ? `<b>Phone (shared):</b> ${e(profile.phone)}` : null,
    `<b>Channel:</b> ${lead.channel}`,
    `<b>Language:</b> ${lead.language}`,
    `<b>Source / campaign:</b> ${lead.source ? e(lead.source) : '—'}`,
    lead.deepLink ? `<b>Deep link:</b> <code>${e(lead.deepLink)}</code>` : null,
    lead.firstMessage ? `<b>First message:</b> ${e(lead.firstMessage)}` : null,
    `<b>Attachments:</b> ${lead.attachments.length || '—'}`,
    ...lead.attachments.map(describeAttachment),
    `<b>Timestamp:</b> ${lead.timestamp}`,
    `<b>Ref:</b> <code>${leadRef(lead)}</code>`,
  ];
  const text = lines.filter((l): l is string => l !== null).join('\n');
  return text.length > 4000 ? `${text.slice(0, 3990)}…` : text;
}

export interface NotifyResult {
  ok: boolean;
  error?: string;
}

export interface DownloadedMedia {
  bytes: Uint8Array;
  mimeType: string;
  fileName: string;
}

export interface NotifyOptions {
  /** WhatsApp adapter: download a media id so it can be uploaded to the staff chat. */
  downloadMedia?: (a: Attachment) => Promise<DownloadedMedia>;
  /** Injected for tests. */
  fetchImpl?: typeof fetch;
}

async function callBotApi(fetchImpl: typeof fetch, token: string, method: string, body: Record<string, unknown> | FormData): Promise<Response> {
  const isForm = body instanceof FormData;
  return fetchImpl(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
  });
}

const SEND_METHOD: Record<Exclude<Attachment['kind'], 'link'>, [string, string]> = {
  photo: ['sendPhoto', 'photo'],
  document: ['sendDocument', 'document'],
  voice: ['sendVoice', 'voice'],
  audio: ['sendAudio', 'audio'],
  video: ['sendVideo', 'video'],
};

async function forwardAttachments(lead: Lead, token: string, chatId: string, opts: NotifyOptions, fetchImpl: typeof fetch): Promise<void> {
  const ref = leadRef(lead);
  for (const [i, a] of lead.attachments.entries()) {
    if (a.kind === 'link') continue;
    const caption = `📎 ${i + 1}/${lead.attachments.length} · ref ${ref}`;
    try {
      let res: Response;
      if (a.channel === 'telegram') {
        const [method, field] = SEND_METHOD[a.kind];
        res = await callBotApi(fetchImpl, token, method, { chat_id: chatId, [field]: a.id, caption });
      } else if (opts.downloadMedia) {
        const media = await opts.downloadMedia(a);
        const form = new FormData();
        form.set('chat_id', chatId);
        form.set('caption', caption);
        form.set('document', new Blob([media.bytes], { type: media.mimeType }), media.fileName);
        res = await callBotApi(fetchImpl, token, 'sendDocument', form);
      } else {
        continue;
      }
      if (!res.ok) console.error(`[notify] attachment ${i + 1} of lead ${ref} not forwarded: HTTP ${res.status}`);
    } catch (err) {
      console.error(`[notify] attachment ${i + 1} of lead ${ref} not forwarded:`, (err as Error).message);
    }
  }
}

/** Never throws. `ok: false` → the adapter tells the user honestly and offers direct contacts + retry. */
export async function notifyStaff(lead: Lead, opts: NotifyOptions = {}): Promise<NotifyResult> {
  const token = telegramBotToken();
  const chatId = telegramStaffChatId();
  const fetchImpl = opts.fetchImpl ?? fetch;
  const ref = leadRef(lead);

  if (!token || !chatId) {
    console.error(`[notify] TELEGRAM_BOT_TOKEN or TELEGRAM_STAFF_CHAT_ID not set — lead ${ref} was NOT delivered.`);
    return { ok: false, error: 'missing_config' };
  }

  try {
    const res = await callBotApi(fetchImpl, token, 'sendMessage', {
      chat_id: chatId,
      text: formatLeadMessage(lead),
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
    });
    if (!res.ok) {
      console.error(`[notify] Telegram rejected lead ${ref}: HTTP ${res.status}`);
      return { ok: false, error: `telegram_${res.status}` };
    }
  } catch (err) {
    console.error(`[notify] Could not reach Telegram for lead ${ref}:`, (err as Error).message);
    return { ok: false, error: 'network_error' };
  }

  await forwardAttachments(lead, token, chatId, opts, fetchImpl);
  console.log(`[notify] lead ${ref} delivered (${lead.channel}, ${lead.service}/${lead.subService}, ${lead.location}, ${lead.attachments.length} files)`);
  return { ok: true };
}
