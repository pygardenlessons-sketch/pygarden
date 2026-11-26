// Картка квесту: завдання, код із пропуском, перевірка й результат.

import { useState } from "react";
import { BLANK, type Quest } from "../data/quests.ts";
import { buildCode, cleanAnswer, judge, type Verdict } from "../game/check-answer.ts";
import { completeQuest } from "../game/progress.ts";
import { python, usePythonStatus } from "../python/python-runner.ts";

type Props = {
  quest: Quest;
  number: number;
  solved: boolean;
  savedAnswer: string;
  autoFocus: boolean;
  /** Перейти до наступного квесту; undefined — це останній квест. */
  onNext?: () => void;
};

type Feedback = Verdict | { kind: "empty" };

export function QuestCard({ quest, number, solved, savedAnswer, autoFocus, onNext }: Props) {
  const pythonStatus = usePythonStatus();
  const [answer, setAnswer] = useState(solved ? savedAnswer : "");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [running, setRunning] = useState(false);

  // Перевіряти можна, коли Python готовий, нічого не виконується і квест ще не пройдено
  const canCheck = pythonStatus === "ready" && !running && !solved;

  async function check() {
    if (!canCheck) return;
    const cleaned = cleanAnswer(answer);
    if (!cleaned) {
      setFeedback({ kind: "empty" });
      return;
    }

    setRunning(true);
    const result = await python.run(buildCode(quest, cleaned));
    setRunning(false);

    const verdict = judge(quest, result);
    setFeedback(verdict);
    if (verdict.kind === "success") completeQuest(quest.id, cleaned);
  }

  const [before, after] = quest.code.split(BLANK);

  return (
    <section className="quest-card">
      <h1>
        Квест {number}. {quest.title}
      </h1>
      <p className="task">{quest.task}</p>

      <pre className="code">
        <code>
          {before}
          <input
            className="blank"
            aria-label="Пропущений фрагмент коду"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && check()}
            // disabled, а не readOnly: у пройденому квесті без курсора й фокусу
            disabled={solved}
            autoFocus={autoFocus}
            style={{ width: `${Math.max(answer.length + 1, 4)}ch` }}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off" // iPhone: без автовиправлення й підказок слів
            spellCheck={false}
            enterKeyHint="go" // кнопка Enter на мобільній клавіатурі
          />
          {after}
        </code>
      </pre>

      <div className="actions">
        <button type="button" className="button" disabled={!canCheck} onClick={check}>
          {running ? "Виконуємо…" : "Перевірити"}
        </button>
        {solved && onNext && (
          <button type="button" className="button button--secondary" onClick={onNext}>
            Наступний квест →
          </button>
        )}
        {solved && (
          <a href="#garden" className="button button--secondary">
            🌳 До саду
          </a>
        )}
        {/* Статус потрібен лише під час завантаження та при помилці */}
        {pythonStatus === "loading" && <span className="python-status">Завантажуємо Python…</span>}
        {pythonStatus === "error" && (
          <span className="python-status">
            Не вдалося завантажити Python. Перевір інтернет і онови сторінку.
          </span>
        )}
      </div>

      {feedback ? (
        <Result feedback={feedback} hint={quest.hint} />
      ) : (
        solved && (
          <div className="result result--success" role="status">
            <p>Квест пройдено, зірочка вже є ⭐</p>
          </div>
        )
      )}
    </section>
  );
}

function Result({ feedback, hint }: { feedback: Feedback; hint: string }) {
  const hintLine = <p className="hint">Підказка: {hint}</p>;

  switch (feedback.kind) {
    case "empty":
      return (
        <div className="result result--error" role="status">
          <p>Спершу впиши щось у пропуск 🙂</p>
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

    case "success":
      return (
        <div className="result result--success" role="status">
          <p>Правильно! +1 ⭐</p>
          <pre className="output">{feedback.output}</pre>
        </div>
      );
  }
}
