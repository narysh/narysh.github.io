# Сергей Нарышев — личная страница

[Сайт](https://narysh.github.io/)

React, TypeScript и Vite. Два проекта, контакты, русский и английский языки,
светлая и тёмная темы. Исходники находятся в `site/`.

## Локальный запуск

```sh
npm --prefix site ci
npm --prefix site run dev
```

## Обновление сайта

```sh
npm --prefix site run build
node scripts/sync-pages.mjs
```

Сборка проверяет TypeScript. GitHub Pages публикует корень ветки `main`,
поэтому исходники и обновлённую сборку нужно сохранять вместе.

## Предыдущая версия

Версия до перехода на React сохранена в ветке
[`archive/matrix-2026-11-16`](https://github.com/narysh/narysh.github.io/tree/archive/matrix-2026-11-16).
