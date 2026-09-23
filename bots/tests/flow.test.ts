import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SERVICES, LOCATION_KEYS, getSubServices, getService } from '../shared/data.js';
import { LOCALES, type Channel, type FlowState, type Locale } from '../shared/types.js';
import { EDITABLE_STEPS, buildLead, isReadyToSubmit } from '../shared/flow.js';
import { act, actionIds, assertScreenHealthy, step, text, view } from './helpers.js';

const CHANNELS: Channel[] = ['telegram', 'whatsapp'];

/** Walks the whole funnel; checks every screen on the way (buttons handled, Back present, WA limits). */
function walk(lang: Locale, service: string, sub: string, location: string, channel: Channel, opts: { skipBudget?: boolean } = {}): FlowState {
  const profile = channel === 'telegram' ? { displayName: 'Anna', telegramUsername: 'anna_k', telegramUserId: 42 } : { displayName: 'Anna', phone: '+66800000000' };
  let s = step(undefined, { type: 'start' }, channel, profile).state;
  const check = () => assertScreenHealthy(s, channel);
  assert.equal(s.step, 'language'); check();
  s = act(s, `lang:${lang}`, channel); assert.equal(s.step, 'welcome'); check();
  s = act(s, 'go:start', channel); assert.equal(s.step, 'service'); check();
  s = act(s, `svc:${service}`, channel); assert.equal(s.step, 'subService'); check();
  s = act(s, `sub:${sub}`, channel); assert.equal(s.step, 'location'); check();
  s = act(s, `loc:${location}`, channel); assert.equal(s.step, 'description'); check();
  s = text(s, 'We need fresh photos of our 4-bedroom villa for Airbnb.', channel); assert.equal(s.step, 'budget'); check();
  s = act(s, opts.skipBudget ? 'nav:skip' : 'bud:50k-150k', channel); assert.equal(s.step, 'timeline'); check();
  s = act(s, 'tl:within-month', channel); assert.equal(s.step, 'attachments'); check();
  s = step(s, { type: 'file', file: { id: 'f1', kind: 'photo', sizeBytes: 1_000_000 } }, channel).state;
  assert.equal(s.attachments.length, 1); check();
  s = act(s, 'files:done', channel); assert.equal(s.step, 'contactName'); check();
  s = act(s, 'name:profile', channel); assert.equal(s.contactName, 'Anna'); assert.equal(s.step, 'contactDetail'); check();
  s = act(s, channel === 'telegram' ? 'contact:tg' : 'contact:phone', channel); assert.equal(s.step, 'review'); check();
  const r = step(s, { type: 'action', id: 'review:submit' }, channel);
  assert.equal(r.effects.length, 1, 'submit must emit exactly one effect');
  const lead = r.effects[0].lead;
  assert.equal(lead.service, service); assert.equal(lead.subService, sub); assert.equal(lead.location, location);
  assert.equal(lead.language, lang); assert.equal(lead.channel, channel);
  s = step(r.state, { type: 'submitResult', ok: true }, channel).state;
  assert.equal(s.step, 'submitted'); check();
  return s;
}

test('every service × sub-service × location × language × channel reaches submit with 0 dead ends', () => {
  let runs = 0;
  for (const channel of CHANNELS)
    for (const lang of LOCALES)
      for (const svc of SERVICES)
        for (const sub of getSubServices(svc.key))
          for (const loc of LOCATION_KEYS) {
            walk(lang, svc.key, sub.key, loc, channel);
            runs++;
          }
  assert.ok(runs > 1000, `ran ${runs} journeys`);
});

test('budget and timeline can be skipped (lead has nulls)', () => {
  let s = walk('en', 'web', 'landing-page', 'koh-phangan', 'telegram', { skipBudget: true });
  assert.equal(s.budget, undefined);
  s = step(undefined, { type: 'start' }).state;
  s = act(s, 'lang:en'); s = act(s, 'go:start'); s = act(s, 'svc:seo'); s = act(s, 'sub:local-seo'); s = act(s, 'loc:other');
  s = text(s, 'Rank our cafe on Google'); s = act(s, 'nav:skip'); s = act(s, 'nav:skip'); s = act(s, 'files:done');
  s = text(s, 'Max'); s = text(s, 'max@example.com');
  const lead = buildLead(s, 'telegram', 'now');
  assert.equal(lead.budget, null); assert.equal(lead.timeline, null); assert.equal(lead.attachments.length, 0);
});

