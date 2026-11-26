// Список розділів курсу з прогресом.

import { CHAPTERS, isChapterOpen, questsOf, solvedCount, UPCOMING } from "../data/course.ts";
import { useProgress } from "../game/progress.ts";

export function ChapterList() {
  const { completed } = useProgress();

  return (
    <main className="page">
      <h1 className="page-title">Розділи</h1>
      <ol className="chapter-list">
        {CHAPTERS.map((chapter, i) => {
          const open = isChapterOpen(chapter, completed);
          const total = questsOf(chapter).length;
          const solved = solvedCount(chapter, completed);
          const done = solved === total;
          const previous = CHAPTERS[i - 1];

          return (
            <li key={chapter.id} className={`chapter-item${open ? "" : " chapter-item--locked"}`}>
              <span className="chapter-emoji" aria-hidden="true">
                {open ? chapter.zone.emoji : "🔒"}
              </span>
              <div className="chapter-info">
                <h2>
                  Розділ {i + 1}. {chapter.title}
                </h2>
                <p>
                  {open
                    ? `Зона «${chapter.zone.name}» · ⭐ ${solved}/${total}`
                    : `Пройди розділ ${i} «${previous?.title}», щоб відкрити`}
                </p>
                {open && (
                  <div className="progress-bar" aria-hidden="true">
                    <div style={{ width: `${(solved / total) * 100}%` }} />
                  </div>
                )}
              </div>
              {open && (
                <a
                  href={`#quests/${chapter.id}`}
                  className={done ? "button button--secondary" : "button"}
                >
                  {done ? "Переглянути" : solved > 0 ? "Продовжити" : "Почати"}
                </a>
              )}
            </li>
          );
        })}

        {UPCOMING.map((upcoming, i) => (
          <li key={upcoming.title} className="chapter-item chapter-item--upcoming">
            <span className="chapter-emoji" aria-hidden="true">
              {upcoming.emoji}
            </span>
            <div className="chapter-info">
              <h2>
                Розділ {CHAPTERS.length + i + 1}. {upcoming.title}
              </h2>
              <p>Зона «{upcoming.zone}» · незабаром</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
