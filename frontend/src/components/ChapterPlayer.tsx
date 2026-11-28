// Проходження розділу: перемикач кроків (поради й квести) і поточний крок.

import { useState } from "react";
import { CHAPTERS, isChapterDone, isQuest } from "../data/course.ts";
import type { Chapter, Step } from "../data/types.ts";
import { useProgress } from "../game/progress.ts";
import { FillBlankCard } from "./FillBlankCard.tsx";
import { PredictCard } from "./PredictCard.tsx";
import { TipCard } from "./TipCard.tsx";
import { WriteCard } from "./WriteCard.tsx";

/** З якого кроку почати: перший непройдений квест (або порада перед ним). */
function firstStepIndex(steps: Step[], completed: string[]): number {
  const index = steps.findIndex((step) => isQuest(step) && !completed.includes(step.id));
  if (index === -1) return 0;
  return steps[index - 1]?.kind === "tip" ? index - 1 : index;
}

export function ChapterPlayer({ chapter }: { chapter: Chapter }) {
  const progress = useProgress();
  const [index, setIndex] = useState(() => firstStepIndex(chapter.steps, progress.completed));
  // Ставити курсор у поле лише коли гравець сам перемкнув крок,
  // а не при відкритті розділу (на телефоні це відкрило б клавіатуру)
  const [focusInput, setFocusInput] = useState(false);

  const chapterNumber = CHAPTERS.indexOf(chapter) + 1;
  const nextChapter = CHAPTERS[chapterNumber];
  const step = chapter.steps[index]!;
  const isLast = index === chapter.steps.length - 1;
  const solved = isQuest(step) && progress.completed.includes(step.id);
  const chapterDone = isChapterDone(chapter, progress.completed);

  function goTo(newIndex: number) {
    setIndex(newIndex);
    setFocusInput(true);
    window.scrollTo(0, 0);
  }

  // Номер квесту серед квестів розділу (поради не рахуємо)
  const questNumber = (i: number) => chapter.steps.slice(0, i + 1).filter(isQuest).length;

  const nextButton = !isLast && (
    <button
      type="button"
      className={step.kind === "tip" ? "button" : "button button--secondary"}
      onClick={() => goTo(index + 1)}
    >
      Далі →
    </button>
  );

  const gardenButton = (
    <a href={`#garden/${chapter.id}`} className="button button--secondary">
      🌳 До саду
    </a>
  );

  return (
    <main className="page">
      <a href="#quests" className="back-link">
        ← Усі розділи
      </a>
      <h2 className="chapter-title">
        Розділ {chapterNumber}. {chapter.title}
      </h2>

      <nav className="quest-nav" aria-label="Кроки розділу">
        {chapter.steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`quest-dot${s.kind === "tip" ? " quest-dot--tip" : ""}`}
            title={s.title}
            aria-current={i === index ? "step" : undefined}
            onClick={() => goTo(i)}
          >
            {s.kind === "tip" ? "💡" : progress.completed.includes(s.id) ? "⭐" : questNumber(i)}
          </button>
        ))}
      </nav>

      {step.kind === "tip" && <TipCard key={step.id} tip={step} actions={nextButton} />}

      {isQuest(step) &&
        (() => {
          const props = {
            heading: `Квест ${questNumber(index)}. ${step.title}`,
            solved,
            savedAnswer: progress.answers[step.id] ?? "",
            autoFocus: focusInput && !solved,
            // Коли розділ пройдено, кнопки переходу показує банер нижче
            actions: solved && !(chapterDone && isLast) && (
              <>
                {nextButton}
                {gardenButton}
              </>
            ),
          };
          // key: при зміні кроку картка створюється заново з чистим станом
          if (step.kind === "fill-blank") {
            return <FillBlankCard key={step.id} quest={step} {...props} />;
          }
          if (step.kind === "predict") {
            return <PredictCard key={step.id} quest={step} {...props} />;
          }
          return <WriteCard key={step.id} quest={step} {...props} />;
        })()}

      {chapterDone && isLast && (
        <section className="chapter-done" role="status">
          <h2>🎉 Розділ «{chapter.title}» пройдено!</h2>
          {nextChapter ? (
            <p>
              Відкрито розділ {chapterNumber + 1} «{nextChapter.title}» і нову зону саду —{" "}
              {nextChapter.zone.emoji} {nextChapter.zone.name}.
            </p>
          ) : (
            <p>Нові розділи — незабаром. А поки відновлюй сад!</p>
          )}
          <div className="actions">
            {nextChapter && (
              <a href={`#quests/${nextChapter.id}`} className="button">
                Наступний розділ →
              </a>
            )}
            {gardenButton}
          </div>
        </section>
      )}
    </main>
  );
}