test('Back works on every step and never loses answers', () => {
  let s = walk('ru', 'photography', 'villa', 'koh-samui', 'telegram');
  s = step(s, { type: 'action', id: 'new' }).state; // new request keeps language
  assert.equal(s.step, 'welcome'); assert.equal(s.language, 'ru');
  // Build a full state then go back step by step to the start.
  s = act(s, 'go:start'); s = act(s, 'svc:video'); s = act(s, 'sub:commercial'); s = act(s, 'loc:koh-tao');
  s = text(s, 'A 30 second ad for our resort'); s = act(s, 'bud:15k-50k'); s = act(s, 'tl:asap'); s = act(s, 'files:done');
  s = text(s, 'Ivan'); s = text(s, '+66 81 234 5678');
  assert.equal(s.step, 'review');
  const expected = ['contactDetail', 'contactName', 'attachments', 'timeline', 'budget', 'description', 'location', 'subService', 'service', 'welcome', 'language'];
  for (const stepId of expected) {
    s = act(s, 'nav:back');
    assert.equal(s.step, stepId);
  }
  assert.equal(s.service, 'video'); assert.equal(s.description, 'A 30 second ad for our resort'); assert.equal(s.contactDetail, '+66 81 234 5678');
});

test('language switch on any step preserves progress (button, /language and typed word)', () => {
  let s = step(undefined, { type: 'start' }).state;
  s = act(s, 'lang:en'); s = act(s, 'go:start'); s = act(s, 'svc:branding'); s = act(s, 'sub:menu-design'); s = act(s, 'loc:koh-phangan');
  s = text(s, 'New menu for our beach bar');
  assert.equal(s.step, 'budget');
  const before = { ...s };
  for (const lang of LOCALES) {
    s = act(s, 'nav:lang');
    assert.equal(s.overlay, 'language'); assertScreenHealthy(s, 'telegram');
    s = act(s, `lang:${lang}`);
    assert.equal(s.overlay, undefined); assert.equal(s.language, lang); assert.equal(s.step, 'budget');
    assert.equal(s.description, before.description); assert.equal(s.subService, before.subService); assert.equal(s.location, before.location);
  }
  s = text(s, 'язык'); assert.equal(s.overlay, 'language');
  s = act(s, 'nav:back'); assert.equal(s.overlay, undefined); assert.equal(s.step, 'budget');
});

test('Hebrew views are RTL-marked and isolate user values', () => {
  let s = walk('he', 'web', 'villa-website', 'koh-tao', 'telegram');
  const v = view(s);
  assert.ok(v.rtl);
  assert.ok(v.text.split('\n').filter(Boolean).every((l) => l.startsWith('‏')));
  s = step(s, { type: 'action', id: 'new' }).state;
  assert.equal(s.language, 'he');
});

test('review → edit any field returns to review; editing service re-asks sub-service', () => {
  let s = walk('th', 'social-media', 'reels', 'koh-phangan', 'whatsapp');
  s = step(s, { type: 'action', id: 'new' }, 'whatsapp').state;
  s = act(s, 'go:start', 'whatsapp'); s = act(s, 'svc:digital', 'whatsapp'); s = act(s, 'sub:listings', 'whatsapp'); s = act(s, 'loc:koh-samui', 'whatsapp');
  s = text(s, 'Please list my spa everywhere', 'whatsapp'); s = act(s, 'nav:skip', 'whatsapp'); s = act(s, 'nav:skip', 'whatsapp');
  s = act(s, 'files:done', 'whatsapp'); s = text(s, 'Nok', 'whatsapp'); s = text(s, 'nok@example.com', 'whatsapp');
  assert.equal(s.step, 'review');
  for (const field of EDITABLE_STEPS) {
    s = act(s, 'review:edit', 'whatsapp'); assert.equal(s.overlay, 'edit'); assertScreenHealthy(s, 'whatsapp');
    s = act(s, `edit:${field}`, 'whatsapp'); assert.equal(s.step, field); assertScreenHealthy(s, 'whatsapp');
    s = act(s, 'nav:back', 'whatsapp'); assert.equal(s.step, 'review', `back from editing ${field} returns to review`);
  }
  s = act(s, 'review:edit', 'whatsapp'); s = act(s, 'edit:service', 'whatsapp'); s = act(s, 'svc:web', 'whatsapp');
  assert.equal(s.step, 'subService'); assert.equal(s.subService, undefined);
  s = act(s, 'sub:ecommerce', 'whatsapp'); assert.equal(s.step, 'review');
  s = act(s, 'review:edit', 'whatsapp'); s = act(s, 'edit:description', 'whatsapp'); s = text(s, 'Actually an online shop', 'whatsapp');
  assert.equal(s.step, 'review'); assert.equal(s.description, 'Actually an online shop');
  s = act(s, 'review:edit', 'whatsapp'); s = act(s, 'edit:cancel', 'whatsapp'); assert.equal(s.step, 'review');
});

