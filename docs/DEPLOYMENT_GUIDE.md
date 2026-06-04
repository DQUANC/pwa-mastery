# Deployment Guide

Full instructions for deploying the portfolio to GitHub Pages and all projects to Railway.

---

## Overview

| Target | Platform | Cost | URL |
|--------|----------|------|-----|
| Portfolio (HTML/CSS/JS) | GitHub Pages | FREE | https://daniel-quan.github.io/pwa-mastery/ |
| Projects (React + backends) | Railway | $5/month | see project URLs below |

---

## Part 1: GitHub Pages (Portfolio)

### What Gets Deployed

Everything inside the `portfolio/` folder is served as a static website at:
`https://daniel-quan.github.io/pwa-mastery/`

### Step 1 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: `gh-pages` (auto-created by the workflow)
5. Folder: `/ (root)`
6. Click Save

### Step 2 — GitHub Actions Workflow

The workflow at `.github/workflows/deploy-pages.yml` deploys automatically on every push to `main` that touches the `portfolio/` folder.

```yaml
name: Deploy Portfolio to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'portfolio/**'
      - '.github/workflows/deploy-pages.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    steps:
      - uses: actions/checkout@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'portfolio'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Step 3 — Verify Deployment

After your first push, go to Actions tab → check the workflow run → visit the URL.

---

## Part 2: Railway (Projects)

### What Gets Deployed

Each project under `projects/` is deployed as a separate Railway service.

### Step 1 — Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create a new project

### Step 2 — Connect Repository

1. In Railway dashboard → New Service → GitHub Repo
2. Select `pwa-mastery` repository
3. Set the root directory to the specific project folder (e.g., `projects/01-todo-app`)

### Step 3 — Generate Railway Token

1. Railway dashboard → Account Settings → Tokens
2. Create a new token
3. Copy the token

### Step 4 — Add GitHub Secrets

In your GitHub repository:
1. Settings → Secrets and variables → Actions
2. New repository secret:
   - Name: `RAILWAY_TOKEN`
   - Value: (paste your token)
3. Optional: add `RAILWAY_ORG_ID` if using an organization

### Step 5 — GitHub Actions Workflow

The workflow at `.github/workflows/deploy-railway.yml` deploys the affected project on every push to `main` that touches a `projects/` subfolder.

```yaml
name: Deploy Projects to Railway

on:
  push:
    branches: [main]
    paths:
      - 'projects/**'

jobs:
  deploy-todo:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'projects/01-todo-app')
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy-action@alpha
        with:
          workingDirectory: projects/01-todo-app
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: todo-app

  deploy-weather:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'projects/02-weather-app')
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy-action@alpha
        with:
          workingDirectory: projects/02-weather-app
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: weather-app

  deploy-qr-scanner:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'projects/03-qr-scanner')
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy-action@alpha
        with:
          workingDirectory: projects/03-qr-scanner
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: qr-scanner

  deploy-task-manager:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'projects/04-task-manager-biometric')
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy-action@alpha
        with:
          workingDirectory: projects/04-task-manager-biometric
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: task-manager

  deploy-asset-tracker:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'projects/05-asset-tracker')
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy-action@alpha
        with:
          workingDirectory: projects/05-asset-tracker
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: asset-tracker

  deploy-collaborative-notes:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'projects/06-collaborative-notes')
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy-action@alpha
        with:
          workingDirectory: projects/06-collaborative-notes
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: collaborative-notes
```

### Step 6 — Environment Variables

Set these in each Railway service's Variables tab:

**Projects 1-2 (frontend only):**
```
NODE_ENV=production
VITE_API_URL=https://<your-service>.railway.app
```

**Project 2 (Weather App):**
```
VITE_OPENWEATHER_API_KEY=<your-key>
```

**Projects 3-6 (backend):**
```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
```

---

## Part 3: Final URLs

### GitHub Pages Portfolio
```
https://daniel-quan.github.io/pwa-mastery/
```

### Railway Projects
```
https://todo-app-prod.railway.app/
https://weather-app-prod.railway.app/
https://qr-scanner-prod.railway.app/
https://tasks-app-prod.railway.app/
https://assets-app-prod.railway.app/
https://notes-app-prod.railway.app/
```

---

## Part 4: Custom Domain (Optional — $10/year)

If you purchase a domain:

### For GitHub Pages

1. Add a `CNAME` file to the `portfolio/` folder:
   ```
   daniel-quan-pwa.com
   ```
2. GitHub Settings → Pages → Custom domain: `daniel-quan-pwa.com`
3. Add DNS records at your registrar:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  daniel-quan.github.io
   ```

### For Railway Projects

In each Railway service:
1. Settings → Domains → Add Custom Domain
2. Add a CNAME record at your registrar:
   ```
   CNAME todo   <your-service>.railway.app
   CNAME weather <your-service>.railway.app
   ...etc
   ```

Resulting URLs:
```
Portfolio:  https://daniel-quan-pwa.com/
Projects:   https://todo.daniel-quan-pwa.com/
            https://weather.daniel-quan-pwa.com/
            https://qr.daniel-quan-pwa.com/
            https://tasks.daniel-quan-pwa.com/
            https://assets.daniel-quan-pwa.com/
            https://notes.daniel-quan-pwa.com/
```

---

## References

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Railway Docs](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/reference/cli-api)
- [GitHub Actions: deploy-pages](https://github.com/actions/deploy-pages)
