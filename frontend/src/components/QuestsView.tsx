// Екран квестів: список розділів або проходження відкритого розділу.

import { findChapter, isChapterOpen } from "../data/course.ts";
import { useProgress } from "../game/progress.ts";
import { ChapterList } from "./ChapterList.tsx";
import { ChapterPlayer } from "./ChapterPlayer.tsx";

export function QuestsView({ chapterId }: { chapterId?: string }) {
  const { completed } = useProgress();
  const chapter = findChapter(chapterId);

  // Закритий або невідомий розділ — показуємо список
  if (!chapter || !isChapterOpen(chapter, completed)) return <ChapterList />;

  // key: інший розділ — новий програвач із власним станом
  return <ChapterPlayer key={chapter.id} chapter={chapter} />;
}
