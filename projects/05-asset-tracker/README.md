# Project 5 — Asset Tracker

**Difficulty:** Advanced | **Duration:** 3-4 weeks | **Priority:** 5/5

**Status:** Not started  
**Live URL:** https://assets-app-prod.railway.app/

---

## Description

A production-grade full-stack asset tracking application that combines every hardware API covered so far:

- GPS (Geolocation API) — record and display asset locations on a map
- Camera (Camera API) — photograph assets on intake
- Biometric auth (WebAuthn) — secure access to asset records
- Offline-first — all operations work without a connection and sync on reconnect
- Admin dashboard — overview of all assets, statuses, and analytics
- Reporting — export asset lists, location history, and audit logs

This is the capstone project for "interview ready" status. It demonstrates the ability to design and build a scalable, production-grade full-stack PWA.

---

## Learning Goals

- [ ] Integrate multiple hardware APIs (GPS, Camera, Biometric) in a single app
- [ ] Build a scalable offline-first architecture with complex data models
- [ ] Implement analytics and usage reporting
- [ ] Build an admin dashboard with role-based views
- [ ] Design a production-ready data schema in MongoDB
- [ ] Handle file uploads (asset photos) to backend
- [ ] Deploy a multi-service full-stack app on Railway

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Maps | Leaflet.js (open source, no API key required) |
| Build tool | Vite |
| Service Worker | Native |
| Local storage | IndexedDB via `idb` |
| Backend runtime | Node.js 18+ |
| Backend framework | Express.js |
| Database | MongoDB (primary) |
| File storage | Multer (uploads) + Railway volume or Cloudinary |
| Authentication | WebAuthn + JWT |
| Testing | Jest + Supertest |
| Deployment | Railway |

---

## Project Structure

```
05-asset-tracker/
├── frontend/
│   ├── public/
│   │   ├── sw.js
│   │   └── manifest.json
│   ├── src/
│   │   ├── auth/
│   │   │   └── useWebAuthn.ts
│   │   ├── camera/
│   │   │   └── useCamera.ts
│   │   ├── gps/
│   │   │   └── useGPS.ts
│   │   ├── db/
│   │   │   └── assets.ts           (IndexedDB schema)
│   │   ├── sync/
│   │   │   └── assetSync.ts        (Offline queue + batch upload)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       (Admin overview)
│   │   │   ├── AssetList.tsx
│   │   │   ├── AssetDetail.tsx
│   │   │   ├── AssetAdd.tsx
│   │   │   └── Analytics.tsx
│   │   ├── components/
│   │   │   ├── MapView.tsx         (Leaflet map)
│   │   │   ├── AssetCard.tsx
│   │   │   ├── PhotoCapture.tsx
│   │   │   └── SyncStatus.tsx
│   │   └── App.tsx
│   ├── railway.json
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── routes/
    │   │   ├── assets.ts           (CRUD + search + filter)
    │   │   ├── locations.ts        (GPS history)
    │   │   ├── uploads.ts          (Photo upload endpoint)
    │   │   ├── analytics.ts        (Aggregate queries)
    │   │   └── auth.ts
    │   ├── models/
    │   │   ├── Asset.ts
    │   │   ├── Location.ts
    │   │   └── User.ts
    │   ├── middleware/
    │   │   ├── authenticate.ts
    │   │   └── authorize.ts
    │   └── server.ts
    ├── railway.json
    └── package.json
```

---

## Setup

### Frontend

```bash
cd projects/05-asset-tracker/frontend
npm create vite@latest . -- --template react-ts
npm install idb tailwindcss axios leaflet @types/leaflet jsqr @simplewebauthn/browser
npm install -D @types/node
npm run dev
```

### Backend

```bash
cd projects/05-asset-tracker/backend
npm init -y
npm install express mongoose cors dotenv multer jsonwebtoken @simplewebauthn/server
npm install -D typescript @types/express @types/node @types/multer ts-node nodemon
```

---

## Data Models

### Asset

```typescript
// backend/src/models/Asset.ts
const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'retired'],
    default: 'active',
  },
  location: {
    lat: Number,
    lng: Number,
    address: String,
    updatedAt: Date,
  },
  photoUrl: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  serialNumber: String,
  purchaseDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### Location History

```typescript
// backend/src/models/Location.ts
const LocationSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  accuracy: Number,
  recordedAt: { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
```

---

## GPS Tracking

```typescript
// frontend/src/gps/useGPS.ts
export function useGPS() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const captureLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  };

  return { position, captureLocation };
}
```

---

## Admin Dashboard

The dashboard (`frontend/src/pages/Dashboard.tsx`) shows:

- Total assets by status (active / maintenance / retired)
- Recently updated assets
- Map of all asset locations (Leaflet)
- Sync queue status (pending uploads count)
- Quick actions: Add asset, Export CSV

---

## Railway Deployment

### Frontend Environment Variables

```
VITE_API_URL=https://assets-api.railway.app
VITE_MAPBOX_TOKEN=   (leave empty — using Leaflet with OpenStreetMap, free)
```

### Backend Environment Variables

```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret>
WEBAUTHN_RP_ID=assets-app-prod.railway.app
WEBAUTHN_RP_NAME=Asset Tracker PWA
WEBAUTHN_ORIGIN=https://assets-app-prod.railway.app
CLOUDINARY_URL=<optional-for-photo-storage>
```

### Live URLs

```
Frontend: https://assets-app-prod.railway.app/
Backend:  https://assets-api.railway.app/
```

---

## Completion Checklist

- [ ] GPS captures current location when adding an asset
- [ ] Camera captures photo and uploads to backend
- [ ] Map shows all assets with location markers
- [ ] Offline adds/edits queue and sync on reconnect
- [ ] Admin dashboard shows correct aggregate stats
- [ ] RBAC enforced (viewer can't edit)
- [ ] Lighthouse PWA score 85+ on Railway URL
- [ ] Zero TypeScript errors
- [ ] Tests passing (unit + integration)

---

## References

- [Geolocation API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Camera API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Leaflet.js](https://leafletjs.com/)
- [Multer (file uploads)](https://github.com/expressjs/multer)
- [Cloudinary (optional photo hosting)](https://cloudinary.com/)
- [Railway Docs](https://docs.railway.app/)
