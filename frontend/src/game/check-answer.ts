// Перевірка відповіді гравця. Тут лише «чисті» функції без браузера й Python,
// тому їх легко тестувати (див. check-answer.test.ts).

import type { FillBlankQuest } from "../data/types.ts";
import { explainError } from "../python/explain-error.ts";
import type { RunFailure, RunResult } from "../python/types.ts";

export const BLANK = "___";

/**
 * iPhone і macOS автоматично замінюють " на «розумні» лапки “ ”, які Python не розуміє.
 * Гравець не винен у цьому, тож повертаємо звичайні лапки.
 */
export const fixSmartQuotes = (text: string) =>
  text.replace(/[“”„‟«»]/g, '"').replace(/[‘’‚‛]/g, "'");

/** Підготувати відповідь до підстановки в код. */
export const cleanAnswer = (answer: string) => fixSmartQuotes(answer).trim();

/** Код квесту з відповіддю на місці пропуску. */
export const buildCode = (quest: FillBlankQuest, answer: string) => quest.code.replace(BLANK, answer);

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
  | { kind: "wrong-output"; expected: string; got: string }
  | { kind: "wrong-prediction"; message: string };

const errorVerdict = (result: RunFailure): Verdict => ({
  kind: "error",
  explanation: explainError(result),
  errorText: result.errorText,
  line: result.line,
});

/** «Заповни пропуск»: код із відповіддю гравця виконано — що сказати гравцеві. */
export function judgeFillBlank(quest: FillBlankQuest, result: RunResult): Verdict {
  if (!result.ok) return errorVerdict(result);
  const got = normalizeOutput(result.output);
  const expected = normalizeOutput(quest.expected);
  return got === expected ? { kind: "success", output: got } : { kind: "wrong-output", expected, got };
}

/**
 * «Передбач вивід»: порівнюємо відповідь гравця зі справжнім виводом коду.
 * Правильну відповідь не показуємо — лише підказуємо, де саме розбіжність.
 */
export function judgePrediction(answer: string, result: RunResult): Verdict {
  if (!result.ok) return errorVerdict(result); // помилка у вмісті квесту — не мала б статися
  const expected = normalizeOutput(result.output);
  const got = normalizeOutput(fixSmartQuotes(answer));
  if (got === expected) return { kind: "success", output: expected };

  const expectedLines = expected.split("\n");
  const gotLines = got.split("\n");

  // Найчастіша помилка новачка: написати вивід разом із лапками
  const withoutQuotes = gotLines.map((line) => line.replace(/^(["'])(.*)\1$/, "$2")).join("\n");
  if (withoutQuotes === expected) {
    return {
      kind: "wrong-prediction",
      message: "Майже! Але лапки на екран не виводяться — print показує лише сам текст.",
    };
  }

  if (gotLines.length !== expectedLines.length) {
    return {
      kind: "wrong-prediction",
      message: `Python виведе ${lines(expectedLines.length)}, а в тебе ${lines(gotLines.length)}.`,
    };
  }

  const wrongLine = expectedLines.findIndex((line, i) => line !== gotLines[i]) + 1;
  return {
    kind: "wrong-prediction",
    message:
      expectedLines.length === 1
        ? "Не зовсім: Python виведе інакше."
        : `Не зовсім: рядок ${wrongLine} не збігається.`,
  };
}

/** «1 рядок», «2 рядки», «5 рядків». */
function lines(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} рядків`;
  if (last === 1) return `${count} рядок`;
  if (last >= 2 && last <= 4) return `${count} рядки`;
  return `${count} рядків`;
}
