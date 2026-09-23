export type Locale = 'en' | 'ru' | 'th' | 'he';

export const LOCALES: Locale[] = ['en', 'ru', 'th', 'he'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value);
}

export type Channel = 'telegram' | 'whatsapp';

/**
 * Funnel order (proposal.md "15. BOT" + TELEGRAM БОТЫ flow):
 * language → welcome → service → subService (project type) → location →
 * description → budget(opt) → timeline(opt) → attachments(opt) →
 * contactName → contactDetail → review → submitted (handoff).
 */
export type StepId =
  | 'language'
  | 'welcome'
  | 'service'
  | 'subService'
  | 'location'
  | 'description'
  | 'budget'
  | 'timeline'
  | 'attachments'
  | 'contactName'
  | 'contactDetail'
  | 'review'
  | 'submitted';

export const STEP_ORDER: StepId[] = [
  'language',
  'welcome',
  'service',
  'subService',
  'location',
  'description',
  'budget',
  'timeline',
  'attachments',
  'contactName',
  'contactDetail',
  'review',
  'submitted',
];

export type AttachmentKind = 'photo' | 'document' | 'voice' | 'audio' | 'video' | 'link';

export interface Attachment {
  /** Provider-native file id (Telegram file_id, WhatsApp media id) or a URL for kind=link — never raw bytes. */
  id: string;
  kind: AttachmentKind;
  channel: Channel;
  mimeType?: string;
  sizeBytes?: number;
  fileName?: string;
}

/** What the channel knows about the user — offered as one-tap answers on the contact steps. */
export interface UserProfile {
  displayName?: string;
  /** Telegram @username (without the @). */
  telegramUsername?: string;
  telegramUserId?: number;
  /** E.164-ish phone (WhatsApp wa_id or a phone shared via Telegram's contact button). */
  phone?: string;
}

/** A temporary screen layered over the current step; closing it returns to the step untouched. */
export type Overlay = 'language' | 'resume' | 'edit' | 'fallback';

export interface FlowState {
  step: StepId;
  overlay?: Overlay;
  language?: Locale;
  service?: string;
  subService?: string;
  location?: string;
  /** Location the user picked where the service isn't offered — drives the smart-fallback overlay. */
  fallbackLocation?: string;
  description?: string;
  budget?: string;
  timeline?: string;
  attachments: Attachment[];
  contactName?: string;
  contactDetail?: string;
  profile: UserProfile;
  /** Steps prefilled from a deep link — skipped once on the way forward (Back still reaches them). */
  skipOnce: StepId[];
  /** True while editing a single field from the review screen. */
  returnToReview?: boolean;
  /** Set when the last notifyStaff call failed — review shows the honest error + fallbacks + retry. */
  submitError?: boolean;
  /** `u_` part of the deep link (utm_source / campaign), if any. */
  source?: string;
  /** The raw deep-link payload, kept for attribution. */
  deepLink?: string;
  /** WhatsApp only: the pre-filled opening message (with the [ref:…] token stripped). */
  firstMessage?: string;
  startedAt: string;
  updatedAt: string;
  submittedAt?: string;
}

/**
 * Submitted payload — proposal.md §15 BOT field list: service, sub-service
 * (project_type), location, description, budget, timeline, name, contact,
 * channel, language, attachments, source/campaign, timestamp — plus the CRM
 * entry stage.
 */
export interface Lead {
  service: string;
  subService: string;
  location: string;
  description: string;
  budget: string | null;
  timeline: string | null;
  name: string;
  contact: string;
  channel: Channel;
  language: Locale;
  attachments: Attachment[];
  source: string | null;
  deepLink: string | null;
  firstMessage: string | null;
  profile: UserProfile;
  timestamp: string;
  stage: 'NEW LEAD';
}
