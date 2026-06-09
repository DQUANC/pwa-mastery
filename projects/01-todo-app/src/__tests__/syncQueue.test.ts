/**
 * Tests for the sync queue.
 */

import 'fake-indexeddb/auto';

import { syncPendingTodos } from '../sync/syncQueue';
import { addTodo, getAllTodos, resetDBInstance, clearAllTodos } from '../db/todos';
import { Todo } from '../types/todo';

// ─── Helpers ──────────────────────────────────────────────────────────────────

let idCounter = 0;
function makeTodo(overrides: Partial<Todo> = {}): Todo {
  idCounter += 1;
  return {
    id: `todo-${idCounter}`,
    title: 'Test todo',
    completed: false,
    syncStatus: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

/** Create a minimal fetch-compatible response object */
function makeResponse(status: number, body = '{}'): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(async () => {
  idCounter = 0;
  resetDBInstance();
  await clearAllTodos();
  mockFetch.mockReset();
});

afterAll(() => {
  resetDBInstance();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('syncPendingTodos', () => {
  it('sends pending todos to the API and marks them synced', async () => {
    const todo = makeTodo({ syncStatus: 'pending' });
    await addTodo(todo);

    mockFetch.mockResolvedValueOnce(makeResponse(200));

    await syncPendingTodos();

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const all = await getAllTodos();
    expect(all[0]?.syncStatus).toBe('synced');
  });

  it('marks todos as failed when the API returns an error', async () => {
    const todo = makeTodo({ syncStatus: 'pending' });
    await addTodo(todo);

    mockFetch.mockResolvedValueOnce(makeResponse(500, 'Server Error'));

    await syncPendingTodos();

    const all = await getAllTodos();
    expect(all[0]?.syncStatus).toBe('failed');
  });

  it('marks todos as failed when fetch throws (network error)', async () => {
    const todo = makeTodo({ syncStatus: 'pending' });
    await addTodo(todo);

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await syncPendingTodos();

    const all = await getAllTodos();
    expect(all[0]?.syncStatus).toBe('failed');
  });

  it('does nothing when there are no pending todos', async () => {
    await addTodo(makeTodo({ syncStatus: 'synced' }));

    await syncPendingTodos();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('syncs multiple pending todos in parallel', async () => {
    const t1 = makeTodo({ syncStatus: 'pending' });
    const t2 = makeTodo({ syncStatus: 'pending' });
    await addTodo(t1);
    await addTodo(t2);

    mockFetch
      .mockResolvedValueOnce(makeResponse(200))
      .mockResolvedValueOnce(makeResponse(200));

    await syncPendingTodos();

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const all = await getAllTodos();
    all.forEach((t) => expect(t.syncStatus).toBe('synced'));
  });
});
