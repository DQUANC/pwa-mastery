# 🏆 Project 3 — QR Code Scanner

**Difficulty:** Medium | **Duration:** 2-3 weeks | **Priority:** ⭐⭐⭐⭐⭐

**Status:** ⏳ Not started  
**Live URL:** https://qr-scanner-prod.railway.app/

> **🎯 MOST IMPORTANT PROJECT FOR FULLSTACK ROLE.** This is the first full-stack project — React frontend + Node.js backend + MongoDB. It also introduces direct hardware integration via the Camera API.

---

## 📋 Description

A production-quality QR code and barcode scanner that:

- Accesses the device camera via the browser's Camera API (`getUserMedia`)
- Decodes QR codes and barcodes in real time from the live video stream
- Stores scan results locally in IndexedDB when offline
- Batch-uploads results to a Node.js + Express backend with MongoDB when online
- Supports scan history, tagging, and export

This project is the most directly relevant to real-world fullstack work — it demonstrates hardware access, API design, database integration, and offline-first patterns all in one app.

---

## 🎓 Learning Goals

- [ ] Integrate the Camera API (`navigator.mediaDevices.getUserMedia`)
- [ ] Implement real-time QR/barcode decoding using the `jsQR` library
- [ ] Handle image processing in the browser (canvas frame capture)
- [ ] Build a batch synchronization pattern (queue offline, flush online)
- [ ] Design and build a REST API with Node.js + Express
- [ ] Connect to MongoDB and design a document schema
- [ ] Deploy a full-stack app to Railway (separate frontend and backend services)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS |
| Build tool | Vite |
| QR decoding | jsQR library |
| Service Worker | Native |
| Local storage | IndexedDB via `idb` |
| Backend runtime | Node.js 18+ |
| Backend framework | Express.js |
| Database | MongoDB (Atlas free tier or Railway MongoDB) |
| HTTP client | Axios |
| Testing | Jest + React Testing Library + Supertest |
| Deployment | Railway (2 services: frontend + backend) |

---

## 📁 Project Structure

```
03-qr-scanner/
├── frontend/
│   ├── public/
│   │   ├── sw.js
│   │   └── manifest.json
│   ├── src/
│   │   ├── camera/
│   │   │   └── useCamera.ts        (getUserMedia hook)
│   │   ├── scanner/
│   │   │   └── useQRScanner.ts     (jsQR decode from canvas)
│   │   ├── db/
│   │   │   └── scans.ts            (IndexedDB schema for scan results)
│   │   ├── sync/
│   │   │   └── uploadQueue.ts      (Batch upload queue)
│   │   ├── components/
│   │   │   ├── CameraView.tsx
│   │   │   ├── ScanResult.tsx
│   │   │   └── ScanHistory.tsx
│   │   └── App.tsx
│   ├── railway.json
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── routes/
    │   │   └── scans.ts            (POST /api/scans, GET /api/scans)
    │   ├── models/
    │   │   └── Scan.ts             (Mongoose schema)
    │   ├── middleware/
    │   │   └── auth.ts             (Optional JWT middleware)
    │   └── server.ts
    ├── railway.json
    └── package.json
```

---

## 🚀 Setup

### Frontend

```bash
cd projects/03-qr-scanner/frontend
npm create vite@latest . -- --template react-ts
npm install idb tailwindcss axios jsqr
npm run dev
```

### Backend

```bash
cd projects/03-qr-scanner/backend
npm init -y
npm install express mongoose cors dotenv
npm install -D typescript @types/express @types/node ts-node nodemon
npm run dev
```

---

## 📷 Camera API Integration

```typescript
// frontend/src/camera/useCamera.ts
export function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Rear camera on mobile
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  return { stream, error, startCamera, stopCamera };
}
```

## 🔍 QR Decoding with jsQR

```typescript
// frontend/src/scanner/useQRScanner.ts
import jsQR from 'jsqr';

export function useQRScanner(
  videoRef: React.RefObject<HTMLVideoElement>,
  onScan: (result: string) => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        onScan(code.data);
      }
    }, 200); // Check every 200ms

    return () => clearInterval(interval);
  }, [videoRef, onScan]);

  return { canvasRef };
}
```

---

## 🔌 Backend API

### Endpoints

```
POST /api/scans         — Save a single scan result
POST /api/scans/batch   — Save multiple scan results (batch upload)
GET  /api/scans         — Get all scan history
GET  /api/scans/:id     — Get a single scan
DELETE /api/scans/:id   — Delete a scan
```

### 🗄️ MongoDB Schema

```typescript
// backend/src/models/Scan.ts
import mongoose from 'mongoose';

const ScanSchema = new mongoose.Schema({
  value: { type: String, required: true },
  type: { type: String, enum: ['qr', 'barcode'], default: 'qr' },
  scannedAt: { type: Date, default: Date.now },
  uploadedAt: { type: Date, default: Date.now },
  deviceId: { type: String },
  tags: [String],
});

export const Scan = mongoose.model('Scan', ScanSchema);
```

---

## 🚂 Railway Deployment

Deploy as two separate Railway services.

### Frontend railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run preview -- --port $PORT --host",
    "healthcheckPath": "/"
  }
}
```

### Backend railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "node dist/server.js",
    "healthcheckPath": "/health"
  }
}
```

### Backend Environment Variables (Railway Variables tab)

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/qr-scanner
JWT_SECRET=<your-secret>
```

### Frontend Environment Variables

```
VITE_API_URL=https://qr-scanner-api.railway.app
```

### Live URLs

```
Frontend: https://qr-scanner-prod.railway.app/
Backend:  https://qr-scanner-api.railway.app/
```

---

## ✅ Completion Checklist

- [ ] Camera stream starts and rear camera is used on mobile
- [ ] QR codes decode in real time from the live video
- [ ] Scan results saved to IndexedDB immediately (offline-first)
- [ ] Batch upload flushes pending scans when online
- [ ] Backend `/api/scans` endpoints working
- [ ] MongoDB stores and retrieves scan records
- [ ] Lighthouse PWA score 85+ on Railway URL
- [ ] Zero TypeScript errors
- [ ] Tests passing

---

## 📚 References

- [Camera API (getUserMedia) — MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [jsQR Library](https://github.com/cozmo/jsQR)
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Railway Docs](https://docs.railway.app/)
