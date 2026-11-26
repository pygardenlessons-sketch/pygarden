// Результат виконання коду гравця у Worker.
export type RunResult =
  | { ok: true; output: string }
  | {
      ok: false;
      output: string;
      /** Тип помилки Python (NameError, SyntaxError…) або "Timeout". */
      errorType: string;
      /** Останній рядок traceback: "NameError: name 'x' is not defined". */
      errorText: string;
      /** Номер рядка в коді гравця, якщо Python його повідомив. */
      line: number | null;
    };

export type RunFailure = Extract<RunResult, { ok: false }>;

// Повідомлення між сторінкою і Worker
export type WorkerRequest = { id: number; code: string };
export type WorkerMessage =
  | { type: "ready" }
  | { type: "load-error"; message: string }
  | ({ type: "result"; id: number } & RunResult);
