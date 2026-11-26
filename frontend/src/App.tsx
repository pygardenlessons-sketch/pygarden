// Головний компонент: шапка й два екрани — «Сад» і «Квести».
// Екран обирається за адресою:
//   #garden            — сад (зона поточного розділу)
//   #garden/variables  — зона розділу «Змінні»
//   #quests            — список розділів
//   #quests/variables  — проходження розділу «Змінні»
// Тож кнопка «Назад» у браузері й телефоні працює як очікується.

import { useEffect, useSyncExternalStore } from "react";
import { GardenView } from "./components/GardenView.tsx";
import { QuestsView } from "./components/QuestsView.tsx";
import { TopBar } from "./components/TopBar.tsx";

export type View = "garden" | "quests";

function subscribeToHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

function parseHash(hash: string): { view: View; id?: string } {
  const [view, id] = hash.replace(/^#/, "").split("/");
  return { view: view === "quests" ? "quests" : "garden", id: id || undefined };
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, () => location.hash);
  const { view, id } = parseHash(hash);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <>
      <TopBar view={view} />
      {view === "garden" ? <GardenView zoneId={id} /> : <QuestsView chapterId={id} />}
    </>
  );
}
