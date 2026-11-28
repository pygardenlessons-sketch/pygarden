// Розділ 8. Функції → зона «Майстерня».
// Як редагувати — див. коментар у 01-print.ts.

import type { Chapter } from "../types.ts";

export const chapterFunctions: Chapter = {
  id: "functions",
  title: "Функції",
  zone: {
    name: "Майстерня",
    emoji: "🔨",
    layout: "workshop",
    spots: [
      { id: "ws-hammer", name: "Молоток", emoji: "🔨", cost: 1, x: 18, y: 26 },
      { id: "ws-saw", name: "Пилка", emoji: "🪚", cost: 1, x: 50, y: 20 },
      { id: "ws-wrench", name: "Ключ", emoji: "🔧", cost: 1, x: 82, y: 26 },
      { id: "ws-toolbox", name: "Скринька", emoji: "🧰", cost: 1, x: 50, y: 52 },
      { id: "ws-screwdriver", name: "Викрутка", emoji: "🪛", cost: 1, x: 18, y: 78 },
      { id: "ws-gear", name: "Механізм", emoji: "⚙️", cost: 1, x: 82, y: 78 },
      { id: "ws-ladder", name: "Драбина", emoji: "🪜", cost: 2, x: 50, y: 84 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "func-tip-def",
      title: "Своя команда",
      text:
        "def створює власну команду — функцію. Спершу пишуть def, назву, дужки й двокрапку, " +
        "а під ними з відступом — що функція робить. Код функції виконується лише тоді, коли її викликають: назва().",
      example: 'def greet():\n    print("Добрий день, садівнику!")\n\ngreet()\ngreet()',
    },
    {
      kind: "predict",
      id: "func-twice",
      title: "Дзвоник",
      task: "Що виведе цей код?",
      code: 'def ring():\n    print("Дзень!")\n\nring()\nring()',
      hints: [
        "Скільки разів викликано функцію ring?",
        "Кожен виклик ring() виконує її блок — тобто один print.",
        "Два виклики — два однакові рядки.",
      ],
    },
    {
      kind: "fill-blank",
      id: "func-call",
      title: "Увімкни полив",
      task: "Функцію вже створено, але її ніхто не викликав. Виклич її.",
      code: 'def water():\n    print("Полито")\n\n___()',
      solution: "water",
      expected: "Полито",
      hints: [
        "Як викликати функцію? Подивись, як вона називається.",
        "Щоб викликати функцію, пишуть її назву й дужки. Дужки вже є.",
        "Впиши назву функції з першого рядка — без def і без дужок.",
      ],
    },
    {
      kind: "predict",
      id: "func-not-called",
      title: "Таємна функція",
      task: "Що виведе цей код?",
      code: 'def secret():\n    print("Таємниця")\n\nprint("Майстерня відчинена")',
      hints: [
        "Чи викликають тут функцію secret()?",
        "def лише створює функцію. Її код виконається, тільки коли напишуть secret().",
        "Виконається лише останній рядок.",
      ],
    },
    {
      kind: "tip",
      id: "func-tip-params",
      title: "Параметри",
      text:
        "У дужках функції можна вказати параметри — змінні, які отримують значення при виклику. " +
        "Так одна функція працює з різними даними.",
      example: 'def water(plant):\n    print("Поливаю", plant)\n\nwater("троянду")\nwater("м\'яту")',
    },
    {
      kind: "fill-blank",
      id: "func-cactus",
      title: "Полий кактус",
      task: "Виклич функцію так, щоб вона полила кактус: має вийти «Поливаю кактус».",
      code: 'def water(plant):\n    print("Поливаю", plant)\n\nwater(___)',
      solution: '"кактус"',
      expected: "Поливаю кактус",
      hints: [
        "Що треба передати функції? Перечитай завдання.",
        "Передай назву рослини. Це текст — а текст пишуть у лапках.",
        "Впиши назву рослини з завдання в лапках.",
      ],
    },
    {
      kind: "predict",
      id: "func-two-params",
      title: "Посадка",
      task: "Що виведе цей код?",
      code: 'def plant(seed, count):\n    print(seed, "×", count)\n\nplant("горох", 5)',
      hints: [
        "Яке значення отримує seed, а яке — count?",
        "Значення передаються по черзі: перше — у seed, друге — у count. print виводить їх через пробіл.",
        "Назва насіння, пробіл, знак ×, пробіл і число.",
      ],
    },
    {
      kind: "tip",
      id: "func-tip-return",
      title: "Повернути результат",
      text:
        "return повертає значення з функції — його можна покласти в змінну або одразу використати. " +
        "print лише показує щось на екрані, а return віддає результат назад у програму.",
      example: "def double(n):\n    return n * 2\n\nresult = double(4)\nprint(result)",
    },
    {
      kind: "fill-blank",
      id: "func-area",
      title: "Площа грядки",
      task: "Функція має повертати площу грядки (ширина × довжина). Допиши слово.",
      code: "def area(width, length):\n    ___ width * length\n\nprint(area(3, 4))",
      solution: "return",
      expected: "12",
      hints: [
        "Функція має віддати результат назад. Згадай останню пораду.",
        "Не print — потрібне слово, яке повертає значення з функції.",
        "Впиши return.",
      ],
    },
    {
      kind: "predict",
      id: "func-return-math",
      title: "Доливаємо",
      task: "Що виведе цей код?",
      code: "def add_water(level):\n    return level + 10\n\nprint(add_water(5) + 1)",
      hints: [
        "Що поверне add_water(5)? А потім до цього ще щось додають.",
        "add_water(5) повертає 5 + 10. Потім до результату додають 1.",
        "П'ятнадцять плюс один.",
      ],
    },
    {
      kind: "write",
      id: "func-harvest",
      title: "Функція врожаю",
      task:
        "Кожен кущ томатів дає 3 помідори. Напиши функцію harvest(bushes), яка ПОВЕРТАЄ кількість " +
        "помідорів для заданої кількості кущів. Гра сама викличе її з різними числами.",
      starter: "def harvest(bushes):\n    ",
      cases: [
        { after: "print(harvest(4))", expected: "12" },
        { after: "print(harvest(0))", expected: "0" },
        { after: "print(harvest(7))", expected: "21" },
      ],
      requires: [
        { anyOf: ["def"], message: "Створи функцію через def harvest(bushes):" },
        { anyOf: ["return"], message: "Функція має повертати результат через return, а не виводити його." },
      ],
      solution: "def harvest(bushes):\n    return bushes * 3",
      hints: [
        "Функція вже почата. Що вона має повернути?",
        "Усередині функції напиши return і вираз: кількість кущів, помножена на кількість помідорів з куща.",
        "return bushes * 3",
      ],
    },
  ],
};
