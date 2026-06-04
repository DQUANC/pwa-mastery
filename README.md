# PWA Learning Path — Progressive Web Apps Mastery

> A structured journey from PWA fundamentals to production-ready full-stack applications with offline capabilities, hardware integration, and real-time sync patterns.

**Author:** Daniel Quan  
**Status:** In Progress  
**Target:** FullStack Labs — Full Stack Developer Role  
**Timeline:** 4-8 weeks (depending on pace)  
**Deployment:** GitHub Pages (portfolio) + Railway (projects)  
**Total Cost:** ~$70/year

---

## What Is This?

Six progressive PWA projects, each building on the patterns of the previous one. Starting from a basic offline todo list and ending with a real-time collaborative editor using CRDT algorithms. Every project is deployed to production and linked from a GitHub Pages portfolio.

The focus is on the PWA primitives that FullStack Labs specifically requires: Service Workers, offline-first architecture with IndexedDB, hardware API integration (camera, GPS, biometrics), and real-time sync.

---

## Why PWAs?

- FullStack Labs requires PWA expertise (Service Workers, offline-first, hardware integration)
- Industry demand is high — major companies are migrating to PWAs
- Combines web and native app capabilities in a single deployable codebase
- Scalable from startup MVP to Fortune 500 applications

---

## Key Outcomes

By completing this learning path you will:

- Understand Service Workers and caching strategies
- Build offline-first applications with IndexedDB
- Integrate device hardware (camera, biometrics, GPS, barcode scanner)
- Implement real-time synchronization patterns
- Deploy production-grade PWAs on Railway with backend support
- Have 6 portfolio projects for job applications
- Have a professional portfolio on GitHub Pages

---

## Projects

| # | Project | Difficulty | Duration | Priority | README |
|---|---------|-----------|----------|----------|--------|
| 1 | Todo App with Offline Sync | Easy | 1 week | 5/5 | [details](projects/01-todo-app/README.md) |
| 2 | Weather App with Geolocation | Easy-Medium | 1 week | 4/5 | [details](projects/02-weather-app/README.md) |
| 3 | QR Code Scanner | Medium | 2-3 weeks | 5/5 | [details](projects/03-qr-scanner/README.md) |
| 4 | Task Manager with Biometric Auth | Medium-Advanced | 2-3 weeks | 4/5 | [details](projects/04-task-manager-biometric/README.md) |
| 5 | Asset Tracker | Advanced | 3-4 weeks | 5/5 | [details](projects/05-asset-tracker/README.md) |
| 6 | Collaborative Notes | Advanced-Expert | 4 weeks | 4/5 | [details](projects/06-collaborative-notes/README.md) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Build tool | Vite |
| Testing | Jest + React Testing Library |
| Service Workers | Native (no framework) |
| Local storage | IndexedDB via idb library |
| Backend | Node.js 18+ + Express.js |
| Database | MongoDB + PostgreSQL (Railway) |
| Auth | JWT + WebAuthn |
| Real-time | WebSockets + Yjs (Project 6) |
| CI/CD | GitHub Actions |
| Portfolio hosting | GitHub Pages (free) |
| Project hosting | Railway ($5/month) |

---

## Deployment Strategy

| Platform | Purpose | Cost | URL |
|----------|---------|------|-----|
| GitHub Pages | Static portfolio | FREE | https://daniel-quan.github.io/pwa-mastery/ |
| Railway | Full-stack projects + databases | $5/month | see project URLs |

```
You push to main
        |
GitHub Actions triggers
        |
   _____|_____
  |           |
Portfolio   Projects
(HTML/CSS)  (React + backends)
  |           |
GitHub      Railway
Pages       (~2-5 min)
(~1 min)
```

**Project URLs:**

```
https://todo-app-prod.railway.app/
https://weather-app-prod.railway.app/
https://qr-scanner-prod.railway.app/
https://tasks-app-prod.railway.app/
https://assets-app-prod.railway.app/
https://notes-app-prod.railway.app/
```

---

## Timeline and Roadmap

### Fast Track (4 Weeks — Apply Immediately)

| Week | Work | Hours |
|------|------|-------|
| 1 | Project 1 — Todo App | 12-15 |
| 2 | Project 2 — Weather App | 14-18 |
| 3 | Project 3 — QR Scanner | 18-22 |
| 4 | Portfolio + Apply to FullStack Labs | 10 |

### Balanced (8 Weeks — Interview Ready)

