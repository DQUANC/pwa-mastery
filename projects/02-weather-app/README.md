# 🌤️ Project 2 — Weather App with Geolocation

**Difficulty:** Easy-Medium | **Duration:** 1 week | **Priority:** ⭐⭐⭐⭐

**Status:** ⏳ Not started  
**Live URL:** https://weather-app-prod.railway.app/

---

## 📋 Description

Real-time weather data with offline caching. This project introduces:

- The Geolocation API to detect the user's position
- Network-First caching strategy (vs the Cache-First from Project 1)
- Graceful offline fallback — shows last known weather when offline
- Automatic cache invalidation when data goes stale

The trade-off between "always fresh" (Network-First) and "always fast" (Cache-First) is the central lesson of this project.

---

## 🎓 Learning Goals

- [ ] Understand Network-First vs Cache-First trade-offs
- [ ] Implement the Geolocation API with proper permission handling
- [ ] Integrate a third-party REST API (OpenWeather) with offline fallback
- [ ] Handle real-time data with stale-while-revalidate patterns
- [ ] Optimize the app for mobile devices (responsive, fast on 3G)
- [ ] Achieve Lighthouse 85+ score on the deployed Railway URL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Service Worker | Native (no framework) |
| Local storage | IndexedDB via `idb` (cache weather responses) |
| HTTP client | Axios |
| Weather API | OpenWeather API (free tier) |
| Testing | Jest + React Testing Library |
| Deployment | Railway |

---

## 🚀 Setup

```bash
cd projects/02-weather-app

# Initialize Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install idb tailwindcss axios

# Start development server
npm run dev
```

You will need a free OpenWeather API key:
1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Create a `.env.local` file:
   ```
   VITE_OPENWEATHER_API_KEY=your_key_here
   ```

---

## 📁 Key Files to Create

```
02-weather-app/
├── public/
│   ├── sw.js               (Service Worker — Network-First strategy)
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── api/
│   │   └── weather.ts      (OpenWeather API client)
│   ├── db/
│   │   └── cache.ts        (IndexedDB — store last weather response)
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   └── useWeather.ts
│   ├── components/
│   │   ├── WeatherCard.tsx
│   │   ├── LocationDisplay.tsx
│   │   └── OfflineBanner.tsx
│   └── App.tsx
├── railway.json
└── package.json
```

---

## ⚙️ Service Worker Strategy

Use **Network-First** for weather API calls so data is always fresh when online:

```javascript
// public/sw.js
const CACHE_NAME = 'weather-app-v1';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.hostname === 'api.openweathermap.org') {
    // Network-First for weather API
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Offline fallback — return cached weather
          return caches.match(event.request);
        })
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

## 📍 Geolocation API

```typescript
// src/hooks/useGeolocation.ts
export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition(pos),
      (err) => setError(err.message),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  return { position, error };
}
```

---

## 🌦️ OpenWeather API Integration

```typescript
// src/api/weather.ts
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather API request failed');
  return response.json();
}
```

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

### Environment Variables (set in Railway Variables tab)

```
NODE_ENV=production
VITE_OPENWEATHER_API_KEY=<your-key>
```

### Live URL

```
https://weather-app-prod.railway.app/
```

---

## ✅ Completion Checklist

- [ ] Lighthouse PWA score 85+ on Railway URL
- [ ] Weather loads from geolocation on first visit
- [ ] Offline fallback shows last known weather with "offline" indicator
- [ ] Permission denied state handled gracefully (manual city input fallback)
- [ ] Zero TypeScript errors
- [ ] Tests passing

---

## 📚 References

- [Geolocation API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [OpenWeather API Docs](https://openweathermap.org/api)
- [Network-First strategy — Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/#network-falling-back-to-cache)
- [Service Workers — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Railway Docs](https://docs.railway.app/)
