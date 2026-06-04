# IndexedDB Guide

A focused reference for using IndexedDB to build offline-first PWA data layers.

---

## What Is IndexedDB?

IndexedDB is a low-level browser API for storing structured data — including files and blobs — client-side. Unlike `localStorage`, it:

- Is asynchronous (non-blocking)
- Supports large amounts of data (gigabytes, not kilobytes)
- Stores objects, not just strings
- Supports indexes and range queries
- Works inside Service Workers

### When to Use IndexedDB

| Scenario | Storage choice |
|----------|---------------|
| User preferences, flags | localStorage |
| Shopping cart, small state | localStorage or sessionStorage |
| Offline todo list, contacts | IndexedDB |
| Offline asset catalog, files | IndexedDB |
| Sync queue, pending mutations | IndexedDB |
| Cached API responses | Cache API (via Service Worker) |

---

## The `idb` Library

The raw IndexedDB API is verbose. The [`idb`](https://github.com/jakearchibald/idb) library wraps it in a clean Promise/async API.

### Installation

```bash
npm install idb
```

### Opening a Database

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: {
      id: string;
      title: string;
      completed: boolean;
      syncStatus: 'synced' | 'pending' | 'failed';
      createdAt: number;
      updatedAt: number;
    };
    indexes: { 'by-sync-status': string };
  };
}

let db: IDBPDatabase<TodoDB>;

async function getDB(): Promise<IDBPDatabase<TodoDB>> {
  if (!db) {
    db = await openDB<TodoDB>('todo-app', 1, {
      upgrade(database) {
        const store = database.createObjectStore('todos', { keyPath: 'id' });
        store.createIndex('by-sync-status', 'syncStatus');
      },
    });
  }
  return db;
}
```

---

## Core CRUD Operations

### Create

```typescript
async function addTodo(todo: Todo): Promise<void> {
  const db = await getDB();
  await db.add('todos', {
    ...todo,
    syncStatus: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}
```

### Read

```typescript
// Get one by ID
async function getTodo(id: string): Promise<Todo | undefined> {
  const db = await getDB();
  return db.get('todos', id);
}

// Get all
async function getAllTodos(): Promise<Todo[]> {
  const db = await getDB();
  return db.getAll('todos');
}

// Get all with a specific index value
async function getPendingTodos(): Promise<Todo[]> {
  const db = await getDB();
  return db.getAllFromIndex('todos', 'by-sync-status', 'pending');
}
```

### Update

```typescript
async function updateTodo(id: string, changes: Partial<Todo>): Promise<void> {
  const db = await getDB();
  const existing = await db.get('todos', id);
  if (!existing) throw new Error(`Todo ${id} not found`);
  await db.put('todos', {
    ...existing,
    ...changes,
    updatedAt: Date.now(),
    syncStatus: 'pending', // Mark for re-sync
  });
}
```

### Delete

```typescript
async function deleteTodo(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('todos', id);
}
```

### Clear

```typescript
async function clearAllTodos(): Promise<void> {
  const db = await getDB();
  await db.clear('todos');
}
```

---

## Offline-First Patterns

### The Sync Queue Pattern

All mutations go to IndexedDB first (optimistic update), then get synced to the server when online.

```typescript
// 1. Write to local DB immediately (user sees result right away)
async function createTodoOfflineFirst(title: string): Promise<Todo> {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    syncStatus: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await addTodo(todo);
  triggerBackgroundSync(); // fire-and-forget
  return todo;
}

// 2. Background sync attempts to flush pending items to the server
async function syncPendingTodos(): Promise<void> {
  const pending = await getPendingTodos();
  for (const todo of pending) {
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      await updateTodo(todo.id, { syncStatus: 'synced' });
    } catch {
      await updateTodo(todo.id, { syncStatus: 'failed' });
    }
  }
}

// 3. Trigger via Background Sync API (from Service Worker)
//    or fallback to online event
function triggerBackgroundSync() {
  navigator.serviceWorker.ready.then((reg) =>
    reg.sync.register('sync-todos').catch(() => {
      // Background Sync not supported; listen for online instead
      window.addEventListener('online', syncPendingTodos, { once: true });
    })
  );
}
```

### Versioning / Schema Migrations

Increment the version number and handle upgrades:

```typescript
db = await openDB<TodoDB>('todo-app', 2, {
  upgrade(database, oldVersion) {
    if (oldVersion < 1) {
      // Version 1: create initial store
      database.createObjectStore('todos', { keyPath: 'id' });
    }
    if (oldVersion < 2) {
      // Version 2: add a new store
      database.createObjectStore('tags', { keyPath: 'id' });
    }
  },
});
```

---

## Working Inside a Service Worker

IndexedDB is available inside Service Workers (no DOM access needed):

```javascript
// sw.js
importScripts('https://cdn.jsdelivr.net/npm/idb@7/build/umd.js');

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncFromServiceWorker());
  }
});

async function syncFromServiceWorker() {
  const db = await idb.openDB('todo-app', 1);
  const pending = await db.getAllFromIndex('todos', 'by-sync-status', 'pending');
  // ... flush to server
}
```

---

## Usage in This Project

| Project | What is stored in IndexedDB |
|---------|----------------------------|
| 01-todo-app | Todos + sync queue |
| 02-weather-app | Cached weather responses + last location |
| 03-qr-scanner | Scanned QR batches pending upload |
| 04-task-manager-biometric | Tasks + encrypted auth tokens |
| 05-asset-tracker | Asset records + GPS history |
| 06-collaborative-notes | Note content + offline edits (CRDT state) |

---

## References

- [IndexedDB API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [idb Library — GitHub](https://github.com/jakearchibald/idb)
- [Using IndexedDB — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [Web.dev: IndexedDB Best Practices](https://web.dev/indexeddb-best-practices/)
