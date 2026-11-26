// Квест «Передбач вивід»: код готовий, гравець пише, що він виведе.
// Правильна відповідь — справжній вивід коду, тож помилитися у вмісті квесту неможливо.

import { useState, type ReactNode } from "react";
import type { PredictQuest } from "../data/types.ts";
import { judgePrediction } from "../game/check-answer.ts";
import { python } from "../python/python-runner.ts";
import { PythonStatusNote, QuestResult } from "./QuestParts.tsx";
import { useQuestCheck } from "./useQuestCheck.ts";

/** Вивід квестів — кілька рядків; довше поле лише розтягує сторінку. */
const MAX_ROWS = 8;

type Props = {
  quest: PredictQuest;
  heading: string;
  solved: boolean;
  savedAnswer: string;
  autoFocus: boolean;
  actions: ReactNode;
};

export function PredictCard({ quest, heading, solved, savedAnswer, autoFocus, actions }: Props) {
  const [answer, setAnswer] = useState(solved ? savedAnswer : "");
  const { pythonStatus, feedback, running, canCheck, check, mistakes } = useQuestCheck(
    quest.id,
    solved,
    async (cleaned) => judgePrediction(cleaned, await python.run(quest.code)),
  );

  return (
    <section className="quest-card">
      <h1>{heading}</h1>
      <p className="task">{quest.task}</p>

      <pre className="code">
        <code>{quest.code}</code>
      </pre>

      <label className="prediction-label" htmlFor={`prediction-${quest.id}`}>
        Вивід програми:
      </label>
      <textarea
        id={`prediction-${quest.id}`}
        className="prediction"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        onKeyDown={(event) => {
          // Enter — новий рядок; Ctrl+Enter (або Cmd+Enter) — перевірити
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) check(answer);
        }}
        disabled={solved}
        autoFocus={autoFocus}
        // Росте разом із відповіддю, але не більше MAX_ROWS — далі з'являється прокрутка
        rows={Math.min(Math.max(answer.split("\n").length, 2), MAX_ROWS)}
        placeholder="Напиши тут, що з'явиться на екрані"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />

      <div className="actions">
        <button type="button" className="button" disabled={!canCheck} onClick={() => check(answer)}>
          {running ? "Виконуємо…" : "Перевірити"}
        </button>
        {actions}
        <PythonStatusNote status={pythonStatus} />
      </div>

      <QuestResult feedback={feedback} solved={solved} hints={quest.hints} mistakes={mistakes} />
    </section>
  );
}
