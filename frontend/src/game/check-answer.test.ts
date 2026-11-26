import { describe, expect, it } from "vitest";
import type { Quest } from "../data/quests.ts";
import { buildCode, cleanAnswer, fixSmartQuotes, judge, normalizeOutput } from "./check-answer.ts";

const quest: Quest = {
  id: "test",
  title: "Тест",
  task: "",
  code: "print(___)",
  expected: "Привіт",
  hint: "",
};

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

describe("judge", () => {
  it("правильний вивід — успіх", () => {
    expect(judge(quest, { ok: true, output: "Привіт\n" })).toEqual({
      kind: "success",
      output: "Привіт",
    });
  });

  it("інший вивід — показує, що очікували і що вийшло", () => {
    expect(judge(quest, { ok: true, output: "Бувай\n" })).toEqual({
      kind: "wrong-output",
      expected: "Привіт",
      got: "Бувай",
    });
  });

  it("помилка Python — пояснення українською", () => {
    const verdict = judge(quest, {
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
