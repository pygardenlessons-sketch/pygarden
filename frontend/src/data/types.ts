// Типи вмісту гри. Курс складається з розділів; кожен розділ — це тема Python
// і зона саду, яку гравець відновлює за зірочки з квестів цього розділу.

/** Порада садівника: коротке пояснення нової ідеї з прикладом, який можна запустити. */
export type Tip = {
  kind: "tip";
  id: string;
  title: string;
  /** 2–3 речення простою мовою. */
  text: string;
  /** Робочий код, який гравець може запустити кнопкою. */
  example: string;
};

/**
 * Ступінчасті підказки: після першої помилки гравець бачить першу, після
 * другої — другу і т. д. Перша лише наштовхує на думку, остання може майже
 * дати відповідь, щоб гравець не застряг. Тест перевіряє, що перша підказка
 * не містить відповіді.
 */
export type Hints = [first: string, second: string, ...more: string[]];

/** Квест «Заповни пропуск»: у коді є `___`, гравець вписує пропущене. */
export type FillBlankQuest = {
  kind: "fill-blank";
  id: string;
  title: string;
  task: string;
  /** Код рівно з одним пропуском `___`. */
  code: string;
  /** Правильна відповідь (тест перевіряє, що з нею код виводить `expected`). */
  solution: string;
  /** Що має вивести код. Зараховується будь-яка відповідь, що дає такий вивід. */
  expected: string;
  hints: Hints;
};

/** Квест «Передбач вивід»: код готовий, гравець пише, що він виведе. */
export type PredictQuest = {
  kind: "predict";
  id: string;
  title: string;
  task: string;
  /** Код, який гравець читає. Правильна відповідь — його справжній вивід. */
  code: string;
  hints: Hints;
};

export type Quest = FillBlankQuest | PredictQuest;
export type Step = Tip | Quest;

export type GardenSpot = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  /** Положення центру ділянки на карті у відсотках. */
  x: number;
  y: number;
};

export type Zone = {
  name: string;
  emoji: string;
  /** Вигляд карти: доріжки, паркан тощо (див. styles.css, .garden-map--…). */
  layout: "gate" | "flowerbeds";
  spots: GardenSpot[];
};

export type Chapter = {
  id: string;
  /** Тема Python, наприклад «Змінні». */
  title: string;
  zone: Zone;
  steps: Step[];
};
