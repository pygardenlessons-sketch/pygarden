// Квест «Заповни пропуск»: код із полем на місці ___.

import { useState, type ReactNode } from "react";
import type { FillBlankQuest } from "../data/types.ts";
import { BLANK, buildCode, judgeFillBlank } from "../game/check-answer.ts";
import { python } from "../python/python-runner.ts";
import { PythonStatusNote, QuestResult } from "./QuestParts.tsx";
import { useQuestCheck } from "./useQuestCheck.ts";

type Props = {
  quest: FillBlankQuest;
  heading: string;
  solved: boolean;
  savedAnswer: string;
  autoFocus: boolean;
  /** Додаткові кнопки в ряду з «Перевірити» (Далі, До саду…). */
  actions: ReactNode;
};

export function FillBlankCard({ quest, heading, solved, savedAnswer, autoFocus, actions }: Props) {
  const [answer, setAnswer] = useState(solved ? savedAnswer : "");
  const { pythonStatus, feedback, running, canCheck, check, mistakes } = useQuestCheck(
    quest.id,
    solved,
    async (cleaned) => judgeFillBlank(quest, await python.run(buildCode(quest, cleaned))),
  );

  const [before, after] = quest.code.split(BLANK);

  return (
    <section className="quest-card">
      <h1>{heading}</h1>
      <p className="task">{quest.task}</p>

      <pre className="code">
        <code>
          {before}
          <input
            className="blank"
            aria-label="Пропущений фрагмент коду"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && check(answer)}
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
