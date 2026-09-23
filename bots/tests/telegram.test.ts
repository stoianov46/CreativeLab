import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileFromMessage } from '../telegram/bot.js';

type Msg = Parameters<typeof fileFromMessage>[0];

test('maps Telegram media to upload candidates using Telegram file_size', () => {
  const photo = fileFromMessage({ photo: [{ file_id: 's', file_size: 10 }, { file_id: 'L', file_size: 999 }] } as unknown as Msg);
  assert.deepEqual(photo, { id: 'L', kind: 'photo', mimeType: 'image/jpeg', sizeBytes: 999 });
  const doc = fileFromMessage({ document: { file_id: 'd', mime_type: 'application/pdf', file_size: 5, file_name: 'a.pdf' } } as unknown as Msg);
  assert.equal(doc?.kind, 'document'); assert.equal(doc?.fileName, 'a.pdf');
  assert.equal(fileFromMessage({ voice: { file_id: 'v', file_size: 1 } } as unknown as Msg)?.kind, 'voice');
  assert.equal(fileFromMessage({ sticker: { file_id: 'st' } } as unknown as Msg)?.kind, 'unsupported');
  assert.equal(fileFromMessage({ location: {} } as unknown as Msg), undefined);
});
