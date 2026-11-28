// Розділ 11. Модулі → зона «Фруктовий сад».
// Як редагувати — див. коментар у 01-print.ts.
// Увага: random дає щоразу різні числа, тому в квестах із ним перевіряємо
// не саме число, а властивість (наприклад, що воно в потрібних межах).

import type { Chapter } from "../types.ts";

export const chapterModules: Chapter = {
  id: "modules",
  title: "Модулі",
  zone: {
    name: "Фруктовий сад",
    emoji: "🍎",
    layout: "orchard",
    spots: [
      { id: "orch-apple", name: "Яблуня", emoji: "🍎", cost: 1, x: 20, y: 24 },
      { id: "orch-pear", name: "Груша", emoji: "🍐", cost: 1, x: 50, y: 20 },
      { id: "orch-cherry", name: "Вишня", emoji: "🍒", cost: 1, x: 80, y: 24 },
      { id: "orch-peach", name: "Персик", emoji: "🍑", cost: 1, x: 20, y: 74 },
      { id: "orch-blueberry", name: "Лохина", emoji: "🫐", cost: 1, x: 80, y: 74 },
      { id: "orch-squirrel", name: "Білка", emoji: "🐿️", cost: 2, x: 50, y: 56 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "mod-tip-import",
      title: "Готові інструменти",
      text:
        "Модуль — це набір готових команд, які написали інші програмісти. import math підключає " +
        "математичний модуль, а його команди викликають через крапку: math.sqrt() — квадратний корінь.",
      example: "import math\nprint(math.sqrt(16))\nprint(math.pi)",
    },
    {
      kind: "predict",
      id: "mod-sqrt",
      title: "Квадратна грядка",
      task: "Грядка має площу 25 м² і квадратну форму. Яка довжина сторони? Що виведе код?",
      code: "import math\nprint(math.sqrt(25))",
      hints: [
        "Що робить math.sqrt()? Згадай пораду.",
        "Квадратний корінь із 25 — число, яке при множенні саме на себе дає 25. math.sqrt повертає число з крапкою.",
        "П'ять — але записане з крапкою й нулем.",
      ],
    },
    {
      kind: "fill-blank",
      id: "mod-import",
      title: "Підключи модуль",
      task: "Код використовує math.floor(), але модуль не підключено. Допиши, що імпортувати.",
      code: "import ___\nprint(math.floor(7.8))",
      solution: "math",
      expected: "7",
      hints: [
        "Який модуль має команду floor()? Подивись на другий рядок.",
        "Назва модуля стоїть перед крапкою у виклику команди.",
        "Впиши назву математичного модуля — чотири латинські літери.",
      ],
    },
    {
      kind: "tip",
      id: "mod-tip-round",
      title: "Округлення",
      text:
        "math.floor() округлює вниз, math.ceil() — вгору. А звичайна команда round(x, 2) " +
        "округлює до 2 знаків після крапки — її імпортувати не треба.",
      example: "import math\nprint(math.ceil(4.1))\nprint(round(3.14159, 2))",
    },
    {
      kind: "predict",
      id: "mod-ceil",
      title: "Скільки ящиків",
      task: "На 9.2 кг вишень потрібні ящики по 1 кг. Що виведе код?",
      code: "import math\nprint(math.ceil(9.2))",
      hints: [
        "ceil округлює вниз чи вгору?",
        "math.ceil() завжди округлює вгору до цілого — щоб усі вишні влізли.",
        "Найближче ціле число, більше за 9.2.",
      ],
    },
    {
      kind: "tip",
      id: "mod-tip-random",
      title: "Випадковість",
      text:
        "Модуль random дає випадкові значення: random.randint(1, 6) — ціле число від 1 до 6 " +
        "(обидва кінці входять), random.choice(список) — випадковий елемент. Запусти приклад кілька разів!",
      example: 'import random\nprint(random.randint(1, 6))\nprint(random.choice(["яблуко", "груша"]))',
    },
    {
      kind: "fill-blank",
      id: "mod-choice",
      title: "Випадковий сорт",
      task: "Обери випадковий сорт яблук зі списку. Код має вивести True — бо обраний сорт є у списку.",
      code: 'import random\nsorts = ["антонівка", "ренет", "голден"]\napple = random.___(sorts)\nprint(apple in sorts)',
      solution: "choice",
      expected: "True",
      hints: [
        "Яка команда random обирає випадковий елемент зі списку?",
        "Ця команда англійською означає «вибір».",
        "Впиши choice — без крапки й дужок.",
      ],
    },
    {
      kind: "predict",
      id: "mod-randint",
      title: "Межі",
      task: "randint щоразу дає інше число. Але що виведе цей код?",
      code: "import random\nn = random.randint(1, 10)\nprint(1 <= n <= 10)",
      hints: [
        "Чи може randint(1, 10) дати число поза межами від 1 до 10?",
        "randint(1, 10) дає число від 1 до 10 включно, тож перевірка завжди справджується.",
        "Ця умова завжди правдива — англійською, з великої літери.",
      ],
    },
    {
      kind: "tip",
      id: "mod-tip-from",
      title: "from … import",
      text:
        "from math import sqrt підключає лише одну команду — тоді її викликають без «math.»: просто sqrt(9).",
      example: "from math import sqrt\nprint(sqrt(9))",
    },
    {
      kind: "fill-blank",
      id: "mod-from",
      title: "Коротше",
      task: "Допиши, яку команду імпортувати, щоб код спрацював.",
      code: "from math import ___\nprint(sqrt(49))",
      solution: "sqrt",
      expected: "7.0",
      hints: [
        "Яку команду викликають у другому рядку без «math.»?",
        "Імпортувати треба саме ту команду, яку потім викликають.",
        "Впиши назву команди квадратного кореня — без дужок.",
      ],
    },
    {
      kind: "write",
      id: "mod-baskets",
      title: "Кошики для яблук",
      task:
        "У змінній apples — кількість яблук. У кошик вміщається 10 яблук. Підключи math і виведи, " +
        "скільки потрібно кошиків, щоб уміщалися всі яблука (округли вгору).",
      starter: "",
      cases: [
        { given: "apples = 23", expected: "3" },
        { given: "apples = 40", expected: "4" },
        { given: "apples = 1", expected: "1" },
      ],
      requires: [{ anyOf: ["import"], message: "Підключи модуль math через import — там є округлення вгору." }],
      solution: "import math\nprint(math.ceil(apples / 10))",
      hints: [
        "Поділи кількість яблук на 10. Яка команда math округлює вгору?",
        "import math, а потім print(math.ceil(...)) — у дужках поділи apples на 10.",
        "import math  і  print(math.ceil(apples / 10))",
      ],
    },
  ],
};
