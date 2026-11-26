// Увесь курс: розділи по порядку й допоміжні функції.

import { chapterPrint } from "./chapters/01-print.ts";
import { chapterVariables } from "./chapters/02-variables.ts";
import type { Chapter, GardenSpot, Quest, Step } from "./types.ts";

export const CHAPTERS: Chapter[] = [chapterPrint, chapterVariables];

/** Наступні розділи за планом — показуються в списку як «Незабаром». */
export const UPCOMING: { title: string; zone: string; emoji: string }[] = [
  { title: "Числа й арифметика", zone: "Город", emoji: "🥕" },
  { title: "Рядки", zone: "Альтанка", emoji: "🏡" },
  { title: "Умови", zone: "Теплиця", emoji: "🌡️" },
  { title: "Цикли", zone: "Грядки", emoji: "🌱" },
  { title: "Списки", zone: "Комора", emoji: "🧺" },
  { title: "Функції", zone: "Майстерня", emoji: "🔨" },
  { title: "Словники", zone: "Каталог рослин", emoji: "📖" },
];

export const isQuest = (step: Step): step is Quest => step.kind !== "tip";

export const questsOf = (chapter: Chapter): Quest[] => chapter.steps.filter(isQuest);

export const ALL_SPOTS: GardenSpot[] = CHAPTERS.flatMap((chapter) => chapter.zone.spots);

export const findChapter = (id: string | undefined) => CHAPTERS.find((c) => c.id === id);

/** Скільки квестів розділу пройдено. */
export const solvedCount = (chapter: Chapter, completed: string[]) =>
  questsOf(chapter).filter((quest) => completed.includes(quest.id)).length;

export const isChapterDone = (chapter: Chapter, completed: string[]) =>
  solvedCount(chapter, completed) === questsOf(chapter).length;

/** Розділ відкритий, якщо це перший розділ або попередній пройдено повністю. */
export function isChapterOpen(chapter: Chapter, completed: string[]): boolean {
  const index = CHAPTERS.indexOf(chapter);
  const previous = CHAPTERS[index - 1];
  return index === 0 || (previous !== undefined && isChapterDone(previous, completed));
}

/** Останній відкритий розділ — з нього гравець продовжує. */
export function currentChapter(completed: string[]): Chapter {
  return CHAPTERS.findLast((chapter) => isChapterOpen(chapter, completed)) ?? CHAPTERS[0]!;
}
