import type { View } from "../App.tsx";
import { starBalance, useProgress } from "../game/progress.ts";

const TABS: { view: View; label: string }[] = [
  { view: "garden", label: "🌳 Сад" },
  { view: "quests", label: "📜 Квести" },
];

export function TopBar({ view }: { view: View }) {
  const progress = useProgress();

  return (
    <header className="top-bar">
      <span className="logo">
        🌱 <span className="logo-text">PyGarden</span>
      </span>
      <nav className="tabs" aria-label="Розділи">
        {TABS.map((tab) => (
          <a
            key={tab.view}
            className="tab"
            href={`#${tab.view}`}
            aria-current={tab.view === view ? "page" : undefined}
          >
            {tab.label}
          </a>
        ))}
      </nav>
      <span className="stars" aria-label="Зірочки">
        ⭐ {starBalance(progress)}
      </span>
    </header>
  );
}
