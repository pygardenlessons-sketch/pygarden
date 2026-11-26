// Екран саду: зарослі ділянки, які гравець відновлює за зірочки.

import { useState } from "react";
import { GARDEN_SPOTS, type GardenSpot } from "../data/garden.ts";
import { starBalance, unlockSpot, useProgress } from "../game/progress.ts";
import { UnlockDialog } from "./UnlockDialog.tsx";

export function GardenView({ hidden }: { hidden: boolean }) {
  const progress = useProgress();
  const balance = starBalance(progress);
  const [selected, setSelected] = useState<GardenSpot | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  function handleUnlock(spot: GardenSpot) {
    if (unlockSpot(spot.id)) setJustUnlocked(spot.id);
    setSelected(null);
  }

  return (
    <main className="page" hidden={hidden}>
      <div className="garden-map" aria-label="Карта саду">
        {GARDEN_SPOTS.map((spot) => (
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

      <GardenHint balance={balance} unlockedCount={progress.unlocked.length} />

      <UnlockDialog
        spot={selected}
        balance={balance}
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

function GardenHint({ balance, unlockedCount }: { balance: number; unlockedCount: number }) {
  const allOpen = unlockedCount === GARDEN_SPOTS.length;

  let text: string;
  let showQuestsLink = false;
  if (allOpen) {
    text = "Сад відновлено! 🎉 Нові квести й ділянки — незабаром.";
  } else if (balance > 0) {
    text = `У тебе ⭐${balance}. Торкнись зарослої ділянки, щоб відновити її.`;
  } else {
    showQuestsLink = true;
    text =
      unlockedCount === 0
        ? "Сад давно заріс. Проходь квести, отримуй ⭐ і відновлюй його ділянку за ділянкою."
        : "Зірочки закінчились. Пройди ще квест, щоб відновлювати сад далі.";
  }

  return (
    <div className="garden-hint" role="status" aria-live="polite">
      <p>{text}</p>
      {showQuestsLink && (
        <a href="#quests" className="button">
          До квестів →
        </a>
      )}
    </div>
  );
}
