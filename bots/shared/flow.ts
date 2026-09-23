/**
 * Channel-agnostic intake engine — PURE (no I/O, no clocks, no env).
 *
 *   reduce(state, input, ctx) → { state, effects, notice }
 *   render(state, ctx, notice?) → View   (text + button rows + what input is accepted)
 *
 * Channel adapters (telegram/, whatsapp/) only translate platform updates
 * into `Input`s, persist the returned state, perform `effects` (submit →
 * notifyStaff → feed back `{ type: 'submitResult' }`) and draw the `View`.
 *
 * Guarantees (enforced by tests/flow.test.ts):
 *  - every view offers at least one way forward (0 dead ends);
 *  - every step after the first has Back, Restart and 🌐 Language;
 *  - switching language never touches collected answers;
 *  - unknown input re-renders the current step with a hint, never crashes.
 */
import {
  BUDGET_KEYS,
  LANGUAGE_LABELS,
  LOCATION_KEYS,
  SERVICES,
  TIMELINE_KEYS,
  alternativeLocations,
  alternativeServices,
  availability,
  budgetLabel,
  getService,
  getSubService,
  getSubServices,
  isLocationKey,
  locationLabel,
  serviceLabel,
  siteLink,
  subServiceLabel,
  timelineLabel,
  type LocationKey,
} from './data.js';
import { MAX_ATTACHMENTS, MAX_UPLOAD_BYTES } from './config.js';
import { parseDeepLink } from './deeplink.js';
import { TEXT_COMMANDS, getBotDictionary, t, type DictKey } from './i18n.js';
import {
  LOCALES,
  STEP_ORDER,
  isLocale,
  type Attachment,
  type AttachmentKind,
  type Channel,
  type FlowState,
  type Lead,
  type Locale,
  type StepId,
  type UserProfile,
} from './types.js';

// ---------------------------------------------------------------- types

export interface ReduceContext {
  channel: Channel;
  /** ISO timestamp supplied by the adapter (keeps the engine pure/deterministic). */
  now: string;
  /** Whatever the channel knows about the user right now — merged into state.profile. */
  profile?: UserProfile;
}

export interface RenderContext {
  channel: Channel;
  siteUrl: string;
  /** Optional photo base (see config.photoBaseUrl). Unset → no photos. */
  photoBaseUrl?: string;
  contactEmail: string;
  contactWhatsApp: string;
}

export interface FileCandidate {
  id: string;
  kind: AttachmentKind | 'unsupported';
  mimeType?: string;
  sizeBytes?: number;
  fileName?: string;
}

export type Input =
  | { type: 'start'; payload?: string; firstMessage?: string }
  | { type: 'action'; id: string }
  | { type: 'text'; text: string }
  | { type: 'file'; file: FileCandidate }
  /** Telegram "share phone" contact. */
  | { type: 'contact'; phone: string }
  | { type: 'submitResult'; ok: boolean }
  /** The channel couldn't fetch/inspect an upload — friendly fallback message. */
  | { type: 'uploadFailed' };

export type Effect = { type: 'submit'; lead: Lead };

export interface Notice {
  key: DictKey;
  params?: Record<string, string | number>;
}

export interface ReduceResult {
  state: FlowState;
  effects: Effect[];
  notice?: Notice;
}

export type Button =
  | { kind: 'action'; id: string; label: string; role: 'option' | 'nav' }
  | { kind: 'url'; url: string; label: string };

export type InputMode = 'choice' | 'text' | 'files' | 'none';

export interface View {
  step: StepId;
  overlay?: FlowState['overlay'];
  locale: Locale;
  rtl: boolean;
  /** Telegram-HTML subset: <b>, <i>, <a href>. Every user value is escaped. */
  text: string;
  photoUrl?: string;
  rows: Button[][];
  input: InputMode;
  /** Telegram: also show the native "share phone" reply-keyboard button. */
  requestPhone?: boolean;
}

// ---------------------------------------------------------------- constants

export const MAX_DESCRIPTION = 2000;
export const MIN_DESCRIPTION = 5;
export const MAX_SHORT_TEXT = 120;
export const MAX_NAME = 80;

/** Fields editable from the review screen, in display order. */
export const EDITABLE_STEPS: StepId[] = [
  'service',
  'subService',
  'location',
  'description',
  'budget',
  'timeline',
  'attachments',
  'contactName',
  'contactDetail',
];

const REQUIRED_STEPS: StepId[] = ['service', 'subService', 'location', 'description', 'contactName', 'contactDetail'];

