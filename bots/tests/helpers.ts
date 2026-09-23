import assert from 'node:assert/strict';
import { reduce, render, type Button, type Input, type ReduceResult, type RenderContext, type View } from '../shared/flow.js';
import type { Channel, FlowState, UserProfile } from '../shared/types.js';
import { planWhatsApp } from '../whatsapp/render.js';

export const NOW = '2026-09-23T10:00:00.000Z';

export function renderCtx(channel: Channel = 'telegram'): RenderContext {
  return { channel, siteUrl: 'https://creativelab.in.th', contactEmail: 'hello@example.com', contactWhatsApp: '+66 80 000 0000' };
}

export function step(state: FlowState | undefined, input: Input, channel: Channel = 'telegram', profile?: UserProfile): ReduceResult {
  return reduce(state, input, { channel, now: NOW, profile });
}

export function act(state: FlowState, id: string, channel: Channel = 'telegram'): FlowState {
  const r = step(state, { type: 'action', id }, channel);
  assert.equal(r.notice?.key, undefined, `action ${id} on ${state.step}/${state.overlay ?? '-'} was not accepted (${r.notice?.key})`);
  return r.state;
}

export function text(state: FlowState, value: string, channel: Channel = 'telegram'): FlowState {
  return step(state, { type: 'text', text: value }, channel).state;
}

export function view(state: FlowState, channel: Channel = 'telegram'): View {
  return render(state, renderCtx(channel));
}

export function actionIds(v: View): string[] {
  return v.rows.flat().filter((b): b is Extract<Button, { kind: 'action' }> => b.kind === 'action').map((b) => b.id);
}

/**
 * 0-dead-end check for one screen: it offers at least one action, every
 * offered action is understood by the engine and leads to a screen that
 * again offers actions, and (after the first step) Back/Language/Restart
 * are reachable. Also validates the WhatsApp rendering limits.
 */
export function assertScreenHealthy(state: FlowState, channel: Channel): void {
  const v = view(state, channel);
  const ids = actionIds(v);
  const where = `${state.language}/${state.step}/${state.overlay ?? '-'}`;
  assert.ok(ids.length > 0, `dead end: no actions on ${where}`);
  assert.equal(new Set(ids).size, ids.length, `duplicate action ids on ${where}`);
  if (state.step !== 'language' && state.step !== 'submitted' && state.overlay !== 'resume') {
    assert.ok(ids.includes('nav:back') || ids.includes('edit:cancel'), `no Back on ${where}`);
    if (state.overlay !== 'language') assert.ok(ids.includes('nav:lang'), `no language switch on ${where}`);
  }
  for (const id of ids) {
    const r = step(state, { type: 'action', id }, channel);
    if (r.effects.length) continue; // submit — covered separately
    assert.notEqual(r.notice?.key, 'pickOption', `button ${id} is not handled on ${where}`);
    assert.ok(actionIds(view(r.state, channel)).length > 0, `button ${id} on ${where} leads to a dead end`);
  }
  for (const m of planWhatsApp(v)) {
    if (m.type === 'buttons') {
      assert.ok(m.buttons.length <= 3);
      for (const b of m.buttons) assert.ok([...b.title].length <= 20, `WA button too long: ${b.title}`);
      assert.ok([...m.body].length <= 1024);
    }
    if (m.type === 'list') {
      const rows = m.sections.flatMap((s) => s.rows);
      assert.ok(rows.length <= 10, `WA list has ${rows.length} rows on ${where}`);
      for (const r of rows) assert.ok([...r.title].length <= 24 && (!r.description || [...r.description].length <= 72));
      assert.ok([...m.body].length <= 1024);
      if (ids.includes('nav:back')) assert.ok(rows.some((r) => r.id === 'nav:back'), `WA list lost Back on ${where}`);
    }
    if (m.type === 'buttons' && ids.includes('nav:back')) assert.ok(m.buttons.some((b) => b.id === 'nav:back'));
  }
}
