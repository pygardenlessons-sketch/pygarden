// Розділ 10. Помилки й винятки → зона «Пасіка».
// Помилки в програмах англійською називають «bugs» — жуки. Тож і зона — з комахами.
// Як редагувати — див. коментар у 01-print.ts.

import type { Chapter } from "../types.ts";

export const chapterErrors: Chapter = {
  id: "errors",
  title: "Помилки й винятки",
  zone: {
    name: "Пасіка",
    emoji: "🐝",
    layout: "apiary",
    spots: [
      { id: "api-hive", name: "Вулик", emoji: "🛖", cost: 2, x: 50, y: 40 },
      { id: "api-bees", name: "Рій", emoji: "🐝", cost: 1, x: 22, y: 24 },
      { id: "api-flowers", name: "Квіти", emoji: "🏵️", cost: 1, x: 78, y: 24 },
      { id: "api-honey-jar", name: "Банка меду", emoji: "🫙", cost: 1, x: 22, y: 76 },
      { id: "api-gloves", name: "Рукавиці", emoji: "🧤", cost: 1, x: 78, y: 76 },
      { id: "api-clover", name: "Конюшина", emoji: "🍀", cost: 1, x: 50, y: 82 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "err-tip-read",
      title: "Як читати помилку",
      text:
        "Помилки — це нормально, вони трапляються в усіх програмістів. Python пише тип помилки " +
        "й пояснення в останньому рядку: NameError — невідома назва, TypeError — не той тип, " +
        "ValueError — непідходяще значення (наприклад, int(\"сорок\")), ZeroDivisionError — ділення на нуль. " +
        "int() перетворює текст на число, якщо в тексті справді число.",
      example: 'number = int("42")\nprint(number + 1)',
    },
    {
      kind: "fill-blank",
      id: "err-fix-name",
      title: "Виправ помилку",
      task:
        "Код print(Бзз) падав із помилкою NameError: Python не знає, що таке Бзз. " +
        "Виправ його, щоб на екрані з'явилося «Бзз».",
      code: "print(___)",
      solution: '"Бзз"',
      expected: "Бзз",
      hints: [
        "Python вважає це слово назвою змінної. Як показати, що це текст?",
        "Текст береться в лапки — тоді Python не шукатиме змінну з такою назвою.",
        "Впиши слово з завдання в лапках.",
      ],
    },
    {
      kind: "tip",
      id: "err-tip-try",
      title: "try і except",
      text:
        "Код у блоці try виконується як звичайно. Якщо в ньому стається помилка, Python не зупиняє " +
        "програму, а переходить у блок except з потрібним типом помилки.",
      example: 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("На нуль ділити не можна")',
    },
    {
      kind: "predict",
      id: "err-jump",
      title: "Стрибок у except",
      task: "Що виведе цей код? Подумай, які рядки встигнуть виконатися.",
      code: 'try:\n    print("Початок")\n    x = 5 / 0\n    print("Кінець")\nexcept ZeroDivisionError:\n    print("Помилка ділення")',
      hints: [
        "Що станеться на рядку з діленням на нуль?",
        "Рядки до помилки виконуються. Щойно сталася помилка — решта try пропускається, і Python переходить у except.",
        "Два рядки: перший print із try і print з except.",
      ],
    },
    {
      kind: "fill-blank",
      id: "err-value",
      title: "Скільки бджіл?",
      task: "int() не може перетворити слово «багато» на число. Допиши тип помилки, яку треба перехопити.",
      code: 'try:\n    bees = int("багато")\nexcept ___:\n    print("Це не число")',
      solution: "ValueError",
      expected: "Це не число",
      hints: [
        "Яка помилка виникає, коли значення не підходить — текст не вдається перетворити на число?",
        "Згадай першу пораду: помилка «непідходяще значення». Value — англійською «значення».",
        "Впиши ValueError — саме так, з двома великими літерами.",
      ],
    },
    {
      kind: "predict",
      id: "err-no-error",
      title: "Усе гаразд",
      task: "Що виведе цей код?",
      code: 'try:\n    hives = int("12")\n    print(hives + 1)\nexcept ValueError:\n    print("Помилка")',
      hints: [
        "Чи станеться тут помилка? Чи вийде перетворити \"12\" на число?",
        "\"12\" — це справжнє число в тексті, тож помилки немає, і except не виконується.",
        "Виведеться результат додавання.",
      ],
    },
    {
      kind: "fill-blank",
      id: "err-zero",
      title: "Порожня пасіка",
      task: "12 банок меду ділять між вуликами, а вуликів — нуль. Допиши тип помилки.",
      code: 'try:\n    portion = 12 / 0\nexcept ___:\n    print("Вуликів нема")',
      solution: "ZeroDivisionError",
      expected: "Вуликів нема",
      hints: [
        "Яка помилка виникає при діленні на нуль? Згадай пораду про try і except.",
        "Назва складається з трьох англійських слів: «нуль», «ділення», «помилка» — разом, кожне з великої.",
        "Впиши ZeroDivisionError.",
      ],
    },
    {
      kind: "predict",
      id: "err-safe-divide",
      title: "Безпечне ділення",
      task: "Що виведе цей код?",
      code: "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 0\n\nprint(safe_divide(10, 4))\nprint(safe_divide(3, 0))",
      hints: [
        "Що повертає функція, якщо ділити можна? А якщо ні?",
        "10 / 4 ділиться без помилки (результат з крапкою). 3 / 0 викликає помилку, і функція повертає 0.",
        "Перший рядок — результат ділення десяти на чотири, другий — нуль.",
      ],
    },
    {
      kind: "write",
      id: "err-counter",
      title: "Бджолиний лічильник",
      task:
        "У змінній text — рядок, у якому може бути число, а може й ні. Перетвори його на число через int() " +
        "і виведи це число, помножене на 2. Якщо перетворити не вийде — виведи «Не число».",
      starter: "",
      cases: [
        { given: 'text = "15"', expected: "30" },
        { given: `text = "п'ять"`, expected: "Не число" },
        { given: 'text = "0"', expected: "0" },
      ],
      requires: [
        { anyOf: ["try"], message: "Використай try і except — так програма не зламається, якщо в тексті не число." },
      ],
      solution: 'try:\n    print(int(text) * 2)\nexcept ValueError:\n    print("Не число")',
      hints: [
        "Перетворення через int() може зламатися — тож поклади його в try.",
        "У try: print(int(text) * 2). Яка помилка виникає, коли текст не число? Її й перехопи в except.",
        'try:  →  print(int(text) * 2)  →  except ValueError:  →  print("Не число")',
      ],
    },
  ],
};
