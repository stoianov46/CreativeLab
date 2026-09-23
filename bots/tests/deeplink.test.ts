import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDeepLink, extractWhatsAppRef, parseDeepLink } from '../shared/deeplink.js';
import { SERVICE_KEYS, LOCATION_KEYS } from '../shared/data.js';

test('parses full and partial payloads in any order', () => {
  assert.deepEqual(parseDeepLink('s_web__l_koh-tao__u_fb-ads'), { raw: 's_web__l_koh-tao__u_fb-ads', service: 'web', location: 'koh-tao', source: 'fb-ads' });
  assert.deepEqual(parseDeepLink('l_koh-samui'), { raw: 'l_koh-samui', location: 'koh-samui' });
  assert.deepEqual(parseDeepLink('u_instagram__s_seo'), { raw: 'u_instagram__s_seo', service: 'seo', source: 'instagram' });
  assert.equal(parseDeepLink('s_social-media').service, 'social-media');
});

test('round-trips every service × location', () => {
  for (const service of SERVICE_KEYS)
    for (const location of LOCATION_KEYS) {
      const payload = buildDeepLink({ service, location, source: 'site' });
      assert.ok(payload.length <= 64 && /^[A-Za-z0-9_-]+$/.test(payload));
      assert.deepEqual(parseDeepLink(payload), { raw: payload, service, location, source: 'site' });
    }
});

test('ignores invalid input safely', () => {
  assert.deepEqual(parseDeepLink(undefined), {});
  assert.deepEqual(parseDeepLink(''), {});
  assert.deepEqual(parseDeepLink('x'.repeat(65)), {});
  assert.deepEqual(parseDeepLink('s_web; drop table'), {});
  assert.deepEqual(parseDeepLink('s_unknown__l_bali'), { raw: 's_unknown__l_bali' });
  assert.deepEqual(parseDeepLink('<script>'), {});
});

test('legacy service_<hub-slug> links still work', () => {
  assert.equal(parseDeepLink('service_websites-digital').service, 'web');
  assert.equal(parseDeepLink('service_villas-real-estate').service, 'photography');
  assert.equal(parseDeepLink('s_video-production').service, 'video');
});

test('extracts the WhatsApp [ref:…] token from a pre-filled message', () => {
  const r = extractWhatsAppRef('Hi! I would like photos of my villa [ref:s_photography__l_koh-phangan__u_site]');
  assert.equal(r.text, 'Hi! I would like photos of my villa');
  assert.equal(r.link.service, 'photography'); assert.equal(r.link.location, 'koh-phangan'); assert.equal(r.link.source, 'site');
  assert.deepEqual(extractWhatsAppRef('just hello').link, {});
  assert.deepEqual(extractWhatsAppRef('bad [ref:<x>]').link, {});
});
