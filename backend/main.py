from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI(title="PyGarden API")


@app.get("/", response_class=HTMLResponse)
def home() -> str:
    return """
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <title>PyGarden</title>
    </head>
    <body style="font-family: sans-serif; text-align: center; margin-top: 20vh;">
        <h1>Привіт! 🌱</h1>
        <p>Тут скоро виросте сад, який навчить тебе Python.</p>
    </body>
    </html>
    """


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