test('restart from any step keeps language, clears answers', () => {
  let s = step(undefined, { type: 'start' }).state;
  s = act(s, 'lang:th'); s = act(s, 'go:start'); s = act(s, 'svc:video'); s = act(s, 'sub:fpv-video');
  s = act(s, 'nav:restart');
  assert.equal(s.step, 'welcome'); assert.equal(s.language, 'th'); assert.equal(s.service, undefined);
  s = act(s, 'go:start'); s = text(s, 'заново'); assert.equal(s.step, 'welcome');
});

test('unknown input re-prompts without changing state', () => {
  let s = step(undefined, { type: 'start' }).state;
  let r = step(s, { type: 'text', text: 'hello??' });
  assert.equal(r.notice?.key, 'pickOption'); assert.equal(r.state.step, 'language');
  r = step(s, { type: 'action', id: 'totally:bogus' }); assert.equal(r.notice?.key, 'pickOption');
  s = act(s, 'lang:en'); s = act(s, 'go:start');
  r = step(s, { type: 'text', text: 'something random' }); assert.equal(r.notice?.key, 'pickOption'); assert.equal(r.state.step, 'service');
  r = step(s, { type: 'action', id: 'sub:reels' }); assert.equal(r.notice?.key, 'pickOption'); // stale button
  r = step(s, { type: 'text', text: '' }); assert.equal(r.notice?.key, 'pickOption');
  r = step(s, { type: 'file', file: { id: 'x', kind: 'photo' } }); assert.equal(r.notice?.key, 'filesNotNow');
  // typed option label / number also works (WhatsApp users type)
  assert.equal(text(s, '2').service, SERVICES[1].key);
  assert.equal(text(s, 'Branding').service, 'branding');
  s = act(s, 'svc:web'); s = act(s, 'sub:redesign'); s = act(s, 'loc:koh-phangan');
  r = step(s, { type: 'text', text: 'hi' }); assert.equal(r.notice?.key, 'descriptionTooShort');
  r = step(s, { type: 'text', text: 'x'.repeat(2001) }); assert.equal(r.notice?.key, 'textTooLong');
  s = text(s, 'Refresh our 2015 website');
  s = text(s, 'around 40k'); assert.equal(s.budget, 'around 40k'); assert.equal(s.step, 'timeline');
  s = act(s, 'nav:skip'); s = act(s, 'files:done');
  r = step(s, { type: 'text', text: 'x'.repeat(81) }); assert.equal(r.notice?.key, 'nameInvalid');
  s = text(s, 'Lee');
  r = step(s, { type: 'text', text: 'call me maybe' }); assert.equal(r.notice?.key, 'contactInvalid'); assert.equal(r.state.step, 'contactDetail');
  s = step(s, { type: 'contact', phone: '66812345678' }).state;
  assert.equal(s.contactDetail, '+66812345678'); assert.equal(s.step, 'review');
});

test('/start with a deep link preselects service + location and keeps source', () => {
  let s = step(undefined, { type: 'start', payload: 's_photography__l_koh-samui__u_google-villa' }).state;
  assert.equal(s.service, 'photography'); assert.equal(s.location, 'koh-samui'); assert.equal(s.source, 'google-villa');
  s = act(s, 'lang:en'); s = act(s, 'go:start');
  assert.equal(s.step, 'subService', 'service step skipped');
  s = act(s, 'sub:drone');
  assert.equal(s.step, 'description', 'location step skipped');
  assert.match(view(s).text, /travel fee/);
  s = act(s, 'nav:back'); assert.equal(s.step, 'location'); // Back still reaches prefilled steps
  s = act(s, 'nav:back'); s = act(s, 'nav:back'); assert.equal(s.step, 'service');
});

