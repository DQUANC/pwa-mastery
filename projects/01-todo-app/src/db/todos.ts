import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Todo } from '../types/todo';

interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
    indexes: { 'by-sync-status': string };
  };
}

const DB_NAME = 'todo-app';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<TodoDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<TodoDB>> {
  if (!dbInstance) {
    dbInstance = await openDB<TodoDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        const store = database.createObjectStore('todos', { keyPath: 'id' });
        store.createIndex('by-sync-status', 'syncStatus');
      },
    });
  }
  return dbInstance;
}

export async function addTodo(todo: Todo): Promise<void> {
  const db = await getDB();
  await db.add('todos', todo);
}

export async function getTodo(id: string): Promise<Todo | undefined> {
  const db = await getDB();
  return db.get('todos', id);
}

export async function getAllTodos(): Promise<Todo[]> {
  const db = await getDB();
  return db.getAll('todos');
}

export async function getPendingTodos(): Promise<Todo[]> {
  const db = await getDB();
  return db.getAllFromIndex('todos', 'by-sync-status', 'pending');
}

export async function putTodo(todo: Todo): Promise<void> {
  const db = await getDB();
  await db.put('todos', todo);
}

export async function deleteTodo(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('todos', id);
}

export async function clearAllTodos(): Promise<void> {
  const db = await getDB();
  await db.clear('todos');
}

/**
 * Close and reset the DB instance — used in tests to ensure clean state.
 */
export function resetDBInstance(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
