# Базовий образ: офіційний Python, полегшена версія
FROM python:3.13-slim

# Не створювати .pyc-файли та одразу виводити логи (без буферизації)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Робоча папка всередині контейнера
WORKDIR /app

# Спершу лише залежності: Docker закешує цей шар,
# і при зміні коду пакети не перевстановлюватимуться
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Тепер решта коду
COPY . .

# Запускаємо не від root — так безпечніше
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

# 0.0.0.0 — щоб сервер був доступний ззовні контейнера
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
