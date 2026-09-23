import { createHmac } from 'node:crypto';
import { safeEqual } from '../shared/guards.js';

/**
 * Verifies Meta's `X-Hub-Signature-256: sha256=<hex>` header — HMAC-SHA256 of
 * the RAW request body keyed with the app secret, compared in constant time.
 */
export function verifyMetaSignature(rawBody: Buffer, header: string | undefined, appSecret: string): boolean {
  if (!header || !appSecret) return false;
  const match = /^sha256=([a-f0-9]{64})$/i.exec(header.trim());
  if (!match) return false;
  const expected = createHmac('sha256', appSecret).update(rawBody).digest('hex');
  return safeEqual(expected, match[1].toLowerCase());
}

export function signBody(rawBody: Buffer | string, appSecret: string): string {
  return `sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
}
