// Stand-in for src/assets/images when scripts/i18n.mjs loads the content
// files under plain Node (which can't import .jpg). Only needs to look
// like a StaticImageData so localize.ts skips it.
const stub = (name: string) => ({ src: name, width: 1, height: 1 });
export const images = new Proxy({}, { get: (_target, key) => stub(String(key)) }) as Record<string, ReturnType<typeof stub>>;
