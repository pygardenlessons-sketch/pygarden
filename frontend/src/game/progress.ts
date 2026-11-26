// Прогрес гравця. Поки що зберігається в localStorage браузера;
// згодом сюди додасться синхронізація з бекендом.
//
// Компоненти читають прогрес через хук useProgress() і автоматично
// перемальовуються, коли він змінюється.

import { useSyncExternalStore } from "react";
import { ALL_SPOTS } from "../data/course.ts";

export type Progress = {
  /** id пройдених квестів */
  completed: string[];
  /** правильні відповіді, щоб показати їх, коли гравець повернеться до квесту */
  answers: Record<string, string>;
  /** id відновлених ділянок саду */
  unlocked: string[];
};

// v2: курс перебудовано на розділи, тож прогрес прототипу (v1) не переносимо
const STORAGE_KEY = "pygarden.progress.v2";
const EMPTY: Progress = { completed: [], answers: {}, unlocked: [] };

function load(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Progress> | null;
    return {
      completed: saved?.completed ?? [],
      answers: saved?.answers ?? {},
      unlocked: saved?.unlocked ?? [],
    };
  } catch {
    return EMPTY;
  }
}

let state: Progress = typeof localStorage === "undefined" ? EMPTY : load();
const listeners = new Set<() => void>();

function update(next: Progress) {
  state = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, () => state);
}

// ---------- Розрахунки (чисті функції — легко тестувати) ----------

/** Скільки зірочок можна витратити: зароблені мінус витрачені на сад. */
export function starBalance(progress: Progress): number {
  const spent = ALL_SPOTS.filter((spot) => progress.unlocked.includes(spot.id)).reduce(
    (sum, spot) => sum + spot.cost,
    0,
  );
  return progress.completed.length - spent;
}

// ---------- Дії гравця ----------

export function completeQuest(questId: string, answer: string) {
  update({
    ...state,
    completed: state.completed.includes(questId) ? state.completed : [...state.completed, questId],
    answers: { ...state.answers, [questId]: answer },
  });
}

/** Відновити ділянку саду. Повертає false, якщо зірочок не вистачає. */
export function unlockSpot(spotId: string): boolean {
  const spot = ALL_SPOTS.find((s) => s.id === spotId);
  if (!spot || state.unlocked.includes(spotId) || starBalance(state) < spot.cost) return false;
  update({ ...state, unlocked: [...state.unlocked, spotId] });
  return true;
}
