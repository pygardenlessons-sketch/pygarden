// Розділ 2. Змінні → зона «Клумби».
// Як редагувати — див. коментар у 01-print.ts.

import type { Chapter } from "../types.ts";

export const chapterVariables: Chapter = {
  id: "variables",
  title: "Змінні",
  zone: {
    name: "Клумби",
    emoji: "🌷",
    layout: "flowerbeds",
    spots: [
      { id: "beds-roses", name: "Троянди", emoji: "🌹", cost: 1, x: 20, y: 22 },
      { id: "beds-beehive", name: "Вулик", emoji: "🐝", cost: 1, x: 50, y: 18 },
      { id: "beds-tulips", name: "Тюльпани", emoji: "🌷", cost: 1, x: 80, y: 22 },
      { id: "beds-sunflowers", name: "Соняшники", emoji: "🌻", cost: 1, x: 20, y: 80 },
      { id: "beds-daisies", name: "Ромашки", emoji: "🌼", cost: 1, x: 80, y: 80 },
      { id: "beds-center", name: "Велика клумба", emoji: "🌺", cost: 2, x: 50, y: 52 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "vars-tip-box",
      title: "Підписана коробка",
      text:
        "Змінна — це підписана коробка, у яку кладуть значення. " +
        "Знак = означає «поклади в коробку», а не «дорівнює». " +
        "Потім значення можна дістати за назвою коробки — без лапок.",
      example: "roses = 3\nprint(roses)",
    },
    {
      kind: "fill-blank",
      id: "vars-flowers",
      title: "Рахуємо квіти",
      task: "На клумбі ростуть 5 квітів. Запиши це число у змінну flowers.",
      code: "flowers = ___\nprint(flowers)",
      solution: "5",
      expected: "5",
      hints: [
        "Що треба покласти в коробку flowers? Перечитай завдання.",
        "Це число. Числа в Python пишуть без лапок.",
        "Впиши кількість квітів із завдання — просто цифрою.",
      ],
    },
    {
      kind: "fill-blank",
      id: "vars-name",
      title: "Підпиши коробку",
      task: "Значення вже є, бракує назви змінної. Подивись, яку змінну виводить print.",
      code: '___ = "Тюльпан"\nprint(flower)',
      solution: "flower",
      expected: "Тюльпан",
      hints: [
        "Яку змінну виводить print() у другому рядку?",
        "Назва зліва від = має бути точно такою, як у print().",
        "Впиши flower — без лапок, бо це назва змінної, а не текст.",
      ],
    },
    {
      kind: "predict",
      id: "vars-quotes",
      title: "З лапками чи без?",
      task: "Що виведе цей код? Уважно подивись на лапки.",
      code: 'name = "Ромашка"\nprint(name)\nprint("name")',
      hints: [
        "Тут два print() — отже, два рядки. Чим вони відрізняються?",
        "Без лапок — це змінна, і Python виведе її значення. У лапках — просто текст, як є.",
        "Перший рядок — значення змінної name, другий — саме слово name.",
      ],
    },
    {
      kind: "tip",
      id: "vars-tip-change",
      title: "Нове значення",
      text:
        "У коробку можна покласти нове значення — старе тоді зникає. " +
        "Python виконує код згори донизу, тож важливо, що лежить у змінній саме зараз.",
      example: "water = 1\nwater = 5\nprint(water)",
    },
    {
      kind: "predict",
      id: "vars-bees",
      title: "Бджоли прилетіли",
      task: "Що виведе цей код?",
      code: "bees = 2\nbees = 7\nprint(bees)",
      hints: [
        "Python виконує код згори донизу. Що лежить у bees, коли черга доходить до print?",
        "Друге присвоєння замінює перше значення — старе зникає.",
        "Виведеться останнє значення, яке поклали в bees.",
      ],
    },
    {
      kind: "fill-blank",
      id: "vars-color",
      title: "Перефарбуй лавку",
      task: "Лавку перефарбували. Зроби так, щоб код вивів «жовтий».",
      code: 'color = "червоний"\ncolor = ___\nprint(color)',
      solution: '"жовтий"',
      expected: "жовтий",
      hints: [
        "Яке слово має вивести код? Перечитай завдання.",
        "Нове значення — це текст, а текст беруть у лапки.",
        "Впиши \"жовтий\" разом із лапками.",
      ],
    },
    {
      kind: "tip",
      id: "vars-tip-names",
      title: "Як називати змінні",
      text:
        "Назва змінної — одне слово без пробілів. Якщо слів кілька, їх з'єднують " +
        "підкресленням: rose_count. Назва не може починатися з цифри.",
      example: "rose_count = 12\nprint(rose_count)",
    },
    {
      kind: "fill-blank",
      id: "vars-rose-count",
      title: "Скільки троянд",
      task: "Виведи значення змінної rose_count.",
      code: "rose_count = 9\nprint(___)",
      solution: "rose_count",
      expected: "9",
      hints: [
        "Яка змінна зберігає кількість троянд?",
        "Назву змінної пишуть без лапок — інакше Python виведе саму назву як текст.",
        "Впиши rose_count — точно так, як у першому рядку.",
      ],
    },
    {
      kind: "predict",
      id: "vars-copy",
      title: "Хитра клумба",
      task: "Що виведе цей код? Подумай, що лежить у b.",
      code: "a = 3\nb = a\na = 10\nprint(b)",
      hints: [
        "Що саме поклали в b у другому рядку?",
        "b = a кладе в b значення, яке лежало в a саме тоді. Пізніша зміна a на b не впливає.",
        "У момент b = a у змінній a лежало число з першого рядка.",
      ],
    },
  ],
};
