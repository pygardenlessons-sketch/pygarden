// Діалог «Відновити ділянку?». Використовує вбудований елемент <dialog>:
// він сам затемнює фон, тримає фокус усередині й закривається клавішею Esc.

import { useEffect, useRef } from "react";
import type { GardenSpot } from "../data/garden.ts";

type Props = {
  /** Обрана ділянка; null — діалог закритий. */
  spot: GardenSpot | null;
  balance: number;
  onUnlock: (spot: GardenSpot) => void;
  onClose: () => void;
};

export function UnlockDialog({ spot, balance, onUnlock, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (spot && !dialog.open) dialog.showModal();
    if (!spot && dialog.open) dialog.close();
  }, [spot]);

  const canAfford = spot !== null && balance >= spot.cost;

  return (
    <dialog ref={dialogRef} className="dialog" onClose={onClose}>
      {spot && (
        <>
          <h2>{canAfford ? `Відновити: ${spot.name}?` : `${spot.name}: поки заросло`}</h2>
          <p>
            {canAfford
              ? `Це коштує ⭐${spot.cost}. У тебе ⭐${balance}.`
              : `Щоб відновити, потрібно ⭐${spot.cost}, а в тебе ⭐${balance}. Пройди ще квест — і повертайся!`}
          </p>
          <div className="actions">
            {canAfford ? (
              <button type="button" className="button" onClick={() => onUnlock(spot)}>
                Відновити
              </button>
            ) : (
              <a href="#quests" className="button" onClick={onClose}>
                До квестів →
              </a>
            )}
            <button type="button" className="button button--secondary" onClick={onClose}>
              Скасувати
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
