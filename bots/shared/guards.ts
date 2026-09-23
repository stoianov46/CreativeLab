/**
 * Small runtime guards shared by both adapters:
 *  - RateLimiter: per-user sliding window (RATE_LIMIT_MAX per RATE_LIMIT_WINDOW_MS).
 *  - KeyedQueue: runs one handler at a time per user, so double taps and
 *    bursts (e.g. an album of 10 photos) never race on the session.
 *  - redact(): short, non-reversible id for logs — never log names/phones.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { rateLimitMax, rateLimitWindowMs } from './config.js';

export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number = rateLimitMax(),
    private readonly windowMs: number = rateLimitWindowMs(),
    private readonly clock: () => number = Date.now
  ) {}

  /** Records a hit; returns false when the user is over the limit. */
  allow(key: string): boolean {
    const now = this.clock();
    const recent = (this.hits.get(key) ?? []).filter((ts) => now - ts < this.windowMs);
    const allowed = recent.length < this.max;
    if (allowed) recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 10_000) this.sweep(now);
    return allowed;
  }

  private sweep(now: number): void {
    for (const [key, list] of this.hits) {
      if (list.every((ts) => now - ts >= this.windowMs)) this.hits.delete(key);
    }
  }
}

export class KeyedQueue {
  private tails = new Map<string, Promise<unknown>>();

  run<T>(key: string, task: () => Promise<T>): Promise<T> {
    const prev = this.tails.get(key) ?? Promise.resolve();
    const next = prev.catch(() => undefined).then(task);
    this.tails.set(key, next);
    void next.finally(() => {
      if (this.tails.get(key) === next) this.tails.delete(key);
    }).catch(() => undefined);
    return next;
  }
}

export function redact(id: string | number): string {
  return createHash('sha256').update(String(id)).digest('hex').slice(0, 10);
}

/** Constant-time string comparison (webhook secrets, signatures). */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}
