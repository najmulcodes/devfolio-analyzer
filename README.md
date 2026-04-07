<div align="center">

**DEV FOLIO**

**Analyze your GitHub profile and portfolio in seconds.**  
AI-powered scoring, actionable feedback, and a clean developer-first dashboard.

<br />

![React](https://img.shields.io/badge/React_18-61dafb?style=flat-square&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router_v6-ca4245?style=flat-square&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts_2.10-22b5bf?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)

<br />

[**Live Demo →**](https://devfolio-analyzer.vercel.app) &nbsp;·&nbsp; [Report Bug](https://github.com/najmulcodes/devfolio-analyzer/issues) &nbsp;·&nbsp; [Request Feature](https://github.com/najmulcodes/devfolio-analyzer/issues)

<br />

</div>

---

## What It Does

DevFolio Analyzer takes your **GitHub username** and **portfolio URL**, runs them through a scoring engine (Claude AI-powered or rule-based fallback), and returns an honest breakdown of your developer profile — what's strong, what's missing, and what to fix.

No fluff. No fake metrics. Just real signal.

---

## Features

| | Feature | Description |
|---|---|---|
| 🎯 | **Score Ring** | Animated SVG ring (0–100) color-coded by performance tier |
| 📊 | **Score Breakdown** | Weighted progress bars for every scoring factor |
| 🧠 | **AI Analysis** | Claude AI feedback with rule-based fallback |
| 🔗 | **Portfolio Signals** | 12-point checklist — bio, demos, SEO, resume, stack, social, and more |
| ⚡ | **Combined Mode** | Side-by-side GitHub + Portfolio scores with a weighted combined score |
| 📈 | **Dashboard** | KPI cards, score history chart (Recharts), recent activity table |
| 🕓 | **History** | Paginated saved analyses with mini score rings |
| 🔐 | **Auth Flow** | JWT login/register with guest mode — results saved when authenticated |
| 📱 | **Responsive** | Desktop, tablet, and mobile across all pages |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (CRA) |
| Routing | React Router v6 |
| Charts | Recharts 2.10 |
| HTTP Client | Axios (with auth interceptor) |
| Auth | JWT via AuthContext |
| Fonts | Syne · Poppins · DM Sans |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repo
git clone https://github.com/najmulcodes/devfolio-analyzer.git
cd devfolio-analyzer

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### Environment Variables

```env
# .env
REACT_APP_API_URL=https://your-api-url.com/api
```

### Run Locally

```bash
npm start
# → http://localhost:3000
```

### Production Build

```bash
npm run build
# Output: /build — deploy to Vercel, Netlify, or any static host
```

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js           # Sticky nav — blur-on-scroll, mobile hamburger
│   ├── Sidebar.js          # Dashboard sidebar
│   ├── Footer.js           # Dark footer with links
│   ├── AnalysisResult.js   # Full result panel (GitHub + Portfolio tabs)
│   ├── ScoreRing.js        # Animated SVG score ring
│   ├── KpiCard.js          # KPI metric card
│   └── Spinner.js          # Inline spinner + full-screen PageLoader
├── context/
│   └── AuthContext.js      # JWT auth state (AuthContext, AuthProvider, useAuth)
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

## Pages & Routes

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Landing page — Hero, Features, How It Works, CTA |
| `/login` | Public | Login + Register with toggle |
| `/analyze` | Optional | Run analysis; results saved if authenticated |
| `/dashboard` | Optional | KPIs + chart (empty state for guests) |
| `/history` | Required | Paginated saved analyses |

---

## Auth

`AuthContext.js` exports three things — use what fits:

```js
// Hook — recommended for pages and components
import { useAuth } from '../context/AuthContext';
const { user, login, logout } = useAuth();

// Context — for components using useContext directly
import { AuthContext } from '../context/AuthContext';
const { user, logout } = useContext(AuthContext);

// Provider — wraps the app in App.js
import { AuthProvider } from '../context/AuthContext';
```

---

## Spinner

```js
// Default import — for inline loading states
import Spinner from '../components/Spinner';

// Named import — for full-screen overlay
import { PageLoader } from '../components/Spinner';

<PageLoader message="Analyzing..." />
```

---

## Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| `--cream` | `#fdf6ef` | Page background |
| `--orange` | `#f59e0b` | Primary accent |
| `--orange-light` | `#ff6b35` | Gradient end |
| `--orange-pale` | `#fff0e8` | Cards, badges |
| `--text-dark` | `#1f2937` | Headings |
| `--text-mid` | `#4a3728` | Body text |
| `--text-light` | `#9b8374` | Labels, captions |

### Score Tiers

| Score | Color | Label |
|---|---|---|
| 80–100 | `#22c55e` | Excellent |
| 60–79 | `#f59e0b` | Good |
| 40–59 | `#ff6b35` | Fair |
| 0–39 | `#ef4444` | Needs Work |

### Typography

| Role | Font | Weights |
|---|---|---|
| Display | Syne | 700, 800 |
| Body | Poppins | 400, 500, 600 |
| UI | DM Sans | 400, 500 |

---

## Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Add environment variable:
   ```
   REACT_APP_API_URL = https://your-api-url.com/api
   ```
4. Deploy

Vercel auto-detects CRA — build command `npm run build`, output dir `build`.

---

## Contributing

```bash
git checkout -b feat/your-feature
git commit -m "feat: describe your change"
git push origin feat/your-feature
# Open a pull request
```

---

## License

MIT © 2026 [najmulcodes](https://github.com/najmulcodes)

---

<div align="center">

Built with React &nbsp;·&nbsp; Powered by Claude AI

</div>
