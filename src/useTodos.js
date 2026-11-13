import { useEffect, useState } from "react";
import { STARTER_TODOS } from "./data";
import { loadTodos, saveTodos } from "./storage";

export function useTodos() {
  const [todos, setTodos] = useState(() => loadTodos(STARTER_TODOS));

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Immutable updates keep React in sync, and max-ID allocation avoids reuse after deletions.
    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: currentTodos.reduce((maxId, todo) => Math.max(maxId, todo.id), 0) + 1,
        text: trimmed,
        completed: false,
      },
    ]);
  }

  function toggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  function updateTodo(id, text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos(
      (currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
  };
}
