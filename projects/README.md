# 📁 Projects

Six progressive PWA projects, each deployed independently on Railway.

Each project builds on the patterns from the previous one. Complete them in order for the best learning progression.

---

## 📊 Project Index

| # | Project | Difficulty | Duration | Priority | Link |
|---|---------|-----------|----------|----------|------|
| 1 | [Todo App with Offline Sync](./01-todo-app/README.md) | Easy | 1 week | ⭐⭐⭐⭐⭐ | [Live](https://todo-app-prod.railway.app/) |
| 2 | [Weather App with Geolocation](./02-weather-app/README.md) | Easy-Medium | 1 week | ⭐⭐⭐⭐ | [Live](https://weather-app-prod.railway.app/) |
| 3 | [QR Code Scanner](./03-qr-scanner/README.md) | Medium | 2-3 weeks | ⭐⭐⭐⭐⭐ | [Live](https://qr-scanner-prod.railway.app/) |
| 4 | [Task Manager with Biometric Auth](./04-task-manager-biometric/README.md) | Medium-Advanced | 2-3 weeks | ⭐⭐⭐⭐ | [Live](https://tasks-app-prod.railway.app/) |
| 5 | [Asset Tracker](./05-asset-tracker/README.md) | Advanced | 3-4 weeks | ⭐⭐⭐⭐⭐ | [Live](https://assets-app-prod.railway.app/) |
| 6 | [Collaborative Notes](./06-collaborative-notes/README.md) | Advanced-Expert | 4 weeks | ⭐⭐⭐⭐ | [Live](https://notes-app-prod.railway.app/) |

---

## 📋 Project Summaries

### ⭐ Project 1 — Todo App with Offline Sync

Core PWA fundamentals. Build a todo list that works fully offline using a Service Worker and IndexedDB, then syncs automatically when connectivity is restored.

Key concepts: Service Worker lifecycle, Cache-First strategy, IndexedDB, Background Sync, manifest.json, Lighthouse audit.

---

### ⭐ Project 2 — Weather App with Geolocation

Real-time data with offline fallback. Fetch live weather using the browser's Geolocation API and cache responses so the app works without a connection.

Key concepts: Network-First strategy, Geolocation API, OpenWeather API integration, offline fallback UI.

---

### 🏆 Project 3 — QR Code Scanner

**MOST IMPORTANT FOR FULLSTACK.** Hardware integration with a full backend. Access the device camera, decode QR codes in real time, store results locally, and batch-upload to a Node.js + MongoDB backend.

Key concepts: Camera API (getUserMedia), jsQR library, backend REST API, MongoDB, batch sync patterns.

---

### 💎 Project 4 — Task Manager with Biometric Auth

Security patterns in offline-first apps. Authenticate users with device biometrics (fingerprint/face ID), encrypt local task storage, and enforce role-based access on the backend.

Key concepts: WebAuthn API, crypto-js, JWT, RBAC, encrypted IndexedDB.

---

### 🎯 Project 5 — Asset Tracker

Full production-grade full-stack app. Track physical assets using GPS, camera, and biometric verification. Includes an admin dashboard and analytics.

Key concepts: Multiple hardware APIs combined, scalable offline-first architecture, analytics/reporting, production deployment patterns.

---

### 🔥 Project 6 — Collaborative Notes

Real-time collaboration with conflict resolution. Multiple users edit notes simultaneously; offline edits merge correctly on reconnect using CRDT algorithms.

Key concepts: Yjs (CRDT), WebSocket real-time sync, operational transformation, concurrent offline editing.

---

## 🏗️ Structure Notes

Projects 1 and 2 are single-stack (React frontend only).

Projects 3, 5, and 6 use a `frontend/` + `backend/` split.

Project 4 has a `backend/` subfolder alongside the root `src/`.

Each project will get its own `railway.json` and `package.json` when initialized.

---

## 🔗 Shared Resources

- Shared utilities: `../shared/utils/`
- Shared React hooks: `../shared/hooks/`
- Service Worker guide: `../docs/SERVICE_WORKERS.md`
- IndexedDB guide: `../docs/INDEXEDDB_GUIDE.md`
- Deployment guide: `../docs/DEPLOYMENT_GUIDE.md`
- Quality checklist: `../docs/PWA_CHECKLIST.md`
