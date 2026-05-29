# Makao Menu

Мобильное Vue-приложение меню для нескольких заведений. Один шаблон, данные из JSON по slug в URL.

## Маршруты

| URL | Описание |
|-----|----------|
| `/main` | Лендинг заведения ZAMNA (демо) |
| `/main/menu?section=bar&category=cocktails` | Меню с разделом и категорией |
| `/mria` | Лендинг заведения MRIA (демо) |
| `/mria/menu?section=hookah&category=classic` | Меню MRIA |

На десктопе (ширина ≥ 768px) показывается заглушка с QR-кодом текущего URL.

## Contentful (CMS)

Интеграция через [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) (`contentful` SDK, `src/lib/contentful/`).

### Куда вставить ключи из админки

1. Скопируйте шаблон: `cp .env.example .env.local`
2. Заполните переменные (после изменения `.env.local` перезапустите `npm run dev`):

| Переменная | Где взять в Contentful |
|------------|-------------------------|
| `VITE_CONTENTFUL_SPACE_ID` | **Settings → General settings → Space ID** |
| `VITE_CONTENTFUL_DELIVERY_TOKEN` | **Settings → Content delivery / preview tokens** → токен с типом *Content Delivery API* (не Preview) |
| `VITE_CONTENTFUL_ENVIRONMENT` | **Settings → Environments** — обычно `master` |
| `VITE_CONTENTFUL_HOST` | Только для EU: `cdn.eu.contentful.com` |

Идентификаторы content model (`main-page`, поле `restaurant`, `include`) — константы в `src/lib/contentful/api.ts`, не в `.env`.

3. Опубликуйте `main-page` и связанные `restaurant` entries.

Запрос на главной (`/`, `HomeView`) — **один** вызов `getEntries` с `include`: Contentful отдаёт связанные entries в `includes.Entry`, SDK подставляет их в `fields.restaurant`. Карточки заведений ведут на `/{slug}`.

Альтернатива (все рестораны space, не только с главной): `getEntries({ content_type: 'restaurant' })`. Только выбранные ссылки — через страницу + `include`, как выше.

> Delivery token попадает в клиентский бандл — используйте только read-only CDA token с доступом к нужному environment.

## Разработка

```bash
npm install
npm run dev
```

Откройте в мобильном режиме DevTools или с телефона в той же сети.

## Добавление заведения

1. Создайте файл `public/data/{slug}.json` по образцу `public/data/main.json`.
2. Откройте `https://ваш-домен/{slug}` — шаблон подхватит данные автоматически.

### Структура JSON

- `brand` — название и подзаголовок на лендинге
- `landing` — часы, телефон, Instagram, адрес, иконки услуг
- `bottomNav` — нижняя навигация (`home`, `menu`, `delivery`)
- `menu.sections` — разделы меню (бар, кальяны, десерты)
- В каждой секции: `categories` → `groups` → `items`

Query-параметры меню:

- `section` — id раздела (`bar`, `hookah`, …)
- `category` — id категории внутри раздела

Смена категории обновляет только query, path остаётся `/{slug}/menu`.

## Сборка и деплой

```bash
npm run build
```

Статика в `dist/`. Для Vue Router (history mode) на Nginx:

```nginx
location / {
    root /var/www/makaomenu/dist;
    try_files $uri $uri/ /index.html;
}
```

Одно приложение на домене: `domen.ru/main`, `domen.ru/mria` и т.д.

## Стек

- Vue 3 + TypeScript + Vite
- Vue Router
- lucide-vue-next (иконки)
- qrcode (QR на десктоп-заглушке)
