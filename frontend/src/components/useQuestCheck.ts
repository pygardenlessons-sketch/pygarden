// Спільна логіка перевірки для всіх типів квестів:
// стан «виконується», результат перевірки і зарахування зірочки.

import { useState } from "react";
import { cleanAnswer, type Verdict } from "../game/check-answer.ts";
import { completeQuest } from "../game/progress.ts";
import { usePythonStatus } from "../python/python-runner.ts";

export type Feedback = Verdict | { kind: "empty" };

export function useQuestCheck(
  questId: string,
  solved: boolean,
  /** Виконати відповідь гравця й оцінити результат. */
  evaluate: (answer: string) => Promise<Verdict>,
) {
  const pythonStatus = usePythonStatus();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [running, setRunning] = useState(false);
  // Скільки разів гравець помилився — від цього залежить, яку підказку показати
  const [mistakes, setMistakes] = useState(0);

  // Перевіряти можна, коли Python готовий, нічого не виконується і квест ще не пройдено
  const canCheck = pythonStatus === "ready" && !running && !solved;

  async function check(rawAnswer: string) {
    if (!canCheck) return;
    const answer = cleanAnswer(rawAnswer);
    if (!answer) {
      setFeedback({ kind: "empty" });
      return;
    }

    setRunning(true);
    const verdict = await evaluate(answer);
    setRunning(false);

    setFeedback(verdict);
    if (verdict.kind === "success") completeQuest(questId, answer);
    else setMistakes((count) => count + 1);
  }

  return { pythonStatus, feedback, running, canCheck, check, mistakes };
}
