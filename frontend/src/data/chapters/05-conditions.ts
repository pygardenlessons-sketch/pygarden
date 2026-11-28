// Розділ 5. Умови → зона «Теплиця».
// Як редагувати — див. коментар у 01-print.ts.

import type { Chapter } from "../types.ts";

export const chapterConditions: Chapter = {
  id: "conditions",
  title: "Умови",
  zone: {
    name: "Теплиця",
    emoji: "🌡️",
    layout: "greenhouse",
    spots: [
      { id: "gh-thermometer", name: "Термометр", emoji: "🌡️", cost: 1, x: 16, y: 30 },
      { id: "gh-seedlings", name: "Розсада", emoji: "🌱", cost: 1, x: 39, y: 30 },
      { id: "gh-cactus", name: "Кактус", emoji: "🌵", cost: 1, x: 61, y: 30 },
      { id: "gh-pepper", name: "Перець", emoji: "🌶️", cost: 1, x: 84, y: 30 },
      { id: "gh-strawberry", name: "Полуниця", emoji: "🍓", cost: 1, x: 16, y: 72 },
      { id: "gh-lemon", name: "Лимонне дерево", emoji: "🍋", cost: 2, x: 39, y: 72 },
      { id: "gh-eggplant", name: "Баклажани", emoji: "🍆", cost: 1, x: 61, y: 72 },
      { id: "gh-grapes", name: "Виноград", emoji: "🍇", cost: 1, x: 84, y: 72 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "cond-tip-compare",
      title: "Порівняння",
      text:
        "Python уміє порівнювати: > більше, < менше, >= не менше, <= не більше, " +
        "== дорівнює, != не дорівнює. Результат — True (правда) або False (неправда).",
      example: "print(5 > 3)\nprint(2 == 3)",
    },
    {
      kind: "predict",
      id: "cond-warm",
      title: "Тепло чи ні",
      task: "Що виведе цей код?",
      code: "temp = 18\nprint(temp > 20)",
      hints: [
        "Чи справді 18 більше за 20?",
        "Порівняння виводить не число, а одне з двох слів: True або False.",
        "18 не більше за 20 — отже, це неправда англійською.",
      ],
    },
    {
      kind: "fill-blank",
      id: "cond-equal",
      title: "Рівно 25 градусів",
      task: "Перевір, чи температура дорівнює 25. Код має вивести True.",
      code: "temp = 25\nprint(temp ___ 25)",
      solution: "==",
      expected: "True",
      hints: [
        "Згадай пораду: який знак перевіряє, чи два значення однакові?",
        "Один знак = кладе значення в змінну. Для порівняння потрібен інший.",
        "Порівняння «дорівнює» — це два знаки рівності підряд.",
      ],
    },
    {
      kind: "tip",
      id: "cond-tip-if",
      title: "Якщо…",
      text:
        "if перевіряє умову: якщо вона True, виконується блок коду з відступом під нею. " +
        "Після умови ставлять двокрапку, а рядки блоку починають із 4 пробілів.",
      example: 'temp = 30\nif temp > 25:\n    print("Відчини вікно")',
    },
    {
      kind: "fill-blank",
      id: "cond-thirsty",
      title: "Спрагла квітка",
      task: "Квітку треба полити, якщо води менше ніж 3. Допиши знак порівняння.",
      code: 'water = 2\nif water ___ 3:\n    print("Полий квітку!")',
      solution: "<",
      expected: "Полий квітку!",
      hints: [
        "Води мало чи багато? Яке порівняння це перевіряє?",
        "Потрібна перевірка «менше ніж».",
        "Знак «менше» в Python такий самий, як у математиці.",
      ],
    },
    {
      kind: "predict",
      id: "cond-window",
      title: "Вікно теплиці",
      task: "Що виведе цей код? Подивись уважно на відступи.",
      code: 'temp = 15\nif temp > 25:\n    print("Відчини вікно")\nprint("Перевірку завершено")',
      hints: [
        "Чи виконається рядок із відступом? А той, що без відступу?",
        "Умова 15 > 25 — неправда, тож блок із відступом пропускається. Рядок без відступу виконується завжди.",
        "На екрані буде лише один рядок — з останнього print.",
      ],
    },
    {
      kind: "tip",
      id: "cond-tip-else",
      title: "Інакше",
      text:
        "else виконується, коли умова в if не справдилась. " +
        "elif («інакше якщо») додає ще одну перевірку. Python перевіряє умови згори донизу " +
        "й виконує лише перший блок, умова якого справдилась.",
      example:
        'temp = 10\nif temp > 25:\n    print("Спекотно")\nelif temp > 15:\n    print("Тепло")\nelse:\n    print("Холодно")',
    },
    {
      kind: "fill-blank",
      id: "cond-cover",
      title: "Укрий розсаду",
      task: "Якщо тепліше за 5 градусів — все гаразд, інакше розсаду треба вкрити. Допиши слово.",
      code: 'temp = 3\nif temp > 5:\n    print("Все гаразд")\n___:\n    print("Укрий розсаду")',
      solution: "else",
      expected: "Укрий розсаду",
      hints: [
        "Що виконується, коли умова в if не справдилась? Згадай останню пораду.",
        "Це слово англійською означає «інакше». Двокрапка вже стоїть.",
        "Впиши else — без двокрапки.",
      ],
    },
    {
      kind: "predict",
      id: "cond-thermometer",
      title: "Термометр",
      task: "Що виведе цей код?",
      code: 'temp = 20\nif temp > 25:\n    print("Спекотно")\nelif temp > 15:\n    print("Тепло")\nelse:\n    print("Холодно")',
      hints: [
        "Python перевіряє умови по черзі згори донизу. Яка справдиться першою?",
        "20 > 25 — ні. 20 > 15 — так. Далі Python уже нічого не перевіряє.",
        "Виведеться текст із блоку elif.",
      ],
    },
    {
      kind: "tip",
      id: "cond-tip-logic",
      title: "І, або, не",
      text:
        "and — обидві умови мають справдитись, or — достатньо однієї, " +
        "not — перевертає True на False і навпаки.",
      example: "sun = True\nwarm = False\nprint(sun and warm)\nprint(sun or warm)\nprint(not warm)",
    },
    {
      kind: "predict",
      id: "cond-perfect-day",
      title: "Ідеальна погода",
      task: "Що виведе цей код?",
      code: 'temp = 22\nrain = False\nif temp > 18 and not rain:\n    print("Відчиняй теплицю")\nelse:\n    print("Зачекай")',
      hints: [
        "Перевір кожну частину умови окремо: temp > 18 і not rain.",
        "temp > 18 — True. rain — False, тож not rain — True. True and True — це True.",
        "Умова справдилась, тож виконується блок if.",
      ],
    },
    {
      kind: "fill-blank",
      id: "cond-watering",
      title: "Час поливати",
      task: "Поливати треба, якщо земля суха АБО надворі спекотно. Допиши слово, щоб код вивів «Час поливати».",
      code: 'dry = False\nhot = True\nif dry ___ hot:\n    print("Час поливати")',
      solution: "or",
      expected: "Час поливати",
      hints: [
        "Поливати треба, коли справджується хоча б одна з двох умов.",
        "and вимагає обидві умови, а тут суха земля — False. Потрібне інше слово.",
        "Впиши слово, яке англійською означає «або».",
      ],
    },
    {
      kind: "write",
      id: "cond-guard",
      title: "Сторож теплиці",
      task:
        "Змінна temp уже задана. Напиши умову: якщо temp більше за 30 — виведи «Занадто спекотно», " +
        "інакше — «Норма». Гра перевірить твій код із різними температурами.",
      starter: "",
      cases: [
        { given: "temp = 34", expected: "Занадто спекотно" },
        { given: "temp = 20", expected: "Норма" },
        { given: "temp = 30", expected: "Норма" },
      ],
      requires: [
        { anyOf: ["if"], message: "Розв'яжи це за допомогою if — тоді код працюватиме з будь-якою температурою." },
      ],
      solution: 'if temp > 30:\n    print("Занадто спекотно")\nelse:\n    print("Норма")',
      hints: [
        "Почни з if, потім умова з temp і двокрапка. Не забудь про else.",
        "Структура: рядок if …:, під ним print з відступом, потім else: і ще один print з відступом.",
        'if temp > 30:  — далі з відступом print("Занадто спекотно"), потім else: і print("Норма").',
      ],
    },
  ],
};
