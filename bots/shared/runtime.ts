/**
 * The one impure loop both adapters share: load session → reduce → perform
 * effects (submit → notifyStaff → feed the result back) → save → render.
 * Kept separate from flow.ts so the engine stays pure, and from the
 * adapters so the "notify failed → honest message + keep the lead" path is
 * identical on both channels and testable without a network.
 */
import { reduce, render, type Input, type RenderContext, type View } from './flow.js';
import type { NotifyResult } from './notify.js';
import type { SessionStore } from './session-store.js';
import type { Channel, Lead, UserProfile } from './types.js';
import { contactEmail, contactWhatsApp, photoBaseUrl, siteUrl } from './config.js';

export interface RuntimeDeps {
  store: SessionStore;
  notify: (lead: Lead) => Promise<NotifyResult>;
  now?: () => string;
}

export function renderContext(channel: Channel): RenderContext {
  return {
    channel,
    siteUrl: siteUrl(),
    photoBaseUrl: photoBaseUrl(),
    contactEmail: contactEmail(),
    contactWhatsApp: contactWhatsApp(),
  };
}

export interface ProcessResult {
  view: View;
  submitted: boolean;
  submitFailed: boolean;
}

export async function processInput(
  deps: RuntimeDeps,
  channel: Channel,
  key: string,
  input: Input,
  profile: UserProfile,
  onSubmitting?: () => Promise<void>
): Promise<ProcessResult> {
  const now = deps.now ?? (() => new Date().toISOString());
  const prev = await deps.store.get(key);
  let result = reduce(prev, input, { channel, now: now(), profile });
  let submitted = false;
  let submitFailed = false;

  for (const effect of result.effects) {
    if (effect.type === 'submit') {
      await onSubmitting?.();
      let ok = false;
      try {
        ok = (await deps.notify(effect.lead)).ok;
      } catch {
        ok = false;
      }
      submitted = ok;
      submitFailed = !ok;
      result = reduce(result.state, { type: 'submitResult', ok }, { channel, now: now() });
    }
  }

  await deps.store.set(key, result.state);
  return { view: render(result.state, renderContext(channel), result.notice), submitted, submitFailed };
}
