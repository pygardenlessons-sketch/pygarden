# PyGarden 🌱

Безкоштовна гра, яка навчає Python з нуля через відновлення саду.

🌐 **Сайт:** https://pygarden.com

## Стек

- **Бекенд:** Python, FastAPI
- **Фронтенд:** (згодом) React + TypeScript, Phaser, Pyodide
- **Хостинг:** Cloudflare Pages (фронтенд)

## Структура проєкту

```
pygarden/
├── backend/    # FastAPI-сервер (API)
└── frontend/   # Сайт, який бачить гравець
```

## Деплой

Фронтенд розгортається автоматично: після кожного `git push` у гілку `main`
Cloudflare Pages забирає вміст папки `frontend/` і публікує його на
[pygarden.com](https://pygarden.com). Для кожної іншої гілки Cloudflare
створює окремий preview-сайт, щоб перевірити зміни до злиття в `main`.

```
git push → GitHub → Cloudflare Pages → pygarden.com
```

## Запуск бекенду локально

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

## Запуск фронтенду локально

Поки що це одна HTML-сторінка — достатньо відкрити `frontend/index.html` у браузері.
