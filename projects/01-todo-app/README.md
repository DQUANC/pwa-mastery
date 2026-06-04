# ⭐ Project 1 — Todo App with Offline Sync

**Difficulty:** Easy | **Duration:** 1 week | **Priority:** ⭐⭐⭐⭐⭐

**Status:** ⏳ Not started  
**Live URL:** https://todo-app-prod.railway.app/

---

## 📋 Description

Core PWA fundamentals project. Build a todo list that:

- Works completely offline after first load
- Stores todos in IndexedDB (persists between sessions)
- Syncs pending changes to a remote backend when connectivity is restored
- Scores 85+ on Lighthouse PWA audit
- Is installable on mobile as a home screen app

This project establishes the foundation — Service Workers, IndexedDB, Background Sync, and the PWA manifest — that every subsequent project builds on.

---

## 🎓 Learning Goals

- [ ] Understand Service Worker lifecycle (install → activate → fetch)
- [ ] Implement Cache-First caching strategy for static assets
- [ ] Use IndexedDB (via the `idb` library) for local data persistence
- [ ] Create an installable web app with a valid `manifest.json`
- [ ] Implement Background Sync to queue and flush offline mutations
- [ ] Test offline functionality using Chrome DevTools
- [ ] Achieve Lighthouse 85+ score on the deployed Railway URL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Service Worker | Native (no framework) |
| Local storage | IndexedDB via `idb` library |
| HTTP client | Axios |
| Testing | Jest + React Testing Library |
| Deployment | Railway |

---

## 🚀 Setup

```bash
cd projects/01-todo-app

# Initialize Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install idb tailwindcss axios

# Install dev dependencies
npm install -D @types/node

# Start development server
npm run dev
```

---

## 📁 Key Files to Create

```
01-todo-app/
├── public/
│   ├── sw.js               (Service Worker)
│   ├── manifest.json       (PWA manifest)
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── db/
│   │   └── todos.ts        (IndexedDB schema + CRUD with idb)
│   ├── sync/
│   │   └── syncQueue.ts    (Background Sync queue management)
│   ├── hooks/
│   │   └── useTodos.ts     (React hook wrapping IndexedDB ops)
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   └── AddTodo.tsx
│   └── App.tsx
├── railway.json
└── package.json
```

---

## ⚙️ Service Worker Strategy

Use **Cache-First** for static assets (JS, CSS, icons) and **Network-First** for API calls.

```javascript
// public/sw.js — Cache-First for shell
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Network-First for API
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache-First for static assets
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached || fetch(event.request)
      )
    );
  }
});
```

Reference: `../../docs/SERVICE_WORKERS.md`

---

## 🗄️ IndexedDB Schema

```typescript
// src/db/todos.ts
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
```

Reference: `../../docs/INDEXEDDB_GUIDE.md`

---

## 🚂 Railway Deployment

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview -- --port $PORT --host",
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Steps

1. Build the project: `npm run build`
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Set root directory: `projects/01-todo-app`
4. Railway auto-detects Node.js and runs the build
5. Set environment variables in Railway Variables tab:
   ```
   NODE_ENV=production
   VITE_API_URL=https://todo-app-prod.railway.app
   ```
6. Deploy — live in ~2-5 minutes

### Live URL

```
https://todo-app-prod.railway.app/
```

---

## ✅ Completion Checklist

See `../../docs/PWA_CHECKLIST.md` for the full checklist.

Key gates before marking this project done:

- [ ] Lighthouse PWA score 85+ on Railway URL
- [ ] App works fully offline (todos load, can add/edit/delete, syncs on reconnect)
- [ ] App is installable on Android and iOS
- [ ] Zero TypeScript errors
- [ ] Tests passing

---

## 📚 References

- [Service Workers — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [idb Library](https://github.com/jakearchibald/idb)
- [IndexedDB API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Railway Docs](https://docs.railway.app/)