| Week | Work | Hours |
|------|------|-------|
| 1-2 | Project 1 — Todo App | 12-15 |
| 3-4 | Project 2 — Weather App | 14-18 |
| 5-7 | Project 3 — QR Scanner | 20-25 |
| 8 | Portfolio + Interview Prep | 10 |

### Extended (12 Weeks — Senior Ready)

| Week | Work |
|------|------|
| 1-2 | Project 1 |
| 3-4 | Project 2 |
| 5-7 | Project 3 (main focus) |
| 8-10 | Project 4 |
| 11-12 | Portfolio + Interview Prep |

### Milestones

```
Week 2:   1 project complete + GitHub repo live
Week 4:   2 projects + Portfolio started
Week 7:   3 projects + Portfolio deployed + Apply
Week 10:  4 projects + Interview ready
```

---

## Success Criteria

### Minimum — Interview Ready (Projects 1-3)

- Complete Projects 1-3
- 85+ Lighthouse scores on all deployed URLs
- Portfolio deployed on GitHub Pages
- Projects deployed on Railway
- Clean, documented code
- Professional GitHub repos

### Recommended — Senior Role (Projects 1-5)

- Complete Projects 1-5
- Advanced PWA patterns demonstrated
- Scalable architecture
- 90+ Lighthouse scores

### Expert Level (All 6 Projects)

- All 6 projects complete
- CRDT expertise (Yjs)
- Real-time systems
- Full-stack mastery

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/daniel-quan/pwa-mastery
cd pwa-mastery

# 2. Start Project 1
cd projects/01-todo-app
npm create vite@latest . -- --template react-ts
npm install idb tailwindcss axios
npm run dev

# 3. When ready to deploy, push to main
# GitHub Actions auto-deploys portfolio to GitHub Pages
# and projects to Railway
git push origin main
```

Full setup details: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

---

## Repository Structure

```
pwa-mastery/
├── portfolio/              — GitHub Pages static portfolio
├── projects/
│   ├── 01-todo-app/
│   ├── 02-weather-app/
│   ├── 03-qr-scanner/
│   ├── 04-task-manager-biometric/
│   ├── 05-asset-tracker/
│   └── 06-collaborative-notes/
├── shared/
│   ├── utils/
│   └── hooks/
├── docs/
│   ├── SERVICE_WORKERS.md
│   ├── INDEXEDDB_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── PWA_CHECKLIST.md
└── .github/
    └── workflows/
        ├── deploy-pages.yml
        └── deploy-railway.yml
```

---

## Sub-READMEs and Docs

| File | Contents |
|------|---------|
| [portfolio/README.md](portfolio/README.md) | GitHub Pages setup, folder structure, deployment |
| [projects/README.md](projects/README.md) | All 6 projects overview with links |
| [docs/SERVICE_WORKERS.md](docs/SERVICE_WORKERS.md) | SW lifecycle, Cache-First, Network-First, Background Sync |
| [docs/INDEXEDDB_GUIDE.md](docs/INDEXEDDB_GUIDE.md) | IndexedDB with idb, offline-first patterns |
| [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Full GitHub Pages + Railway deployment walkthrough |
| [docs/PWA_CHECKLIST.md](docs/PWA_CHECKLIST.md) | Testing and quality checklist for all projects |

---

## Cost Breakdown

```
GitHub Pages Portfolio:   $0/month
Railway (projects):       $5/month  (~$60/year)
Custom domain (optional): $10/year

Total: ~$70/year  (vs $1,440+/year with Vercel)
```

---

## Resources

**PWA Fundamentals**
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)

**Service Workers**
- [Service Worker API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [The Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)

**IndexedDB**
- [IndexedDB API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [idb Library](https://github.com/jakearchibald/idb)

**Hardware APIs**
- [Geolocation API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Camera API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [WebAuthn API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebAuthn_API)

**Real-time and Collaboration**
- [Yjs Documentation](https://docs.yjs.dev/)
- [WebSockets — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [CRDT.tech](https://crdt.tech/)

**Deployment**
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Railway Docs](https://docs.railway.app/)

---

## Progress Tracking

- [ ] Week 1: Todo App complete
- [ ] Week 2: Weather App complete
- [ ] Week 3: QR Scanner complete
- [ ] Week 4: Portfolio live
- [ ] Week 5: Apply to FullStack Labs
- [ ] Week 6: Interview preparation
- [ ] Week 7: Offer received

---

**Last Updated:** June 4, 2026  
**Version:** 2.0.0  
**License:** MIT  
**Maintainer:** Daniel Quan
