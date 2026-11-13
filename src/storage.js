const STORAGE_KEY = "desklist.todos";

export function loadTodos(fallback) {
  const raw = localStorage.getItem(STORAGE_KEY);

  const copyFallback = () => fallback.map((todo) => ({ ...todo }));

  if (raw === null) {
    return copyFallback();
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Discard malformed saved data and restore starter tasks instead of crashing on load.
      return copyFallback();
    }
    throw error;
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (todo) =>
        todo !== null &&
        typeof todo === "object" &&
        Number.isFinite(todo.id) &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    )
  ) {
    return copyFallback();
  }

  return parsed.map((todo) => ({ ...todo }));
}

export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}