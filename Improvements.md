# Improvements — CreativeLAB.in.th

Список правок/улучшений, которые нужно реализовать. На основе PROGRESS.md.

**Легенда статуса:** ✅ сделано · 🚫 заблокировано (нужен внешний ввод — клиент/креды/деплой) · ❓ нужно решение перед реализацией

## 🔴 Обязательно перед запуском

### 1. Контактные данные
- [x] ✅ **Email** — `karma8chakra@gmail.com` — предоставлен командой 15.09, заменил старый `[[VERIFY]]`-плейсхолдер. Считаем реальным, если не скажут иное.
- [x] ✅ **Телефон** — `+66 80 870 5704` — предоставлен командой 15.09 (заменил фейковый `+66-00-000-0000`)
- [ ] 🚫 **Telegram bot handle** — `@creativelab1_bot` указан в `site.ts`, но **не подтверждён**: установлен в том же коммите, что и фейковый номер телефона-заглушка, и с тех пор не пересматривался (в отличие от телефона/WhatsApp, которые позже поправили на реальные). `BotEntry`/`NEXT_PUBLIC_TELEGRAM_BOT` намеренно НЕ подключены к этому значению, пока не подтверждено, что это реальный работающий бот — см. `PROGRESS.md`
- [x] ✅ **WhatsApp number** — `+66 80 870 5704` (тот же номер, что и телефон) — предоставлен командой. `NEXT_PUBLIC_WHATSAPP_NUMBER` пока не подключён к нему по той же причине осторожности, что и с Telegram (см. выше) — можно подключить, как только подтвердят, что WhatsApp Business на этот номер отвечает
- [ ] 🚫 **Физический адрес** — всё ещё отсутствует
- [ ] 🚫 **Юридическое лицо** — `legalName: "CreativeLAB Koh Phangan"` похоже на рабочее название, не проверенные юридические реквизиты

### 2. Реальный контент
- [ ] 🚫 Настоящие проекты / кейсы для портфолио — нужны от клиента
- [ ] 🚫 Настоящие отзывы клиентов (testimonials) — нужны от клиента
- [ ] 🚫 Настоящие фото/видео работ — нужны от клиента
- [ ] 🚫 Настоящие кейс-стадис (сейчас "first case studies in progress") — нужны от клиента
- [ ] 🚫 Статьи в Journal (сейчас "first articles on the way") — нужны от клиента
- [ ] 🚫 **Цены** — нужно подтверждение от клиента

### 3. Юридические данные (нужен юрист!)
- [ ] 🚫 Privacy Policy — нужен реальный текст от юриста (Thai law)
- [ ] 🚫 Terms — нужен реальный текст от юриста

### 4. Боты (Telegram + WhatsApp)
- [x] ✅ Код бота (`bots/`) написан и типизирован — общая логика для Telegram (grammY) и WhatsApp (Cloud API), см. `bots/README.md`
- [ ] 🚫 Telegram bot token (получить у @BotFather) — нужен реальный токен от владельца бота
- [ ] 🚫 WhatsApp Cloud API аккаунт + webhook — нужен реальный аккаунт
- [ ] 🚫 Развернуть ботов на сервере с публичным URL для webhook — нужен хостинг с публичным URL
- [ ] 🚫 CRM-интеграция (сейчас только "notify staff chat") — нужно решение, какая CRM

### 5. Переводы (RU/TH/HE)
- [x] ✅ Routing/RTL/шрифты — реализованы полностью (`src/proxy.ts`, `src/app/[locale]/`, RTL logical CSS, `Noto_Sans_Thai`) — контента действительно нет, это осознанно (proposal.md запрещает машинный перевод как финальный текст)
- [x] ✅ Решение принято (22.09): LLM-перевод сейчас, вычитка носителями позже
- [x] ✅ Весь контент переведён на RU/TH/HE: все хабы/услуги, главная, About, Contact, Portfolio, Case Studies, Journal, Privacy, Terms и весь UI (меню, кнопки, форма, футер). Файлы `src/content/locales/<locale>/*.json`: правишь строку, и она меняется везде (меню, хлебные крошки, карточки берут название из одного места). Как редактировать: `docs/i18n.md`, проверка `npm run i18n:check` (есть в CI)
- [x] ✅ Переключатель языков EN/RU/TH/HE в хедере (desktop: выпадающий список, mobile: в меню), ведёт на ту же страницу на другом языке
- [ ] 🚫 Вычитка RU/TH/HE носителями языка перед запуском, особенно SEO-поля (metaTitle/metaDescription/primaryKeyword)
- [ ] 🚫 Thai шрифт — проверить рендер с реальным текстом — заблокировано отсутствием реального тайского текста для проверки (шрифт сам по себе подключён и работает с тестовыми строками)

