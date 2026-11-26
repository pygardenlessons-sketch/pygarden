// Перевірки вмісту курсу: ловлять помилки, коли додаєш нові розділи, квести чи ділянки.

import { describe, expect, it } from "vitest";
import { BLANK } from "../game/check-answer.ts";
import {
  CHAPTERS,
  currentChapter,
  isChapterOpen,
  isQuest,
  questsOf,
} from "./course.ts";

const allSteps = CHAPTERS.flatMap((chapter) => chapter.steps);
const allSpots = CHAPTERS.flatMap((chapter) => chapter.zone.spots);

describe("курс", () => {
  it("id розділів, кроків і ділянок унікальні", () => {
    for (const ids of [
      CHAPTERS.map((c) => c.id),
      allSteps.map((s) => s.id),
      allSpots.map((s) => s.id),
    ]) {
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it.each(CHAPTERS)("розділ $id починається з поради", (chapter) => {
    expect(chapter.steps[0]?.kind).toBe("tip");
  });

  it.each(CHAPTERS)("розділ $id: зірочок рівно стільки, щоб відновити всю зону", (chapter) => {
    const totalCost = chapter.zone.spots.reduce((sum, spot) => sum + spot.cost, 0);
    expect(totalCost).toBe(questsOf(chapter).length);
  });

  it.each(allSpots)("ділянка $id стоїть у межах карти", (spot) => {
    for (const coordinate of [spot.x, spot.y]) {
      expect(coordinate).toBeGreaterThanOrEqual(0);
      expect(coordinate).toBeLessThanOrEqual(100);
    }
  });

  it.each(allSteps.filter(isQuest))("квест $id має завдання й непорожні підказки", (quest) => {
    expect(quest.task).not.toBe("");
    expect(quest.hints.length).toBeGreaterThanOrEqual(2);
    for (const hint of quest.hints) expect(hint.trim()).not.toBe("");
  });

  it.each(allSteps.filter((s) => s.kind === "fill-blank"))(
    "квест $id: перша підказка не видає відповідь",
    (quest) => {
      // Відповідь без лапок, без урахування регістру: "Привіт, сад!" → привіт, сад!
      const answer = quest.solution.replace(/^["']|["']$/g, "").toLowerCase();
      expect(quest.hints[0].toLowerCase()).not.toContain(answer);
    },
  );

  it.each(allSteps.filter((s) => s.kind === "fill-blank"))(
    "квест $id має рівно один пропуск",
    (quest) => {
      expect(quest.code.split(BLANK)).toHaveLength(2);
    },
  );
});

describe("відкриття розділів", () => {
  const [first, second] = CHAPTERS;
  const firstQuestIds = questsOf(first!).map((q) => q.id);

  it("перший розділ відкритий одразу, другий — ні", () => {
    expect(isChapterOpen(first!, [])).toBe(true);
    expect(isChapterOpen(second!, [])).toBe(false);
    expect(currentChapter([])).toBe(first);
  });

  it("другий розділ відкривається, коли перший пройдено повністю", () => {
    expect(isChapterOpen(second!, firstQuestIds.slice(1))).toBe(false);
    expect(isChapterOpen(second!, firstQuestIds)).toBe(true);
    expect(currentChapter(firstQuestIds)).toBe(second);
  });
});
