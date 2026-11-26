# PyGarden 🌱

Безкоштовна гра, яка навчає Python з нуля через відновлення саду.

🌐 **Сайт:** https://pygarden.com

## Стек

- **Бекенд:** Python, FastAPI
- **Фронтенд:** HTML + JavaScript, [Pyodide](https://pyodide.org/) (Python у браузері);
  згодом React + TypeScript, Phaser
- **Хостинг:** Cloudflare Workers, static assets (фронтенд)

## Структура проєкту

```
pygarden/
├── backend/        # FastAPI-сервер (API)
├── frontend/       # Сайт, який бачить гравець
└── wrangler.jsonc  # Налаштування деплою на Cloudflare
```

## Деплой

Фронтенд розгортається автоматично: після кожного `git push` у гілку `main`
Cloudflare Workers Builds запускає `npx wrangler deploy` і публікує вміст папки
`frontend/` на [pygarden.com](https://pygarden.com). Налаштування деплою
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

Тести й ruff автоматично запускає GitHub Actions при кожному `push` і на
кожен pull request (`.github/workflows/tests.yml`). Результат видно на вкладці
**Actions** у репозиторії та зеленою ✓ / червоним ✗ біля коміту.

## Запуск фронтенду локально

Фронтенд використовує JS-модулі та Web Worker, тому просто відкрити
`index.html` з диска не вийде — потрібен локальний сервер:

```bash
python -m http.server 5500 --directory frontend
```

і відкрий http://localhost:5500.

## Як працюють квести

- `frontend/js/quests.js` — список квестів: код із пропуском `___`, очікуваний вивід і підказка.
- Відповідь гравця підставляється в код, і код **виконується** справжнім Python
  (Pyodide у Web Worker). Вивід порівнюється з очікуваним, тож зараховується будь-яке
  правильне рішення.
- Якщо код виконується довше 5 секунд (наприклад, нескінченний цикл), Worker
  зупиняється й перезапускається — сторінка не зависає.
- `frontend/js/explain-error.js` пояснює помилки Python українською.
- Прогрес (зірочки) поки що зберігається в `localStorage` браузера.
