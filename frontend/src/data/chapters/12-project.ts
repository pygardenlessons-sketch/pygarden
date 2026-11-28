// Розділ 12. Фінальний проєкт → зона «Будиночок садівника».
// Завдання поєднують теми всіх попередніх розділів.
// Як редагувати — див. коментар у 01-print.ts.

import type { Chapter } from "../types.ts";

export const chapterProject: Chapter = {
  id: "project",
  title: "Фінальний проєкт",
  zone: {
    name: "Будиночок садівника",
    emoji: "🏠",
    layout: "lawn",
    spots: [
      { id: "home-house", name: "Будиночок", emoji: "🏠", cost: 2, x: 50, y: 30 },
      { id: "home-dog", name: "Песик", emoji: "🐕", cost: 1, x: 20, y: 56 },
      { id: "home-cat", name: "Кіт", emoji: "🐈", cost: 1, x: 80, y: 56 },
      { id: "home-kite", name: "Повітряний змій", emoji: "🪁", cost: 1, x: 80, y: 18 },
      { id: "home-rainbow", name: "Веселка", emoji: "🌈", cost: 1, x: 20, y: 18 },
    ],
  },
  steps: [
    {
      kind: "tip",
      id: "proj-tip-intro",
      title: "Ти вже програміст",
      text:
        "Ти знаєш змінні, умови, цикли, списки, словники, функції й винятки. Справжні програми — це " +
        "поєднання всього цього. Ось невелика програма, у якій працюють одразу кілька тем.",
      example:
        'plants = {"томат": 3, "огірок": 0}\nfor name, count in plants.items():\n    if count > 0:\n        print(f"{name}: {count}")\n    else:\n        print(f"{name}: немає")',
    },
    {
      kind: "predict",
      id: "proj-read",
      title: "Прочитай програму",
      task: "Що виведе ця програма?",
      code: "harvest = [3, 0, 5]\ntotal = 0\nfor n in harvest:\n    if n > 0:\n        total = total + n\nprint(total)",
      hints: [
        "Які числа зі списку потрапляють у total?",
        "До total додаються лише числа, більші за нуль. print — після циклу, тож виведеться одне число.",
        "Сума трьох і п'яти.",
      ],
    },
    {
      kind: "write",
      id: "proj-weather",
      title: "Щоденник погоди",
      task:
        "У списку temps — температура за кілька днів. Для кожного дня виведи «спека», якщо більше 30, " +
        "«тепло», якщо більше 20, інакше «прохолодно».",
      starter: "",
      cases: [
        { given: "temps = [12, 25, 31, 18]", expected: "прохолодно\nтепло\nспека\nпрохолодно" },
        { given: "temps = [35]", expected: "спека" },
        { given: "temps = [30, 20]", expected: "тепло\nпрохолодно" },
      ],
      requires: [
        { anyOf: ["for", "while"], message: "Пройди по списку циклом — днів може бути скільки завгодно." },
        { anyOf: ["if"], message: "Для вибору слова потрібні умови if / elif / else." },
      ],
      solution:
        'for t in temps:\n    if t > 30:\n        print("спека")\n    elif t > 20:\n        print("тепло")\n    else:\n        print("прохолодно")',
      hints: [
        "Цикл по списку, а всередині — if, elif і else (розділ «Умови»).",
        "for t in temps:  і всередині з відступом: if t > 30: … elif t > 20: … else: …",
        'Під for: if t > 30: print("спека"), elif t > 20: print("тепло"), else: print("прохолодно") — кожен print ще з одним відступом.',
      ],
    },
    {
      kind: "write",
      id: "proj-best",
      title: "Найкращий урожай",
      task: "У словнику harvest — урожай кожної рослини. Знайди рослину з найбільшим урожаєм і виведи її назву.",
      starter: "",
      cases: [
        { given: 'harvest = {"томат": 12, "огірок": 20, "перець": 7}', expected: "огірок" },
        { given: `harvest = {"кріп": 3, "м'ята": 9}`, expected: "м'ята" },
        { given: 'harvest = {"гарбуз": 1}', expected: "гарбуз" },
      ],
      requires: [
        { anyOf: ["for", "max("], message: "Пройди по словнику циклом і запам'ятовуй найкращу рослину." },
      ],
      solution:
        'best_name = ""\nbest_count = -1\nfor name, count in harvest.items():\n    if count > best_count:\n        best_name = name\n        best_count = count\nprint(best_name)',
      hints: [
        "Заведи дві змінні: назву найкращої рослини й найбільший урожай. Потім пройди по словнику.",
        "Почни з best_count = -1. У циклі по harvest.items(): якщо count > best_count — запам'ятай і назву, і кількість.",
        'best_name = ""  ·  best_count = -1  ·  for name, count in harvest.items():  ·  if count > best_count: оновити обидві змінні  ·  після циклу print(best_name)',
      ],
    },
    {
      kind: "write",
      id: "proj-water-func",
      title: "Розумний полив",
      task:
        "Напиши функцію water_needed(temp), яка повертає 3 (відра), якщо temp більше за 25, інакше — 1. " +
        "Гра сама викличе її з різними температурами.",
      starter: "def water_needed(temp):\n    ",
      cases: [
        { after: "print(water_needed(30))", expected: "3" },
        { after: "print(water_needed(10))", expected: "1" },
        { after: "print(water_needed(25))", expected: "1" },
      ],
      requires: [
        { anyOf: ["def"], message: "Створи функцію через def water_needed(temp):" },
        { anyOf: ["return"], message: "Функція має повертати кількість відер через return." },
      ],
      solution: "def water_needed(temp):\n    if temp > 25:\n        return 3\n    return 1",
      hints: [
        "Усередині функції потрібна умова, а в кожному випадку — return із числом.",
        "if temp > 25: return 3, а інакше — return 1. Не забудь про відступи всередині функції.",
        "Під def: if temp > 25: (з відступом return 3), потім else: (з відступом return 1).",
      ],
    },
    {
      kind: "write",
      id: "proj-report",
      title: "Звіт саду",
      task:
        "У списку plants — назви рослин. Виведи їх нумерованим списком: «1. троянда», «2. кактус» і т. д. " +
        "Використай цикл і f-рядок.",
      starter: "",
      cases: [
        { given: `plants = ["троянда", "кактус", "м'ята"]`, expected: "1. троянда\n2. кактус\n3. м'ята" },
        { given: 'plants = ["лілія"]', expected: "1. лілія" },
      ],
      requires: [{ anyOf: ["for", "while"], message: "Пройди по списку циклом — рослин може бути скільки завгодно." }],
      solution: 'number = 1\nfor plant in plants:\n    print(f"{number}. {plant}")\n    number = number + 1',
      hints: [
        "Окрім циклу по рослинах, потрібна ще змінна-лічильник для номера.",
        "number = 1 перед циклом; у циклі виводь f-рядок із номером і назвою, а потім збільшуй number на 1.",
        'number = 1  ·  for plant in plants:  ·  print(f"{number}. {plant}")  ·  number = number + 1',
      ],
    },
    {
      kind: "write",
      id: "proj-safe-calc",
      title: "Безпечний калькулятор",
      task:
        "У змінних text і boxes — рядки, у яких мають бути числа. Перетвори обидва на числа, поділи text на boxes " +
        "і виведи результат. Якщо щось не так (не число або ділення на нуль) — виведи «Помилка».",
      starter: "",
      cases: [
        { given: 'text = "24"\nboxes = "4"', expected: "6.0" },
        { given: 'text = "24"\nboxes = "0"', expected: "Помилка" },
        { given: 'text = "багато"\nboxes = "2"', expected: "Помилка" },
      ],
      requires: [{ anyOf: ["try"], message: "Тут можуть статися дві різні помилки — перехопи їх через try / except." }],
      solution:
        'try:\n    print(int(text) / int(boxes))\nexcept ValueError:\n    print("Помилка")\nexcept ZeroDivisionError:\n    print("Помилка")',
      hints: [
        "Які дві помилки можуть статися? Згадай розділ «Помилки й винятки».",
        "У try: print(int(text) / int(boxes)). Потім два except: для ValueError і для ZeroDivisionError.",
        'try:  ·  print(int(text) / int(boxes))  ·  except ValueError: print("Помилка")  ·  except ZeroDivisionError: print("Помилка")',
      ],
    },
  ],
};
