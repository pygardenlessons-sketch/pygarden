import { explainError } from "./explain-error.js";
import { PythonRunner } from "./python-runner.js";
import { BLANK, QUESTS } from "./quests.js";

// ---------- Прогрес (поки що в localStorage браузера) ----------

const STORAGE_KEY = "pygarden.progress";

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      completed: new Set(saved?.completed ?? []),
      answers: saved?.answers ?? {}, // правильні відповіді гравця, щоб показати їх знову
    };
  } catch {
    return { completed: new Set(), answers: {} };
  }
}

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ completed: [...progress.completed], answers: progress.answers }),
  );
}

const progress = loadProgress();

// ---------- Елементи сторінки ----------

const $ = (selector) => document.querySelector(selector);
const els = {
  stars: $("#stars"),
  questNav: $("#quest-nav"),
  title: $("#quest-title"),
  task: $("#quest-task"),
  code: $("#quest-code"),
  check: $("#check-button"),
  next: $("#next-button"),
  status: $("#python-status"),
  result: $("#result"),
};

const runner = new PythonRunner();
let current = 0;
let answerInput = null;
let pythonReady = false;
let running = false;

const isSolved = (quest) => progress.completed.has(quest.id);

// ---------- Відображення ----------

// Перевіряти можна, коли Python готовий, нічого не виконується і квест ще не пройдено
function updateCheckButton() {
  const solved = isSolved(QUESTS[current]);
  els.check.disabled = !pythonReady || running || solved;
  answerInput.disabled = solved; // disabled, а не readOnly: без курсора і фокусу
}

function renderStars() {
  els.stars.textContent = `⭐ ${progress.completed.size}`;
}

function renderNav() {
  els.questNav.replaceChildren(
    ...QUESTS.map((quest, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quest-dot";
      button.textContent = progress.completed.has(quest.id) ? "⭐" : String(index + 1);
      button.title = quest.title;
      button.setAttribute("aria-current", index === current ? "step" : "false");
      button.addEventListener("click", () => openQuest(index));
      return button;
    }),
  );
}

function openQuest(index) {
  current = index;
  const quest = QUESTS[index];

  els.title.textContent = `Квест ${index + 1}. ${quest.title}`;
  els.task.textContent = quest.task;

  // Код із полем для відповіді на місці пропуску.
  // Використовуємо текстові вузли, а не innerHTML, — так безпечніше.
  const [before, after] = quest.code.split(BLANK);
  answerInput = document.createElement("input");
  answerInput.className = "blank";
  answerInput.setAttribute("aria-label", "Пропущений фрагмент коду");
  answerInput.autocomplete = "off";
  answerInput.spellcheck = false;
  answerInput.autocapitalize = "off";
  answerInput.addEventListener("input", resizeInput);
  answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkAnswer();
  });
  els.code.replaceChildren(before, answerInput, after);

  // Пройдений квест: показуємо збережену відповідь і що зірочка вже є
  const solved = isSolved(quest);
  answerInput.value = solved ? (progress.answers[quest.id] ?? "") : "";
  resizeInput();

  if (solved) {
    showResult("success", [
      ["p", "Квест пройдено, зірочка вже є ⭐"],
    ]);
  } else {
    els.result.hidden = true;
  }
  els.next.hidden = !solved || index === QUESTS.length - 1;
  renderNav();
  updateCheckButton();
  if (!solved) answerInput.focus();
}

function resizeInput() {
  answerInput.style.width = `${Math.max(answerInput.value.length + 1, 4)}ch`;
}

function showResult(kind, parts) {
  els.result.className = `result result--${kind}`;
  els.result.replaceChildren(
    ...parts.map(([tag, text, className]) => {
      const el = document.createElement(tag);
      el.textContent = text;
      if (className) el.className = className;
      return el;
    }),
  );
  els.result.hidden = false;
}

// ---------- Перевірка ----------

// Порівнюємо вивід без зайвих пробілів у кінці рядків
const normalize = (text) =>
  text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();

async function checkAnswer() {
  const quest = QUESTS[current];
  if (els.check.disabled) return; // наприклад, Enter у вже пройденому квесті
  const answer = answerInput.value.trim();

  if (!answer) {
    showResult("error", [["p", "Спершу впиши щось у пропуск 🙂"]]);
    return;
  }

  running = true;
  updateCheckButton();
  els.check.textContent = "Виконуємо…";
  const result = await runner.run(quest.code.replace(BLANK, answer));
  running = false;
  updateCheckButton();
  els.check.textContent = "Перевірити";

  if (!result.ok) {
    const where = result.line ? ` (рядок ${result.line})` : "";
    showResult("error", [
      ["p", explainError(result)],
      ...(result.errorText ? [["pre", result.errorText + where, "error-text"]] : []),
      ["p", `Підказка: ${quest.hint}`, "hint"],
    ]);
    return;
  }

  const got = normalize(result.output);
  if (got !== normalize(quest.expected)) {
    showResult("error", [
      ["p", "Код спрацював без помилок, але вивід не той, що потрібно."],
      ["p", "Очікували:", "label"],
      ["pre", quest.expected, "output"],
      ["p", "Вийшло:", "label"],
      ["pre", got || "(нічого не виведено)", "output"],
      ["p", `Підказка: ${quest.hint}`, "hint"],
    ]);
    return;
  }

  progress.completed.add(quest.id);
  progress.answers[quest.id] = answer; // щоб показати відповідь, коли гравець повернеться
  saveProgress();
  renderStars();
  updateCheckButton();
  showResult("success", [
    ["p", "Правильно! +1 ⭐"],
    ["pre", got, "output"],
  ]);
  renderNav();
  els.next.hidden = current === QUESTS.length - 1;
}

// ---------- Старт ----------

els.check.addEventListener("click", checkAnswer);
els.next.addEventListener("click", () => openQuest(current + 1));

renderStars();
const firstUnsolved = QUESTS.findIndex((quest) => !isSolved(quest));
openQuest(firstUnsolved === -1 ? 0 : firstUnsolved);

runner.ready.then(
  () => {
    // Статус потрібен лише під час завантаження та при помилці
    els.status.hidden = true;
    pythonReady = true;
    updateCheckButton();
  },
  (error) => {
    els.status.textContent = "Не вдалося завантажити Python. Перевір інтернет і онови сторінку.";
    console.error(error);
  },
);
