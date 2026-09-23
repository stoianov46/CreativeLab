/**
 * Bot catalog — the 8 CreativeLAB services from proposal.md (TELEGRAM БОТЫ →
 * Услуги: Advertising, Social Media, Photography, Video, Branding, Web, SEO,
 * Digital), each with sub-services that exist as pages on the website
 * (`src/content/hubs/*.ts` → `services[].slug`). `sitePath` points at that
 * real page so the bot can link to examples ("portfolio preview").
 *
 * Service/location keys are a PUBLIC CONTRACT — they appear in website deep
 * links (`s_<service>__l_<location>`, see shared/deeplink.ts). Don't rename.
 *
 * Availability is data-driven: `unavailableIn` lists locations where a
 * service/sub-service is NOT offered (drives the smart fallback). Today
 * every service is offered on all three islands, so it's empty everywhere.
 * On-site work (shoots, drone, virtual tours) outside Koh Phangan — the home
 * base — gets a "travel fee may apply" note. No prices are invented here.
 */
import type { Locale } from './types.js';

export type L10n = Record<Locale, string>;

export const SERVICE_KEYS = ['advertising', 'social-media', 'photography', 'video', 'branding', 'web', 'seo', 'digital'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const ISLAND_KEYS = ['koh-phangan', 'koh-samui', 'koh-tao'] as const;
export const LOCATION_KEYS = [...ISLAND_KEYS, 'other'] as const;
export type LocationKey = (typeof LOCATION_KEYS)[number];

export const HOME_BASE: LocationKey = 'koh-phangan';
/** Islands where on-site work may carry a travel fee (amount is quoted by staff, never by the bot). */
export const TRAVEL_FEE_LOCATIONS: LocationKey[] = ['koh-samui', 'koh-tao'];
/** Closest islands first — used to suggest an alternative when a service isn't offered somewhere. */
export const NEAREST_LOCATIONS: Record<LocationKey, LocationKey[]> = {
  'koh-phangan': ['koh-samui', 'koh-tao'],
  'koh-samui': ['koh-phangan', 'koh-tao'],
  'koh-tao': ['koh-phangan', 'koh-samui'],
  other: ['koh-phangan', 'koh-samui', 'koh-tao'],
};

export interface SubService {
  key: string;
  label: L10n;
  /** Path of the matching website page (without locale prefix). */
  sitePath?: string;
  /** Requires the team on location (shoot, drone, tour). */
  onSite?: boolean;
  unavailableIn?: LocationKey[];
}

export interface Service {
  key: ServiceKey;
  emoji: string;
  label: L10n;
  description: L10n;
  /** Hub page on the website. */
  sitePath: string;
  subServices: SubService[];
  unavailableIn?: LocationKey[];
  /** Similar services to suggest when this one isn't available in a location. */
  alternatives: ServiceKey[];
}

/** Always appended to every service's sub-service list, so nobody gets stuck on "none of these fit". */
export const OTHER_SUB_SERVICE: SubService = {
  key: 'other',
  label: {
    en: '🤔 Something else / not sure',
    ru: '🤔 Другое / пока не знаю',
    th: '🤔 อย่างอื่น / ยังไม่แน่ใจ',
    he: '🤔 משהו אחר / עוד לא בטוחים',
  },
};

export const SERVICES: Service[] = [
  {
    key: 'advertising',
    emoji: '📣',
    label: { en: 'Advertising', ru: 'Реклама', th: 'โฆษณา', he: 'פרסום' },
    description: {
      en: 'Paid campaigns that bring real enquiries — Google Ads and Meta Ads set up, launched and optimised by the team that also shoots your creative.',
      ru: 'Платные кампании, которые приводят реальные заявки: Google Ads и Meta Ads — настройка, запуск и оптимизация командой, которая сама снимает ваш креатив.',
      th: 'แคมเปญโฆษณาที่สร้างลูกค้าจริง ตั้งค่า เปิดตัว และปรับแต่ง Google Ads และ Meta Ads โดยทีมเดียวกับที่ถ่ายทำครีเอทีฟให้คุณ',
      he: 'קמפיינים ממומנים שמביאים פניות אמיתיות: Google Ads ו-Meta Ads — הקמה, השקה ואופטימיזציה על ידי הצוות שגם מצלם את הקריאייטיב.',
    },
    sitePath: '/advertising',
    alternatives: ['social-media', 'seo'],
    subServices: [
      { key: 'google-ads', sitePath: '/advertising/google-ads', label: { en: 'Google Ads', ru: 'Google Ads', th: 'Google Ads', he: 'Google Ads' } },
      { key: 'meta-ads', sitePath: '/advertising/meta-ads', label: { en: 'Meta Ads (Instagram / Facebook)', ru: 'Meta Ads (Instagram / Facebook)', th: 'Meta Ads (Instagram / Facebook)', he: 'Meta Ads (Instagram / Facebook)' } },
      { key: 'campaign-launch', sitePath: '/advertising/campaign-launch', label: { en: 'Campaign launch', ru: 'Запуск кампании', th: 'เปิดตัวแคมเปญ', he: 'השקת קמפיין' } },
      { key: 'performance', sitePath: '/advertising/performance', label: { en: 'Performance marketing', ru: 'Performance-маркетинг', th: 'การตลาดแบบวัดผล (Performance)', he: 'שיווק ביצועים' } },
    ],
  },
  {
    key: 'social-media',
    emoji: '📱',
    label: { en: 'Social Media', ru: 'Соцсети', th: 'โซเชียลมีเดีย', he: 'רשתות חברתיות' },
    description: {
      en: 'Instagram that feels alive: content shot on the island, Reels, influencer collaborations and monthly management.',
      ru: 'Живой Instagram: контент, снятый на острове, Reels, коллаборации с инфлюенсерами и ежемесячное ведение.',
      th: 'Instagram ที่มีชีวิตชีวา คอนเทนต์ถ่ายบนเกาะ Reels การร่วมงานกับอินฟลูเอนเซอร์ และการดูแลรายเดือน',
      he: 'אינסטגרם שמרגיש חי: תוכן שמצולם על האי, רילס, שיתופי פעולה עם משפיענים וניהול חודשי.',
    },
    sitePath: '/social-media',
    alternatives: ['video', 'advertising'],
    subServices: [
      { key: 'instagram-management', sitePath: '/social-media/instagram-management', label: { en: 'Instagram management', ru: 'Ведение Instagram', th: 'ดูแล Instagram', he: 'ניהול אינסטגרם' } },
      { key: 'content-creation', sitePath: '/social-media/content-creation', onSite: true, label: { en: 'Content creation', ru: 'Создание контента', th: 'สร้างคอนเทนต์', he: 'יצירת תוכן' } },
      { key: 'reels', sitePath: '/social-media/reels', onSite: true, label: { en: 'Reels', ru: 'Reels', th: 'Reels', he: 'רילס' } },
      { key: 'influencer-marketing', sitePath: '/social-media/influencer-marketing', label: { en: 'Influencer marketing', ru: 'Работа с инфлюенсерами', th: 'การตลาดผ่านอินฟลูเอนเซอร์', he: 'שיווק משפיענים' } },
      { key: 'monthly-packages', sitePath: '/social-media/monthly-packages', label: { en: 'Monthly package', ru: 'Ежемесячный пакет', th: 'แพ็กเกจรายเดือน', he: 'חבילה חודשית' } },
    ],
  },
  {
    key: 'photography',
    emoji: '📸',
    label: { en: 'Photography', ru: 'Фотосъёмка', th: 'ถ่ายภาพ', he: 'צילום' },
    description: {
      en: 'Villas, real estate, architecture and food — photographed in the best island light, plus drone and FPV from above.',
      ru: 'Виллы, недвижимость, архитектура и еда — снятые в лучшем островном свете, плюс съёмка с дрона и FPV.',
      th: 'วิลล่า อสังหาริมทรัพย์ สถาปัตยกรรม และอาหาร ถ่ายในแสงที่สวยที่สุดของเกาะ พร้อมมุมสูงจากโดรนและ FPV',
      he: 'וילות, נדל"ן, אדריכלות ואוכל — מצולמים באור הכי יפה של האי, וגם רחפן ו-FPV מלמעלה.',
    },
    sitePath: '/villas-real-estate',
    alternatives: ['video', 'social-media'],
    subServices: [
      { key: 'villa', sitePath: '/villas-real-estate/villa-photography', onSite: true, label: { en: 'Villa photography', ru: 'Съёмка вилл', th: 'ถ่ายภาพวิลล่า', he: 'צילום וילות' } },
      { key: 'real-estate', sitePath: '/villas-real-estate/real-estate-photography', onSite: true, label: { en: 'Real estate', ru: 'Недвижимость', th: 'อสังหาริมทรัพย์', he: 'נדל"ן' } },
      { key: 'architecture', sitePath: '/villas-real-estate/architecture-photography', onSite: true, label: { en: 'Architecture', ru: 'Архитектура', th: 'สถาปัตยกรรม', he: 'אדריכלות' } },
      { key: 'food', sitePath: '/food-restaurants/food-photography', onSite: true, label: { en: 'Food & restaurants', ru: 'Еда и рестораны', th: 'อาหารและร้านอาหาร', he: 'אוכל ומסעדות' } },
      { key: 'menu', sitePath: '/food-restaurants/menu-photography', onSite: true, label: { en: 'Menu photography', ru: 'Фото для меню', th: 'ถ่ายภาพเมนู', he: 'צילום תפריט' } },
      { key: 'drone', sitePath: '/villas-real-estate/drone', onSite: true, label: { en: 'Drone', ru: 'Дрон', th: 'โดรน', he: 'רחפן' } },
      { key: 'fpv', sitePath: '/villas-real-estate/fpv', onSite: true, label: { en: 'FPV drone', ru: 'FPV-дрон', th: 'โดรน FPV', he: 'רחפן FPV' } },
    ],
  },
  {
    key: 'video',
    emoji: '🎬',
    label: { en: 'Video', ru: 'Видео', th: 'วิดีโอ', he: 'וידאו' },
    description: {
      en: 'Commercials, social video and property films — from concept to final edit, including drone and FPV shots.',
      ru: 'Рекламные ролики, видео для соцсетей и фильмы о недвижимости — от идеи до финального монтажа, включая дрон и FPV.',
      th: 'วิดีโอโฆษณา วิดีโอโซเชียล และวิดีโออสังหาริมทรัพย์ ตั้งแต่ไอเดียจนถึงตัดต่อเสร็จ รวมถึงช็อตโดรนและ FPV',
      he: 'סרטוני פרסומת, וידאו לרשתות וסרטי נכסים — מהרעיון ועד העריכה הסופית, כולל צילומי רחפן ו-FPV.',
    },
    sitePath: '/video-production',
    alternatives: ['photography', 'social-media'],
    subServices: [
      { key: 'commercial', sitePath: '/video-production/commercial', onSite: true, label: { en: 'Commercial video', ru: 'Рекламный ролик', th: 'วิดีโอโฆษณา', he: 'סרטון פרסומת' } },
      { key: 'social-video', sitePath: '/video-production/social-video', onSite: true, label: { en: 'Social video', ru: 'Видео для соцсетей', th: 'วิดีโอโซเชียล', he: 'וידאו לרשתות' } },
      { key: 'property-video', sitePath: '/villas-real-estate/property-video', onSite: true, label: { en: 'Property / villa video', ru: 'Видео виллы / объекта', th: 'วิดีโอวิลล่า / อสังหาฯ', he: 'וידאו לנכס / וילה' } },
      { key: 'drone-video', sitePath: '/video-production/drone-video', onSite: true, label: { en: 'Drone video', ru: 'Видео с дрона', th: 'วิดีโอโดรน', he: 'וידאו רחפן' } },
      { key: 'fpv-video', sitePath: '/video-production/fpv-video', onSite: true, label: { en: 'FPV video', ru: 'FPV-видео', th: 'วิดีโอ FPV', he: 'וידאו FPV' } },
    ],
  },
  {
    key: 'branding',
    emoji: '🎨',
    label: { en: 'Branding', ru: 'Брендинг', th: 'สร้างแบรนด์', he: 'מיתוג' },
    description: {
      en: 'A recognisable identity: logo and brand system, graphic design, creative direction and menu design.',
      ru: 'Узнаваемый образ: логотип и фирменный стиль, графический дизайн, креативное направление и дизайн меню.',
      th: 'อัตลักษณ์ที่จดจำได้ โลโก้และระบบแบรนด์ งานกราฟิก การกำหนดทิศทางครีเอทีฟ และออกแบบเมนู',
      he: 'זהות שזוכרים: לוגו ושפה מותגית, עיצוב גרפי, קריאייטיב דיירקשן ועיצוב תפריטים.',
    },
    sitePath: '/branding-creative',
    alternatives: ['web', 'social-media'],
    subServices: [
      { key: 'brand-identity', sitePath: '/branding-creative/branding', label: { en: 'Logo & brand identity', ru: 'Логотип и фирменный стиль', th: 'โลโก้และอัตลักษณ์แบรนด์', he: 'לוגו וזהות מותג' } },
      { key: 'graphic-design', sitePath: '/branding-creative/graphic-design', label: { en: 'Graphic design', ru: 'Графический дизайн', th: 'ออกแบบกราฟิก', he: 'עיצוב גרפי' } },
      { key: 'creative-direction', sitePath: '/branding-creative/creative-direction', label: { en: 'Creative direction', ru: 'Креативное направление', th: 'กำหนดทิศทางครีเอทีฟ', he: 'קריאייטיב דיירקשן' } },
      { key: 'menu-design', sitePath: '/branding-creative/menu-design', label: { en: 'Menu design', ru: 'Дизайн меню', th: 'ออกแบบเมนู', he: 'עיצוב תפריט' } },
    ],
  },
  {
    key: 'web',
    emoji: '💻',
    label: { en: 'Web', ru: 'Сайты', th: 'เว็บไซต์', he: 'אתרים' },
    description: {
      en: 'Fast, beautiful websites that turn visitors into bookings — business sites, landing pages, villa and restaurant sites, e-commerce and redesigns.',
      ru: 'Быстрые и красивые сайты, которые превращают посетителей в заявки: сайты компаний, лендинги, сайты вилл и ресторанов, интернет-магазины и редизайн.',
      th: 'เว็บไซต์ที่เร็วและสวย เปลี่ยนผู้เข้าชมให้เป็นการจอง เว็บไซต์ธุรกิจ แลนดิ้งเพจ เว็บวิลล่าและร้านอาหาร ร้านค้าออนไลน์ และรีดีไซน์',
      he: 'אתרים מהירים ויפים שהופכים גולשים להזמנות: אתרי עסקים, דפי נחיתה, אתרים לווילות ולמסעדות, חנויות אונליין ועיצוב מחדש.',
    },
    sitePath: '/websites-digital',
    alternatives: ['seo', 'branding'],
    subServices: [
      { key: 'web-design', sitePath: '/websites-digital/web-design', label: { en: 'Web design', ru: 'Веб-дизайн', th: 'ออกแบบเว็บไซต์', he: 'עיצוב אתרים' } },
      { key: 'business-website', sitePath: '/websites-digital/business-websites', label: { en: 'Business website', ru: 'Сайт для бизнеса', th: 'เว็บไซต์ธุรกิจ', he: 'אתר לעסק' } },
      { key: 'landing-page', sitePath: '/websites-digital/landing-pages', label: { en: 'Landing page', ru: 'Лендинг', th: 'แลนดิ้งเพจ', he: 'דף נחיתה' } },
      { key: 'restaurant-website', sitePath: '/websites-digital/restaurant-website', label: { en: 'Restaurant website', ru: 'Сайт ресторана', th: 'เว็บไซต์ร้านอาหาร', he: 'אתר למסעדה' } },
      { key: 'villa-website', sitePath: '/websites-digital/villa-website', label: { en: 'Villa website', ru: 'Сайт виллы', th: 'เว็บไซต์วิลล่า', he: 'אתר לווילה' } },
      { key: 'ecommerce', sitePath: '/websites-digital/ecommerce', label: { en: 'E-commerce', ru: 'Интернет-магазин', th: 'ร้านค้าออนไลน์', he: 'חנות אונליין' } },
      { key: 'redesign', sitePath: '/websites-digital/redesign', label: { en: 'Website redesign', ru: 'Редизайн сайта', th: 'รีดีไซน์เว็บไซต์', he: 'עיצוב מחדש לאתר' } },
    ],
  },
  {
    key: 'seo',
    emoji: '🔎',
    label: { en: 'SEO', ru: 'SEO', th: 'SEO', he: 'SEO' },
    description: {
      en: 'Be found when people search: local SEO, Google Business Profile, technical SEO and visibility in AI search.',
      ru: 'Чтобы вас находили в поиске: локальное SEO, профиль в Google Business, техническое SEO и видимость в AI-поиске.',
      th: 'ให้ลูกค้าค้นหาคุณเจอ SEO ท้องถิ่น Google Business Profile SEO เชิงเทคนิค และการมองเห็นใน AI Search',
      he: 'שימצאו אתכם בחיפוש: SEO מקומי, פרופיל Google Business, SEO טכני ונראות בחיפוש מבוסס AI.',
    },
    sitePath: '/business-local-presence',
    alternatives: ['digital', 'web'],
    subServices: [
      { key: 'local-seo', sitePath: '/business-local-presence/local-seo', label: { en: 'Local SEO', ru: 'Локальное SEO', th: 'SEO ท้องถิ่น', he: 'SEO מקומי' } },
      { key: 'google-business-profile', sitePath: '/business-local-presence/google-business-profile', label: { en: 'Google Business Profile', ru: 'Профиль Google Business', th: 'Google Business Profile', he: 'Google Business Profile' } },
      { key: 'technical-seo', sitePath: '/websites-digital/technical-seo', label: { en: 'Technical SEO', ru: 'Техническое SEO', th: 'SEO เชิงเทคนิค', he: 'SEO טכני' } },
      { key: 'ai-search', sitePath: '/websites-digital/ai-search', label: { en: 'AI search / GEO', ru: 'AI-поиск / GEO', th: 'AI Search / GEO', he: 'חיפוש AI / GEO' } },
    ],
  },
  {
    key: 'digital',
    emoji: '⚡',
    label: { en: 'Digital', ru: 'Digital', th: 'ดิจิทัล', he: 'דיגיטל' },
    description: {
      en: 'Your business, visible everywhere online: Google Maps, listings, reviews and reputation, virtual tours and real estate marketing.',
      ru: 'Ваш бизнес заметен онлайн везде: Google Maps, каталоги, отзывы и репутация, виртуальные туры и маркетинг недвижимости.',
      th: 'ให้ธุรกิจของคุณโดดเด่นทุกช่องทางออนไลน์ Google Maps รายชื่อธุรกิจ รีวิวและชื่อเสียง เวอร์ชวลทัวร์ และการตลาดอสังหาริมทรัพย์',
      he: 'העסק שלכם נראה בכל מקום ברשת: Google Maps, אינדקסים, ביקורות ומוניטין, סיורים וירטואליים ושיווק נדל"ן.',
    },
    sitePath: '/business-local-presence',
    alternatives: ['seo', 'web'],
    subServices: [
      { key: 'google-maps', sitePath: '/business-local-presence/google-maps', label: { en: 'Google Maps', ru: 'Google Maps', th: 'Google Maps', he: 'Google Maps' } },
      { key: 'listings', sitePath: '/business-local-presence/listings', label: { en: 'Listings & directories', ru: 'Каталоги и площадки', th: 'รายชื่อธุรกิจและไดเรกทอรี', he: 'אינדקסים ורישומים' } },
      { key: 'reviews-reputation', sitePath: '/business-local-presence/reputation', label: { en: 'Reviews & reputation', ru: 'Отзывы и репутация', th: 'รีวิวและชื่อเสียง', he: 'ביקורות ומוניטין' } },
      { key: 'virtual-tours', sitePath: '/villas-real-estate/virtual-tours', onSite: true, label: { en: 'Virtual tours', ru: 'Виртуальные туры', th: 'เวอร์ชวลทัวร์', he: 'סיורים וירטואליים' } },
      { key: 'real-estate-marketing', sitePath: '/villas-real-estate/marketing', label: { en: 'Real estate marketing', ru: 'Маркетинг недвижимости', th: 'การตลาดอสังหาริมทรัพย์', he: 'שיווק נדל"ן' } },
    ],
  },
];

export const LOCATION_LABELS: Record<LocationKey, L10n> = {
  'koh-phangan': { en: '🏝 Koh Phangan', ru: '🏝 Ко Панган', th: '🏝 เกาะพะงัน', he: '🏝 קו פנגן' },
  'koh-samui': { en: '🌴 Koh Samui', ru: '🌴 Ко Самуи', th: '🌴 เกาะสมุย', he: '🌴 קו סמוי' },
  'koh-tao': { en: '🐢 Koh Tao', ru: '🐢 Ко Тао', th: '🐢 เกาะเต่า', he: '🐢 קו טאו' },
  other: { en: '🌍 Other / remote', ru: '🌍 Другое / удалённо', th: '🌍 ที่อื่น / ทำงานทางไกล', he: '🌍 מקום אחר / מרחוק' },
};

export const BUDGET_KEYS = ['lt-15k', '15k-50k', '50k-150k', '150k-500k', '500k-plus', 'unsure'] as const;
export const BUDGET_LABELS: Record<(typeof BUDGET_KEYS)[number], L10n> = {
  'lt-15k': { en: 'Under ฿15,000', ru: 'До ฿15 000', th: 'ต่ำกว่า 15,000 บาท', he: 'עד 15,000 ฿' },
  '15k-50k': { en: '฿15,000 – 50,000', ru: '฿15 000 – 50 000', th: '15,000 – 50,000 บาท', he: '15,000 – 50,000 ฿' },
  '50k-150k': { en: '฿50,000 – 150,000', ru: '฿50 000 – 150 000', th: '50,000 – 150,000 บาท', he: '50,000 – 150,000 ฿' },
  '150k-500k': { en: '฿150,000 – 500,000', ru: '฿150 000 – 500 000', th: '150,000 – 500,000 บาท', he: '150,000 – 500,000 ฿' },
  '500k-plus': { en: '฿500,000+', ru: 'От ฿500 000', th: '500,000 บาทขึ้นไป', he: '500,000 ฿ ומעלה' },
  unsure: { en: '🤷 Not sure yet', ru: '🤷 Пока не знаю', th: '🤷 ยังไม่แน่ใจ', he: '🤷 עוד לא יודעים' },
};

export const TIMELINE_KEYS = ['asap', 'within-2-weeks', 'within-month', '1-3-months', 'flexible'] as const;
export const TIMELINE_LABELS: Record<(typeof TIMELINE_KEYS)[number], L10n> = {
  asap: { en: '⚡ As soon as possible', ru: '⚡ Как можно скорее', th: '⚡ เร็วที่สุด', he: '⚡ בהקדם האפשרי' },
  'within-2-weeks': { en: 'Within 2 weeks', ru: 'В течение 2 недель', th: 'ภายใน 2 สัปดาห์', he: 'תוך שבועיים' },
  'within-month': { en: 'Within a month', ru: 'В течение месяца', th: 'ภายใน 1 เดือน', he: 'תוך חודש' },
  '1-3-months': { en: 'In 1–3 months', ru: 'Через 1–3 месяца', th: 'ภายใน 1–3 เดือน', he: 'בעוד 1–3 חודשים' },
  flexible: { en: '🌊 Flexible', ru: '🌊 Без спешки', th: '🌊 ยืดหยุ่นได้', he: '🌊 גמיש' },
};

export const LANGUAGE_LABELS: Record<Locale, string> = {
  en: '🇬🇧 English',
  ru: '🇷🇺 Русский',
  th: '🇹🇭 ภาษาไทย',
  he: '🇮🇱 עברית',
};

// ---------- lookups ----------

export function isServiceKey(value: string): value is ServiceKey {
  return (SERVICE_KEYS as readonly string[]).includes(value);
}

export function isLocationKey(value: string): value is LocationKey {
  return (LOCATION_KEYS as readonly string[]).includes(value);
}

export function getService(key: string | undefined): Service | undefined {
  return SERVICES.find((s) => s.key === key);
}

export function getSubServices(serviceKey: string | undefined): SubService[] {
  const service = getService(serviceKey);
  return service ? [...service.subServices, OTHER_SUB_SERVICE] : [];
}

export function getSubService(serviceKey: string | undefined, subKey: string | undefined): SubService | undefined {
  return getSubServices(serviceKey).find((s) => s.key === subKey);
}

export function serviceLabel(locale: Locale, key: string | undefined): string {
  const s = getService(key);
  return s ? `${s.emoji} ${s.label[locale]}` : key ?? '';
}

export function subServiceLabel(locale: Locale, serviceKey: string | undefined, subKey: string | undefined): string {
  return getSubService(serviceKey, subKey)?.label[locale] ?? subKey ?? '';
}

export function locationLabel(locale: Locale, key: string | undefined): string {
  return key && isLocationKey(key) ? LOCATION_LABELS[key][locale] : key ?? '';
}

export function budgetLabel(locale: Locale, key: string | undefined): string {
  return key && key in BUDGET_LABELS ? BUDGET_LABELS[key as keyof typeof BUDGET_LABELS][locale] : key ?? '';
}

export function timelineLabel(locale: Locale, key: string | undefined): string {
  return key && key in TIMELINE_LABELS ? TIMELINE_LABELS[key as keyof typeof TIMELINE_LABELS][locale] : key ?? '';
}

/**
 * Legacy deep links (`?start=service_<hub-slug>`) and hub slugs used on the
 * website map onto the proposal's 8 service keys.
 */
export const SERVICE_ALIASES: Record<string, ServiceKey> = {
  'websites-digital': 'web',
  website: 'web',
  websites: 'web',
  'video-production': 'video',
  'branding-creative': 'branding',
  'villas-real-estate': 'photography',
  'food-restaurants': 'photography',
  'business-local-presence': 'digital',
  social: 'social-media',
  ads: 'advertising',
};

export function resolveServiceKey(raw: string): ServiceKey | undefined {
  const key = raw.toLowerCase();
  if (isServiceKey(key)) return key;
  return SERVICE_ALIASES[key];
}

// ---------- availability (smart fallback) ----------

export type Availability = { ok: true; travelNote: boolean; remoteNote: boolean } | { ok: false };

export function availability(serviceKey: string | undefined, subKey: string | undefined, location: LocationKey): Availability {
  const service = getService(serviceKey);
  if (!service) return { ok: true, travelNote: false, remoteNote: false };
  const sub = getSubService(serviceKey, subKey);
  if (service.unavailableIn?.includes(location) || sub?.unavailableIn?.includes(location)) return { ok: false };
  const onSite = Boolean(sub?.onSite);
  return {
    ok: true,
    travelNote: onSite && TRAVEL_FEE_LOCATIONS.includes(location),
    remoteNote: onSite && location === 'other',
  };
}

/** Closest locations where the chosen service/sub-service IS offered. */
export function alternativeLocations(serviceKey: string | undefined, subKey: string | undefined, location: LocationKey): LocationKey[] {
  return NEAREST_LOCATIONS[location].filter((loc) => availability(serviceKey, subKey, loc).ok);
}

/** Similar services that ARE offered in the given location. */
export function alternativeServices(serviceKey: string | undefined, location: LocationKey): ServiceKey[] {
  const service = getService(serviceKey);
  const candidates = service ? service.alternatives : [];
  return candidates.filter((key) => {
    const s = getService(key);
    return s && !s.unavailableIn?.includes(location);
  });
}

/** Website link for a service/sub-service, in the user's language (EN unprefixed, /ru /th /he). */
export function siteLink(base: string, locale: Locale, serviceKey: string | undefined, subKey?: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const service = getService(serviceKey);
  const path = getSubService(serviceKey, subKey)?.sitePath ?? service?.sitePath ?? '';
  return `${base}${prefix}${path}`;
}
