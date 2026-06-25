import { getPendingTodos, putTodo } from '../db/todos';
import { Todo } from '../types/todo';

const SYNC_TAG = 'sync-todos';

/**
 * Attempt to register a Background Sync, falling back to an online event listener
 * if the Background Sync API is not supported.
 */
export function triggerBackgroundSync(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        // SyncManager is available in Chrome; check before use
        const reg = registration as ServiceWorkerRegistration & {
          sync?: { register: (tag: string) => Promise<void> };
        };
        if (reg.sync) {
          return reg.sync.register(SYNC_TAG);
        }
        // Fallback: sync immediately if online
        window.addEventListener('online', () => void syncPendingTodos(), { once: true });
        return Promise.resolve();
      })
      .catch(() => {
        window.addEventListener('online', () => void syncPendingTodos(), { once: true });
      });
  } else {
    window.addEventListener('online', () => void syncPendingTodos(), { once: true });
  }
}

/**
 * Flush all pending todos to the remote API.
 * Called either by the Service Worker sync event or the online fallback.
 */
export async function syncPendingTodos(): Promise<void> {
  const pending = await getPendingTodos();

  const results = await Promise.allSettled(
    pending.map((todo) => syncOneTodo(todo)),
  );

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      const todo = pending[idx];
      if (todo) {
        void putTodo({ ...todo, syncStatus: 'failed' });
      }
    }
  });
}

function getApiBase(): string {
  // Works in both Vite (import.meta.env) and Jest (process.env)
  if (typeof process !== 'undefined' && process.env['VITE_API_URL']) {
    return process.env['VITE_API_URL'];
  }
  return '';
}

async function syncOneTodo(todo: Todo): Promise<void> {
  const apiBase = getApiBase();
  const url = `${apiBase}/api/todos${todo.syncStatus === 'pending' ? '' : `/${todo.id}`}`;
  const method = todo.syncStatus === 'pending' ? 'POST' : 'PUT';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }

  await putTodo({ ...todo, syncStatus: 'synced' });
}
