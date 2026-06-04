# Project 6 — Collaborative Notes

**Difficulty:** Advanced-Expert | **Duration:** 4 weeks | **Priority:** 4/5

**Status:** Not started  
**Live URL:** https://notes-app-prod.railway.app/

---

## Description

A real-time collaborative note editor where multiple users can:

- Edit the same note simultaneously, with changes merged conflict-free
- Work completely offline — edits are stored locally and merged on reconnect
- See other users' cursors and presence indicators in real time
- Version notes (view history, roll back)

This project uses **Yjs**, a CRDT (Conflict-free Replicated Data Type) library, to handle concurrent edits. CRDTs are the state-of-the-art solution to the hard problem of merging concurrent offline changes without data loss.

This is the most technically complex project in the learning path. Completing it puts you at senior/expert level for real-time systems and distributed data.

---

## Learning Goals

- [ ] Understand CRDT algorithms and why they solve the offline collaboration problem
- [ ] Implement real-time collaboration using Yjs
- [ ] Build WebSocket communication between frontend and backend
- [ ] Handle offline edits and merge them correctly on reconnect
- [ ] Design version control for document history
- [ ] Manage concurrent users editing the same document
- [ ] Build a presence system (show who is online and where their cursor is)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| CRDT library | Yjs |
| Rich text editor | Tiptap (built on ProseMirror, Yjs-compatible) |
| WebSocket client | y-websocket provider |
| Service Worker | Native |
| Local persistence | Y.IndexedDB provider (Yjs official) |
| Backend runtime | Node.js 18+ |
| Backend framework | Express.js + ws (WebSocket) |
| CRDT server | y-websocket server |
| Database | MongoDB (note metadata + snapshots) |
| Testing | Jest + React Testing Library |
| Deployment | Railway |

---

## Project Structure

```
06-collaborative-notes/
├── frontend/
│   ├── public/
│   │   ├── sw.js
│   │   └── manifest.json
│   ├── src/
│   │   ├── collaboration/
│   │   │   ├── useYjs.ts           (Yjs doc + providers setup)
│   │   │   └── usePresence.ts      (Awareness — cursors, online users)
│   │   ├── editor/
│   │   │   └── CollaborativeEditor.tsx  (Tiptap + Yjs binding)
│   │   ├── db/
│   │   │   └── notes.ts            (Note metadata in IndexedDB)
│   │   ├── pages/
│   │   │   ├── NoteList.tsx
│   │   │   └── NoteEditor.tsx
│   │   ├── components/
│   │   │   ├── PresenceBar.tsx     (Online users list)
│   │   │   ├── ConnectionStatus.tsx
│   │   │   └── VersionHistory.tsx
│   │   └── App.tsx
│   ├── railway.json
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── server.ts               (Express + WebSocket server)
    │   ├── yjsServer.ts            (y-websocket server setup)
    │   ├── routes/
    │   │   ├── notes.ts            (Note CRUD metadata)
    │   │   └── auth.ts
    │   ├── models/
    │   │   ├── Note.ts
    │   │   └── User.ts
    │   └── persistence/
    │       └── mongodbPersistence.ts  (y-mongodb-provider)
    ├── railway.json
    └── package.json
```

---

## Setup

### Frontend

```bash
cd projects/06-collaborative-notes/frontend
npm create vite@latest . -- --template react-ts
npm install yjs y-websocket y-indexeddb @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
npm install idb tailwindcss axios
npm run dev
```

### Backend

```bash
cd projects/06-collaborative-notes/backend
npm init -y
npm install express ws y-websocket y-mongodb-provider mongoose cors dotenv jsonwebtoken
npm install -D typescript @types/express @types/node @types/ws ts-node nodemon
```

---

## How Yjs Works

Yjs is a CRDT implementation. A `Y.Doc` is a shared data structure that:

- Can be edited by multiple users simultaneously
- Tracks all changes as operations
- Merges concurrent operations without conflicts (no "last write wins")
- Persists offline edits locally and merges them when synced

