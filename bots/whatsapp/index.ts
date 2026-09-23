import 'dotenv/config';
import { createWhatsAppApp } from './webhook.js';
import { downloadMedia } from './graph-api.js';
import { createSessionStore } from '../shared/session-store.js';
import { notifyStaff } from '../shared/notify.js';
import { whatsAppPort } from '../shared/config.js';

const requiredEnv = ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VERIFY_TOKEN', 'WHATSAPP_APP_SECRET'];
const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  console.error(`[whatsapp] Missing required env vars: ${missing.join(', ')} — see bots/.env.example.`);
  process.exit(1);
}

const app = createWhatsAppApp({
  appSecret: process.env.WHATSAPP_APP_SECRET!.trim(),
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN!.trim(),
  store: createSessionStore(),
  notify: (lead) =>
    notifyStaff(lead, {
      downloadMedia: async (a) => {
        const media = await downloadMedia(a.id);
        const ext = media.mimeType.split('/')[1]?.split(';')[0] ?? 'bin';
        return { ...media, fileName: a.fileName ?? `whatsapp-${a.kind}.${ext}` };
      },
    }),
});

const port = whatsAppPort();
app.listen(port, () => {
  console.log(`[whatsapp] Webhook listening on :${port} (GET/POST /webhook).`);
});
