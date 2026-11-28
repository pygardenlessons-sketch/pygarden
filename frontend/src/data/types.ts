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

/**
 * Один набір даних для перевірки квесту «Напиши сам»:
 * код гравця виконується як  given + код гравця + after,
 * і його вивід має збігтися з expected.
 */
export type WriteCase = {
  /** Код, що виконується ДО коду гравця (наприклад, задає змінні). Гравець бачить його як «Дано». */
  given?: string;
  /** Код, що виконується ПІСЛЯ коду гравця (наприклад, викликає його функцію). */
  after?: string;
  expected: string;
};

/** Вимога до коду гравця, наприклад «використай цикл». */
export type Requirement = {
  /** Код має містити хоча б один із цих фрагментів. */
  anyOf: string[];
  /** Що сказати гравцеві, якщо вимогу не виконано. */
  message: string;
};

/**
 * Квест «Напиши сам»: гравець пише код у редакторі. Код перевіряється на
 * кількох наборах даних (cases), тож просто вивести потрібну відповідь не вийде.
 */
export type WriteQuest = {
  kind: "write";
  id: string;
  title: string;
  task: string;
  /** Що вже написано в редакторі на початку (може бути порожнім). */
  starter: string;
  /** Набори даних для перевірки; перший гравець бачить у завданні. */
  cases: [WriteCase, ...WriteCase[]];
  requires?: Requirement[];
  /** Зразок розв'язку (тест перевіряє, що він проходить усі cases). */
  solution: string;
  hints: Hints;
};

export type Quest = FillBlankQuest | PredictQuest | WriteQuest;
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
  layout:
    | "gate"
    | "flowerbeds"
    | "vegetables"
    | "gazebo"
    | "greenhouse"
    | "pond"
    | "pantry"
    | "workshop"
    | "herbs"
    | "apiary"
    | "orchard"
    | "lawn";
  spots: GardenSpot[];
};

export type Chapter = {
  id: string;
  /** Тема Python, наприклад «Змінні». */
  title: string;
  zone: Zone;
  steps: Step[];
};
