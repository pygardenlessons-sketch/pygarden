// Обгортка над Web Worker: запускає код і стежить за часом виконання.

const TIMEOUT_MS = 5000;

export class PythonRunner {
  #worker;
  #ready;
  #nextId = 1;
  #pending = new Map();

  constructor() {
    this.#start();
  }

  /** Проміс, який виконується, коли Python завантажився. */
  get ready() {
    return this.#ready;
  }

  /**
   * Виконати код. Повертає { ok, output, errorType?, errorText?, line? }.
   * Ніколи не кидає винятків: помилки Python теж повертаються як результат.
   */
  async run(code) {
    await this.#ready;
    const id = this.#nextId++;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        // Код виконується надто довго — найімовірніше, нескінченний цикл.
        // Зупинити Python зсередини не можна, тож вбиваємо Worker цілком.
        this.#pending.delete(id);
        this.#worker.terminate();
        this.#start();
        resolve({ ok: false, output: "", errorType: "Timeout", errorText: "", line: null });
      }, TIMEOUT_MS);

      this.#pending.set(id, (result) => {
        clearTimeout(timer);
        resolve(result);
      });
      this.#worker.postMessage({ id, code });
    });
  }

  #start() {
    this.#worker = new Worker(new URL("./python-worker.js", import.meta.url), {
      type: "module",
    });
    this.#ready = new Promise((resolve, reject) => {
      this.#worker.onmessage = (event) => {
        const message = event.data;
        if (message.type === "ready") return resolve();
        if (message.type === "load-error") return reject(new Error(message.message));

        const callback = this.#pending.get(message.id);
        if (callback) {
          this.#pending.delete(message.id);
          callback(message);
        }
      };
      this.#worker.onerror = (event) => reject(new Error(event.message));
    });
  }
}
