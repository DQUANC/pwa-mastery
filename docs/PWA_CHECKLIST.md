# PWA Quality Checklist

Use this checklist before marking any project as complete. Every project in this repo must pass all applicable sections.

---

## Unit Tests

- [ ] Components render correctly without crashing
- [ ] Hooks return expected values and update state correctly
- [ ] Utility functions return correct outputs for all edge cases
- [ ] Error states are handled and displayed correctly
- [ ] Loading states are handled correctly

```bash
npm run test
npm run test -- --coverage
```

---

## Integration Tests

- [ ] Service Worker registers without errors in the browser
- [ ] Service Worker activates and claims clients
- [ ] IndexedDB store opens and CRUD operations succeed
- [ ] Offline mutations are queued in IndexedDB
- [ ] Background Sync fires when connection is restored
- [ ] API calls succeed with correct data
- [ ] API call failures fall back to cached data
- [ ] App shell loads fully offline

---

## PWA Tests

Run Lighthouse from Chrome DevTools (DevTools → Lighthouse → Progressive Web App):

- [ ] Lighthouse PWA score: **85 or higher**
- [ ] Lighthouse Performance score: 80+
- [ ] Lighthouse Accessibility score: 90+
- [ ] App works **100% offline** (no network requests fail silently)
- [ ] App is **installable** — install prompt appears on mobile
- [ ] `manifest.json` is valid and linked in HTML
- [ ] Icons provided at 192x192 and 512x512
- [ ] `theme-color` meta tag is set
- [ ] App is fully **responsive** (mobile, tablet, desktop)
- [ ] No mixed content (all assets over HTTPS)
- [ ] `start_url` responds with 200 when offline

---

## Device Tests

- [ ] Works on iPhone (Safari)
- [ ] Works on Android (Chrome)
- [ ] Works on desktop Chrome
- [ ] Works on desktop Firefox
- [ ] Works on desktop Safari
- [ ] Camera access works (Projects 3+)
- [ ] Geolocation works (Project 2+)
- [ ] Biometric prompt appears and works (Project 4+)
- [ ] App can be added to home screen on both iOS and Android

---

## Code Quality Standards

### TypeScript

All projects use TypeScript strict mode. The `tsconfig.json` must include:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

- [ ] Zero TypeScript errors (`tsc --noEmit`)
- [ ] No `any` types without explicit justification in a comment
- [ ] All API response shapes are typed

### Linting & Formatting

```bash
npm run lint      # Zero ESLint errors
npm run format    # Prettier applied
```

- [ ] Zero ESLint errors
- [ ] Code formatted with Prettier
- [ ] No `console.log` left in production code (use a logger utility)

### Build

```bash
npm run build     # Must succeed with no errors or warnings
```

- [ ] Build succeeds cleanly
- [ ] Bundle size checked (Vite build output)
- [ ] No unused dependencies in `package.json`

---

## Git Workflow

### Branch Naming

```
feat/01-todo-app
feat/02-weather-app
feat/03-qr-scanner-camera
fix/01-todo-offline-sync
chore/update-dependencies
```

### Commit Messages (Conventional Commits)

```bash
feat: add service worker with cache-first strategy
feat: implement IndexedDB sync queue
fix: handle offline sync race condition
chore: update idb to v7
docs: add service worker setup notes
test: add unit tests for sync queue
```

### Before Merging to Main

```bash
# Run full validation suite
npm run lint
npm run test
npm run build

# Then push — GitHub Actions handles deployment
git push origin feat/01-todo-app
# Create PR → review → merge to main
```

### After Merging

- [ ] GitHub Actions deploy workflow passes (check Actions tab)
- [ ] Live URL is reachable
- [ ] Lighthouse audit passes on live URL (not just localhost)

---

## Per-Project Completion Checklist

### Project 1 — Todo App
- [ ] Service Worker registered and working
- [ ] IndexedDB storing todos offline
- [ ] Background Sync queuing and flushing
- [ ] Lighthouse 85+ on Railway URL
- [ ] Installable on mobile

### Project 2 — Weather App
- [ ] Geolocation permission handled gracefully
- [ ] Network-First strategy for weather API
- [ ] Offline fallback shows last known weather
- [ ] Lighthouse 85+ on Railway URL

### Project 3 — QR Scanner
- [ ] Camera stream initiated with getUserMedia
- [ ] QR codes detected from live video frame
- [ ] Scan results stored in IndexedDB
- [ ] Batch upload syncs when online
- [ ] Backend API deployed on Railway
- [ ] MongoDB connected

### Project 4 — Task Manager with Biometric Auth
- [ ] WebAuthn registration flow working
- [ ] WebAuthn authentication flow working
- [ ] Tasks encrypted in IndexedDB
- [ ] RBAC enforced on backend
- [ ] JWT refresh flow implemented

### Project 5 — Asset Tracker
- [ ] GPS tracking working
- [ ] Camera capture working
- [ ] All data syncs offline-first
- [ ] Admin dashboard accessible
- [ ] Analytics data displayed

### Project 6 — Collaborative Notes
- [ ] Multiple users can edit simultaneously
- [ ] CRDT (Yjs) merges concurrent edits correctly
- [ ] WebSocket connection established
- [ ] Offline edits merged on reconnect
- [ ] No data loss on conflict