const ALLOWED_DOC_MIME = [
  /^image\//,
  /^video\//,
  /^audio\//,
  /^application\/pdf$/,
  /^application\/msword$/,
  /^application\/vnd\.openxmlformats-officedocument\./,
  /^application\/vnd\.ms-(excel|powerpoint)/,
  /^application\/vnd\.oasis\.opendocument\./,
  /^application\/vnd\.apple\./,
  /^application\/(zip|x-zip-compressed|x-rar-compressed|vnd\.rar|x-7z-compressed)$/,
  /^application\/(rtf|postscript|illustrator|acad|x-autocad|dxf)$/,
  /^image\/vnd\.dwg$/,
  /^text\/(plain|csv|rtf)$/,
];
const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'key', 'pages', 'numbers', 'txt', 'csv', 'rtf',
  'zip', 'rar', '7z', 'dwg', 'dxf', 'skp', 'psd', 'ai', 'eps', 'svg', 'heic', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'tif', 'tiff',
  'mp4', 'mov', 'm4v', 'webm', 'mp3', 'm4a', 'ogg', 'oga', 'opus', 'wav',
]);

// ---------------------------------------------------------------- state helpers

export function createInitialState(now: string, language?: Locale): FlowState {
  return {
    step: language ? 'welcome' : 'language',
    language,
    attachments: [],
    profile: {},
    skipOnce: [],
    startedAt: now,
    updatedAt: now,
  };
}

function loc(state: FlowState): Locale {
  return state.language ?? 'en';
}

function isFilled(state: FlowState, step: StepId): boolean {
  switch (step) {
    case 'service':
      return Boolean(getService(state.service));
    case 'subService':
      return Boolean(getSubService(state.service, state.subService));
    case 'location':
      return Boolean(state.location && isLocationKey(state.location));
    case 'description':
      return Boolean(state.description);
    case 'contactName':
      return Boolean(state.contactName);
    case 'contactDetail':
      return Boolean(state.contactDetail);
    default:
      return true;
  }
}

export function isReadyToSubmit(state: FlowState): boolean {
  return Boolean(state.language) && REQUIRED_STEPS.every((s) => isFilled(state, s));
}

function firstMissing(state: FlowState): StepId | undefined {
  return REQUIRED_STEPS.find((s) => !isFilled(state, s));
}

function locationOk(state: FlowState): boolean {
  return !state.location || !isLocationKey(state.location) || availability(state.service, state.subService, state.location).ok;
}

/** Next step after `from`, honouring deep-link prefills (skipOnce) and review-edit mode. */
function goForward(state: FlowState, from: StepId): FlowState {
  if (state.returnToReview) {
    const missing = firstMissing(state);
    if (missing) return { ...state, step: missing, overlay: undefined };
    return { ...state, step: 'review', overlay: undefined, returnToReview: false };
  }
  let skipOnce = [...state.skipOnce];
  let idx = STEP_ORDER.indexOf(from) + 1;
  while (idx < STEP_ORDER.length - 1) {
    const candidate = STEP_ORDER[idx];
    const canSkip = skipOnce.includes(candidate) && isFilled(state, candidate) && (candidate !== 'location' || locationOk(state));
    if (!canSkip) break;
    skipOnce = skipOnce.filter((s) => s !== candidate);
    idx += 1;
  }
  skipOnce = skipOnce.filter((s) => STEP_ORDER.indexOf(s) > idx);
  return { ...state, step: STEP_ORDER[idx], skipOnce, overlay: undefined };
}

function goBack(state: FlowState): FlowState {
  if (state.overlay === 'language' || state.overlay === 'resume') return { ...state, overlay: undefined };
  if (state.overlay === 'edit') return { ...state, overlay: undefined, step: 'review' };
  if (state.overlay === 'fallback') return { ...state, overlay: undefined, fallbackLocation: undefined, step: 'location' };
  if (state.returnToReview && state.step !== 'review') return { ...state, step: 'review', returnToReview: false };
  const idx = STEP_ORDER.indexOf(state.step);
  if (idx <= 0 || state.step === 'submitted') return state;
  // Back never skips prefilled steps — the user can always revisit a deep-link choice.
  return { ...state, step: STEP_ORDER[idx - 1], skipOnce: [] };
}

function restart(state: FlowState, now: string): FlowState {
  const fresh = createInitialState(now, state.language);
  return { ...fresh, profile: state.profile, source: state.source };
}

// ---------------------------------------------------------------- validation

export type UploadVerdict = 'ok' | 'too_big' | 'bad_type' | 'too_many';