### 6. Аналитика
- [x] ✅ Слой аналитики + cookie-баннер (Accept / Reject / Settings, PDPA/GDPR): `src/lib/analytics.ts`, `src/components/layout/Analytics.tsx`. GA4 / Metrica / Meta Pixel грузятся **только после согласия**. События: page_view, scroll_75, cta_click, form_start/submit/error, whatsapp/telegram/phone/email_click, language_switch
- [ ] 🚫 Вписать реальные ID: `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_YM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`. Пока ID нет, баннер не показывается и ничего не грузится
- [ ] 🚫 Search Console / Yandex Webmaster: верификация домена и отправка sitemap. Нужен доступ

### 7. Хостинг
- [x] ✅ **Vercel / Node** — подтверждено с командой, `next.config.ts` держим без `output: "export"` (это ломает `src/proxy.ts`/API routes — уже дважды случайно возвращали static export и оба раза чинил)
- [x] ✅ GitHub Pages (`deploy.yml`) удалён из `main` (решение 22.09). Форк DrAndromeda может держать свой Pages-превью отдельно
- [ ] 🚫 `creativelab.in.th` домен — привязать к хостингу — нужен доступ к DNS/хостингу
- [ ] 🚫 Запустить Lighthouse против live URL — заблокировано отсутствием деплоя (локальный прогон уже сделан, см. `docs/tasks/TASK-006-performance-pass.md`)

## 🟡 Улучшения

### 8. Performance
- [x] ✅ Локальный Lighthouse-прогон сделан (home/hub/service/contact) — Accessibility/Best Practices/SEO 100/100 везде, Performance 89-94
- [x] ✅ AVIF/WebP, preload hero-картинки (Next 16 `preload` вместо устаревшего `priority`), blur-плейсхолдеры, security-заголовки
- [ ] 🚫 LCP > 2.5s — оптимизация упирается в реальные фото (сейчас placeholder JPEG — самый большой рычаг)
- [ ] 🚫 Core Web Vitals — перемерить после деплоя — заблокировано отсутствием live URL

### 9. QA
- [x] ✅ Accessibility pass — сделан через Lighthouse (тот же движок, что и axe-core): найден и исправлен реальный баг контраста (`--color-accent` не проходил WCAG AA), сейчас 100/100 на всех проверенных страницах
- [ ] 🚫 Кросс-браузерное тестирование — доступен только Chrome-автоматизация в этой сессии
- [ ] 🚫 Mobile viewport визуальная проверка — не выполнена в этой сессии (ранее была техническая проблема со скриншотами на мобильной ширине)
- [ ] 🚫 Hebrew RTL — проверить визуально с реальным контентом — структурно проверено (`dir="rtl"` рендерится корректно), но живого иврит-текста для полноценной визуальной проверки нет

### 10. Technical debt
- [x] ✅ `robots.txt` / `llms.txt` — переделаны обратно на генерацию из контента (`src/app/robots.ts`, `src/app/llms.txt/route.ts`), статические файлы в `public/` удалены — больше не будут расходиться с реальным контентом
- [x] ✅ Contact form: доставка в Telegram на сервере. Добавлены чекбокс согласия, лимиты длины, rate limit (5 заявок за 10 мин с одного IP), поле телефона/мессенджера, язык/страница/UTM в заявке, предзаполнение услуги по `?service=`
- [ ] 🚫 Креды `TELEGRAM_BOT_TOKEN` / `TELEGRAM_STAFF_CHAT_ID` на хостинге. Email/CRM-копия лидов: решение 23.09 «пока только Telegram»
- [ ] ❓ Header sticky — решить с заказчиком translucent vs transparent-on-hero — дизайн-решение, не блокирует запуск

### 11. IA cannibalization
- [x] ✅ Решено 23.09: построено дерево `/services/*` из proposal (13 страниц). 10 из них пересекаются с хабами и указывают canonical на страницу хаба (решение «оба живы, canonical на хаб»), в sitemap их нет. 3 новые темы (Digital Marketing, SEO, Commercial Photography) — самостоятельные страницы
- [ ] ❓ Пары внутри хабов (`/food-restaurants/website` vs `/websites-digital/restaurant-website`) остались с разными углами подачи. Подтвердить с клиентом

