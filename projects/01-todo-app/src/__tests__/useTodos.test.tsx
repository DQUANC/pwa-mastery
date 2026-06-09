/**
 * Tests for the useTodos hook.
 */

import 'fake-indexeddb/auto';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';
import { clearAllTodos, resetDBInstance } from '../db/todos';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock triggerBackgroundSync — it calls navigator.serviceWorker which isn't available in jsdom
jest.mock('../sync/syncQueue', () => ({
  triggerBackgroundSync: jest.fn(),
  syncPendingTodos: jest.fn(),
}));

// Polyfill crypto.randomUUID for jsdom environments that don't have it
if (!global.crypto.randomUUID) {
  let uuidCounter = 0;
  Object.defineProperty(global.crypto, 'randomUUID', {
    value: () => {
      uuidCounter += 1;
      return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, '0')}`;
    },
    writable: true,
    configurable: true,
  });
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(async () => {
  resetDBInstance();
  await clearAllTodos();
});

afterAll(() => {
  resetDBInstance();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useTodos', () => {
  it('starts with loading=true, then loading=false with empty list', async () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.todos).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('addTodoItem adds a todo and makes it visible', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodoItem({ title: 'Buy milk' });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0]?.title).toBe('Buy milk');
    expect(result.current.todos[0]?.completed).toBe(false);
    expect(result.current.todos[0]?.syncStatus).toBe('pending');
  });

  it('toggleTodo toggles the completed flag', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodoItem({ title: 'Exercise' });
    });

    const id = result.current.todos[0]?.id;
    expect(id).toBeDefined();

    await act(async () => {
      await result.current.toggleTodo(id!);
    });

    expect(result.current.todos[0]?.completed).toBe(true);

    await act(async () => {
      await result.current.toggleTodo(id!);
    });

    expect(result.current.todos[0]?.completed).toBe(false);
  });

  it('updateTodoTitle changes the title', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodoItem({ title: 'Old title' });
    });

    const id = result.current.todos[0]?.id;
    expect(id).toBeDefined();

    await act(async () => {
      await result.current.updateTodoTitle(id!, { title: 'New title' });
    });

    expect(result.current.todos[0]?.title).toBe('New title');
  });

  it('deleteTodoItem removes the todo', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodoItem({ title: 'To delete' });
    });

    const id = result.current.todos[0]?.id;
    expect(id).toBeDefined();

    await act(async () => {
      await result.current.deleteTodoItem(id!);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('trims whitespace from todo titles', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTodoItem({ title: '   Trimmed   ' });
    });

    expect(result.current.todos[0]?.title).toBe('Trimmed');
  });
});
