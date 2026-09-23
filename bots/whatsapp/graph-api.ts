/**
 * Thin WhatsApp Cloud API client — only the calls this bot needs. No SDK;
 * the Cloud API is plain REST/JSON. Errors are logged by status code only
 * (response bodies can echo user content).
 */
const GRAPH_VERSION = 'v21.0';

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function authHeaders(json = true): Record<string, string> {
  return { Authorization: `Bearer ${env('WHATSAPP_ACCESS_TOKEN')}`, ...(json ? { 'Content-Type': 'application/json' } : {}) };
}

async function postMessage(body: Record<string, unknown>): Promise<boolean> {
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${env('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', ...body }),
  });
  if (!res.ok) {
    console.error(`[whatsapp] Cloud API rejected a ${String(body.type ?? 'status')} message: HTTP ${res.status}`);
    return false;
  }
  return true;
}

export function sendText(to: string, text: string): Promise<boolean> {
  return postMessage({ to, type: 'text', text: { body: text.slice(0, 4096), preview_url: false } });
}

export function sendImage(to: string, link: string): Promise<boolean> {
  return postMessage({ to, type: 'image', image: { link } });
}

export interface ReplyButton {
  id: string;
  title: string;
}

/** Max 3 buttons, title ≤ 20 chars, body ≤ 1024, footer ≤ 60. */
export function sendButtons(to: string, body: string, buttons: ReplyButton[], footer?: string): Promise<boolean> {
  return postMessage({
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: body },
      ...(footer ? { footer: { text: footer } } : {}),
      action: { buttons: buttons.slice(0, 3).map((b) => ({ type: 'reply', reply: { id: b.id, title: b.title } })) },
    },
  });
}

export interface ListRow {
  id: string;
  title: string;
  description?: string;
}

export interface ListSection {
  title: string;
  rows: ListRow[];
}

/** Max 10 rows across all sections, row title ≤ 24, description ≤ 72, button label ≤ 20. */
export function sendList(to: string, body: string, buttonLabel: string, sections: ListSection[], footer?: string): Promise<boolean> {
  return postMessage({
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: body },
      ...(footer ? { footer: { text: footer } } : {}),
      action: { button: buttonLabel, sections },
    },
  });
}

/** Marks the inbound message read and shows "typing…" (Cloud API typing indicator). Best effort. */
export async function markReadWithTyping(messageId: string): Promise<void> {
  await postMessage({ status: 'read', message_id: messageId, typing_indicator: { type: 'text' } }).catch(() => false);
}

export interface MediaInfo {
  url: string;
  mimeType: string;
  sizeBytes?: number;
}

export async function getMediaInfo(mediaId: string): Promise<MediaInfo> {
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(mediaId)}`, { headers: authHeaders(false) });
  if (!res.ok) throw new Error(`media lookup failed: HTTP ${res.status}`);
  const data = (await res.json()) as { url: string; mime_type: string; file_size?: number | string };
  return { url: data.url, mimeType: data.mime_type, sizeBytes: data.file_size != null ? Number(data.file_size) : undefined };
}

export async function downloadMedia(mediaId: string): Promise<{ bytes: Uint8Array; mimeType: string }> {
  const info = await getMediaInfo(mediaId);
  const res = await fetch(info.url, { headers: authHeaders(false) });
  if (!res.ok) throw new Error(`media download failed: HTTP ${res.status}`);
  return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: info.mimeType };
}