test('/start on an unfinished request offers resume; resume keeps answers', () => {
  let s = step(undefined, { type: 'start' }).state;
  s = act(s, 'lang:en'); s = act(s, 'go:start'); s = act(s, 'svc:seo');
  s = step(s, { type: 'start' }).state;
  assert.equal(s.overlay, 'resume'); assertScreenHealthy(s, 'telegram');
  s = act(s, 'resume:continue'); assert.equal(s.step, 'subService'); assert.equal(s.service, 'seo');
  s = step(s, { type: 'start' }).state; s = act(s, 'resume:restart');
  assert.equal(s.step, 'welcome'); assert.equal(s.service, undefined);
});

test('submit failure keeps the lead, shows contacts + retry, retry succeeds', () => {
  let s = walk('en', 'advertising', 'google-ads', 'koh-phangan', 'telegram');
  s = step(s, { type: 'action', id: 'new' }).state;
  s = act(s, 'go:start'); s = act(s, 'svc:advertising'); s = act(s, 'sub:meta-ads'); s = act(s, 'loc:koh-phangan');
  s = text(s, 'Promote our yoga retreat'); s = act(s, 'nav:skip'); s = act(s, 'nav:skip'); s = act(s, 'files:done');
  s = text(s, 'Mia'); s = text(s, 'mia@example.com');
  let r = step(s, { type: 'action', id: 'review:submit' });
  s = step(r.state, { type: 'submitResult', ok: false }).state;
  assert.equal(s.step, 'review'); assert.equal(s.submitError, true); assert.ok(isReadyToSubmit(s));
  const v = view(s);
  assert.match(v.text, /hello@example\.com/); assert.match(v.text, /\+66 80 000 0000/);
  assert.ok(actionIds(v).includes('review:retry'));
  assertScreenHealthy(s, 'telegram');
  r = step(s, { type: 'action', id: 'review:retry' });
  assert.equal(r.effects.length, 1);
  s = step(r.state, { type: 'submitResult', ok: true }).state;
  assert.equal(s.step, 'submitted'); assert.equal(s.submitError, false);
  assert.match(view(s).text, /24/);
});

test('smart fallback when a service is not offered in a location', () => {
  const svc = getService('photography')!;
  svc.unavailableIn = ['koh-tao'];
  try {
    let s = step(undefined, { type: 'start' }).state;
    s = act(s, 'lang:en'); s = act(s, 'go:start'); s = act(s, 'svc:photography'); s = act(s, 'sub:villa');
    s = act(s, 'loc:koh-tao');
    assert.equal(s.overlay, 'fallback'); assertScreenHealthy(s, 'telegram');
    const ids = actionIds(view(s));
    assert.ok(ids.includes('loc:koh-phangan')); assert.ok(ids.includes('svc:video')); assert.ok(ids.includes('fb:continue'));
    const viaLocation = act(s, 'loc:koh-phangan'); assert.equal(viaLocation.step, 'description'); assert.equal(viaLocation.location, 'koh-phangan');
    const viaService = act(s, 'svc:video'); assert.equal(viaService.step, 'subService'); assert.equal(viaService.location, 'koh-tao');
    const viaService2 = act(viaService, 'sub:commercial'); assert.equal(viaService2.step, 'description');
    const anyway = act(s, 'fb:continue'); assert.equal(anyway.step, 'description'); assert.equal(anyway.location, 'koh-tao');
    const back = act(s, 'nav:back'); assert.equal(back.step, 'location'); assert.equal(back.overlay, undefined);
  } finally {
    delete svc.unavailableIn;
  }
});

test('review submit with a missing field jumps to it instead of failing', () => {
  let s = walk('en', 'web', 'web-design', 'koh-phangan', 'telegram');
  s = { ...s, step: 'review', description: undefined };
  s = act(s, 'review:submit');
  assert.equal(s.step, 'description'); assert.equal(s.returnToReview, true);
  s = text(s, 'A new portfolio site'); assert.equal(s.step, 'review');
});

test('every language has every service description and step text (no English leaks in RU/TH/HE)', () => {
  let s = step(undefined, { type: 'start' }).state;
  s = act(s, 'lang:en');
  const enWelcome = view(s).text;
  for (const lang of ['ru', 'th', 'he'] as const) {
    const other = { ...s, language: lang };
    assert.notEqual(view(other).text, enWelcome);
    for (const svc of SERVICES) assert.ok(svc.description[lang].length > 20 && svc.label[lang]);
  }
});
