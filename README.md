<div align="center">

# DevFolio Analyzer

![DevFolio](https://img.shields.io/badge/DevFolio-Analyzer-f59e0b?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6-ca4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.10-22b5bf?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)

**An analytics dashboard for developers. Paste your GitHub username and portfolio URL to get an instant score, AI-powered feedback, and actionable suggestions — all in a clean, fast UI.**

[Live Demo](https://devfolio-analyzer.vercel.app) · [Backend Repo](https://github.com/najmulcodes/devfolio-analyzer-server) · [Report Bug](https://github.com/najmulcodes/devfolio-analyzer/issues) · [Request Feature](https://github.com/najmulcodes/devfolio-analyzer/issues)

</div>

---

## Preview

```
┌────────────────────────────────────────────────────────────┐
│  🏠 Landing  →  🔍 Analyze  →  📊 Dashboard  →  📋 History │
│                                                            │
│  Hero + Features + How It Works + CTA                      │
│             ↓                                              │
│  GitHub + Portfolio inputs → Score ring + Breakdown bars   │
│             ↓                                              │
│  KPI cards + Line chart + Recent activity table            │
└────────────────────────────────────────────────────────────┘
```

---

## Features

- **Landing Page** — Hero, Features, How It Works, and CTA sections with scroll animations
- **Sticky Navbar** — Blur-on-scroll, mobile hamburger menu, active state highlighting
- **Analyze Page** — Submit GitHub username + optional portfolio URL for instant dual analysis
- **Score Ring** — Animated SVG ring (0–100) color-coded by performance tier
- **Score Breakdown** — Animated progress bars for all scoring factors
- **Portfolio Signals** — 12-signal checklist: projects, bio, GitHub link, resume, SEO, social, demos, tech stack, viewport
- **AI Badge** — Indicates Claude AI vs rule-based fallback analysis
- **Combined Mode** — Side-by-side GitHub + Portfolio scores with a weighted combined score
- **Dashboard** — KPI cards, Recharts score history chart, recent activity table
- **History Page** — Paginated past analyses with mini score rings
- **Auth Flow** — JWT login/register with guest mode support
- **Responsive** — Desktop, tablet, and mobile across all pages

---

## Tech Stack

| Category     | Technology              |
|--------------|-------------------------|
| Framework    | React 18 (CRA)          |
| Routing      | React Router v6         |
| Charts       | Recharts 2.10           |
| HTTP         | Axios                   |
| Fonts        | Syne · Poppins · DM Sans |
| Deployment   | Vercel                  |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Backend running locally or deployed — see [backend repo](https://github.com/najmulcodes/devfolio-analyzer-server)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/najmulcodes/devfolio-analyzer.git
cd devfolio-analyzer

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

### Environment Variables

```env
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

For production:

```env
REACT_APP_API_URL=https://devfolio-analyzer-server.onrender.com/api
```

### Run Locally

```bash
npm start
```

Opens at → `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output in `/build` — deploy this folder to Vercel, Netlify, or any static host.

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js           # Sticky nav with blur + hamburger
│   ├── Sidebar.js          # App sidebar for dashboard pages
│   ├── Footer.js           # Dark footer with links
│   ├── AnalysisResult.js   # Full result panel (GitHub + Portfolio tabs)
│   ├── ScoreRing.js        # Animated SVG score ring
│   ├── KpiCard.js          # Metric display card
│   └── Spinner.js          # Loading spinner + PageLoader overlay
├── context/
│   └── AuthContext.js      # JWT auth state — exports AuthContext, AuthProvider, useAuth
├── pages/
│   ├── Home.js             # Public landing page
│   ├── Analyze.js          # Analysis form + result display
│   ├── Dashboard.js        # KPIs + chart + activity table
│   ├── History.js          # Paginated analysis history
│   └── Login.js            # Login + Register toggle
├── utils/
│   ├── api.js              # Axios instance with auth interceptor
│   └── helpers.js          # Score color, label, date formatters
├── App.js                  # Routing + layout logic
├── index.js                # React entry point
└── index.css               # Global styles + CSS design tokens
```

---

## Design System

### Font Stack

| Role    | Font    | Weights  |
|---------|---------|----------|
| Display | Syne    | 700, 800 |
| Body    | Poppins | 400, 500, 600 |
| UI      | DM Sans | 400, 500 |

### Color Palette

| Token            | Value     | Usage                        |
|------------------|-----------|------------------------------|
| `--cream`        | `#fdf6ef` | Page background              |
| `--orange`       | `#f59e0b` | Primary accent               |
| `--orange-light` | `#ff6b35` | Gradient end                 |
| `--orange-pale`  | `#fff0e8` | Card backgrounds, badges     |
| `--text-dark`    | `#1f2937` | Headings                     |
| `--text-mid`     | `#4a3728` | Body text                    |
| `--text-light`   | `#9b8374` | Labels, captions             |

### Score Colors

| Range  | Color   | Label      |
|--------|---------|------------|
| 80–100 | `#22c55e` | Excellent  |
| 60–79  | `#f59e0b` | Good       |
| 40–59  | `#ff6b35` | Fair       |
| 0–39   | `#ef4444` | Needs Work |

---

## Pages & Routes

| Route        | Auth Required | Description                                    |
|--------------|---------------|------------------------------------------------|
| `/`          | No            | Public landing page                            |
| `/login`     | No            | Login + Register with toggle                   |
| `/analyze`   | No (optional) | Run analysis; results saved if authenticated   |
| `/dashboard` | No (optional) | KPIs + chart (empty state for guests)          |
| `/history`   | Yes           | Paginated saved analyses                       |

---

## Auth Context

The `AuthContext` module exports three things:

```js
// Named context — for components using useContext directly
export const AuthContext = createContext(null);

// Provider — wrap your app with this
export const AuthProvider = ({ children }) => { ... };

// Hook — for pages and hooks (preferred)
export const useAuth = () => useContext(AuthContext);
```

Usage in components:

```js
// Option A — hook (recommended for pages)
import { useAuth } from '../context/AuthContext';
const { user, login, logout } = useAuth();

// Option B — context (for components that do useContext manually)
import { AuthContext } from '../context/AuthContext';
const { user, logout } = useContext(AuthContext);
```

---

## Spinner Component

`Spinner.js` exports both a default and named export for flexibility:

```js
// Default import — works in Analyze.js and Login.js
import Spinner from '../components/Spinner';

// Named imports — for advanced usage
import { Spinner, PageLoader } from '../components/Spinner';
```

`<PageLoader message="Analyzing..." />` renders a full-screen overlay with blur.

---

## Deployment — Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Add environment variable:
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
4. Click **Deploy**

Vercel auto-detects CRA, sets build command to `npm run build`, output dir to `build`.

---

## Contributing

```bash
git checkout -b feat/your-feature
git commit -m "feat: your change"
git push origin feat/your-feature
# then open a PR
```

---

## License

MIT © 2026 [najmulcodes](https://github.com/najmulcodes)

---

<div align="center">

Built with ☕ and React &nbsp;·&nbsp; [Backend →](https://github.com/najmulcodes/devfolio-analyzer-server)

</div>
