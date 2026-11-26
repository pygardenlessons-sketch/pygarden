// Web Worker: тут живе Python (Pyodide) окремо від сторінки.
// Якщо код гравця зависне (наприклад, `while True:`), сторінка не замерзне —
// головний потік просто зупинить цей Worker і створить новий.

const PYODIDE_VERSION = "314.0.8";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`;

const pyodideReady = import(PYODIDE_URL).then(({ loadPyodide }) => loadPyodide());

pyodideReady.then(
  () => postMessage({ type: "ready" }),
  (error) => postMessage({ type: "load-error", message: String(error) }),
);

self.onmessage = async (event) => {
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
    postMessage({ id, ok: true, output });
  } catch (error) {
    postMessage({
      id,
      ok: false,
      output,
      errorType: error.type ?? "Error",
      errorText: lastLine(String(error.message ?? error)),
      line: findLine(String(error.message ?? "")),
    });
  } finally {
    globals.destroy();
  }
};

// Останній рядок traceback: "NameError: name 'x' is not defined"
function lastLine(text) {
  const lines = text.trim().split("\n");
  return lines[lines.length - 1];
}

// Номер рядка в коді гравця: File "<exec>", line 3
function findLine(text) {
  const matches = [...text.matchAll(/File "<exec>", line (\d+)/g)];
  return matches.length ? Number(matches[matches.length - 1][1]) : null;
}
