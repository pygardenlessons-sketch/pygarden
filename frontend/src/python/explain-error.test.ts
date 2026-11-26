import { describe, expect, it } from "vitest";
import { explainError } from "./explain-error.ts";

const explain = (errorType: string, errorText = "") => explainError({ errorType, errorText });

describe("explainError", () => {
  it("нескінченний цикл", () => {
    expect(explain("Timeout")).toContain("нескінченний цикл");
  });

  it("незакрита лапка", () => {
    expect(explain("SyntaxError", "unterminated string literal (detected at line 1)")).toContain(
      "Лапка відкрилась",
    );
  });

  it("незакрита дужка", () => {
    expect(explain("SyntaxError", "'(' was never closed")).toContain("Дужки");
  });

  it("текст без лапок — підказує взяти в лапки", () => {
    expect(explain("NameError", "NameError: name 'five' is not defined")).toContain('"five"');
  });

  it("текст замість числа в range()", () => {
    expect(
      explain("TypeError", "TypeError: 'str' object cannot be interpreted as an integer"),
    ).toContain("ціле число");
  });

  it("невідома помилка — загальне пояснення", () => {
    expect(explain("KeyError")).toContain("Прочитай її текст");
  });
});
