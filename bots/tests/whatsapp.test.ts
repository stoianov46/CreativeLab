import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createWhatsAppApp, type WhatsAppGraph } from '../whatsapp/webhook.js';
import { signBody, verifyMetaSignature } from '../whatsapp/signature.js';
import { htmlToWhatsApp } from '../whatsapp/render.js';
import { MemorySessionStore } from '../shared/session-store.js';
import { RateLimiter } from '../shared/guards.js';

const SECRET = 'app-secret-123';

test('X-Hub-Signature-256 verification', () => {
  const body = Buffer.from('{"a":1}');
  assert.ok(verifyMetaSignature(body, signBody(body, SECRET), SECRET));
  assert.equal(verifyMetaSignature(body, signBody(body, 'other'), SECRET), false);
  assert.equal(verifyMetaSignature(Buffer.from('{"a":2}'), signBody(body, SECRET), SECRET), false);
  assert.equal(verifyMetaSignature(body, undefined, SECRET), false);
  assert.equal(verifyMetaSignature(body, 'sha256=zz', SECRET), false);
  assert.equal(verifyMetaSignature(body, signBody(body, SECRET), ''), false);
});

test('html → WhatsApp formatting', () => {
  assert.equal(htmlToWhatsApp('<b>Hi</b> &amp; <i>you</i> &lt;3'), '*Hi* & _you_ <3');
});

function fakeGraph() {
  const sent: Array<{ to: string; kind: string; payload: unknown }> = [];
  const g: WhatsAppGraph = {
    sendText: async (to, text) => { sent.push({ to, kind: 'text', payload: text }); return true; },
    sendImage: async (to, link) => { sent.push({ to, kind: 'image', payload: link }); return true; },
    sendButtons: async (to, body, buttons) => { sent.push({ to, kind: 'buttons', payload: { body, buttons } }); return true; },
    sendList: async (to, body, _button, sections) => { sent.push({ to, kind: 'list', payload: { body, sections } }); return true; },
    markReadWithTyping: async () => undefined,
    getMediaInfo: async () => ({ url: 'https://x', mimeType: 'image/jpeg', sizeBytes: 1000 }),
  };
  return { g, sent };
}

async function withServer(fn: (base: string, ctx: ReturnType<typeof fakeGraph> & { store: MemorySessionStore }) => Promise<void>, limiter?: RateLimiter) {
  const fake = fakeGraph();
  const store = new MemorySessionStore();
  const app = createWhatsAppApp({ appSecret: SECRET, verifyToken: 'verify-me', store, notify: async () => ({ ok: true }), graph: fake.g, limiter });
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    await fn(base, { ...fake, store });
  } finally {
    server.close();
  }
}

function payload(from: string, message: Record<string, unknown>) {
  return JSON.stringify({ object: 'whatsapp_business_account', entry: [{ changes: [{ value: { contacts: [{ wa_id: from, profile: { name: 'Nok' } }], messages: [{ from, id: `wamid.${Math.random()}`, ...message }] } }] }] });
}

async function post(base: string, body: string, signature?: string) {
  return fetch(`${base}/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(signature ? { 'X-Hub-Signature-256': signature } : {}) }, body });
}

const settle = () => new Promise((r) => setTimeout(r, 30));

test('GET verify handshake', async () => {
  await withServer(async (base) => {
    const ok = await fetch(`${base}/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=42`);
    assert.equal(ok.status, 200); assert.equal(await ok.text(), '42');
    const bad = await fetch(`${base}/webhook?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=42`);
    assert.equal(bad.status, 403);
  });
});

test('POST without / with invalid signature is rejected; valid one is processed', async () => {
  await withServer(async (base, { sent, store }) => {
    const body = payload('66810000001', { type: 'text', text: { body: 'Hi, photos please [ref:s_photography__l_koh-tao__u_site]' } });
    assert.equal((await post(base, body)).status, 401);
    assert.equal((await post(base, body, signBody('tampered', SECRET))).status, 401);
    assert.equal(sent.length, 0);
    assert.equal((await post(base, body, signBody(body, SECRET))).status, 200);
    await settle();
    const state = await store.get('wa:66810000001');
    assert.equal(state?.service, 'photography'); assert.equal(state?.location, 'koh-tao'); assert.equal(state?.source, 'site');
    assert.equal(state?.firstMessage, 'Hi, photos please'); assert.equal(state?.profile.phone, '+66810000001');
    assert.ok(sent.length > 0);
    // choose a language via list reply
    const reply = payload('66810000001', { type: 'interactive', interactive: { type: 'list_reply', list_reply: { id: 'lang:th' } } });
    await post(base, reply, signBody(reply, SECRET));
    await settle();
    assert.equal((await store.get('wa:66810000001'))?.language, 'th');
  });
});

test('per-user rate limiting on WhatsApp', async () => {
  await withServer(async (base, { sent }) => {
    for (let i = 0; i < 4; i++) {
      const body = payload('66810000002', { type: 'text', text: { body: 'hello' } });
      await post(base, body, signBody(body, SECRET));
    }
    await settle();
    const texts = sent.filter((s) => s.kind === 'text').map((s) => String(s.payload));
    assert.ok(texts.some((t) => t.includes('wait a few seconds')));
  }, new RateLimiter(2, 60_000));
});
