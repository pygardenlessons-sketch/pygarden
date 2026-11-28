// Запускає код кожного квесту й поради справжнім Python (тим, що встановлений
// на комп'ютері або в CI) і перевіряє, що вміст курсу правильний:
//   - «Заповни пропуск»: з правильною відповіддю код виводить саме `expected`;
//   - «Передбач вивід» і поради: код виконується без помилок.
// Так помилку в завданні знайде тест, а не гравець.

import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { BLANK, buildWriteCode, checkRequirements, normalizeOutput } from "../game/check-answer.ts";
import { CHAPTERS } from "./course.ts";

function findPython(): string | null {
  for (const command of ["python3", "python"]) {
    const result = spawnSync(command, ["--version"], { encoding: "utf8" });
    if (result.status === 0) return command;
  }
  return null;
}

const python = findPython();

function runPython(code: string) {
  const result = spawnSync(python!, ["-c", code], {
    encoding: "utf8",
    env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
  });
  return { ok: result.status === 0, output: normalizeOutput(result.stdout), error: result.stderr };
}

const steps = CHAPTERS.flatMap((chapter) => chapter.steps);

describe.skipIf(!python)("вміст курсу в справжньому Python", () => {
  it.each(steps.filter((s) => s.kind === "fill-blank"))(
    "квест $id: правильна відповідь дає очікуваний вивід",
    (quest) => {
      const result = runPython(quest.code.replace(BLANK, quest.solution));
      expect(result.error).toBe("");
      expect(result.output).toBe(normalizeOutput(quest.expected));
    },
  );

  it.each(steps.filter((s) => s.kind === "predict"))(
    "квест $id: код виконується й щось виводить",
    (quest) => {
      const result = runPython(quest.code);
      expect(result.error).toBe("");
      expect(result.output).not.toBe("");
    },
  );

  it.each(steps.filter((s) => s.kind === "predict"))(
    "квест $id: перша підказка не видає жодного рядка виводу",
    (quest) => {
      const hint = quest.hints[0].toLowerCase();
      for (const line of runPython(quest.code).output.split("\n")) {
        // Короткі рядки на кшталт "7" чи "3" можуть випадково трапитись у тексті
        if (line.length >= 3) expect(hint).not.toContain(line.toLowerCase());
      }
    },
  );

  const writeQuests = steps.filter((s) => s.kind === "write");

  it.each(writeQuests)("квест $id: зразок розв'язку проходить усі набори даних", (quest) => {
    for (const testCase of quest.cases) {
      const result = runPython(buildWriteCode(testCase, quest.solution));
      expect(result.error).toBe("");
      expect(result.output).toBe(normalizeOutput(testCase.expected));
    }
  });

  it.each(writeQuests)("квест $id: зразок розв'язку виконує вимоги", (quest) => {
    expect(checkRequirements(quest, quest.solution)).toBeNull();
  });

  it.each(writeQuests)("квест $id: стартовий код сам по собі не проходить", (quest) => {
    const first = quest.cases[0];
    const result = runPython(buildWriteCode(first, quest.starter));
    expect(result.ok && result.output === normalizeOutput(first.expected)).toBe(false);
  });

  it.each(steps.filter((s) => s.kind === "tip"))("порада $id: приклад працює", (tip) => {
    const result = runPython(tip.example);
    expect(result.error).toBe("");
  });
});
