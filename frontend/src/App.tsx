// Головний компонент: шапка й два екрани — «Сад» і «Квести».
// Екран обирається за адресою: pygarden.com/#garden або /#quests,
// тож кнопка «Назад» у браузері й телефоні працює як очікується.

import { useEffect, useSyncExternalStore } from "react";
import { GardenView } from "./components/GardenView.tsx";
import { QuestsView } from "./components/QuestsView.tsx";
import { TopBar } from "./components/TopBar.tsx";

export type Route = "garden" | "quests";

function readRoute(): Route {
  return location.hash === "#quests" ? "quests" : "garden";
}

function subscribeToHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

export default function App() {
  const route = useSyncExternalStore(subscribeToHash, readRoute);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  // Обидва екрани лишаються змонтованими (лише ховаємо неактивний),
  // щоб не губився стан: відкритий квест, введена відповідь тощо.
  return (
    <>
      <TopBar route={route} />
      <GardenView hidden={route !== "garden"} />
      <QuestsView hidden={route !== "quests"} />
    </>
  );
}
