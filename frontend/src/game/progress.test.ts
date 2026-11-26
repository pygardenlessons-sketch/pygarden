import { describe, expect, it } from "vitest";
import { starBalance, type Progress } from "./progress.ts";

const progress = (completed: string[], unlocked: string[] = []): Progress => ({
  completed,
  answers: {},
  unlocked,
});

describe("starBalance", () => {
  it("новий гравець — нуль зірочок", () => {
    expect(starBalance(progress([]))).toBe(0);
  });

  it("кожен пройдений квест дає зірочку", () => {
    expect(starBalance(progress(["a", "b", "c"]))).toBe(3);
  });

  it("відновлені ділянки віднімають свою вартість", () => {
    // клумба коштує 1, фонтан — 2
    expect(starBalance(progress(["a", "b", "c"], ["flowerbed", "fountain"]))).toBe(0);
  });

  it("невідомі ділянки (наприклад, перейменовані) не враховуються", () => {
    expect(starBalance(progress(["a"], ["old-spot"]))).toBe(1);
  });
});
