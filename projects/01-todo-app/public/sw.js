/**
 * Service Worker for Todo App
 *
 * Strategy:
 *   - Cache-First for static shell assets (JS, CSS, icons, manifest)
 *   - Network-First for API calls (/api/*)
 *   - Background Sync for offline todo mutations
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `todo-app-${CACHE_VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name.startsWith('todo-app-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── FETCH ────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests and GET methods for caching
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    // Network-First for API calls
    event.respondWith(networkFirst(request));
  } else {
    // Cache-First for static assets
    event.respondWith(cacheFirst(request));
  }
});

/**
 * Cache-First strategy: serve from cache, fall back to network and cache the response.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

/**
 * Network-First strategy: try network, fall back to cache if offline.
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ─── BACKGROUND SYNC ─────────────────────────────────────────────────────────

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncPendingTodos());
  }
});

/**
 * Flush all pending todos to the server.
 * Reads from IndexedDB using the idb UMD build (available in SW context).
 */
async function syncPendingTodos() {
  try {
    const { openDB } = await import('/node_modules/idb/build/index.js').catch(
      () => ({ openDB: null }),
    );

    if (!openDB) return;

    const db = await openDB('todo-app', 1);
    const pending = await db.getAllFromIndex('todos', 'by-sync-status', 'pending');

    for (const todo of pending) {
      try {
        const method = todo.deletedAt ? 'DELETE' : todo.syncStatus === 'pending' ? 'POST' : 'PUT';
        const apiUrl = todo.deletedAt
          ? `/api/todos/${todo.id}`
          : method === 'POST'
            ? '/api/todos'
            : `/api/todos/${todo.id}`;

        await fetch(apiUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: method !== 'DELETE' ? JSON.stringify(todo) : undefined,
        });

        await db.put('todos', { ...todo, syncStatus: 'synced' });
      } catch {
        await db.put('todos', { ...todo, syncStatus: 'failed' });
      }
    }
  } catch {
    // SW sync errors are non-fatal; the next sync event will retry
  }
}
