// Перевірки вмісту гри: ловлять помилки, коли додаєш нові квести чи ділянки.

import { describe, expect, it } from "vitest";
import { GARDEN_SPOTS } from "./garden.ts";
import { BLANK, QUESTS } from "./quests.ts";

describe("квести", () => {
  it("мають унікальні id", () => {
    const ids = QUESTS.map((quest) => quest.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(QUESTS)("квест $id має рівно один пропуск", (quest) => {
    expect(quest.code.split(BLANK)).toHaveLength(2);
  });

  it.each(QUESTS)("квест $id має завдання, очікуваний вивід і підказку", (quest) => {
    expect(quest.task).not.toBe("");
    expect(quest.expected).not.toBe("");
    expect(quest.hint).not.toBe("");
  });
});

describe("сад", () => {
  it("ділянки мають унікальні id", () => {
    const ids = GARDEN_SPOTS.map((spot) => spot.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("пройшовши всі квести, можна відновити весь сад", () => {
    const totalCost = GARDEN_SPOTS.reduce((sum, spot) => sum + spot.cost, 0);
    expect(totalCost).toBe(QUESTS.length);
  });

  it.each(GARDEN_SPOTS)("ділянка $id стоїть у межах карти", (spot) => {
    for (const coordinate of [spot.x, spot.y]) {
      expect(coordinate).toBeGreaterThanOrEqual(0);
      expect(coordinate).toBeLessThanOrEqual(100);
    }
  });
});
