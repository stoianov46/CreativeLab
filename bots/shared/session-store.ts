/**
 * Session persistence — "left and came back → continue" (proposal: Сохранение
 * прогресса). Two implementations behind one interface:
 *
 *  - MemorySessionStore — tests / throwaway dev runs.
 *  - FileSessionStore   — a small JSON file (SESSION_STORE_PATH, default
 *    ./data/sessions.json). Writes are serialized and atomic (write to a temp
 *    file, then rename), entries expire after SESSION_TTL_DAYS (default 14).
 *
 * The file store is for ONE process. Running several replicas needs a shared
 * store (Redis/KV) implementing the same interface.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { FlowState } from './types.js';
import { sessionStoreKind, sessionStorePath, sessionTtlMs } from './config.js';

export interface SessionStore {
  get(key: string): Promise<FlowState | undefined>;
  set(key: string, state: FlowState): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Entry {
  state: FlowState;
  /** epoch ms of last write — drives the TTL */
  touchedAt: number;
}

export class MemorySessionStore implements SessionStore {
  protected entries = new Map<string, Entry>();

  constructor(
    protected readonly ttlMs: number = sessionTtlMs(),
    protected readonly clock: () => number = Date.now
  ) {}

  async get(key: string): Promise<FlowState | undefined> {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (this.clock() - entry.touchedAt > this.ttlMs) {
      this.entries.delete(key);
      return undefined;
    }
    return structuredClone(entry.state);
  }

  async set(key: string, state: FlowState): Promise<void> {
    this.entries.set(key, { state: structuredClone(state), touchedAt: this.clock() });
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  protected prune(): void {
    const now = this.clock();
    for (const [key, entry] of this.entries) {
      if (now - entry.touchedAt > this.ttlMs) this.entries.delete(key);
    }
  }
}

export class FileSessionStore extends MemorySessionStore {
  private loaded: Promise<void> | undefined;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(
    private readonly path: string = sessionStorePath(),
    ttlMs?: number,
    clock?: () => number
  ) {
    super(ttlMs, clock);
  }

  private load(): Promise<void> {
    this.loaded ??= (async () => {
      try {
        const raw = await readFile(this.path, 'utf8');
        const data = JSON.parse(raw) as Record<string, Entry>;
        for (const [key, entry] of Object.entries(data)) {
          if (entry && typeof entry.touchedAt === 'number' && entry.state) this.entries.set(key, entry);
        }
        this.prune();
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.error(`[sessions] Could not read ${this.path} — starting with an empty store.`, (err as Error).message);
        }
      }
    })();
    return this.loaded;
  }

  private persist(): Promise<void> {
    this.writeChain = this.writeChain
      .then(async () => {
        this.prune();
        await mkdir(dirname(this.path), { recursive: true });
        const tmp = `${this.path}.${process.pid}.tmp`;
        await writeFile(tmp, JSON.stringify(Object.fromEntries(this.entries)), { mode: 0o600 });
        await rename(tmp, this.path);
      })
      .catch((err) => {
        console.error('[sessions] Failed to persist sessions', (err as Error).message);
      });
    return this.writeChain;
  }

  override async get(key: string): Promise<FlowState | undefined> {
    await this.load();
    return super.get(key);
  }

  override async set(key: string, state: FlowState): Promise<void> {
    await this.load();
    await super.set(key, state);
    await this.persist();
  }

  override async delete(key: string): Promise<void> {
    await this.load();
    await super.delete(key);
    await this.persist();
  }
}

export function createSessionStore(): SessionStore {
  return sessionStoreKind() === 'memory' ? new MemorySessionStore() : new FileSessionStore();
}
