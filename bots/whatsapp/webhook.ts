/**
 * WhatsApp Cloud API webhook (Express — required by the platform's push
 * model). GET = Meta's verification handshake; POST = inbound messages,
 * accepted only with a valid X-Hub-Signature-256. Thin adapter: payload →
 * flow Input → shared/runtime.ts → View → planWhatsApp → Graph API.
 */
import express, { type Request, type Response } from 'express';
import type { FileCandidate, Input } from '../shared/flow.js';
import { processInput, type RuntimeDeps } from '../shared/runtime.js';
import { extractWhatsAppRef } from '../shared/deeplink.js';
import { KeyedQueue, RateLimiter, redact, safeEqual } from '../shared/guards.js';
import { getBotDictionary } from '../shared/i18n.js';
import { rateLimitWindowMs } from '../shared/config.js';
import type { UserProfile } from '../shared/types.js';
import * as graph from './graph-api.js';
import { planWhatsApp, type WaMessage } from './render.js';
import { verifyMetaSignature } from './signature.js';

export interface WhatsAppGraph {
  sendText: typeof graph.sendText;
  sendImage: typeof graph.sendImage;
  sendButtons: typeof graph.sendButtons;
  sendList: typeof graph.sendList;
  markReadWithTyping: typeof graph.markReadWithTyping;
  getMediaInfo: typeof graph.getMediaInfo;
}

export interface WhatsAppDeps extends RuntimeDeps {
  appSecret: string;
  verifyToken: string;
  graph?: WhatsAppGraph;
  limiter?: RateLimiter;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type WaMessageIn = Record<string, any>;

async function send(g: WhatsAppGraph, to: string, messages: WaMessage[]): Promise<void> {
  for (const m of messages) {
    if (m.type === 'image') await g.sendImage(to, m.link).catch(() => false); // optional photo — skip on failure
    else if (m.type === 'text') await g.sendText(to, m.text);
    else if (m.type === 'buttons') await g.sendButtons(to, m.body, m.buttons, m.footer);
    else await g.sendList(to, m.body, m.button, m.sections, m.footer);
  }
}

async function toInput(g: WhatsAppGraph, msg: WaMessageIn, hasSession: boolean): Promise<Input> {
  switch (msg.type) {
    case 'text': {
      const body = String(msg.text?.body ?? '');
      const { text, link } = extractWhatsAppRef(body);
      if (link.raw) return { type: 'start', payload: link.raw, firstMessage: text };
      if (!hasSession) return { type: 'start', firstMessage: text };
      return { type: 'text', text: body };
    }
    case 'interactive': {
      const reply = msg.interactive?.button_reply ?? msg.interactive?.list_reply;
      return reply?.id ? { type: 'action', id: String(reply.id) } : { type: 'text', text: '' };
    }
    case 'button':
      return { type: 'text', text: String(msg.button?.text ?? '') };
    case 'contacts': {
      const phone = msg.contacts?.[0]?.phones?.[0]?.phone;
      return phone ? { type: 'contact', phone: String(phone) } : { type: 'text', text: '' };
    }
    case 'image':
    case 'document':
    case 'audio':
    case 'video': {
      const media = msg[msg.type] ?? {};
      const kind: FileCandidate['kind'] =
        msg.type === 'image' ? 'photo' : msg.type === 'audio' ? (media.voice ? 'voice' : 'audio') : (msg.type as 'document' | 'video');
      try {
        const info = await g.getMediaInfo(String(media.id));
        return {
          type: 'file',
          file: { id: String(media.id), kind, mimeType: media.mime_type ?? info.mimeType, sizeBytes: info.sizeBytes, fileName: media.filename },
        };
      } catch {
        return { type: 'uploadFailed' };
      }
    }
    case 'sticker':
      return { type: 'file', file: { id: 'unsupported', kind: 'unsupported' } };
    default:
      return { type: 'text', text: '' };
  }
}

export function createWhatsAppApp(deps: WhatsAppDeps): express.Express {
  const g = deps.graph ?? graph;
  const limiter = deps.limiter ?? new RateLimiter();
  const queue = new KeyedQueue();
  const lastWarned = new Map<string, number>();
  const app = express();
  app.disable('x-powered-by');

  app.get('/healthz', (_req, res) => {
    res.send('ok');
  });

  app.get('/webhook', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && typeof token === 'string' && safeEqual(token, deps.verifyToken) && typeof challenge === 'string') {
      res.status(200).type('text/plain').send(challenge);
      return;
    }
    res.sendStatus(403);
  });

  app.post('/webhook', express.raw({ type: '*/*', limit: '2mb' }), (req: Request, res: Response) => {
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    if (!verifyMetaSignature(raw, req.get('X-Hub-Signature-256'), deps.appSecret)) {
      res.sendStatus(401);
      return;
    }
    let payload: any;
    try {
      payload = JSON.parse(raw.toString('utf8'));
    } catch {
      res.sendStatus(400);
      return;
    }
    // Ack fast — Meta retries if a 200 isn't returned quickly.
    res.sendStatus(200);
    void handlePayload(payload);
  });

  async function handlePayload(payload: any): Promise<void> {
    for (const entry of payload?.entry ?? []) {
      for (const change of entry?.changes ?? []) {
        const value = change?.value ?? {};
        const names = new Map<string, string>();
        for (const c of value.contacts ?? []) if (c?.wa_id) names.set(String(c.wa_id), String(c.profile?.name ?? ''));
        for (const msg of value.messages ?? []) {
          const from = String(msg?.from ?? '');
          if (!/^\d{6,20}$/.test(from)) continue;
          await queue.run(from, () => handleMessage(from, msg, names.get(from))).catch((err) => {
            console.error(`[whatsapp] message from ${redact(from)} failed:`, (err as Error).message);
          });
        }
      }
    }
  }

  async function handleMessage(from: string, msg: WaMessageIn, name: string | undefined): Promise<void> {
    if (!limiter.allow(from)) {
      const now = Date.now();
      if (now - (lastWarned.get(from) ?? 0) > rateLimitWindowMs()) {
        lastWarned.set(from, now);
        const state = await deps.store.get(`wa:${from}`);
        await g.sendText(from, getBotDictionary(state?.language ?? 'en').rateLimited);
      }
      return;
    }
    if (msg.id) await g.markReadWithTyping(String(msg.id));
    const key = `wa:${from}`;
    const hasSession = Boolean(await deps.store.get(key));
    const input = await toInput(g, msg, hasSession);
    const profile: UserProfile = { phone: `+${from}`, displayName: name || undefined };
    const { view } = await processInput(deps, 'whatsapp', key, input, profile);
    await send(g, from, planWhatsApp(view));
  }

  return app;
}
