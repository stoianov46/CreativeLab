# IMPROVEMENTS — BroService.in.th

> ТЗ для Claude Code
> Home Services on Koh Phangan — сантехник, электрик, AC, клининг, вода, байки, телефоны, цветы
> Репозиторий: stoianov46/CreativeLab (bro-service project)
> Дата: 22 Sep 2026 | Статус: Живой сайт, нужен апгрейд

---

## 🎯 МИССИЯ

Сделать **профессиональный сервисный сайт** для местных услуг на Кох Панган:
- Быстрый, понятный, конверсионный (WhatsApp/Telegram → заказ)
- Все услуги с подробными лендингами
- 3 языка (EN/RU/TH)
- SEO: каждая страница в топе по своему запросу
- Bro-service: доставка цветов Copang — одна страница в футере

---

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА ДЛЯ КЛОДА

1. **Цвет:** `#e88800` (оранжевый) — не менять.
2. **Конверсия.** CTA (WhatsApp/Telegram) — на каждом экране.
3. **3 языка:** EN (основной), RU, TH.
4. **Никакой CMS, никакой БД** — static-first.
5. **Mobile-first** — 80% клиентов с телефона.

---

## 📋 ЗАДАЧИ

### 🔴 ЗАДАЧА 1: РЕДИЗАЙН — ПРОФЕССИОНАЛЬНЫЙ ЛОКАЛЬНЫЙ СЕРВИС

**Цвета:**
```css
--primary:        #e88800;   /* оранжевый */
--primary-dark:   #c47000;   /* hover */
--dark:           #1a1414;   /* хедер/футер */
--dark2:          #2b2424;   /* тёмные секции */
--bg:             #edeef0;   /* фон */
--white:          #ffffff;
--text:           #1a1a1a;
```

**Новые блоки:**
| Блок | Назначение |
|---|---|
| `HeroService` | Hero с фото услуги + заголовок + CTA |
| `ServiceGrid` | Сетка всех услуг с иконками |
| `HowItWorks` | 3 шага: заявка → приезд → готово |
| `PriceTable` | Цены в карточках |
| `FAQBlock` | Аккордеон + JSON-LD |
| `ContactSticky` | WhatsApp/Telegram плавающая кнопка |
| `AreaCovered` | Зоны обслуживания |
| `ReviewSlider` | Отзывы |

### 🔴 ЗАДАЧА 2: СТРУКТУРА СТРАНИЦ

```
/                                 → Главная
/plumber-koh-phangan/             → Сантехник
/electrician-koh-phangan/         → Электрик
/ac-service-koh-phangan/          → AC / кондиционеры
/cleaning-koh-phangan/            → Клининг
/water-delivery-koh-phangan/      → Доставка воды
/bike-service-koh-phangan/        → Ремонт байков
/phone-tech-repair-koh-phangan/   → Ремонт телефонов
/handyman-koh-phangan/            → Мастер на час
/flower-delivery-copang/          → 🟡 Доставка цветов Copang (футер, не в меню)
/faq/                             → FAQ
/contact/                         → Контакты
```

**Каждая страница услуги:**
- [ ] H1: `"{Service} on Koh Phangan | BroService"`
- [ ] SEO title (50-60 chars) + meta description (140-160 chars)
- [ ] Direct Answer 50-80 слов
- [ ] Цены, зоны, FAQ, CTA
- [ ] JSON-LD: `LocalBusiness` + `FAQPage`
- [ ] hreflang (EN/RU/TH)

### 🟡 ЗАДАЧА 3: ДОСТАВКА ЦВЕТОВ COPANG (BRO-SERVICE)

**URL:** `/{lang}/flower-delivery-copang/`
**Не в главном меню!** Только ссылка в футере. Индексируется.

- [ ] H1: `"Flower Delivery on Koh Phangan — Copang"`
- [ ] SEO title: `"Flower Delivery Koh Phangan | Copang — Fresh Flowers"`
- [ ] Description: про доставку цветов по всему острову
- [ ] Direct Answer 50-80 слов
- [ ] H2-секции: ассортимент, зоны (Thong Sala, Haad Rin, Srithanu), цены от 350 THB, FAQ
- [ ] JSON-LD: `LocalBusiness` + `FAQPage`
- [ ] CTA: WhatsApp `wa.me/+66808705704` + Telegram `@BroService_kpg_bot`
- [ ] All 3 языка (EN/RU/TH)
- [ ] Sitemap + hreflang + canonical

### 🟡 ЗАДАЧА 4: 3 ЯЗЫКА

- [ ] EN (есть), RU (дописать), TH (дописать)
- [ ] Language switch working
- [ ] H1/title/description уникальные на каждом языке
- [ ] hreflang + canonical
- [ ] Не машинный перевод

### 🟡 ЗАДАЧА 5: SEO

- [ ] JSON-LD (LocalBusiness, FAQPage, Service, BreadcrumbList)
- [ ] sitemap.xml / robots.txt / llms.txt
- [ ] Canonical + hreflang
- [ ] OG / Twitter карточки
- [ ] Semantic HTML5

### 🔵 ЗАДАЧА 6: ПРОИЗВОДИТЕЛЬНОСТЬ

- [ ] Lighthouse: Perf ≥ 90, SEO 100, A11y ≥ 90
- [ ] LCP ≤ 2.5s, CLS ≤ 0.1
- [ ] WebP/AVIF, lazy load
- [ ] Mobile-first, 320-1920px

---

## ✅ ЧТО УЖЕ РАБОТАЕТ

- ✅ Живой сайт на Cloudflare: 200 OK
- ✅ 6 услуг в меню + футере
- ✅ Telegram бот @BroService_kpg_bot
- ✅ WhatsApp + Telegram + LINE + FB + IG в футере
- ✅ Базовый языковой переключатель
- ✅ Фирменный оранжевый `#e88800`

---

## 📐 ТЕХСТЕК

- Static HTML (Astro / Vite / чистый HTML)
- Cloudflare / GitHub Pages
- 3 языка: EN/RU/TH
- JSON-LD, sitemap, robots, llms.txt
- Без CMS, без БД