### 12. Прочее
- [x] ✅ **Меню V2 реализовано (решение 23.09)** — мега-меню по структуре proposal §2: Services (5 групп: Advertising / Social & Content / Photo & Video / Digital / Creative + блок с картинкой) / Industries / Locations / Work / Journal / About / Contact. Открывается по наведению, клику и с клавиатуры. Названия пунктов берутся из самих страниц. Хабы остались в футере и на `/services`. Исходная заметка: `proposal.md` содержит секцию "МЕНЮ — ПРИНЦИП AdFoto/4-20" (строка ~125) с ДРУГОЙ структурой категорий (Advertising/Branding/Photography/Video/Social Media/Digital/Hospitality — 7 категорий), чем то, что реально реализовано в `src/content/navigation.ts` (8 категорий: Advertising/Social Media/Villas & Real Estate/Food & Restaurants/Business & Local Presence/Websites & Digital/Video & Production/Branding & Creative). Это выглядит как альтернативная/более новая идея меню, а не подтверждённое решение — реализация означала бы полную реструктуризацию IA (48+ страниц услуг, новые URL, редиректы). **Не реализовывал без подтверждения** — уточните, актуальна ли эта структура или это старый вариант из брифа.
- [ ] ❓ **"Start a Project" button — перенести из header в footer** — сейчас кнопка есть И в header (основной CTA), И в footer (текстовая ссылка в колонке "Contact"). Не убирал CTA из header без подтверждения — это стандартная и проверенная практика для конверсии, удаление выглядит как регресс без явного объяснения зачем. Уточните: имелось в виду физически убрать из header, или просто сделать в footer более заметной кнопкой (сейчас это обычная текстовая ссылка)?

## Отдельно исправлено в этой сессии (не было в списке)

- ✅ `next.config.ts` дважды возвращался к `output: "export"` (GitHub Pages) — оба раза ломал `next dev` полностью (middleware/proxy.ts не работает со static export). Вернул к обычному конфигу.
- ✅ Добавлен `allowedDevOrigins: ["192.168.1.101"]` — без этого меню в хедере не реагировали на клики при открытии сайта через сетевой IP (Next.js блокирует cross-origin HMR-запросы в dev-режиме по умолчанию).
- ✅ CI на GitHub Actions падал на чистом чекауте (не только локально) — `bots/` не был исключён из корневого `tsconfig.json`, и `tsc --noEmit` запускался до `next build`, из-за чего отсутствовали сгенерированные типы (`PageProps`/`LayoutProps`, image-модули). Исправлено.

## Сделано 22–23.09 по аудиту proposal.md (решения клиента)

- [x] ✅ **География: Koh Phangan + Koh Samui + Koh Tao.** Страницы `/locations/koh-phangan`, `/koh-samui`, `/koh-tao` (уникальные, ~1500 слов, Place-schema с координатами). Схема организации: `areaServed` 3 острова, geo, contactPoint. Тексты хабов упоминают все острова
- [x] ✅ **7 страниц отраслей** `/industries/*`: виллы и недвижимость, отели, рестораны, велнес и ретриты, туризм, события, бренды. ~1500 слов каждая
- [x] ✅ **13 страниц `/services/*`** (P0 из proposal §4) + индексы `/services`, `/industries`, `/locations`
- [x] ✅ **Объём контента по proposal §8:** хабы ~1500 слов, 8–10 FAQ; услуги ~800 слов, 8 FAQ, блок «Service overview»; SEO-поля в рамках (title ≤50 + « | CreativeLAB», description 150–160, direct answer 40–60 слов). Всего ~75 тыс. слов EN. Перевод новых текстов на RU/TH/HE **частичный** (остановлен ради экономии токенов): осталось RU 1372, TH 2440, HE 2557 строк, пока показываются на английском. Продолжить: `npm run i18n:pending` / `i18n:accept`
- [x] ✅ **Структура страницы услуги по §16:** Overview → Deliverables → Process → Portfolio → Industries → Locations → FAQ → CTA
- [x] ✅ **Шаблоны:** кейс `/case-studies/[slug]` (§20, CreativeWork schema) и статья `/journal/[slug]` (Article schema, кластеры §22). Пока пусты (нужен реальный контент), карточки появятся автоматически
- [x] ✅ **Trust-страницы:** `/editorial-policy`, `/accessibility`
- [x] ✅ **UI/UX:** hero-слайдер (пауза, стрелки, reduced-motion), свайп-карусель портфолио, мобильная панель контактов (WhatsApp / Telegram / звонок / старт), баннер-подсказка языка по языку браузера (без авто-редиректа), чат-кнопки в каждом CTA, deep links в ботов с предвыбором услуги/локации
- [x] ✅ **Техническое:** один «CreativeLAB» в title, локализованная 404 (`global-not-found`), шрифт Heebo для иврита, OG-картинка, Service-schema на хабах, `<caption>` у таблиц цен, AVIF, security-заголовки, sitemap/llms.txt с новыми страницами
- [x] ✅ **Боты по proposal:** 8 услуг с подуслугами × 3 острова + «другое» × 4 языка. Back/🌐/Restart на каждом шаге, сохранение прогресса, webhook, проверка подписи WhatsApp, rate limit, валидация файлов (≤20 МБ), честное сообщение при сбое доставки, deep links. 35 тестов (1568 сценариев) в CI
- [x] ✅ **Инструмент переводов:** `npm run i18n:check|sync|pending|accept`. Отслеживает, с какого английского сделан каждый перевод: изменённый EN сразу виден как «нужен перевод»
- [ ] ❓ **Не делалось (не выбрано 23.09):** автотесты сайта (H1, ссылки, hreflang, schema), варианты главной /v1–/v5 (клиент: не нужны), план бэклинков и Wayback-анализ AdFoto (исследовательские задачи). Всё это перенесено в NOTES.md / PROGRESS.md

