/**
 * Tests for the IndexedDB CRUD layer.
 *
 * Uses fake-indexeddb so tests run in Node/Jest without a real browser.
 */

// Polyfill IndexedDB for Node.js test environment
import 'fake-indexeddb/auto';

import {
  addTodo,
  getTodo,
  getAllTodos,
  getPendingTodos,
  putTodo,
  deleteTodo,
  clearAllTodos,
  resetDBInstance,
} from '../db/todos';
import { Todo } from '../types/todo';

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

beforeEach(async () => {
  idCounter = 0;
  // Reset instance and clear store between tests
  resetDBInstance();
  await clearAllTodos();
});

afterAll(() => {
  resetDBInstance();
});

describe('addTodo / getTodo', () => {
  it('stores a todo and retrieves it by id', async () => {
    const todo = makeTodo({ title: 'Buy groceries' });
    await addTodo(todo);

    const fetched = await getTodo(todo.id);
    expect(fetched).toEqual(todo);
  });

  it('returns undefined for a non-existent id', async () => {
    const result = await getTodo('does-not-exist');
    expect(result).toBeUndefined();
  });
});

describe('getAllTodos', () => {
  it('returns an empty array when no todos exist', async () => {
    const todos = await getAllTodos();
    expect(todos).toEqual([]);
  });

  it('returns all stored todos', async () => {
    const t1 = makeTodo({ title: 'First' });
    const t2 = makeTodo({ title: 'Second' });
    await addTodo(t1);
    await addTodo(t2);

    const todos = await getAllTodos();
    expect(todos).toHaveLength(2);
    expect(todos.map((t) => t.title)).toEqual(expect.arrayContaining(['First', 'Second']));
  });
});

describe('getPendingTodos', () => {
  it('returns only pending todos', async () => {
    const pending1 = makeTodo({ syncStatus: 'pending' });
    const pending2 = makeTodo({ syncStatus: 'pending' });
    const synced = makeTodo({ syncStatus: 'synced' });
    const failed = makeTodo({ syncStatus: 'failed' });

    await Promise.all([addTodo(pending1), addTodo(pending2), addTodo(synced), addTodo(failed)]);

    const pending = await getPendingTodos();
    expect(pending).toHaveLength(2);
    pending.forEach((t) => expect(t.syncStatus).toBe('pending'));
  });
});

describe('putTodo', () => {
  it('updates an existing todo', async () => {
    const todo = makeTodo({ title: 'Original' });
    await addTodo(todo);

    const updated: Todo = { ...todo, title: 'Updated', completed: true };
    await putTodo(updated);

    const fetched = await getTodo(todo.id);
    expect(fetched?.title).toBe('Updated');
    expect(fetched?.completed).toBe(true);
  });

  it('inserts a new todo if it does not exist', async () => {
    const todo = makeTodo({ title: 'Brand new' });
    await putTodo(todo);

    const fetched = await getTodo(todo.id);
    expect(fetched?.title).toBe('Brand new');
  });
});

describe('deleteTodo', () => {
  it('removes a todo by id', async () => {
    const todo = makeTodo();
    await addTodo(todo);
    await deleteTodo(todo.id);

    const fetched = await getTodo(todo.id);
    expect(fetched).toBeUndefined();

    const all = await getAllTodos();
    expect(all).toHaveLength(0);
  });
});

describe('clearAllTodos', () => {
  it('removes all todos from the store', async () => {
    await addTodo(makeTodo());
    await addTodo(makeTodo());

    await clearAllTodos();

    const all = await getAllTodos();
    expect(all).toHaveLength(0);
  });
});