```typescript
// frontend/src/collaboration/useYjs.ts
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

export function useYjs(noteId: string) {
  const [doc] = useState(() => new Y.Doc());

  // Persist offline in IndexedDB
  const indexeddbProvider = new IndexeddbPersistence(`note-${noteId}`, doc);

  // Sync with server via WebSocket when online
  const wsProvider = new WebsocketProvider(
    `wss://${import.meta.env.VITE_WS_URL}`,
    noteId,
    doc
  );

  return { doc, wsProvider, indexeddbProvider };
}
```

### Offline Behavior

When the WebSocket disconnects (offline or server down):
1. Yjs continues accumulating local changes in the `Y.Doc`
2. `IndexeddbPersistence` persists the changes to the browser
3. When the WebSocket reconnects, Yjs automatically syncs the diverged state
4. The server merges all updates from all clients — no conflicts

---

## WebSocket Server (y-websocket)

```typescript
// backend/src/yjsServer.ts
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

export function startYjsServer(server: import('http').Server) {
  const wss = new WebSocketServer({ server, path: '/yjs' });

  wss.on('connection', (ws, req) => {
    // roomName = noteId (each note is a separate CRDT document room)
    setupWSConnection(ws, req, {
      docName: req.url?.slice(1), // /noteId -> noteId
    });
  });
}
```

---

## Presence (Awareness API)

Show other users' names and cursor positions in real time:

```typescript
// frontend/src/collaboration/usePresence.ts
export function usePresence(wsProvider: WebsocketProvider, currentUser: User) {
  const awareness = wsProvider.awareness;

  // Set local user state
  awareness.setLocalStateField('user', {
    name: currentUser.name,
    color: currentUser.color,
  });

  // Observe remote users
  const [onlineUsers, setOnlineUsers] = useState<AwarenessUser[]>([]);
  awareness.on('change', () => {
    const states = Array.from(awareness.getStates().values());
    setOnlineUsers(states.map((s) => s.user).filter(Boolean));
  });

  return { onlineUsers };
}
```

---

## Conflict Resolution — Key Concept

| Approach | How conflicts are resolved | Offline support |
|----------|--------------------------|-----------------|
| Last Write Wins | Latest timestamp wins — data lost | Poor |
| Operational Transform (OT) | Server mediates — complex | Limited |
| CRDT (Yjs) | Math guarantees no conflicts | Excellent |

CRDTs guarantee that all clients converge to the same state regardless of the order in which they received updates. This is why Yjs can merge offline edits made by 10 different users without a server in the loop.

---

## Railway Deployment

The backend runs both Express (HTTP) and a WebSocket server on the same port.

### Backend railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "node dist/server.ts",
    "healthcheckPath": "/health"
  }
}
```

### Backend Environment Variables

```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret>
```

### Frontend Environment Variables

```
VITE_API_URL=https://notes-api.railway.app
VITE_WS_URL=notes-api.railway.app
```

### Live URLs

```
Frontend: https://notes-app-prod.railway.app/
Backend:  https://notes-api.railway.app/
```

---

## Completion Checklist

- [ ] Two browser tabs can edit the same note simultaneously and stay in sync
- [ ] Edits made offline are merged correctly on reconnect (no data loss)
- [ ] Presence bar shows online users in real time
- [ ] Note history is accessible and content can be rolled back
- [ ] WebSocket connection status is displayed (connected / reconnecting / offline)
- [ ] IndexedDB persistence means notes survive page refresh while offline
- [ ] Lighthouse PWA score 85+ on Railway URL
- [ ] Zero TypeScript errors

---

## References

- [Yjs Documentation](https://docs.yjs.dev/)
- [y-websocket](https://github.com/yjs/y-websocket)
- [y-indexeddb](https://github.com/yjs/y-indexeddb)
- [Tiptap Editor](https://tiptap.dev/)
- [CRDT.tech — Research Papers](https://crdt.tech/)
- [WebSockets — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws — Node.js WebSocket library](https://github.com/websockets/ws)
- [Railway Docs](https://docs.railway.app/)
