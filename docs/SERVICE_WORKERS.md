# Service Workers Guide

A focused reference for understanding and implementing Service Workers in this PWA learning path.

---

## What Is a Service Worker?

A Service Worker is a JavaScript file that runs in the background, separate from the main browser thread. It acts as a network proxy, intercepting requests between the app and the network, enabling offline support, background sync, and push notifications.

Key points:
- Runs in a separate worker context (no DOM access)
- Requires HTTPS (or localhost for development)
- Is event-driven
- Has its own lifecycle independent of the page

---

## Service Worker Lifecycle

```
1. REGISTRATION  → navigator.serviceWorker.register('/sw.js')
        ↓
2. INSTALL       → sw.js downloaded, install event fires
        ↓          Cache shell assets here (Cache Storage API)
3. WAITING       → New SW waits for old SW to release all clients
        ↓
4. ACTIVATE      → Old caches cleaned up here
        ↓
5. FETCH         → SW intercepts all network requests from this point on
```

### Registration

```javascript
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration.scope);
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}
```

### Install Event — Cache Shell Assets

```javascript
// sw.js
const CACHE_NAME = 'app-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  // Take over immediately without waiting
  self.skipWaiting();
});
```

### Activate Event — Clean Up Old Caches

```javascript
// sw.js
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  // Claim all clients so SW takes effect immediately
  self.clients.claim();
});
```

---

## Caching Strategies

### Cache-First (Used in: Project 1 — Todo App)

Best for: Static assets, app shell, fonts, icons.
Trade-off: Content may be stale until SW updates.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Serve from cache
      }
      return fetch(event.request).then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      });
    })
  );
});
```

### Network-First (Used in: Project 2 — Weather App)

Best for: API calls, dynamic data, anything that must be fresh.
Trade-off: Fails gracefully to cache when offline.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request)) // Fallback to cache
  );
});
```

### Stale-While-Revalidate

Best for: Avatars, non-critical images, secondary data.
Trade-off: Returns stale data immediately while fetching fresh in background.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    )
  );
});
```

---

## Background Sync API

Defers actions (like form submissions) until the user has a stable connection.
Used in: Project 1 (todo sync), Project 3 (batch QR scan upload).

```javascript
// Registering a sync in the page
async function syncTodos() {
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('sync-todos');
}

// Handling the sync in sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(flushPendingTodos());
  }
});

async function flushPendingTodos() {
  // Read pending items from IndexedDB and POST them to the API
  const db = await openDB('todos', 1);
  const pending = await db.getAll('pending');
  for (const item of pending) {
    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json' },
    });
    await db.delete('pending', item.id);
  }
}
```

---

## PWA Manifest

Every installable PWA needs a `manifest.json`:

```json
{
  "name": "My PWA App",
  "short_name": "MyApp",
  "description": "A progressive web app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Link it in your HTML:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
```

---

## Testing Service Workers

In Chrome DevTools:
- Application tab → Service Workers: inspect status, force update, test offline
- Application tab → Cache Storage: inspect cached assets
- Network tab → check "Offline" checkbox to simulate offline

Lighthouse audit:
- Run from DevTools → Lighthouse → Progressive Web App
- Target: 85+ score

---

## References

- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [The Offline Cookbook — Jake Archibald](https://jakearchibald.com/2014/offline-cookbook/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Background Sync API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
