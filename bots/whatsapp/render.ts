/**
 * Pure View → WhatsApp message plan. WhatsApp limits: ≤ 3 reply buttons
 * (title ≤ 20), or one list with ≤ 10 rows (title ≤ 24, description ≤ 72),
 * interactive body ≤ 1024, footer ≤ 60, no URL buttons. When a step has more
 * actions than fit, low-priority nav rows are dropped — they stay reachable
 * by typing "back" / "restart" / "language" (see the footer hint).
 */
import type { Button, View } from '../shared/flow.js';
import { getBotDictionary } from '../shared/i18n.js';
import type { ListSection, ReplyButton } from './graph-api.js';

export type WaMessage =
  | { type: 'image'; link: string }
  | { type: 'text'; text: string }
  | { type: 'buttons'; body: string; buttons: ReplyButton[]; footer?: string }
  | { type: 'list'; body: string; button: string; sections: ListSection[]; footer?: string };

const NAV_PRIORITY = ['nav:skip', 'nav:back', 'edit:cancel', 'nav:lang', 'nav:restart'];

export function htmlToWhatsApp(html: string): string {
  return html
    .replace(/<\/?b>/g, '*')
    .replace(/<\/?i>/g, '_')
    .replace(/<\/?code>/g, '')
    .replace(/<a\s+href="([^"]*)">([^<]*)<\/a>/g, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

function clip(value: string, max: number): string {
  const chars = [...value];
  return chars.length <= max ? value : `${chars.slice(0, max - 1).join('')}…`;
}

type ActionButton = Extract<Button, { kind: 'action' }>;

export function planWhatsApp(view: View): WaMessage[] {
  const d = getBotDictionary(view.locale);
  const messages: WaMessage[] = [];
  if (view.photoUrl) messages.push({ type: 'image', link: view.photoUrl });

  const all = view.rows.flat();
  const urls = all.filter((b): b is Extract<Button, { kind: 'url' }> => b.kind === 'url');
  const actions = all.filter((b): b is ActionButton => b.kind === 'action');

  let body = htmlToWhatsApp(view.text);
  for (const u of urls) body += `\n\n${u.label}: ${u.url}`;

  const footer = [...d.textCommandsHint].length <= 60 ? d.textCommandsHint : undefined;

  if (actions.length === 0) {
    messages.push({ type: 'text', text: body });
    return messages;
  }

  // Interactive bodies are capped at 1024 chars — send long text separately.
  let interactiveBody = body;
  if ([...body].length > 1024) {
    messages.push({ type: 'text', text: body });
    interactiveBody = d.pickOption;
  }

  if (actions.length <= 3) {
    messages.push({
      type: 'buttons',
      body: interactiveBody,
      buttons: actions.map((b) => ({ id: b.id, title: clip(b.label, 20) })),
      footer,
    });
    return messages;
  }

  const options = actions.filter((b) => b.role === 'option').slice(0, 10);
  const nav = actions
    .filter((b) => b.role === 'nav')
    .sort((a, b) => NAV_PRIORITY.indexOf(a.id) - NAV_PRIORITY.indexOf(b.id))
    .slice(0, Math.max(0, 10 - options.length));

  const row = (b: ActionButton) => {
    const title = clip(b.label, 24);
    return title === b.label ? { id: b.id, title } : { id: b.id, title, description: clip(b.label, 72) };
  };
  const sections: ListSection[] = [];
  if (options.length) sections.push({ title: clip(d.waOptions, 24), rows: options.map(row) });
  if (nav.length) sections.push({ title: clip(d.waNavigation, 24), rows: nav.map(row) });

  messages.push({ type: 'list', body: interactiveBody, button: clip(d.waChoose, 20), sections, footer });
  return messages;
}
