import type { Route } from "../App.tsx";
import { starBalance, useProgress } from "../game/progress.ts";

const TABS: { route: Route; label: string }[] = [
  { route: "garden", label: "🌳 Сад" },
  { route: "quests", label: "📜 Квести" },
];

export function TopBar({ route }: { route: Route }) {
  const progress = useProgress();

  return (
    <header className="top-bar">
      <span className="logo">
        🌱 <span className="logo-text">PyGarden</span>
      </span>
      <nav className="tabs" aria-label="Розділи">
        {TABS.map((tab) => (
          <a
            key={tab.route}
            className="tab"
            href={`#${tab.route}`}
            aria-current={tab.route === route ? "page" : undefined}
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
