import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { processInput } from '../shared/runtime.js';
import { FileSessionStore, MemorySessionStore } from '../shared/session-store.js';
import { RateLimiter, KeyedQueue } from '../shared/guards.js';
import { formatLeadMessage, notifyStaff } from '../shared/notify.js';
import type { Lead } from '../shared/types.js';
import { NOW } from './helpers.js';

async function driveToReview(store: MemorySessionStore, notify: (l: Lead) => Promise<{ ok: boolean }>) {
  const deps = { store, notify, now: () => NOW };
  const key = 'tg:1';
  const run = (input: Parameters<typeof processInput>[3]) => processInput(deps, 'telegram', key, input, { displayName: 'Anna', telegramUsername: 'anna' });
  await run({ type: 'start' });
  for (const id of ['lang:en', 'go:start', 'svc:web', 'sub:landing-page', 'loc:koh-samui']) await run({ type: 'action', id });
  await run({ type: 'text', text: 'Landing page for our dive school' });
  for (const id of ['nav:skip', 'nav:skip', 'files:done', 'name:profile', 'contact:tg']) await run({ type: 'action', id });
  return run;
}

test('notify failure → honest message with contacts, lead kept, retry delivers', async () => {
  const store = new MemorySessionStore();
  let fail = true;
  const delivered: Lead[] = [];
  const run = await driveToReview(store, async (lead) => {
    if (fail) return { ok: false };
    delivered.push(lead);
    return { ok: true };
  });
  let r = await run({ type: 'action', id: 'review:submit' });
  assert.equal(r.submitFailed, true);
  assert.equal(r.view.step, 'review');
  assert.match(r.view.text, /couldn’t deliver/);
  assert.match(r.view.text, /WhatsApp/);
  assert.equal((await store.get('tg:1'))?.submitError, true);
  fail = false;
  r = await run({ type: 'action', id: 'review:retry' });
  assert.equal(r.submitted, true); assert.equal(r.view.step, 'submitted');
  assert.equal(delivered.length, 1); assert.equal(delivered[0].subService, 'landing-page');
});

test('a throwing notifier is treated as a failure, not a crash', async () => {
  const store = new MemorySessionStore();
  const run = await driveToReview(store, async () => {
    throw new Error('boom');
  });
  const r = await run({ type: 'action', id: 'review:submit' });
  assert.equal(r.submitFailed, true);
});

test('file session store persists atomically and survives a restart; TTL expires', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'clab-bots-'));
  const path = join(dir, 'nested', 'sessions.json');
  let clock = 1_000;
  try {
    const a = new FileSessionStore(path, 14 * 86_400_000, () => clock);
    const run = await driveToReview(a, async () => ({ ok: true }));
    void run;
    const raw = JSON.parse(await readFile(path, 'utf8'));
    assert.ok(raw['tg:1']);
    const b = new FileSessionStore(path, 14 * 86_400_000, () => clock);
    assert.equal((await b.get('tg:1'))?.step, 'review'); // came back → continue
    clock += 15 * 86_400_000;
    const c = new FileSessionStore(path, 14 * 86_400_000, () => clock);
    assert.equal(await c.get('tg:1'), undefined);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('rate limiter blocks bursts per user and recovers', () => {
  let now = 0;
  const rl = new RateLimiter(3, 1000, () => now);
  assert.ok(rl.allow('a') && rl.allow('a') && rl.allow('a'));
  assert.equal(rl.allow('a'), false);
  assert.ok(rl.allow('b'));
  now = 1500;
  assert.ok(rl.allow('a'));
});

test('keyed queue serializes per key', async () => {
  const q = new KeyedQueue();
  const order: number[] = [];
  await Promise.all([
    q.run('k', async () => { await new Promise((r) => setTimeout(r, 20)); order.push(1); }),
    q.run('k', async () => { order.push(2); }),
  ]);
  assert.deepEqual(order, [1, 2]);
});

const LEAD: Lead = {
  service: 'photography', subService: 'villa', location: 'koh-samui', description: '<b>hi</b> & bye', budget: null, timeline: 'asap',
  name: 'A <script>', contact: '+66 81 000 0000', channel: 'whatsapp', language: 'ru', attachments: [{ id: 'm1', kind: 'photo', channel: 'whatsapp' }],
  source: 'google', deepLink: 's_photography__u_google', firstMessage: 'Hello', profile: { phone: '+66810000000' }, timestamp: NOW, stage: 'NEW LEAD',
};

test('staff message contains every lead field and escapes HTML', () => {
  const msg = formatLeadMessage(LEAD);
  for (const needle of ['Photography', 'villa', 'Koh Samui', 'Budget', 'As soon as possible', '&lt;b&gt;hi&lt;/b&gt; &amp; bye', 'A &lt;script&gt;', '+66 81 000 0000', 'whatsapp', 'ru', 'google', 's_photography__u_google', 'Attachments:</b> 1', NOW]) {
    assert.ok(msg.includes(needle), `staff message misses ${needle}`);
  }
  assert.ok(!msg.includes('<script>'));
});

test('notifyStaff reports failures without throwing and without logging personal data', async () => {
  const logs: string[] = [];
  const orig = console.error;
  console.error = (...args: unknown[]) => logs.push(args.map(String).join(' '));
  const env = { ...process.env };
  try {
    delete process.env.TELEGRAM_BOT_TOKEN;
    assert.deepEqual(await notifyStaff(LEAD), { ok: false, error: 'missing_config' });
    process.env.TELEGRAM_BOT_TOKEN = 't';
    process.env.TELEGRAM_STAFF_CHAT_ID = '-100';
    const res = await notifyStaff(LEAD, { fetchImpl: (async () => new Response('nope', { status: 500 })) as typeof fetch });
    assert.equal(res.ok, false);
    const calls: string[] = [];
    const ok = await notifyStaff(LEAD, {
      fetchImpl: (async (url: string) => { calls.push(String(url)); return new Response('{}', { status: 200 }); }) as unknown as typeof fetch,
      downloadMedia: async () => ({ bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/jpeg', fileName: 'x.jpg' }),
    });
    assert.equal(ok.ok, true);
    assert.ok(calls[0].endsWith('/sendMessage')); assert.ok(calls[1].endsWith('/sendDocument'));
  } finally {
    console.error = orig;
    process.env = env;
  }
  const joined = logs.join('\n');
  assert.ok(!joined.includes('+66'), 'phone leaked into logs');
  assert.ok(!joined.includes('script'), 'name leaked into logs');
});