export function validateUpload(file: FileCandidate, currentCount: number): UploadVerdict {
  if (currentCount >= MAX_ATTACHMENTS) return 'too_many';
  if (file.kind === 'unsupported') return 'bad_type';
  if (file.sizeBytes != null && file.sizeBytes > MAX_UPLOAD_BYTES) return 'too_big';
  if (file.kind === 'document') {
    const mime = (file.mimeType ?? '').toLowerCase();
    const ext = (file.fileName ?? '').toLowerCase().split('.').pop() ?? '';
    const mimeOk = ALLOWED_DOC_MIME.some((re) => re.test(mime));
    const extOk = ALLOWED_EXTENSIONS.has(ext);
    if (!mimeOk && !extOk) return 'bad_type';
  }
  return 'ok';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HANDLE_RE = /^@[A-Za-z0-9_]{3,32}$/;

export function isValidContact(value: string): boolean {
  const v = value.trim();
  if (!v || v.length > MAX_SHORT_TEXT) return false;
  if (EMAIL_RE.test(v) || HANDLE_RE.test(v)) return true;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[+\d\s().-]+$/.test(v);
}

const URL_RE = /\bhttps?:\/\/[^\s<>"]{3,500}/gi;

// ---------------------------------------------------------------- reduce

function ok(state: FlowState, notice?: Notice, effects: Effect[] = []): ReduceResult {
  return { state, effects, notice };
}

export function reduce(prev: FlowState | undefined, input: Input, ctx: ReduceContext): ReduceResult {
  const base = prev ?? createInitialState(ctx.now);
  const state: FlowState = {
    ...base,
    profile: { ...base.profile, ...stripUndefined(ctx.profile ?? {}) },
    updatedAt: ctx.now,
  };

  switch (input.type) {
    case 'start':
      return handleStart(prev ? state : undefined, state, input, ctx);
    case 'action':
      return handleAction(state, input.id, ctx);
    case 'text':
      return handleText(state, input.text, ctx);
    case 'file':
      return handleFile(state, input.file, ctx);
    case 'contact':
      return handleContact(state, input.phone);
    case 'uploadFailed':
      return ok(state, { key: 'fileFailed' });
    case 'submitResult':
      if (input.ok) {
        return ok({ ...state, step: 'submitted', overlay: undefined, submitError: false, submittedAt: ctx.now, returnToReview: false });
      }
      return ok({ ...state, step: 'review', overlay: undefined, submitError: true });
  }
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')) as Partial<T>;
}

function handleStart(prev: FlowState | undefined, state: FlowState, input: { payload?: string; firstMessage?: string }, ctx: ReduceContext): ReduceResult {
  const link = parseDeepLink(input.payload);
  const hasLink = Boolean(link.service || link.location || link.source);
  const inProgress =
    prev && prev.step !== 'submitted' && STEP_ORDER.indexOf(prev.step) > STEP_ORDER.indexOf('welcome');

  if (!hasLink && inProgress) {
    return ok({ ...state, overlay: 'resume' });
  }

  const fresh = createInitialState(ctx.now, state.language);
  const next: FlowState = {
    ...fresh,
    profile: state.profile,
    source: link.source ?? (hasLink ? undefined : state.source),
    deepLink: link.raw,
    firstMessage: input.firstMessage?.slice(0, 500) || undefined,
  };
  if (link.service) {
    next.service = link.service;
    next.skipOnce.push('service');
  }
  if (link.location) {
    next.location = link.location;
    next.skipOnce.push('location');
  }
  return ok(next);
}

function handleAction(state: FlowState, id: string, ctx: ReduceContext): ReduceResult {
  const [kind, value = ''] = splitAction(id);

  // Global navigation — valid from any step/overlay.
  switch (id) {
    case 'nav:back':
      return ok(goBack(state));
    case 'nav:restart':
    case 'resume:restart':
    case 'new':
      return ok(restart(state, ctx.now));
    case 'nav:lang':
      return ok({ ...state, overlay: 'language' });
    case 'resume:continue':
      return ok({ ...state, overlay: undefined });
  }

  if (kind === 'lang' && isLocale(value)) {
    if (state.overlay === 'language') return ok({ ...state, language: value, overlay: undefined });
    if (state.step === 'language') return ok(goForward({ ...state, language: value }, 'language'));
    return ok({ ...state, language: value });
  }

  if (state.overlay === 'fallback') return handleFallbackAction(state, kind, value);
  if (state.overlay === 'edit') {
    if (id === 'edit:cancel') return ok({ ...state, overlay: undefined, step: 'review' });
    if (kind === 'edit' && EDITABLE_STEPS.includes(value as StepId)) {
      return ok({ ...state, overlay: undefined, step: value as StepId, returnToReview: true });
    }
    return ok(state, { key: 'pickOption' });
  }
  if (state.overlay) return ok(state, { key: 'pickOption' });

  switch (state.step) {
    case 'welcome':
      if (id === 'go:start') return ok(goForward(state, 'welcome'));
      break;
    case 'service':
      if (kind === 'svc' && getService(value)) {
        const changed = value !== state.service;
        return ok(goForward({ ...state, service: value, subService: changed ? undefined : state.subService }, 'service'));
      }
      break;
    case 'subService':
      if (kind === 'sub' && getSubService(state.service, value)) {
        return ok(goForward({ ...state, subService: value }, 'subService'));
      }
      break;
    case 'location':
      if (kind === 'loc' && isLocationKey(value)) return ok(chooseLocation(state, value));
      break;
    case 'description':
      break;
    case 'budget':
      if (id === 'nav:skip') return ok(goForward({ ...state, budget: undefined }, 'budget'));
      if (kind === 'bud' && (BUDGET_KEYS as readonly string[]).includes(value)) return ok(goForward({ ...state, budget: value }, 'budget'));
      break;
    case 'timeline':
      if (id === 'nav:skip') return ok(goForward({ ...state, timeline: undefined }, 'timeline'));
      if (kind === 'tl' && (TIMELINE_KEYS as readonly string[]).includes(value)) return ok(goForward({ ...state, timeline: value }, 'timeline'));
      break;
    case 'attachments':
      if (id === 'files:done') return ok(goForward(state, 'attachments'));
      if (kind === 'files' && value === 'remove-last') return ok({ ...state, attachments: state.attachments.slice(0, -1) });
      break;
    case 'contactName':
      if (id === 'name:profile' && state.profile.displayName) {
        return ok(goForward({ ...state, contactName: state.profile.displayName.slice(0, MAX_NAME) }, 'contactName'));
      }
      break;
    case 'contactDetail':
      if (id === 'contact:tg' && state.profile.telegramUsername) {
        return ok(goForward({ ...state, contactDetail: `@${state.profile.telegramUsername}` }, 'contactDetail'));
      }
      if (id === 'contact:phone' && state.profile.phone) {
        return ok(goForward({ ...state, contactDetail: state.profile.phone }, 'contactDetail'));
      }
      break;
    case 'review':
      if (id === 'review:submit' || id === 'review:retry') {
        if (!isReadyToSubmit(state)) {
          const missing = firstMissing(state) ?? 'service';
          return ok({ ...state, step: missing, returnToReview: true });
        }
        return ok(state, undefined, [{ type: 'submit', lead: buildLead(state, ctx.channel, ctx.now) }]);
      }
      if (id === 'review:edit') return ok({ ...state, overlay: 'edit' });
      break;
    case 'submitted':
    case 'language':
      break;
  }
  return ok(state, { key: 'pickOption' });
}

function splitAction(id: string): [string, string?] {
  const i = id.indexOf(':');
  return i === -1 ? [id] : [id.slice(0, i), id.slice(i + 1)];
}

function chooseLocation(state: FlowState, location: LocationKey): FlowState {
  if (!availability(state.service, state.subService, location).ok) {
    return { ...state, overlay: 'fallback', fallbackLocation: location };
  }
  return goForward({ ...state, location, fallbackLocation: undefined }, 'location');
}

function handleFallbackAction(state: FlowState, kind: string, value: string): ReduceResult {
  const wanted = state.fallbackLocation && isLocationKey(state.fallbackLocation) ? state.fallbackLocation : undefined;
  if (kind === 'loc' && isLocationKey(value) && availability(state.service, state.subService, value).ok) {
    return ok(goForward({ ...state, location: value, fallbackLocation: undefined, overlay: undefined }, 'location'));
  }
  if (kind === 'svc' && getService(value) && wanted) {
    return ok({
      ...state,
      overlay: undefined,
      service: value,
      subService: undefined,
      location: wanted,
      fallbackLocation: undefined,
      step: 'subService',
      skipOnce: ['location'],
    });
  }
  if (kind === 'fb' && value === 'continue' && wanted) {
    return ok(goForward({ ...state, location: wanted, fallbackLocation: undefined, overlay: undefined }, 'location'));
  }
  return ok(state, { key: 'pickOption' });
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function matchTextCommand(text: string): 'back' | 'restart' | 'language' | undefined {
  const v = text.trim().toLowerCase();
  for (const cmd of ['back', 'restart', 'language'] as const) {
    if (TEXT_COMMANDS[cmd].includes(v)) return cmd;
  }
  return undefined;
}

/** Lets users type an option (its number or its label) instead of tapping — WhatsApp users often do. */
function matchOption(view: View, text: string): string | undefined {
  const options = view.rows.flat().filter((b): b is Extract<Button, { kind: 'action' }> => b.kind === 'action' && b.role === 'option');
  const trimmed = text.trim();
  if (/^\d{1,2}$/.test(trimmed)) {
    const n = Number(trimmed);
    if (n >= 1 && n <= options.length) return options[n - 1].id;
  }
  const needle = normalize(trimmed);
  if (!needle) return undefined;
  const exact = options.find((o) => normalize(o.label) === needle);
  return exact?.id;
}

const MATCH_CTX: RenderContext = { channel: 'telegram', siteUrl: '', contactEmail: '', contactWhatsApp: '' };

function handleText(state: FlowState, rawText: string, ctx: ReduceContext): ReduceResult {
  const text = rawText.replace(/\u0000/g, '').trim();
  const command = matchTextCommand(text);
  if (command === 'back') return handleAction(state, 'nav:back', ctx);
  if (command === 'restart') return handleAction(state, 'nav:restart', ctx);
  if (command === 'language') return handleAction(state, 'nav:lang', ctx);

  if (state.step === 'language' && !state.overlay) {
    const byCode = LOCALES.find((l) => l === text.toLowerCase());
    if (byCode) return handleAction(state, `lang:${byCode}`, ctx);
  }

  const view = render(state, { ...MATCH_CTX, channel: ctx.channel });
  const matched = matchOption(view, text);
  if (matched) return handleAction(state, matched, ctx);

  if (state.overlay) return ok(state, { key: 'pickOption' });

  switch (state.step) {
    case 'description': {
      if (text.length < MIN_DESCRIPTION) return ok(state, { key: 'descriptionTooShort' });
      if (text.length > MAX_DESCRIPTION) return ok(state, { key: 'textTooLong', params: { max: MAX_DESCRIPTION } });
      return ok(goForward({ ...state, description: text }, 'description'));
    }
    case 'budget':
    case 'timeline': {
      if (!text) return ok(state, { key: 'pickOption' });
      if (text.length > MAX_SHORT_TEXT) return ok(state, { key: 'textTooLong', params: { max: MAX_SHORT_TEXT } });
      return ok(goForward({ ...state, [state.step]: text }, state.step));
    }
    case 'attachments': {
      const urls = text.match(URL_RE) ?? [];
      if (urls.length === 0) return ok(state, { key: 'filesHint' });
      const attachments = [...state.attachments];
      for (const url of urls) {
        if (attachments.length >= MAX_ATTACHMENTS) return ok({ ...state, attachments }, { key: 'fileTooMany', params: { max: MAX_ATTACHMENTS } });
        if (!attachments.some((a) => a.id === url)) attachments.push({ id: url, kind: 'link', channel: ctx.channel });
      }
      return ok({ ...state, attachments }, { key: 'fileSaved', params: { count: attachments.length, max: MAX_ATTACHMENTS } });
    }
    case 'contactName': {
      if (!text || text.length > MAX_NAME) return ok(state, { key: 'nameInvalid' });
      return ok(goForward({ ...state, contactName: text }, 'contactName'));
    }
    case 'contactDetail': {
      if (!isValidContact(text)) return ok(state, { key: 'contactInvalid' });
      return ok(goForward({ ...state, contactDetail: text }, 'contactDetail'));
    }
    case 'submitted':
      return ok(state);
    default:
      return ok(state, { key: 'pickOption' });
  }
}

function handleFile(state: FlowState, file: FileCandidate, ctx: ReduceContext): ReduceResult {
  const isVoice = file.kind === 'voice' || file.kind === 'audio';
  const acceptsHere = state.step === 'attachments' || (state.step === 'description' && isVoice);
  if (!acceptsHere || state.overlay) return ok(state, { key: 'filesNotNow' });

  const verdict = validateUpload(file, state.attachments.length);
  if (verdict === 'too_big') return ok(state, { key: 'fileTooBig' });
  if (verdict === 'bad_type') return ok(state, { key: 'fileBadType' });
  if (verdict === 'too_many') return ok(state, { key: 'fileTooMany', params: { max: MAX_ATTACHMENTS } });

  const attachment: Attachment = {
    id: file.id,
    kind: file.kind as AttachmentKind,
    channel: ctx.channel,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    fileName: file.fileName?.slice(0, 120),
  };
  const attachments = state.attachments.some((a) => a.id === file.id) ? state.attachments : [...state.attachments, attachment];

  if (state.step === 'description') {
    // A voice note is a perfectly good project description.
    return ok(goForward({ ...state, attachments, description: '🎤 (voice note — see files)' }, 'description'));
  }
  return ok({ ...state, attachments }, { key: 'fileSaved', params: { count: attachments.length, max: MAX_ATTACHMENTS } });
}

function handleContact(state: FlowState, phone: string): ReduceResult {
  const clean = phone.trim().slice(0, 32);
  const normalized = clean.startsWith('+') ? clean : `+${clean}`;
  const withPhone = { ...state, profile: { ...state.profile, phone: normalized } };
  if (state.step === 'contactDetail' && !state.overlay && isValidContact(normalized)) {
    return ok(goForward({ ...withPhone, contactDetail: normalized }, 'contactDetail'));
  }
  return ok(withPhone);
}

// ---------------------------------------------------------------- lead

export function buildLead(state: FlowState, channel: Channel, now: string): Lead {
  if (!isReadyToSubmit(state)) throw new Error('buildLead called before all required fields were collected');
  return {
    service: state.service!,
    subService: state.subService!,
    location: state.location!,
    description: state.description!,
    budget: state.budget ?? null,
    timeline: state.timeline ?? null,
    name: state.contactName!,
    contact: state.contactDetail!,
    channel,
    language: state.language!,
    attachments: state.attachments,
    source: state.source ?? null,
    deepLink: state.deepLink ?? null,
    firstMessage: state.firstMessage ?? null,
    profile: state.profile,
    timestamp: now,
    stage: 'NEW LEAD',
  };
}

// ---------------------------------------------------------------- render

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Hebrew: isolate user/Latin values so they don't flip the surrounding RTL text. */
function val(locale: Locale, value: string): string {
  const escaped = escapeHtml(value);
  return locale === 'he' ? `⁨${escaped}⁩` : escaped;
}

function action(id: string, label: string, role: 'option' | 'nav' = 'option'): Button {
  return { kind: 'action', id, label, role };
}

function navRow(locale: Locale, opts: { back?: boolean; skip?: boolean } = {}): Button[][] {
  const d = getBotDictionary(locale);
  const rows: Button[][] = [];
  if (opts.skip) rows.push([action('nav:skip', d.skip, 'nav')]);
  const row: Button[] = [];
  if (opts.back !== false) row.push(action('nav:back', d.back, 'nav'));
  row.push(action('nav:lang', d.language, 'nav'));
  row.push(action('nav:restart', d.restart, 'nav'));
  rows.push(row);
  return rows;
}

function attachmentSummary(locale: Locale, attachments: Attachment[]): string {
  if (attachments.length === 0) return getBotDictionary(locale).notSpecified;
  const icons: Record<AttachmentKind, string> = { photo: '📷', video: '🎬', document: '📄', voice: '🎤', audio: '🎵', link: '🔗' };
  const counts = new Map<AttachmentKind, number>();
  for (const a of attachments) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);
  return [...counts.entries()].map(([kind, n]) => `${icons[kind]} ${n}`).join(' · ');
}

export function summaryLines(state: FlowState): string[] {
  const locale = loc(state);
  const d = getBotDictionary(locale);
  const or = (v: string | undefined) => (v ? val(locale, v) : d.notSpecified);
  return [
    `<b>${d.fieldService}:</b> ${or(state.service ? serviceLabel(locale, state.service) : undefined)}`,
    `<b>${d.fieldSubService}:</b> ${or(state.subService ? subServiceLabel(locale, state.service, state.subService) : undefined)}`,
    `<b>${d.fieldLocation}:</b> ${or(state.location ? locationLabel(locale, state.location) : undefined)}`,
    `<b>${d.fieldDescription}:</b> ${or(state.description)}`,
    `<b>${d.fieldBudget}:</b> ${or(state.budget ? budgetLabel(locale, state.budget) : undefined)}`,
    `<b>${d.fieldTimeline}:</b> ${or(state.timeline ? timelineLabel(locale, state.timeline) : undefined)}`,
    `<b>${d.fieldAttachments}:</b> ${attachmentSummary(locale, state.attachments)}`,
    `<b>${d.fieldName}:</b> ${or(state.contactName)}`,
    `<b>${d.fieldContact}:</b> ${or(state.contactDetail)}`,
  ];
}

function fieldLabel(locale: Locale, step: StepId): string {
  const d = getBotDictionary(locale);
  const map: Partial<Record<StepId, string>> = {
    service: d.fieldService,
    subService: d.fieldSubService,
    location: d.fieldLocation,
    description: d.fieldDescription,
    budget: d.fieldBudget,
    timeline: d.fieldTimeline,
    attachments: d.fieldAttachments,
    contactName: d.fieldName,
    contactDetail: d.fieldContact,
  };
  return map[step] ?? step;
}

function photo(ctx: RenderContext, name: string): string | undefined {
  return ctx.photoBaseUrl ? `${ctx.photoBaseUrl}/${name}.jpg` : undefined;
}

function onSiteNote(state: FlowState): string | undefined {
  if (!state.location || !isLocationKey(state.location)) return undefined;
  const a = availability(state.service, state.subService, state.location);
  if (!a.ok) return undefined;
  const locale = loc(state);
  if (a.travelNote) return t(locale, 'travelNote', { location: val(locale, locationLabel(locale, state.location)) });
  if (a.remoteNote) return t(locale, 'remoteNote');
  return undefined;
}

function siteHome(ctx: RenderContext, locale: Locale): string {
  return `${ctx.siteUrl}${locale === 'en' ? '' : `/${locale}`}`;
}

export function render(state: FlowState, ctx: RenderContext, notice?: Notice): View {
  const view = renderBody(state, ctx);
  const locale = view.locale;
  if (notice) view.text = `${t(locale, notice.key, noticeParams(notice, ctx))}\n\n${view.text}`;
  if (locale === 'he') view.text = view.text.split('\n').map((line) => (line ? `‏${line}` : line)).join('\n');
  return view;
}

function noticeParams(notice: Notice, ctx: RenderContext): Record<string, string | number> {
  return { email: ctx.contactEmail, whatsapp: ctx.contactWhatsApp, max: MAX_ATTACHMENTS, ...(notice.params ?? {}) };
}

function renderBody(state: FlowState, ctx: RenderContext): View {
  const locale = loc(state);
  const d = getBotDictionary(locale);
  const base = { step: state.step, overlay: state.overlay, locale, rtl: locale === 'he' };

  // ---- overlays
  if (state.overlay === 'language') {
    return {
      ...base,
      text: d.chooseLanguage,
      rows: [...LOCALES.map((l) => [action(`lang:${l}`, `${l === state.language ? '✓ ' : ''}${LANGUAGE_LABELS[l]}`)]), [action('nav:back', d.back, 'nav')]],
      input: 'choice',
    };
  }
  if (state.overlay === 'resume') {
    return {
      ...base,
      text: d.resumeTitle,
      rows: [[action('resume:continue', d.resumeContinue)], [action('resume:restart', d.resumeRestart)], [action('nav:lang', d.language, 'nav')]],
      input: 'choice',
    };
  }
  if (state.overlay === 'edit') {
    return {
      ...base,
      text: d.editWhich,
      rows: [...EDITABLE_STEPS.map((s) => [action(`edit:${s}`, `✏️ ${fieldLabel(locale, s)}`)]), [action('edit:cancel', d.editCancel, 'nav')], ...navRow(locale, { back: false })],
      input: 'choice',
    };
  }
  if (state.overlay === 'fallback' && state.fallbackLocation && isLocationKey(state.fallbackLocation)) {
    const wanted = state.fallbackLocation;
    const locs = alternativeLocations(state.service, state.subService, wanted);
    const svcs = alternativeServices(state.service, wanted);
    const lines = [t(locale, 'fallbackTitle', { service: val(locale, serviceLabel(locale, state.service)), location: val(locale, locationLabel(locale, wanted)) })];
    if (locs.length) lines.push('', d.fallbackAltLocations);
    if (svcs.length) lines.push('', t(locale, 'fallbackAltServices', { location: val(locale, locationLabel(locale, wanted)) }));
    return {
      ...base,
      text: lines.join('\n'),
      rows: [
        ...locs.map((l) => [action(`loc:${l}`, locationLabel(locale, l))]),
        ...svcs.map((s) => [action(`svc:${s}`, serviceLabel(locale, s))]),
        [action('fb:continue', d.fallbackContinue)],
        ...navRow(locale),
      ],
      input: 'choice',
    };
  }

  // ---- steps
  switch (state.step) {
    case 'language':
      return {
        ...base,
        text: getBotDictionary(locale).chooseLanguage,
        rows: LOCALES.map((l) => [action(`lang:${l}`, LANGUAGE_LABELS[l])]),
        input: 'choice',
      };
    case 'welcome':
      return {
        ...base,
        text: d.welcome,
        photoUrl: photo(ctx, 'welcome'),
        rows: [[action('go:start', d.welcomeCta)], ...navRow(locale)],
        input: 'choice',
      };
    case 'service': {
      const rows: Button[][] = [];
      for (let i = 0; i < SERVICES.length; i += 2) {
        rows.push(SERVICES.slice(i, i + 2).map((s) => action(`svc:${s.key}`, `${state.service === s.key ? '✓ ' : ''}${s.emoji} ${s.label[locale]}`)));
      }
      return { ...base, text: d.askService, rows: [...rows, ...navRow(locale)], input: 'choice' };
    }
    case 'subService': {
      const service = getService(state.service);
      if (!service) return renderBody({ ...state, step: 'service' }, ctx);
      const description = `${service.emoji} <b>${escapeHtml(service.label[locale])}</b>\n${escapeHtml(service.description[locale])}`;
      const subs = getSubServices(service.key);
      return {
        ...base,
        text: t(locale, 'askSubService', { description }),
        photoUrl: photo(ctx, service.key),
        rows: [
          ...subs.map((s) => [action(`sub:${s.key}`, `${state.subService === s.key ? '✓ ' : ''}${s.label[locale]}`)]),
          [{ kind: 'url', url: siteLink(ctx.siteUrl, locale, service.key), label: d.seeExamples }],
          ...navRow(locale),
        ],
        input: 'choice',
      };
    }
    case 'location':
      return {
        ...base,
        text: d.askLocation,
        rows: [
          ...LOCATION_KEYS.map((l) => [action(`loc:${l}`, `${state.location === l ? '✓ ' : ''}${locationLabel(locale, l)}`)]),
          ...navRow(locale),
        ],
        input: 'choice',
      };
    case 'description': {
      const note = onSiteNote(state);
      return { ...base, text: note ? `${note}\n\n${d.askDescription}` : d.askDescription, rows: navRow(locale), input: 'text' };
    }
    case 'budget':
      return {
        ...base,
        text: d.askBudget,
        rows: [
          ...BUDGET_KEYS.map((k) => [action(`bud:${k}`, `${state.budget === k ? '✓ ' : ''}${budgetLabel(locale, k)}`)]),
          ...navRow(locale, { skip: true }),
        ],
        input: 'text',
      };
    case 'timeline':
      return {
        ...base,
        text: d.askTimeline,
        rows: [
          ...TIMELINE_KEYS.map((k) => [action(`tl:${k}`, `${state.timeline === k ? '✓ ' : ''}${timelineLabel(locale, k)}`)]),
          ...navRow(locale, { skip: true }),
        ],
        input: 'text',
      };
    case 'attachments': {
      const count = state.attachments.length;
      const text = t(locale, 'askFiles', { max: MAX_ATTACHMENTS }) + (count ? `\n\n${t(locale, 'filesCount', { count: attachmentSummary(locale, state.attachments) })}` : '');
      return {
        ...base,
        text,
        rows: [[action('files:done', count ? d.filesDone : d.filesSkip)], ...navRow(locale)],
        input: 'files',
      };
    }
    case 'contactName': {
      const name = state.profile.displayName?.slice(0, MAX_NAME);
      return {
        ...base,
        text: d.askName,
        rows: [...(name ? [[action('name:profile', t(locale, 'useName', { name }))]] : []), ...navRow(locale)],
        input: 'text',
      };
    }
    case 'contactDetail': {
      const rows: Button[][] = [];
      if (ctx.channel === 'telegram' && state.profile.telegramUsername) {
        rows.push([action('contact:tg', t(locale, 'useTelegram', { username: state.profile.telegramUsername }))]);
      }
      if (ctx.channel === 'whatsapp' && state.profile.phone) {
        rows.push([action('contact:phone', d.useWhatsApp)]);
      } else if (ctx.channel === 'telegram' && state.profile.phone) {
        rows.push([action('contact:phone', `📱 ${state.profile.phone}`)]);
      }
      return {
        ...base,
        text: d.askContact,
        rows: [...rows, ...navRow(locale)],
        input: 'text',
        requestPhone: ctx.channel === 'telegram',
      };
    }
    case 'review': {
      const lines = [d.reviewTitle, '', ...summaryLines(state)];
      if (state.submitError) lines.push('', t(locale, 'submitFailed', { email: val(locale, ctx.contactEmail), whatsapp: val(locale, ctx.contactWhatsApp) }));
      return {
        ...base,
        text: lines.join('\n'),
        rows: [
          [action(state.submitError ? 'review:retry' : 'review:submit', state.submitError ? d.retry : d.submit)],
          [action('review:edit', d.edit)],
          ...navRow(locale),
        ],
        input: 'choice',
      };
    }
    case 'submitted':
      return {
        ...base,
        text: t(locale, 'handoff', { name: val(locale, state.contactName ?? '') }),
        rows: [
          [{ kind: 'url', url: siteHome(ctx, locale), label: d.visitSite }],
          [action('new', d.newRequest)],
          [action('nav:lang', d.language, 'nav')],
        ],
        input: 'none',
      };
  }
}
