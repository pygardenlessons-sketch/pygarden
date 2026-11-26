// Дрібні частини, спільні для карток квестів і порад.

import type { Hints } from "../data/types.ts";
import type { PythonStatus } from "../python/python-runner.ts";
import type { Feedback } from "./useQuestCheck.ts";

/** Статус Python потрібен лише під час завантаження та при помилці. */
export function PythonStatusNote({ status }: { status: PythonStatus }) {
  if (status === "loading") return <span className="python-status">Завантажуємо Python…</span>;
  if (status === "error") {
    return (
      <span className="python-status">
        Не вдалося завантажити Python. Перевір інтернет і онови сторінку.
      </span>
    );
  }
  return null;
}

/** Результат перевірки, або «вже пройдено», якщо гравець повернувся до квесту. */
export function QuestResult({
  feedback,
  solved,
  hints,
  mistakes,
}: {
  feedback: Feedback | null;
  solved: boolean;
  hints: Hints;
  /** Скільки разів гравець помилився: 1 — перша підказка, 2 — друга… */
  mistakes: number;
}) {
  if (!feedback) {
    return solved ? (
      <div className="result result--success" role="status">
        <p>Квест пройдено, зірочка вже є ⭐</p>
      </div>
    ) : null;
  }

  // Ступінчасті підказки: що більше помилок, то конкретніша підказка
  const level = Math.min(Math.max(mistakes, 1), hints.length);
  const hintLine = (
    <p className="hint">
      Підказка {level} з {hints.length}: {hints[level - 1]}
      {level < hints.length && (
        <span className="hint-more"> Наступна з'явиться, якщо знову не вийде.</span>
      )}
    </p>
  );

  switch (feedback.kind) {
    case "empty":
      return (
        <div className="result result--error" role="status">
          <p>Спершу впиши відповідь 🙂</p>
        </div>
      );

    case "error":
      return (
        <div className="result result--error" role="status">
          <p>{feedback.explanation}</p>
          {feedback.errorText && (
            <pre className="error-text">
              {feedback.errorText}
              {feedback.line && ` (рядок ${feedback.line})`}
            </pre>
          )}
          {hintLine}
        </div>
      );

    case "wrong-output":
      return (
        <div className="result result--error" role="status">
          <p>Код спрацював без помилок, але вивід не той, що потрібно.</p>
          <p className="label">Очікували:</p>
          <pre className="output">{feedback.expected}</pre>
          <p className="label">Вийшло:</p>
          <pre className="output">{feedback.got || "(нічого не виведено)"}</pre>
          {hintLine}
        </div>
      );

    case "wrong-prediction":
      return (
        <div className="result result--error" role="status">
          <p>{feedback.message}</p>
          {hintLine}
        </div>
      );

    case "success":
      return (
        <div className="result result--success" role="status">
          <p>Правильно! +1 ⭐</p>
          <pre className="output">{feedback.output}</pre>
        </div>
      );
  }
}
