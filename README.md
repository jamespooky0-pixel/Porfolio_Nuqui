# Christopher Nuqui — Portfolio

> Personal portfolio website with a tech / coding / cars theme.  
> Live at: **https://YOUR_USERNAME.github.io/portfolio** *(update after deploying)*

---

## Features

- Animated particle network background
- Typewriter hero text cycling through roles
- Scroll-reveal animations on every section
- Animated skill progress bars
- Project filter (All / Web / App / Tools)
- Dark ↔ Light theme toggle (persisted via localStorage)
- Responsive — mobile-first layout
- RPM gauge easter egg — press **R** to open, hold **Space** to rev
- Contact form with client-side validation
- Back-to-top button

---

## File Structure

```
portfolio/
├── index.html    ← Main page (all sections)
├── style.css     ← Dark/light theme styles
├── script.js     ← All interactivity & animations
└── README.md     ← This file
```

---

## How to Deploy on GitHub Pages (Free Hosting)

Follow these steps to make your portfolio public:

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up if you don't have an account.

### Step 2 — Create a new repository
1. Click the **+** icon → **New repository**
2. Name it: `portfolio` *(or any name you want)*
3. Set it to **Public**
4. Do **NOT** check "Add a README" (you already have one)
5. Click **Create repository**

### Step 3 — Push your files

Open PowerShell or Git Bash inside your portfolio folder and run:

```powershell
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 4 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Branch: `main` | Folder: `/ (root)`
5. Click **Save**

### Step 5 — Your site is live!
After ~1 minute visit:
```
https://YOUR_USERNAME.github.io/portfolio
```

---

## Customizing Your Portfolio

| What to change | Where |
|---|---|
| Your name & title | `index.html` → hero section |
| Typed phrases | `script.js` → `phrases` array |
| Skills & percentages | `index.html` → skills section + `data-w` values |
| Project cards | `index.html` → projects section |
| Social links (GitHub, LinkedIn) | `index.html` → contact + footer |
| Email address | `index.html` → contact section |
| Resume PDF | Add `resume.pdf` to folder, update `href` in `index.html` |
| Accent color | `style.css` → `--accent` variable |

---

## Optional: Custom Domain

If you own a domain (e.g. `christophernuqui.com`):
1. Add a file named `CNAME` to the repo root containing just your domain:
   ```
   christophernuqui.com
   ```
2. Point your domain's DNS to GitHub Pages IPs — see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

Built with HTML · CSS · Vanilla JS — no frameworks, no build tools needed.
