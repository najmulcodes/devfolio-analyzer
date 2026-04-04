# DevFolio Analyzer — Frontend

<div align="center">

![DevFolio Analyzer](https://img.shields.io/badge/DevFolio-Analyzer-f59e0b?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6-ca4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.10-22b5bf?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern analytics dashboard for analyzing developer GitHub profiles — with AI-powered insights, score tracking, and a premium landing experience.**

[Live Demo](https://devfolio-analyzer.vercel.app) · [Backend Repo](https://github.com/najmulcodes/devfolio-analyzer-server) · [Report Bug](https://github.com/najmulcodes/devfolio-analyzer/issues)

</div>

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────────┐
│  🏠 Landing Page  →  🔍 Analyze  →  📊 Dashboard        │
│                                                         │
│  Hero + Features + How It Works + CTA                   │
│  ↓                                                      │
│  GitHub Username Input → Score Ring + Breakdown         │
│  ↓                                                      │
│  KPI Cards + Line Chart + Activity Table                │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **Landing Page** — Hero, Features, How It Works, and CTA sections with smooth scroll animations
- **Sticky Navbar** — Blur-on-scroll effect with mobile hamburger menu
- **Analyze Page** — Submit GitHub username and optional portfolio URL for instant analysis
- **Score Ring** — Animated SVG ring visualizing 0–100 score with color-coded labels
- **Score Breakdown** — Animated progress bars for all 6 scoring factors
- **AI Badge** — Indicates when analysis is powered by Claude AI vs rule-based fallback
- **Dashboard** — KPI cards, Recharts line chart for score history, recent activity table
- **History Page** — Paginated list of past analyses with mini score rings and trends
- **Auth Flow** — Login and Register with toggle, JWT stored in localStorage, guest mode supported
- **Responsive Design** — Desktop, tablet, and mobile support across all pages
- **Micro-interactions** — Button hover effects, card lift, skeleton shimmer, fade-in on scroll

---

## 🗂 Project Structure

```
frontend/
├── public/
│   └── index.html              # Syne + DM Sans + Poppins fonts
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Sticky nav with blur + hamburger
│   │   ├── Footer.js           # Dark footer with links + social
│   │   ├── Sidebar.js          # App sidebar with nav + user info
│   │   ├── KpiCard.js          # Metric display card
│   │   ├── ScoreRing.js        # Animated SVG score ring
│   │   ├── AnalysisResult.js   # Full result panel with breakdown
│   │   └── Spinner.js          # Loading spinner + PageLoader
│   ├── context/
│   │   └── AuthContext.js      # JWT auth state (login/register/logout)
│   ├── pages/
│   │   ├── Home.js             # Landing page (public)
│   │   ├── Dashboard.js        # KPIs + chart + activity table
│   │   ├── Analyze.js          # Analysis form + result display
│   │   ├── History.js          # Paginated analysis history
│   │   └── Login.js            # Login + Register page
│   ├── utils/
│   │   ├── api.js              # Axios instance with auth interceptor
│   │   └── helpers.js          # Score color, label, date formatters
│   ├── App.js                  # Routing + layout logic
│   ├── index.js                # React entry point
│   └── index.css               # Global styles + CSS variables
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Backend running (see [backend repo](https://github.com/najmulcodes/devfolio-analyzer-server))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/najmulcodes/devfolio-analyzer.git
cd devfolio-analyzer

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production, replace with your deployed backend URL:

```env
REACT_APP_API_URL=https://devfolio-analyzer-server.onrender.com/api
```

### Run Locally

```bash
npm start
```

App runs at → `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output goes to `/build` — deploy this folder to Vercel or Netlify.

---

## 🎨 Design System

### Font Stack

| Role    | Font    | Weights       |
|---------|---------|---------------|
| Display | Syne    | 700, 800      |
| Body    | Poppins | 400, 500, 600 |
| UI      | DM Sans | 400, 500      |

### Color Palette

| Token              | Value     | Usage                        |
|--------------------|-----------|------------------------------|
| `--cream`          | `#fdf6ef` | Page background              |
| `--orange`         | `#f59e0b` | Primary accent               |
| `--orange-light`   | `#ff6b35` | Gradient end                 |
| `--orange-pale`    | `#fff0e8` | Card backgrounds, badges     |
| `--text-dark`      | `#1f2937` | Headings                     |
| `--text-mid`       | `#4a3728` | Body text                    |
| `--text-light`     | `#9b8374` | Labels, captions             |

### Score Colors

| Score Range | Color   | Label      |
|-------------|---------|------------|
| 80–100      | `#22c55e` (green) | Excellent |
| 60–79       | `#f59e0b` (amber) | Good      |
| 40–59       | `#ff6b35` (orange) | Fair     |
| 0–39        | `#ef4444` (red)   | Needs Work |

---

## 📄 Pages & Routes

| Route        | Component     | Auth Required | Description                          |
|--------------|---------------|---------------|--------------------------------------|
| `/`          | Home          | No            | Public landing page                  |
| `/login`     | Login         | No            | Login + Register toggle              |
| `/analyze`   | Analyze       | No (optional) | Run analysis, save if authenticated  |
| `/dashboard` | Dashboard     | No (optional) | KPIs + chart (empty state for guests)|
| `/history`   | History       | Yes           | Paginated saved analyses             |

---

## 🔌 API Integration

All requests go through `src/utils/api.js` — an Axios instance that:

- Automatically attaches `Authorization: Bearer <token>` from localStorage
- Normalizes error messages from the server
- Has a 30-second timeout

```js
// Example usage
import api from '../utils/api';

const result = await api.post('/analysis/run', {
  githubUsername: 'torvalds',
  portfolioUrl: 'https://example.com',
});
```

---

## 📦 Dependencies

| Package          | Version  | Purpose                        |
|------------------|----------|--------------------------------|
| react            | ^18.2.0  | UI library                     |
| react-dom        | ^18.2.0  | DOM rendering                  |
| react-router-dom | ^6.20.0  | Client-side routing            |
| recharts         | ^2.10.1  | Score history line chart       |
| axios            | ^1.6.0   | HTTP client with interceptors  |

---

## ☁️ Deployment — Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Set environment variable:
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
4. Click **Deploy**

> Vercel auto-detects Create React App and handles the build command (`npm run build`) and output directory (`build`) automatically.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
# Fork → Clone → Create branch → Commit → Push → PR
git checkout -b feat/your-feature-name
git commit -m "feat: describe your change"
git push origin feat/your-feature-name
```

---

## 📃 License

MIT © 2026 [najmulcodes](https://github.com/najmulcodes)

---

<div align="center">

Built with ☕ and React · [Backend →](https://github.com/najmulcodes/devfolio-analyzer-server)

</div>
