/// <reference lib="webworker" />
// Web Worker: тут живе Python (Pyodide) окремо від сторінки.
// Якщо код гравця зависне (наприклад, `while True:`), сторінка не замерзне —
// головний потік просто зупинить цей Worker і створить новий.

import type { WorkerMessage, WorkerRequest } from "./types.ts";

const PYODIDE_VERSION = "314.0.8";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`;

// Мінімальні типи тієї частини Pyodide, якою ми користуємось
type PyProxyDict = { destroy(): void };
type Pyodide = {
  globals: { get(name: "dict"): () => PyProxyDict };
  setStdout(options: { batched: (line: string) => void }): void;
  setStderr(options: { batched: (line: string) => void }): void;
  setStdin(options: { stdin: () => string }): void;
  runPythonAsync(code: string, options: { globals: PyProxyDict }): Promise<unknown>;
};
type PythonError = Error & { type?: string };

const post = (message: WorkerMessage) => self.postMessage(message);

const pyodideReady: Promise<Pyodide> = import(/* @vite-ignore */ PYODIDE_URL).then(
  ({ loadPyodide }: { loadPyodide: () => Promise<Pyodide> }) => loadPyodide(),
);

pyodideReady.then(
  () => post({ type: "ready" }),
  (error: unknown) => post({ type: "load-error", message: String(error) }),
);

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, code } = event.data;
  const pyodide = await pyodideReady;

  let output = "";
  pyodide.setStdout({ batched: (line) => (output += line + "\n") });
  pyodide.setStderr({ batched: (line) => (output += line + "\n") });
  pyodide.setStdin({
    stdin: () => {
      throw new Error("input() у квестах поки не підтримується");
    },
  });

  // Кожен запуск — з чистими змінними, щоб квести не впливали один на одного
  const globals = pyodide.globals.get("dict")();
  try {
    await pyodide.runPythonAsync(code, { globals });
    post({ type: "result", id, ok: true, output });
  } catch (error) {
    const { type, message } = error as PythonError;
    post({
      type: "result",
      id,
      ok: false,
      output,
      errorType: type ?? "Error",
      errorText: lastLine(String(message ?? error)),
      line: findLine(String(message ?? "")),
    });
  } finally {
    globals.destroy();
  }
};

// Останній рядок traceback: "NameError: name 'x' is not defined"
function lastLine(text: string): string {
  const lines = text.trim().split("\n");
  return lines[lines.length - 1] ?? "";
}

// Номер рядка в коді гравця: File "<exec>", line 3
function findLine(text: string): number | null {
  const matches = [...text.matchAll(/File "<exec>", line (\d+)/g)];
  const last = matches[matches.length - 1];
  return last ? Number(last[1]) : null;
}
