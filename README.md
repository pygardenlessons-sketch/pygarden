# PyGarden 🌱

Безкоштовна гра, яка навчає Python з нуля через відновлення саду.

🌐 **Сайт:** https://pygarden.com

## Стек

- **Бекенд:** Python, FastAPI
- **Фронтенд:** React + TypeScript, [Vite](https://vite.dev/),
  [Pyodide](https://pyodide.org/) (Python у браузері); згодом, можливо, Phaser
- **Хостинг:** Cloudflare Workers, static assets (фронтенд)

## Структура проєкту

```
pygarden/
├── backend/        # FastAPI-сервер (API)
├── frontend/       # Сайт, який бачить гравець (React + TypeScript)
│   └── src/
│       ├── components/ # Екрани та їхні частини (сад, квест, шапка)
│       ├── data/       # Вміст гри: квести й ділянки саду
│       ├── game/       # Логіка: перевірка відповідей, прогрес, зірочки
│       └── python/     # Pyodide у Web Worker і пояснення помилок
└── wrangler.jsonc  # Налаштування деплою на Cloudflare
```

## Деплой

Фронтенд розгортається автоматично: після кожного `git push` у гілку `main`
Cloudflare Workers Builds запускає `npx wrangler deploy`. Wrangler спершу збирає
фронтенд (`npm ci && npm run build` у папці `frontend/`, див. `build` у
`wrangler.jsonc`), а потім публікує готову папку `frontend/dist` на
[pygarden.com](https://pygarden.com). Налаштування деплою
зберігаються в репозиторії у файлі `wrangler.jsonc` (configuration as code).
Для інших гілок Cloudflare створює preview-версії, щоб перевірити зміни до
злиття в `main`.

```
git push → GitHub → Cloudflare Workers Builds → pygarden.com
```

## Запуск бекенду через Docker

Потрібен [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build
```

API буде доступне на http://127.0.0.1:8000. Зупинити — `Ctrl+C`.

## Запуск бекенду без Docker

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

Відкрий у браузері:

- http://127.0.0.1:8000 — сторінка «Привіт»
- http://127.0.0.1:8000/docs — автоматична документація API

## Тести

Тести лежать у `backend/tests/` і пишуться на [pytest](https://docs.pytest.org/).

```bash
cd backend
pip install -r requirements-dev.txt
pytest -v
```

Стиль коду перевіряє лінтер [ruff](https://docs.astral.sh/ruff/)
(налаштування — `backend/ruff.toml`):

```bash
ruff check .          # знайти проблеми
ruff check --fix .    # виправити те, що можна автоматично
ruff format .         # відформатувати код
```

Тести фронтенду описані в розділі «Запуск фронтенду локально».

Усі перевірки бекенду й фронтенду автоматично запускає GitHub Actions при кожному `push` і на
кожен pull request (`.github/workflows/tests.yml`). Результат видно на вкладці
**Actions** у репозиторії та зеленою ✓ / червоним ✗ біля коміту.

## Запуск фронтенду локально

Потрібен [Node.js](https://nodejs.org/) 24+.

```bash
cd frontend
npm install
npm run dev
```

Відкрий http://localhost:5173. Зміни в коді з'являються на сторінці одразу.

Інші команди (теж у папці `frontend/`):

```bash
npm run lint     # лінтер (oxlint)
npm test         # тести (vitest)
npm run build    # перевірка типів TypeScript і збірка в frontend/dist
npm run preview  # відкрити зібрану версію локально
```

## Як працюють квести

- `frontend/src/data/quests.ts` — список квестів: код із пропуском `___`, очікуваний вивід і підказка.
- Відповідь гравця підставляється в код, і код **виконується** справжнім Python
  (Pyodide у Web Worker). Вивід порівнюється з очікуваним, тож зараховується будь-яке
  правильне рішення.
- Якщо код виконується довше 5 секунд (наприклад, нескінченний цикл), Worker
  зупиняється й перезапускається — сторінка не зависає.
- `frontend/src/python/explain-error.ts` пояснює помилки Python українською.
- Прогрес (пройдені квести, відповіді, відновлені ділянки) поки що зберігається
  в `localStorage` браузера — `frontend/src/game/progress.ts`.

## Як працює сад

- Екрани «Сад» і «Квести» перемикаються за адресою: `/#garden` та `/#quests`
  (`frontend/src/App.tsx`), тож кнопка «Назад» працює як звичайно.
- `frontend/src/data/garden.ts` — ділянки саду: назва, емодзі, вартість у зірочках і
  положення на карті (у відсотках).
- Зірочки — валюта: кожен пройдений квест дає ⭐1, відновлення ділянки її витрачає.
  Баланс = пройдені квести − вартість відновлених ділянок.
- Сума вартостей ділянок дорівнює кількості квестів: пройшовши все, можна
  відновити весь сад. Додаючи ділянки, додавай і квести — це перевіряє тест
  `frontend/src/data/data.test.ts`.
