// Перевірка відповіді гравця. Тут лише «чисті» функції без браузера й Python,
// тому їх легко тестувати (див. check-answer.test.ts).

import { BLANK, type Quest } from "../data/quests.ts";
import { explainError } from "../python/explain-error.ts";
import type { RunResult } from "../python/types.ts";

/**
 * iPhone і macOS автоматично замінюють " на «розумні» лапки “ ”, які Python не розуміє.
 * Гравець не винен у цьому, тож повертаємо звичайні лапки.
 */
export const fixSmartQuotes = (text: string) =>
  text.replace(/[“”„‟«»]/g, '"').replace(/[‘’‚‛]/g, "'");

/** Підготувати відповідь до підстановки в код. */
export const cleanAnswer = (answer: string) => fixSmartQuotes(answer).trim();

/** Код квесту з відповіддю на місці пропуску. */
export const buildCode = (quest: Quest, answer: string) => quest.code.replace(BLANK, answer);

/** Порівнюємо вивід без зайвих пробілів у кінці рядків. */
export const normalizeOutput = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();

export type Verdict =
  | { kind: "success"; output: string }
  | { kind: "error"; explanation: string; errorText: string; line: number | null }
  | { kind: "wrong-output"; expected: string; got: string };

/** Що сказати гравцеві, коли код виконано. */
export function judge(quest: Quest, result: RunResult): Verdict {
  if (!result.ok) {
    return {
      kind: "error",
      explanation: explainError(result),
      errorText: result.errorText,
      line: result.line,
    };
  }
  const got = normalizeOutput(result.output);
  const expected = normalizeOutput(quest.expected);
  return got === expected ? { kind: "success", output: got } : { kind: "wrong-output", expected, got };
}
