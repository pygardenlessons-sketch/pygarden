// Квест «Напиши сам»: гравець пише код у редакторі, а гра перевіряє його
// на кількох наборах даних (щоб просто вивести відповідь не вийшло).

import { useState, type KeyboardEvent, type ReactNode } from "react";
import type { WriteQuest } from "../data/types.ts";
import { buildWriteCode, checkRequirements, judgeWrite } from "../game/check-answer.ts";
import { python } from "../python/python-runner.ts";
import { PythonStatusNote, QuestResult } from "./QuestParts.tsx";
import { useQuestCheck } from "./useQuestCheck.ts";

const INDENT = "    "; // 4 пробіли — стандартний відступ у Python
const MIN_ROWS = 4;
const MAX_ROWS = 14;

type Props = {
  quest: WriteQuest;
  heading: string;
  solved: boolean;
  savedAnswer: string;
  autoFocus: boolean;
  actions: ReactNode;
};

export function WriteCard({ quest, heading, solved, savedAnswer, autoFocus, actions }: Props) {
  const [code, setCode] = useState(solved ? savedAnswer : quest.starter);
  const { pythonStatus, feedback, running, canCheck, check, mistakes } = useQuestCheck(
    quest.id,
    solved,
    async (answer) => {
      const unmet = checkRequirements(quest, answer);
      if (unmet) return unmet;
      const results = [];
      for (const testCase of quest.cases) {
        const result = await python.run(buildWriteCode(testCase, answer));
        results.push(result);
        if (!result.ok) break; // далі перевіряти немає сенсу
      }
      return judgeWrite(quest, results);
    },
  );

  const [first] = quest.cases;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const editor = event.currentTarget;
    const { selectionStart, selectionEnd, value } = editor;

    // Ctrl+Enter (або Cmd+Enter) — перевірити
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      check(code);
      return;
    }

    // Tab — вставити відступ замість переходу до наступного елемента
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      editor.setRangeText(INDENT, selectionStart, selectionEnd, "end");
      setCode(editor.value);
      return;
    }

    // Enter — новий рядок із тим самим відступом; після «:» — на один рівень глибше
    if (event.key === "Enter") {
      event.preventDefault();
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const line = value.slice(lineStart, selectionStart);
      const indent = line.match(/^ */)![0] + (line.trimEnd().endsWith(":") ? INDENT : "");
      editor.setRangeText("\n" + indent, selectionStart, selectionEnd, "end");
      setCode(editor.value);
    }
  }

  return (
    <section className="quest-card">
      <h1>{heading}</h1>
      <p className="task">{quest.task}</p>

      {first.given && (
        <>
          <p className="code-label">Дано:</p>
          <pre className="code code--given">
            <code>{first.given}</code>
          </pre>
        </>
      )}

      <label className="prediction-label" htmlFor={`write-${quest.id}`}>
        Твій код:
      </label>
      <textarea
        id={`write-${quest.id}`}
        className="code-editor"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={solved}
        autoFocus={autoFocus}
        rows={Math.min(Math.max(code.split("\n").length + 1, MIN_ROWS), MAX_ROWS)}
        placeholder="Пиши код тут"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <p className="editor-note">Tab — відступ, Ctrl+Enter — перевірити</p>

      {first.after && (
        <>
          <p className="code-label">Після твого коду гра виконає:</p>
          <pre className="code code--given">
            <code>{first.after}</code>
          </pre>
        </>
      )}

      <div className="actions">
        <button type="button" className="button" disabled={!canCheck} onClick={() => check(code)}>
          {running ? "Виконуємо…" : "Перевірити"}
        </button>
        {actions}
        <PythonStatusNote status={pythonStatus} />
      </div>

      <QuestResult feedback={feedback} solved={solved} hints={quest.hints} mistakes={mistakes} />
    </section>
  );
}
