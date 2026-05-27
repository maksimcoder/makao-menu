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
