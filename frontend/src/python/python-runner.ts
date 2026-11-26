// Обгортка над Web Worker: запускає код і стежить за часом виконання.

import { useSyncExternalStore } from "react";
import type { RunResult, WorkerMessage } from "./types.ts";

const TIMEOUT_MS = 5000;

export type PythonStatus = "loading" | "ready" | "error";

class PythonRunner {
  #worker!: Worker;
  #ready!: Promise<void>;
  #nextId = 1;
  #pending = new Map<number, (result: RunResult) => void>();
  #status: PythonStatus = "loading";
  #listeners = new Set<() => void>();

  constructor() {
    this.#start();
    this.#ready.then(
      () => this.#setStatus("ready"),
      (error: unknown) => {
        console.error(error);
        this.#setStatus("error");
      },
    );
  }

  get status(): PythonStatus {
    return this.#status;
  }

  subscribe = (listener: () => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  /**
   * Виконати код. Ніколи не кидає винятків: помилки Python
   * (і завеликий час виконання) теж повертаються як результат.
   */
  async run(code: string): Promise<RunResult> {
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
    this.#worker = new Worker(new URL("./python-worker.ts", import.meta.url), {
      type: "module",
    });
    this.#ready = new Promise((resolve, reject) => {
      this.#worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const message = event.data;
        if (message.type === "ready") return resolve();
        if (message.type === "load-error") return reject(new Error(message.message));

        const { type: _type, id, ...result } = message;
        const callback = this.#pending.get(id);
        if (callback) {
          this.#pending.delete(id);
          callback(result);
        }
      };
      this.#worker.onerror = (event) => reject(new Error(event.message));
    });
  }

  #setStatus(status: PythonStatus) {
    this.#status = status;
    for (const listener of this.#listeners) listener();
  }
}

// Один Python на всю гру: починає вантажитись одразу при відкритті сайту
export const python = new PythonRunner();

export function usePythonStatus(): PythonStatus {
  return useSyncExternalStore(python.subscribe, () => python.status);
}
