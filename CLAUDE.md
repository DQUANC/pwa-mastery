# CLAUDE.md — PWA Mastery

## Project Overview

PWA Mastery is a progressive learning path with 6 projects targeting a FullStack Labs Full Stack Developer role. Projects build incrementally from basic offline patterns (Service Workers, IndexedDB) toward real-time collaboration with CRDT algorithms. Each project is deployed independently to Railway; a static portfolio links them from GitHub Pages.

---

## Repository Structure

```
pwa-mastery/
├── portfolio/          Static GitHub Pages site (HTML/CSS/JS only — no framework)
├── projects/
│   ├── 01-todo-app/    React + TypeScript, Service Worker, IndexedDB
│   ├── 02-weather-app/ React + TypeScript, Geolocation, Network-First SW
│   ├── 03-qr-scanner/  React + Node.js + MongoDB, Camera API, jsQR
│   ├── 04-task-manager-biometric/  React + Node.js, WebAuthn, RBAC
│   ├── 05-asset-tracker/  Full-stack, GPS + Camera + Biometric, admin dashboard
│   └── 06-collaborative-notes/  Real-time CRDT, Yjs, WebSockets
├── shared/
│   ├── utils/          Cross-project utility functions
│   └── hooks/          Shared React hooks
├── docs/               Technical guides (SW, IndexedDB, Deployment, Checklist)
├── scripts/            Automation (auto-commit, auto-pr, auto-jira, dashboard)
└── .github/workflows/  CI/CD — GitHub Pages + Railway
```

---

## Tech Stack Conventions

### Frontend (all projects)

- React 18 + TypeScript strict mode (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`)
- Tailwind CSS for styling; shadcn/ui for complex components (Projects 5+)
- Vite as build tool
- Jest + React Testing Library for tests
- `VITE_` prefix required for all env vars exposed to the browser

### Backend (Projects 3+)

- Node.js 18+ with Express.js
- TypeScript strict mode
- MongoDB (primary) via Mongoose; JWT + WebAuthn for auth (Projects 4+)
- WebSockets via `ws` library (Project 6)

### PWA Core (all projects)

- Service Workers: native, no framework — never use Workbox unless explicitly decided
- Local storage: IndexedDB via `idb` library — never `localStorage` for app data
- Background Sync API for queuing offline mutations

---

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Branch | `feat/<project-slug>` | `feat/01-todo-app` |
| Commits | Conventional commits | `feat(01-todo-app): add service worker` |
| Components | PascalCase | `TodoItem.tsx` |
| Hooks / utilities | camelCase | `useTodos.ts`, `syncQueue.ts` |
| Files (non-component) | kebab-case | `upload-queue.ts` |
| IndexedDB stores | plural nouns | `todos`, `scans`, `assets` |
| CSS classes | Tailwind utility-first | no custom class names unless necessary |

---

## Commit Message Format

```
<type>(<scope>): <short description>

Types:  feat | fix | chore | docs | refactor | test | style
Scope:  project folder name or shared area

Examples:
feat(01-todo-app): add service worker with cache-first strategy
fix(03-qr-scanner): handle camera permission denied on iOS
chore(portfolio): update project links to Railway URLs
docs(shared): add IndexedDB migration guide
```

---

## Automation Scripts

All scripts live in `scripts/` and run via npm:

| Command | Purpose |
|---------|---------|
| `npm run auto-commit` | Generate and create a conventional commit |
| `npm run auto-pr` | Create a PR with standard description |
| `npm run auto-jira` | Create or update a Jira ticket |
| `npm run dashboard` | Print project status dashboard |

---

## Husky Hooks

Pre-commit hook is conditionally gated — each check only runs when the relevant config exists:

- `npm test` — only if a `test` script exists in `package.json`
- `eslint src/` — only if `src/` directory exists
- `tsc --noEmit` — only if `tsconfig.json` exists
- Secrets scan — checks for hardcoded credentials assigned to known secret variable names

A scaffold-only commit (no `src/`, no `tsconfig.json`) will not fail the hooks.

---

## PWA Quality Gates

Every project must pass all of the following before being marked complete:

- [ ] Lighthouse PWA score ≥ 85 on the deployed Railway URL
- [ ] App functions 100% offline (Service Worker active + IndexedDB populated)
- [ ] App is installable on Android and iOS (`manifest.json` + HTTPS)
- [ ] Zero TypeScript errors (`tsc --noEmit` passes)
- [ ] All tests passing

Full per-project checklist: `docs/PWA_CHECKLIST.md`

---

## Deployment

### GitHub Pages (`portfolio/`)

- Deploys on push to `main` when `portfolio/**` files change
- Workflow: `.github/workflows/deploy-pages.yml`
- No build step — static HTML/CSS/JS served directly
- URL: `https://daniel-quan.github.io/pwa-mastery/`

### Railway (`projects/`)

- Each project is an independent Railway service
- Deploys on push to `main` when the relevant `projects/<folder>/**` changes
- Workflow: `.github/workflows/deploy-railway.yml`
- Each project requires its own `railway.json` before deploying

---

## Environment Variables

- Never commit `.env` files — they are gitignored
- Local development: `.env.local` in each project root
- Production: Railway Variables tab per service
- All frontend env vars must use the `VITE_` prefix (Vite only exposes these to the browser)

---

## Code Style

- TypeScript strict mode in all projects — no `any`, use generics or `unknown`
- No `console.log` in committed code
- ESLint + Prettier configured per project
- Prefer named exports over default exports for utilities and hooks
- Keep components focused — extract data logic into custom hooks
- No inline comments unless the WHY is non-obvious to a future reader

---

## Documentation

- Each project has its own `README.md` with setup, learning goals, tech stack, and deployment steps
- `docs/` contains cross-cutting technical guides (Service Workers, IndexedDB, Deployment, Checklist)
- Update the completion checklist in each project's `README.md` as work progresses
- Main `README.md` is a general overview — do not add project-specific details there
