// Розділ 6. Цикли → зона «Ставок».
// Як редагувати — див. коментар у 01-print.ts.

import type { Chapter } from "../types.ts";

const LOOP_REQUIRED = {
  anyOf: ["for", "while"],
  message: "Тут потрібен цикл — for або while. Спробуй без копіювання рядків.",
};

export const chapterLoops: Chapter = {
  id: "loops",
  title: "Цикли",
  zone: {
    name: "Ставок",
    emoji: "🦆",
    layout: "pond",
    spots: [
      { id: "pond-lilies", name: "Лілії", emoji: "🪷", cost: 1, x: 50, y: 28 },
      { id: "pond-ducks", name: "Качки", emoji: "🦆", cost: 2, x: 38, y: 50 },
      { id: "pond-fish", name: "Рибки", emoji: "🐟", cost: 1, x: 62, y: 52 },
      { id: "pond-boat", name: "Човник", emoji: "🛶", cost: 1, x: 48, y: 70 },
      { id: "pond-frog", name: "Жаба", emoji: "🐸", cost: 1, x: 14, y: 24 },
      { id: "pond-reeds", name: "Очерет", emoji: "🌾", cost: 1, x: 86, y: 24 },
      { id: "pond-snail", name: "Равлик", emoji: "🐌", cost: 1, x: 14, y: 78 },
      { id: "pond-stones", name: "Камінці", emoji: "🪨", cost: 1, x: 86, y: 78 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "loop-tip-for",
      title: "Повтори кілька разів",
      text:
        "Цикл for повторює блок коду з відступом. range(3) означає «три рази»: " +
        "змінна циклу по черзі стає 0, 1 і 2 — рахунок у Python починається з нуля.",
      example: 'for i in range(3):\n    print("Хвиля")',
    },
    {
      kind: "fill-blank",
      id: "loop-beds",
      title: "Три грядки",
      task: "Біля ставка три грядки. Зроби так, щоб цикл полив кожну з них.",
      code: 'for bed in range(___):\n    print("Грядку полито")',
      solution: "3",
      expected: "Грядку полито\nГрядку полито\nГрядку полито",
      hints: [
        "Скільки разів має повторитися полив? Перечитай завдання.",
        "range(n) повторює цикл n разів.",
        "Впиши кількість грядок — просто число.",
      ],
    },
    {
      kind: "predict",
      id: "loop-ducks-count",
      title: "Лічба качок",
      task: "Що виведе цей код?",
      code: "for i in range(3):\n    print(i)",
      hints: [
        "Які значення по черзі набуває i в range(3)? Згадай пораду.",
        "Рахунок у range починається з нуля, а останнє число не входить.",
        "Три рядки: перше число — нуль, останнє — на одиницю менше за три.",
      ],
    },
    {
      kind: "tip",
      id: "loop-tip-range",
      title: "Звідки й докуди",
      text:
        "range(1, 4) рахує з 1 до 3: перше число входить, останнє — ні. " +
        "Змінну циклу можна використовувати всередині блоку.",
      example: 'for day in range(1, 4):\n    print("День", day)',
    },
    {
      kind: "fill-blank",
      id: "loop-days",
      title: "П'ять днів росту",
      task: "Виведи «День 1» … «День 5». Допиши кінець range.",
      code: 'for day in range(1, ___):\n    print("День", day)',
      solution: "6",
      expected: "День 1\nДень 2\nДень 3\nДень 4\nДень 5",
      hints: [
        "range(1, n) зупиняється ПЕРЕД n. Яким має бути n, щоб останнім днем був п'ятий?",
        "Друге число в range має бути на одиницю більше за останнє потрібне.",
        "П'ять плюс один.",
      ],
    },
    {
      kind: "predict",
      id: "loop-growth",
      title: "Ростемо",
      task: "Пагін щодня виростає на 2 см. Що виведе код?",
      code: "height = 0\nfor day in range(3):\n    height = height + 2\nprint(height)",
      hints: [
        "Скільки разів виконується рядок height = height + 2?",
        "Цикл повторюється тричі, і щоразу до height додається 2. print стоїть ПІСЛЯ циклу — без відступу.",
        "Тричі по 2, і виводиться одне число.",
      ],
    },
    {
      kind: "tip",
      id: "loop-tip-while",
      title: "Поки…",
      text:
        "while повторює блок, поки умова справджується. Обов'язково змінюй щось " +
        "усередині циклу — інакше умова ніколи не стане False і цикл буде нескінченним.",
      example: 'water = 3\nwhile water > 0:\n    print("Лишилось", water)\n    water = water - 1',
    },
    {
      kind: "predict",
      id: "loop-buckets",
      title: "Відра",
      task: "Що виведе цей код?",
      code: 'buckets = 2\nwhile buckets > 0:\n    print("Полив")\n    buckets = buckets - 1\nprint("Готово")',
      hints: [
        "Скільки разів умова buckets > 0 буде правдою?",
        "Спершу buckets = 2, потім 1, потім 0 — і цикл зупиняється. Останній print — поза циклом.",
        "Двічі слово з циклу, а потім слово з останнього рядка.",
      ],
    },
    {
      kind: "fill-blank",
      id: "loop-fill-pond",
      title: "Наповни ставок",
      task: "Доливай воду, поки рівень не дійде до 3. Код має вивести 3.",
      code: "level = 0\nwhile level ___ 3:\n    level = level + 1\nprint(level)",
      solution: "<",
      expected: "3",
      hints: [
        "Цикл має працювати, поки рівень ще не дійшов до потрібного.",
        "Умова має бути правдою для 0, 1 і 2, а для 3 — уже ні.",
        "Потрібен знак «менше».",
      ],
    },
    {
      kind: "tip",
      id: "loop-tip-break",
      title: "Стоп!",
      text: "break зупиняє цикл одразу, навіть якщо він ще не закінчився.",
      example: "for i in range(10):\n    if i == 3:\n        break\n    print(i)",
    },
    {
      kind: "predict",
      id: "loop-first-frog",
      title: "Перша жаба",
      task: "Жаби сидять на каменях 1, 2, 3… Шукаємо перший камінь із номером, що ділиться на 4. Що виведе код?",
      code: 'for n in range(1, 10):\n    if n % 4 == 0:\n        print("Знайдено", n)\n        break',
      hints: [
        "Що робить n % 4 == 0? Згадай розділ про числа.",
        "Умова справджується, коли n ділиться на 4 без остачі. Після першого збігу break зупиняє цикл.",
        "Перше число від 1, яке ділиться на 4, — це сама четвірка.",
      ],
    },
    {
      kind: "write",
      id: "loop-steps",
      title: "Сходинки до ставка",
      task: "Виведи числа від 1 до 5 — кожне з нового рядка — за допомогою циклу.",
      starter: "",
      cases: [{ expected: "1\n2\n3\n4\n5" }],
      requires: [LOOP_REQUIRED],
      solution: "for n in range(1, 6):\n    print(n)",
      hints: [
        "Згадай пораду «Звідки й докуди»: range може починатися не з нуля.",
        "for n in range(1, …): і з відступом print(n). Яким має бути друге число в range?",
        "for n in range(1, 6):  і під ним із відступом print(n).",
      ],
    },
    {
      kind: "write",
      id: "loop-sum",
      title: "Весь урожай",
      task:
        "Щодня збирали на 1 огірок більше: 1, 2, 3 … аж до 10. " +
        "Порахуй циклом, скільки огірків зібрали разом, і виведи це число.",
      starter: "total = 0\n",
      cases: [{ expected: "55" }],
      requires: [LOOP_REQUIRED],
      solution: "total = 0\nfor n in range(1, 11):\n    total = total + n\nprint(total)",
      hints: [
        "Почни з total = 0 і в циклі додавай до нього кожне число.",
        "Цикл for n in range(1, 11): а всередині total = total + n. print — після циклу, без відступу.",
        "for n in range(1, 11):  →  total = total + n  →  а після циклу print(total).",
      ],
    },
  ],
};
