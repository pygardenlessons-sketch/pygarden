// Екран квестів: перемикач квестів і картка поточного квесту.

import { useState } from "react";
import { QUESTS } from "../data/quests.ts";
import { useProgress } from "../game/progress.ts";
import { QuestCard } from "./QuestCard.tsx";

export function QuestsView({ hidden }: { hidden: boolean }) {
  const progress = useProgress();
  const [index, setIndex] = useState(() => {
    const firstUnsolved = QUESTS.findIndex((quest) => !progress.completed.includes(quest.id));
    return firstUnsolved === -1 ? 0 : firstUnsolved;
  });
  // Ставити курсор у поле лише коли гравець сам перемкнув квест,
  // а не при завантаженні сторінки (на телефоні це відкрило б клавіатуру)
  const [focusInput, setFocusInput] = useState(false);

  const quest = QUESTS[index]!;
  const solved = progress.completed.includes(quest.id);

  function openQuest(newIndex: number) {
    setIndex(newIndex);
    setFocusInput(true);
  }

  return (
    <main className="page" hidden={hidden}>
      <nav className="quest-nav" aria-label="Квести">
        {QUESTS.map((q, i) => (
          <button
            key={q.id}
            type="button"
            className="quest-dot"
            title={q.title}
            aria-current={i === index ? "step" : undefined}
            onClick={() => openQuest(i)}
          >
            {progress.completed.includes(q.id) ? "⭐" : i + 1}
          </button>
        ))}
      </nav>

      {/* key: при зміні квесту картка створюється заново з чистим станом */}
      <QuestCard
        key={quest.id}
        quest={quest}
        number={index + 1}
        solved={solved}
        savedAnswer={progress.answers[quest.id] ?? ""}
        autoFocus={focusInput && !solved}
        onNext={index < QUESTS.length - 1 ? () => openQuest(index + 1) : undefined}
      />
    </main>
  );
}
