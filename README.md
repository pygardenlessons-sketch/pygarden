# PyGarden 🌱

Безкоштовна гра, яка навчає Python з нуля через відновлення саду.

## Стек

- **Бекенд:** Python, FastAPI
- **Фронтенд:** (згодом) React + TypeScript, Phaser, Pyodide

## Запуск локально

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
