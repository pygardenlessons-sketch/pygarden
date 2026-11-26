// «Порада садівника»: коротке пояснення нової ідеї з прикладом, який можна запустити.

import { useState, type ReactNode } from "react";
import type { Tip } from "../data/types.ts";
import { normalizeOutput } from "../game/check-answer.ts";
import { python, usePythonStatus } from "../python/python-runner.ts";
import { PythonStatusNote } from "./QuestParts.tsx";

export function TipCard({ tip, actions }: { tip: Tip; actions: ReactNode }) {
  const pythonStatus = usePythonStatus();
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const result = await python.run(tip.example);
    setRunning(false);
    setOutput(result.ok ? normalizeOutput(result.output) : result.errorText);
  }

  return (
    <section className="quest-card tip-card">
      <p className="tip-kicker">💡 Порада садівника</p>
      <h1>{tip.title}</h1>
      <p className="task">{tip.text}</p>

      <pre className="code">
        <code>{tip.example}</code>
      </pre>

      {output !== null && (
        <div className="tip-output">
          <p className="label">Вивід:</p>
          <pre>{output || "(нічого не виведено)"}</pre>
        </div>
      )}

      <div className="actions">
        {/* Приклад завжди виводить те саме, тож після запуску кнопка зникає */}
        {output === null && (
          <button
            type="button"
            className="button button--secondary"
            disabled={pythonStatus !== "ready" || running}
            onClick={run}
          >
            {running ? "Виконуємо…" : "▶ Запустити приклад"}
          </button>
        )}
        {actions}
        <PythonStatusNote status={pythonStatus} />
      </div>
    </section>
  );
}
