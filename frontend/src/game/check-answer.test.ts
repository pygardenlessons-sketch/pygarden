import { describe, expect, it } from "vitest";
import type { FillBlankQuest } from "../data/types.ts";
import {
  buildCode,
  cleanAnswer,
  fixSmartQuotes,
  judgeFillBlank,
  judgePrediction,
  normalizeOutput,
} from "./check-answer.ts";

const quest: FillBlankQuest = {
  kind: "fill-blank",
  id: "test",
  title: "Тест",
  task: "",
  code: "print(___)",
  solution: '"Привіт"',
  expected: "Привіт",
  hints: ["", ""],
};

const ok = (output: string) => ({ ok: true as const, output });

describe("fixSmartQuotes", () => {
  it("замінює «розумні» лапки iPhone на звичайні", () => {
    expect(fixSmartQuotes("“Привіт”")).toBe('"Привіт"');
    expect(fixSmartQuotes("‘сад’")).toBe("'сад'");
    expect(fixSmartQuotes("«ялинки»")).toBe('"ялинки"');
  });

  it("не чіпає звичайні лапки", () => {
    expect(fixSmartQuotes(`"a" + 'b'`)).toBe(`"a" + 'b'`);
  });
});

describe("cleanAnswer і buildCode", () => {
  it("прибирає пробіли по краях і підставляє відповідь у пропуск", () => {
    expect(buildCode(quest, cleanAnswer("  “Привіт”  "))).toBe('print("Привіт")');
  });
});

describe("normalizeOutput", () => {
  it("ігнорує пробіли в кінці рядків і порожні рядки в кінці", () => {
    expect(normalizeOutput("a  \nb\n\n")).toBe("a\nb");
  });
});

describe("judgeFillBlank", () => {
  it("правильний вивід — успіх", () => {
    expect(judgeFillBlank(quest, ok("Привіт\n"))).toEqual({ kind: "success", output: "Привіт" });
  });

  it("інший вивід — показує, що очікували і що вийшло", () => {
    expect(judgeFillBlank(quest, ok("Бувай\n"))).toEqual({
      kind: "wrong-output",
      expected: "Привіт",
      got: "Бувай",
    });
  });

  it("помилка Python — пояснення українською", () => {
    const verdict = judgeFillBlank(quest, {
      ok: false,
      output: "",
      errorType: "NameError",
      errorText: "NameError: name 'Привіт' is not defined",
      line: 1,
    });
    expect(verdict.kind).toBe("error");
    if (verdict.kind === "error") {
      expect(verdict.explanation).toContain('візьми його в лапки: "Привіт"');
      expect(verdict.line).toBe(1);
    }
  });
});

describe("judgePrediction", () => {
  const twoLines = ok("Сад\nпрокидається\n");

  it("правильне передбачення — успіх", () => {
    expect(judgePrediction("Сад\nпрокидається", twoLines).kind).toBe("success");
  });

  it("пробіли в кінці рядків не мають значення", () => {
    expect(judgePrediction("Сад  \nпрокидається\n\n", twoLines).kind).toBe("success");
  });

  it("помічає зайві лапки", () => {
    const verdict = judgePrediction('"Сад"\n"прокидається"', twoLines);
    expect(verdict).toMatchObject({ kind: "wrong-prediction" });
    if (verdict.kind === "wrong-prediction") expect(verdict.message).toContain("лапки");
  });

  it("підказує, скільки рядків має бути", () => {
    const verdict = judgePrediction("Сад прокидається", twoLines);
    if (verdict.kind !== "wrong-prediction") throw new Error("очікували wrong-prediction");
    expect(verdict.message).toBe("Python виведе 2 рядки, а в тебе 1 рядок.");
  });

  it("підказує, який рядок не збігається, але не показує правильну відповідь", () => {
    const verdict = judgePrediction("Сад\nспить", twoLines);
    if (verdict.kind !== "wrong-prediction") throw new Error("очікували wrong-prediction");
    expect(verdict.message).toContain("рядок 2");
    expect(verdict.message).not.toContain("прокидається");
  });
});
