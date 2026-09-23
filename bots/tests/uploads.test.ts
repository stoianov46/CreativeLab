import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateUpload } from '../shared/flow.js';
import { MAX_ATTACHMENTS, MAX_UPLOAD_BYTES } from '../shared/config.js';
import { act, step, text } from './helpers.js';
import type { FlowState } from '../shared/types.js';

function atAttachments(): FlowState {
  let s = step(undefined, { type: 'start' }).state;
  s = act(s, 'lang:en'); s = act(s, 'go:start'); s = act(s, 'svc:photography'); s = act(s, 'sub:real-estate'); s = act(s, 'loc:koh-phangan');
  s = text(s, 'Listing photos for a condo'); s = act(s, 'nav:skip'); s = act(s, 'nav:skip');
  assert.equal(s.step, 'attachments');
  return s;
}

test('validateUpload: size, type, count', () => {
  assert.equal(validateUpload({ id: 'a', kind: 'photo', sizeBytes: MAX_UPLOAD_BYTES }, 0), 'ok');
  assert.equal(validateUpload({ id: 'a', kind: 'photo', sizeBytes: MAX_UPLOAD_BYTES + 1 }, 0), 'too_big');
  assert.equal(validateUpload({ id: 'a', kind: 'voice' }, 0), 'ok');
  assert.equal(validateUpload({ id: 'a', kind: 'document', mimeType: 'application/pdf', fileName: 'plan.pdf' }, 0), 'ok');
  assert.equal(validateUpload({ id: 'a', kind: 'document', mimeType: 'application/octet-stream', fileName: 'site.dwg' }, 0), 'ok');
  assert.equal(validateUpload({ id: 'a', kind: 'document', mimeType: 'application/x-msdownload', fileName: 'setup.exe' }, 0), 'bad_type');
  assert.equal(validateUpload({ id: 'a', kind: 'unsupported' }, 0), 'bad_type');
  assert.equal(validateUpload({ id: 'a', kind: 'photo' }, MAX_ATTACHMENTS), 'too_many');
});

test('multiple photos/docs/voice notes/links are collected; rejects give friendly notices', () => {
  let s = atAttachments();
  s = step(s, { type: 'file', file: { id: 'p1', kind: 'photo', sizeBytes: 500_000 } }).state;
  s = step(s, { type: 'file', file: { id: 'p2', kind: 'photo', sizeBytes: 700_000 } }).state;
  s = step(s, { type: 'file', file: { id: 'd1', kind: 'document', mimeType: 'application/pdf', fileName: 'floorplan.pdf', sizeBytes: 3_000_000 } }).state;
  s = step(s, { type: 'file', file: { id: 'v1', kind: 'voice', mimeType: 'audio/ogg', sizeBytes: 90_000 } }).state;
  let r = step(s, { type: 'text', text: 'see https://drive.google.com/abc and https://instagram.com/villa' });
  assert.equal(r.notice?.key, 'fileSaved'); s = r.state;
  assert.equal(s.attachments.length, 6);
  assert.deepEqual(s.attachments.map((a) => a.kind), ['photo', 'photo', 'document', 'voice', 'link', 'link']);
  r = step(s, { type: 'file', file: { id: 'big', kind: 'video', sizeBytes: 50 * 1024 * 1024 } });
  assert.equal(r.notice?.key, 'fileTooBig'); assert.equal(r.state.attachments.length, 6);
  r = step(s, { type: 'file', file: { id: 'exe', kind: 'document', mimeType: 'application/x-msdownload', fileName: 'x.exe' } });
  assert.equal(r.notice?.key, 'fileBadType');
  r = step(s, { type: 'uploadFailed' });
  assert.equal(r.notice?.key, 'fileFailed'); assert.equal(r.state.step, 'attachments');
  r = step(s, { type: 'text', text: 'no link here' });
  assert.equal(r.notice?.key, 'filesHint');
  for (let i = 0; i < 10; i++) s = step(s, { type: 'file', file: { id: `more${i}`, kind: 'photo' } }).state;
  assert.equal(s.attachments.length, MAX_ATTACHMENTS);
  r = step(s, { type: 'file', file: { id: 'overflow', kind: 'photo' } });
  assert.equal(r.notice?.key, 'fileTooMany');
  // Back from attachments works and keeps files
  const back = act(s, 'nav:back'); assert.equal(back.step, 'timeline'); assert.equal(back.attachments.length, MAX_ATTACHMENTS);
  s = act(s, 'files:done'); assert.equal(s.step, 'contactName');
});

test('a voice note is accepted as the project description', () => {
  let s = atAttachments();
  s = act(s, 'nav:back'); s = act(s, 'nav:back'); s = act(s, 'nav:back');
  assert.equal(s.step, 'description');
  s = step(s, { type: 'file', file: { id: 'voice1', kind: 'voice', sizeBytes: 100_000 } }).state;
  assert.equal(s.step, 'budget'); assert.equal(s.attachments.at(-1)?.id, 'voice1'); assert.ok(s.description);
});
