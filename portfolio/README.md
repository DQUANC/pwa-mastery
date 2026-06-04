# Portfolio — GitHub Pages

This folder contains the static portfolio website deployed to GitHub Pages.  
It serves as the public-facing showcase for all 6 PWA projects.

**Live URL:** https://daniel-quan.github.io/pwa-mastery/

---

## Purpose

- Central landing page linking to all deployed Railway projects
- About and contact pages for job applications
- Demonstrates HTML/CSS/JS fundamentals alongside PWA work
- Deployed automatically via GitHub Actions on every push to `main`

---

## Folder Structure

```
portfolio/
├── index.html          (Home page — project showcase hero)
├── projects.html       (Projects grid with descriptions and links)
├── about.html          (About section — background, skills, goals)
├── contact.html        (Contact form)
├── css/
│   ├── main.css        (Global styles, typography, variables)
│   ├── projects.css    (Project card grid styles)
│   └── responsive.css  (Media queries for mobile/tablet/desktop)
├── js/
│   └── main.js         (Interactivity: nav toggle, scroll animations)
└── assets/
    ├── images/         (Profile photo, project screenshots)
    └── icons/          (Favicon, PWA icons)
```

---

## HTML Files to Create

| File | Purpose |
|------|---------|
| `index.html` | Hero section + featured projects + CTA to hire |
| `projects.html` | Full project grid with descriptions, tech stack badges, and live links |
| `about.html` | Background, skills, timeline, and motivation for PWA focus |
| `contact.html` | Contact form (can use Formspree for free form handling) |

---

## GitHub Pages Deployment

### Automatic (via GitHub Actions)

The workflow at `.github/workflows/deploy-pages.yml` runs on every push to `main` that changes files in this folder.

It uploads the `portfolio/` directory as a GitHub Pages artifact and deploys it.

### Manual Setup (one-time)

1. Push the repository to GitHub
2. Go to repository **Settings → Pages**
3. Under Source, select **Deploy from a branch**
4. Branch: `gh-pages` (auto-created by the workflow on first run)
5. Folder: `/ (root)`
6. Click Save

After the first workflow run completes, the site will be live at:
```
https://daniel-quan.github.io/pwa-mastery/
```

### Verify Deployment

- Go to repository **Actions** tab
- Find the latest "Deploy Portfolio to GitHub Pages" run
- Click it to see logs
- If green, visit the live URL

---

## Linking to Railway Projects

In `projects.html`, link each project card to its Railway URL:

```html
<a href="https://todo-app-prod.railway.app/" target="_blank">
  Todo App
</a>
<a href="https://weather-app-prod.railway.app/" target="_blank">
  Weather App
</a>
<a href="https://qr-scanner-prod.railway.app/" target="_blank">
  QR Scanner
</a>
<a href="https://tasks-app-prod.railway.app/" target="_blank">
  Task Manager
</a>
<a href="https://assets-app-prod.railway.app/" target="_blank">
  Asset Tracker
</a>
<a href="https://notes-app-prod.railway.app/" target="_blank">
  Collaborative Notes
</a>
```

---

## Optional: Custom Domain ($10/year)

If you purchase a domain (e.g., `daniel-quan-pwa.com`):

1. Add a `CNAME` file to this `portfolio/` folder containing just:
   ```
   daniel-quan-pwa.com
   ```
2. GitHub Settings → Pages → Custom domain: enter `daniel-quan-pwa.com`
3. At your DNS registrar, add these records:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  daniel-quan.github.io
   ```
4. Check "Enforce HTTPS" in GitHub Pages settings after DNS propagates

---

## References

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions: deploy-pages](https://github.com/actions/deploy-pages)
- [Formspree (free contact forms)](https://formspree.io/)
- Deployment workflow: `../.github/workflows/deploy-pages.yml`
- Full deployment guide: `../docs/DEPLOYMENT_GUIDE.md`
