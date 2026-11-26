// Ділянки саду. Спершу вони зарослі; гравець відновлює їх за зірочки.
// x та y — положення центру ділянки на карті саду у відсотках.
// Сума вартостей = кількість квестів, тож пройшовши все, можна відновити весь сад
// (це перевіряє тест у data.test.ts).

export type GardenSpot = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  x: number;
  y: number;
};

export const GARDEN_SPOTS: GardenSpot[] = [
  { id: "flowerbed", name: "Клумба", emoji: "🌷", cost: 1, x: 20, y: 28 },
  { id: "apple-tree", name: "Яблуня", emoji: "🌳", cost: 1, x: 80, y: 26 },
  { id: "bench", name: "Лавка", emoji: "🪑", cost: 1, x: 26, y: 78 },
  { id: "fountain", name: "Фонтан", emoji: "⛲", cost: 2, x: 50, y: 52 },
];
