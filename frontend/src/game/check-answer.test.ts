import { describe, expect, it } from "vitest";
import type { FillBlankQuest, WriteQuest } from "../data/types.ts";
import {
  buildCode,
  buildWriteCode,
  checkRequirements,
  cleanAnswer,
  fixSmartQuotes,
  judgeFillBlank,
  judgePrediction,
  judgeWrite,
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

describe("«Напиши сам»", () => {
  const writeQuest: WriteQuest = {
    kind: "write",
    id: "write-test",
    title: "Тест",
    task: "",
    starter: "",
    cases: [
      { given: "temp = 34", expected: "Спека" },
      { given: "temp = 10", expected: "Норма" },
    ],
    requires: [{ anyOf: ["if"], message: "Потрібен if" }],
    solution: "",
    hints: ["", ""],
  };

  it("код збирається з «Дано», коду гравця й «Після»", () => {
    expect(buildWriteCode({ given: "a = 1", after: "print(a)", expected: "" }, "a = a + 1")).toBe(
      "a = 1\na = a + 1\nprint(a)",
    );
    expect(buildWriteCode({ expected: "" }, 'print("x")')).toBe('print("x")');
  });

  it("помічає невиконану вимогу ще до запуску", () => {
    expect(checkRequirements(writeQuest, 'print("Спека")')).toEqual({
      kind: "requirement",
      message: "Потрібен if",
    });
    expect(checkRequirements(writeQuest, "if temp > 30: ...")).toBeNull();
  });

  it("успіх, лише якщо пройдено всі набори даних", () => {
    expect(judgeWrite(writeQuest, [ok("Спека\n"), ok("Норма\n")]).kind).toBe("success");
  });

  it("каже, на якому наборі даних не вийшло", () => {
    expect(judgeWrite(writeQuest, [ok("Спека"), ok("Спека")])).toEqual({
      kind: "wrong-case",
      caseNumber: 2,
      given: "temp = 10",
      expected: "Норма",
      got: "Спека",
    });
  });

  it("номер рядка помилки — у коді гравця, без рядків «Дано»", () => {
    const verdict = judgeWrite(writeQuest, [
      { ok: false, output: "", errorType: "NameError", errorText: "NameError: name 'x' is not defined", line: 3 },
    ]);
    expect(verdict).toMatchObject({ kind: "error", line: 2 });
  });
});

describe("номери рядків у помилках «Напиши сам»", () => {
  it("зсуває номер і в тексті помилки, і в позначці рядка", () => {
    const quest: WriteQuest = {
      kind: "write", id: "x", title: "", task: "", starter: "", solution: "", hints: ["", ""],
      cases: [{ given: "temps = [1]", expected: "" }],
    };
    const verdict = judgeWrite(quest, [
      {
        ok: false,
        output: "",
        errorType: "IndentationError",
        errorText: "IndentationError: expected an indented block after 'if' statement on line 3",
        line: 4,
      },
    ]);
    expect(verdict).toMatchObject({
      kind: "error",
      line: 3,
      errorText: "IndentationError: expected an indented block after 'if' statement on line 2",
    });
  });
});