## Исправлено в DrAndromeda/CreativeLAB.in.th (форк — деплой на GitHub Pages)

Правки из форка разобраны 22.09 против `main`. Статус **в основном репозитории**:

### GitHub Pages / Static Export
- [x] ✅ **Не перенесено намеренно** (решение 22.09: `deploy.yml` убран из `main`) — `basePath: '/CreativeLAB.in.th'` + `output: 'export'` + `images.unoptimized` + копирование страниц в `deploy.yml` (коммиты `318d48f`, `d0ed7fa`, `a00329a`, `69fd667`). Это противоречит подтверждённому решению (п. 7: Vercel / Node) и ломает `src/proxy.ts` и `/api/contact` — а после переноса формы на сервер (см. ниже) static export сделает форму нерабочей. Если GitHub Pages нужен как staging-превью форка — держать эти правки только в форке. 

### Mobile Menu & Navigation
- [x] ✅ Мобильное меню (burger) — в `main` уже было (`Header.tsx`: focus trap, Esc, `aria-expanded`)
- [x] ✅ Locale prefix во внутренних ссылках — в `main` уже было через `LocalizedLink` (`/ru/*` страницы ссылаются на `/ru/*`). Фикс форка (`a00329a`/`69fd667`) — это правка `deploy.yml` под static export, в `main` не нужна
- [x] ✅ BreadcrumbList JSON-LD на всех страницах — добавлен на `/privacy` и `/terms` (единственные страницы, где его не было)

### SEO & Security
- [x] ✅ 🔴 **Telegram token убран из клиентского кода** — в `main` токен бота был зашит в `ContactForm.tsx` (коммит `0bda801`) и попадал в JS-бандл. Форма теперь шлёт на `/api/contact`, route отправляет лид в Telegram на сервере (`TELEGRAM_BOT_TOKEN` / `TELEGRAM_STAFF_CHAT_ID` — те же переменные, что у `bots/`). Без env → 503 и форма показывает ошибку (лид не теряется молча). ⚠️ **Токен остаётся в истории git** — обязательно проверить, что он отозван у @BotFather (форк утверждает, что да)
- [ ] 🚫 Прописать `TELEGRAM_BOT_TOKEN` / `TELEGRAM_STAFF_CHAT_ID` на хостинге — нужен новый токен + chat id
- [x] ✅ `SECURITY.md` — перенесён и адаптирован (имена переменных из `main`, без фрагментов токенов, порядок действий при утечке)
- [x] ✅ `llms.txt` уже был; добавлен `llms-full.txt` (`src/app/llms-full.txt/route.ts`) — генерируется из контента: direct answer + scope + FAQ по каждому хабу/услуге, цены намеренно не включены (не подтверждены). В форке этот файл отмечен, но не существовал
- [x] ✅ Full SEO title/description/H1 на всех 8 hubs — в `main` уже было (`src/content/hubs/*`)
- [x] ✅ Canonical + hreflang — в `main` уже было (`src/lib/metadata.ts`, включая `x-default`)
- [x] ✅ JSON-LD Organization / WebPage / BreadcrumbList — в `main` уже было (`src/lib/schema.ts`)
- [x] ✅ `.env.example` теперь коммитится (`!.env.example` в `.gitignore`) — раньше игнорировался, хотя README ссылается на него


### Документация
- [x] ✅ Правило: всё нереализованное/заблокированное дублируется для ревью в `NOTES.md` (короткий список) и `PROGRESS.md` (Open Questions & Blockers)
- [x] ✅ Правило: любые изменения конфигов / devops / env-требований обязательно отражаются в `README.md` и `docs/Index.md` → «Setup, configuration & environment» (прописано в `AGENTS.md`, чтобы видели и люди, и AI-агенты)
