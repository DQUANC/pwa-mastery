# 💎 Project 4 — Task Manager with Biometric Auth

**Difficulty:** Medium-Advanced | **Duration:** 2-3 weeks | **Priority:** ⭐⭐⭐⭐

**Status:** ⏳ Not started  
**Live URL:** https://tasks-app-prod.railway.app/

---

## 📋 Description

A security-focused task manager that demonstrates:

- WebAuthn biometric authentication (fingerprint / Face ID)
- Encrypted local storage (IndexedDB data encrypted with `crypto-js`)
- Role-based access control (RBAC) on the backend
- Secure offline-first design where sensitive data is protected even when stored locally
- JWT-based session management with refresh tokens

This project is the most security-intensive of the six. It bridges the gap between consumer PWA patterns and enterprise-grade application security.

---

## 🎓 Learning Goals

- [ ] Implement WebAuthn registration and authentication flows
- [ ] Understand the difference between passkey (platform authenticator) and security key (roaming authenticator)
- [ ] Encrypt IndexedDB data using `crypto-js`
- [ ] Design role-based access control (admin, manager, viewer)
- [ ] Build secure JWT authentication with refresh token rotation
- [ ] Handle security edge cases in offline-first apps (token expiry, data exposure)
- [ ] Build a secure sync mechanism that validates identity before pushing data

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Service Worker | Native |
| Local storage | IndexedDB via `idb` + `crypto-js` encryption |
| HTTP client | Axios |
| Backend runtime | Node.js 18+ |
| Backend framework | Express.js |
| Authentication | WebAuthn + JWT + refresh tokens |
| Database | MongoDB |
| Testing | Jest + React Testing Library |
| Deployment | Railway |

---

## 📁 Project Structure

```
04-task-manager-biometric/
├── src/                            (React frontend)
│   ├── auth/
│   │   ├── useWebAuthn.ts          (Registration + authentication flows)
│   │   └── webauthnClient.ts       (Browser-side WebAuthn helpers)
│   ├── db/
│   │   ├── tasks.ts                (IndexedDB schema)
│   │   └── encryption.ts           (crypto-js encrypt/decrypt wrappers)
│   ├── hooks/
│   │   └── useTasks.ts
│   ├── components/
│   │   ├── LoginScreen.tsx
│   │   ├── BiometricPrompt.tsx
│   │   ├── TaskBoard.tsx
│   │   └── RoleGuard.tsx
│   └── App.tsx
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts             (POST /api/auth/register, /api/auth/login)
│   │   │   └── tasks.ts            (CRUD + RBAC middleware)
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── middleware/
│   │   │   ├── authenticate.ts     (JWT verification)
│   │   │   └── authorize.ts        (RBAC check)
│   │   ├── webauthn/
│   │   │   └── webauthnServer.ts   (@simplewebauthn/server helpers)
│   │   └── server.ts
│   ├── railway.json
│   └── package.json
├── railway.json
└── package.json
```

---

## 🚀 Setup

### Frontend

```bash
cd projects/04-task-manager-biometric
npm create vite@latest . -- --template react-ts
npm install idb tailwindcss axios crypto-js @simplewebauthn/browser
npm install -D @types/crypto-js
npm run dev
```

### Backend

```bash
cd projects/04-task-manager-biometric/backend
npm init -y
npm install express mongoose cors dotenv jsonwebtoken @simplewebauthn/server
npm install -D typescript @types/express @types/node @types/jsonwebtoken ts-node nodemon
```

---

## 🔐 WebAuthn Flow

### Registration (creating a passkey)

```
1. User enters username
2. Frontend requests challenge from backend (GET /api/auth/webauthn/register-options)
3. Browser shows biometric prompt (fingerprint / Face ID)
4. Browser creates a key pair; public key sent to backend (POST /api/auth/webauthn/register-verify)
5. Backend stores the public key (credential) linked to the user
```

### Authentication (using a passkey)

```
1. User clicks "Sign In with Biometrics"
2. Frontend requests challenge from backend (GET /api/auth/webauthn/login-options)
3. Browser shows biometric prompt
4. Browser signs the challenge; response sent to backend (POST /api/auth/webauthn/login-verify)
5. Backend verifies the signature with the stored public key
6. Backend issues a JWT + refresh token
7. Frontend stores JWT (in memory) and refresh token (in HttpOnly cookie)
```

### Using @simplewebauthn (recommended)

```bash
npm install @simplewebauthn/browser  # frontend
npm install @simplewebauthn/server   # backend
```

Reference: [SimpleWebAuthn Docs](https://simplewebauthn.dev/)

---

## 🔒 Encrypted IndexedDB

```typescript
// src/db/encryption.ts
import CryptoJS from 'crypto-js';

// Derive a key from the user's JWT sub (unique per user)
export function encryptData(data: unknown, userKey: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), userKey).toString();
}

export function decryptData<T>(encrypted: string, userKey: string): T {
  const bytes = CryptoJS.AES.decrypt(encrypted, userKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
}
```

All task objects are encrypted before writing to IndexedDB and decrypted on read. This protects data if another user gains access to the device's IndexedDB.

---

## 👥 Role-Based Access Control

Three roles:

| Role | Can view tasks | Can create tasks | Can delete tasks | Can manage users |
|------|--------------|-----------------|-----------------|-----------------|
| viewer | Own only | No | No | No |
| manager | Team tasks | Yes | Own only | No |
| admin | All tasks | Yes | All | Yes |

Backend middleware:

```typescript
// backend/src/middleware/authorize.ts
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage in routes
router.delete('/tasks/:id', authenticate, authorize('admin', 'manager'), deleteTask);
```

---

## 🚂 Railway Deployment

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

### Backend Environment Variables

```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-secret>
WEBAUTHN_RP_ID=tasks-app-prod.railway.app
WEBAUTHN_RP_NAME=Task Manager PWA
WEBAUTHN_ORIGIN=https://tasks-app-prod.railway.app
```

### Live URL

```
https://tasks-app-prod.railway.app/
```

---

## ✅ Completion Checklist

- [ ] WebAuthn registration flow works on Chrome (desktop + Android)
- [ ] WebAuthn authentication flow works and issues JWT
- [ ] Tasks are encrypted in IndexedDB
- [ ] RBAC enforced — viewer cannot delete tasks
- [ ] JWT refresh token rotation working
- [ ] Offline tasks sync securely on reconnect with valid token
- [ ] Lighthouse PWA score 85+ on Railway URL
- [ ] Zero TypeScript errors

---

## 📚 References

- [WebAuthn API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebAuthn_API)
- [SimpleWebAuthn](https://simplewebauthn.dev/)
- [crypto-js](https://github.com/brix/crypto-js)
- [JWT Guide](https://jwt.io/introduction)
- [OWASP RBAC Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Railway Docs](https://docs.railway.app/)
