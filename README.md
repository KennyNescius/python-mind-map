# Интерактивная карта Python

Визуальная mind map для изучения Python. Публичная часть — только на **чтение**
с любого устройства; редактирование — через защищённый интерфейс `/edit`,
доступный только владельцу.

## Как это устроено

- **Контент** живёт в одном файле `public/content.json` (узлы, связи, тексты в
  Markdown) — единственный источник правды.
- **Просмотр** (`/`) — статичная карта (React + React Flow), читает `content.json`.
- **Редактор** (`/edit`) — визуальное добавление/перетаскивание узлов и связей
  плюс Markdown-редактор. Кнопка «Сохранить» вызывает serverless-функцию, которая
  коммитит `content.json` обратно в репозиторий → сайт пересобирается.
- **Доступ к редактору** ограничен входом через Netlify Identity, а сама функция
  отклоняет любые запросы без авторизации — поэтому публичный сайт ничего изменить
  не может.

## Локальный запуск

**Требуется:** Node.js

```bash
npm install
npm run dev      # http://localhost:3000  (карта)
                 # http://localhost:3000/edit  (редактор)
```

Локально вход через Identity недоступен (нет бэкенда), поэтому в редакторе
используйте кнопку **«Скачать JSON»** и замените им `public/content.json`,
затем закоммитьте.

Сборка и проверки:

```bash
npm run build    # сборка в dist/
npm run lint     # проверка типов (tsc)
```

## Деплой на Netlify (один раз)

1. **Создайте сайт** на [Netlify](https://app.netlify.com) из этого репозитория.
   Build command и publish-папка берутся из `netlify.toml`
   (`npm run build` → `dist`, функции в `netlify/functions`).
2. **Включите Identity:** Site settings → Identity → Enable.
   - Registration → **Invite only**.
   - Пригласите **свой email** (Identity → Invite users). Только он получит доступ
     к сохранению через `/edit`.
3. **Создайте GitHub Personal Access Token** (fine-grained) с правом
   **Contents: Read and write** на этот репозиторий.
4. **Задайте переменные окружения** сайта (Site settings → Environment variables):
   - `GITHUB_TOKEN` — токен из шага 3.
   - `GITHUB_REPO` — `KennyNescius/python-mind-map`.
   - `GIT_BRANCH` — ветка для коммитов (по умолчанию `main`).

После этого: открываете `https://<ваш-сайт>.netlify.app/edit`, входите по
приглашению, редактируете карту и жмёте «Сохранить» — изменения уезжают в
репозиторий, Netlify пересобирает сайт, и обновлённая карта доступна всем на
чтение.
