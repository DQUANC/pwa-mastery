import { useEffect, useReducer, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { addTodo, getAllTodos, putTodo, deleteTodo } from '../db/todos';
import { triggerBackgroundSync } from '../sync/syncQueue';

// ─── State ────────────────────────────────────────────────────────────────────

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; todos: Todo[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'ADD'; todo: Todo }
  | { type: 'UPDATE'; todo: Todo }
  | { type: 'DELETE'; id: string };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { todos: action.todos, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD':
      return { ...state, todos: [...state.todos, action.todo] };
    case 'UPDATE':
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.todo.id ? action.todo : t)),
      };
    case 'DELETE':
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodoItem: (input: CreateTodoInput) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodoTitle: (id: string, input: UpdateTodoInput) => Promise<void>;
  deleteTodoItem: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    loading: true,
    error: null,
  });

  // Load all todos from IndexedDB on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_START' });
    getAllTodos()
      .then((todos) => dispatch({ type: 'LOAD_SUCCESS', todos }))
      .catch((err: unknown) =>
        dispatch({
          type: 'LOAD_ERROR',
          error: err instanceof Error ? err.message : 'Failed to load todos',
        }),
      );
  }, []);

  const addTodoItem = useCallback(async (input: CreateTodoInput): Promise<void> => {
    const now = Date.now();
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      completed: false,
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    await addTodo(todo);
    dispatch({ type: 'ADD', todo });
    triggerBackgroundSync();
  }, []);

  const toggleTodo = useCallback(
    async (id: string): Promise<void> => {
      const existing = state.todos.find((t) => t.id === id);
      if (!existing) return;

      const updated: Todo = {
        ...existing,
        completed: !existing.completed,
        syncStatus: 'pending',
        updatedAt: Date.now(),
      };
      await putTodo(updated);
      dispatch({ type: 'UPDATE', todo: updated });
      triggerBackgroundSync();
    },
    [state.todos],
  );

  const updateTodoTitle = useCallback(
    async (id: string, input: UpdateTodoInput): Promise<void> => {
      const existing = state.todos.find((t) => t.id === id);
      if (!existing) return;

      const updated: Todo = {
        ...existing,
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.completed !== undefined ? { completed: input.completed } : {}),
        syncStatus: 'pending',
        updatedAt: Date.now(),
      };
      await putTodo(updated);
      dispatch({ type: 'UPDATE', todo: updated });
      triggerBackgroundSync();
    },
    [state.todos],
  );

  const deleteTodoItem = useCallback(async (id: string): Promise<void> => {
    await deleteTodo(id);
    dispatch({ type: 'DELETE', id });
    triggerBackgroundSync();
  }, []);

  return {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    addTodoItem,
    toggleTodo,
    updateTodoTitle,
    deleteTodoItem,
  };
}
