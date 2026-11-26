// Екран саду: кожен розділ курсу має свою зону з зарослими ділянками,
// які гравець відновлює за зірочки.

import { useEffect, useState } from "react";
import { CHAPTERS, currentChapter, findChapter, isChapterOpen } from "../data/course.ts";
import type { Chapter, GardenSpot } from "../data/types.ts";
import { starBalance, unlockSpot, useProgress, type Progress } from "../game/progress.ts";
import { UnlockDialog } from "./UnlockDialog.tsx";

export function GardenView({ zoneId }: { zoneId?: string }) {
  const progress = useProgress();
  const balance = starBalance(progress);
  const [selected, setSelected] = useState<GardenSpot | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  // Закрита або невідома зона — показуємо першу відкриту зону, яку ще не відновлено
  // (або зону поточного розділу, якщо все відновлено)
  const requested = findChapter(zoneId);
  const chapter =
    requested && isChapterOpen(requested, progress.completed)
      ? requested
      : (CHAPTERS.find(
          (c) =>
            isChapterOpen(c, progress.completed) &&
            c.zone.spots.some((spot) => !progress.unlocked.includes(spot.id)),
        ) ?? currentChapter(progress.completed));
  const { zone } = chapter;

  // Фіксуємо обрану зону в адресі (#garden → #garden/print), щоб сад не перескакував
  // на іншу зону, щойно гравець відновить останню ділянку поточної
  useEffect(() => {
    if (zoneId === chapter.id) return;
    history.replaceState(null, "", `#garden/${chapter.id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [zoneId, chapter.id]);

  function handleUnlock(spot: GardenSpot) {
    if (unlockSpot(spot.id)) setJustUnlocked(spot.id);
    setSelected(null);
  }

  return (
    <main className="page garden-page">
      <nav className="zone-tabs" aria-label="Зони саду">
        {CHAPTERS.map((c, i) =>
          isChapterOpen(c, progress.completed) ? (
            <a
              key={c.id}
              href={`#garden/${c.id}`}
              className="zone-tab"
              aria-current={c === chapter ? "page" : undefined}
            >
              {c.zone.emoji} {c.zone.name}
            </a>
          ) : (
            <span
              key={c.id}
              className="zone-tab zone-tab--locked"
              title={`Пройди розділ ${i}, щоб відкрити`}
            >
              🔒 {c.zone.name}
            </span>
          ),
        )}
      </nav>

      <div className={`garden-map garden-map--${zone.layout}`} aria-label={`Зона «${zone.name}»`}>
        {zone.spots.map((spot) => (
          <Spot
            key={spot.id}
            spot={spot}
            unlocked={progress.unlocked.includes(spot.id)}
            affordable={balance >= spot.cost}
            justUnlocked={spot.id === justUnlocked}
            onSelect={() => setSelected(spot)}
          />
        ))}
      </div>

      <ZoneHint chapter={chapter} progress={progress} balance={balance} />

      <UnlockDialog
        spot={selected}
        balance={balance}
        questsHref={`#quests/${chapter.id}`}
        onUnlock={handleUnlock}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

type SpotProps = {
  spot: GardenSpot;
  unlocked: boolean;
  affordable: boolean;
  justUnlocked: boolean;
  onSelect: () => void;
};

function Spot({ spot, unlocked, affordable, justUnlocked, onSelect }: SpotProps) {
  const position = { left: `${spot.x}%`, top: `${spot.y}%` };

  if (unlocked) {
    return (
      <div className={`spot spot--open${justUnlocked ? " spot--just-unlocked" : ""}`} style={position}>
        <span className="spot-icon">{spot.emoji}</span>
        <span className="spot-label">{spot.name}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`spot spot--locked${affordable ? " spot--affordable" : ""}`}
      style={position}
      aria-label={`${spot.name}: заросло, відновити за ${spot.cost} ⭐`}
      onClick={onSelect}
    >
      <span className="spot-icon">🌿</span>
      <span className="spot-cost">🔒 ⭐{spot.cost}</span>
    </button>
  );
}

function ZoneHint({
  chapter,
  progress,
  balance,
}: {
  chapter: Chapter;
  progress: Progress;
  balance: number;
}) {
  const { zone } = chapter;
  const index = CHAPTERS.indexOf(chapter);
  const nextChapter = CHAPTERS[index + 1];
  const zoneDone = zone.spots.every((spot) => progress.unlocked.includes(spot.id));
  const anyUnlocked = zone.spots.some((spot) => progress.unlocked.includes(spot.id));

  let text: string;
  let link: { href: string; label: string } | null = null;

  if (zoneDone) {
    if (!nextChapter) {
      text = `Зону «${zone.name}» відновлено! 🎉 Нові зони — незабаром.`;
    } else if (isChapterOpen(nextChapter, progress.completed)) {
      text = `Зону «${zone.name}» відновлено! 🎉 На тебе чекає наступна зона.`;
      link = {
        href: `#garden/${nextChapter.id}`,
        label: `${nextChapter.zone.emoji} ${nextChapter.zone.name} →`,
      };
    } else {
      text = `Зону «${zone.name}» відновлено! 🎉 Пройди розділ ${index + 1} до кінця, щоб відкрити зону «${nextChapter.zone.name}».`;
      link = { href: `#quests/${chapter.id}`, label: "До квестів →" };
    }
  } else if (balance > 0) {
    text = `У тебе ⭐${balance}. Торкнись зарослої ділянки, щоб відновити її.`;
  } else {
    text = anyUnlocked
      ? "Зірочки закінчились. Пройди ще квест, щоб відновлювати зону далі."
      : `Зона «${zone.name}» давно заросла. Проходь квести розділу «${chapter.title}», отримуй ⭐ і відновлюй її.`;
    link = { href: `#quests/${chapter.id}`, label: "До квестів →" };
  }

  return (
    <div className="garden-hint" role="status" aria-live="polite">
      <p>{text}</p>
      {link && (
        <a href={link.href} className="button">
          {link.label}
        </a>
      )}
    </div>
  );
}
