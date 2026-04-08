<div align="center">

<br />

# DevFolio Analyzer – AI GitHub Profile Analyzer & Developer Portfolio Review Tool

**AI-powered GitHub profile analyzer and portfolio analysis tool that evaluates developer profiles, provides recruiter-style feedback, and helps improve your GitHub profile, portfolio, and overall developer score.**

<br />

[![React](https://img.shields.io/badge/React_18-20232a?style=flat-square&logo=react&logoColor=61dafb)](https://reactjs.org)
[![React Router](https://img.shields.io/badge/React_Router_v6-20232a?style=flat-square&logo=reactrouter&logoColor=ca4245)](https://reactrouter.com)
[![Recharts](https://img.shields.io/badge/Recharts-20232a?style=flat-square&logoColor=22b5bf)](https://recharts.org)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![MIT License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)](./LICENSE)

<br />

[**Live Demo – GitHub Profile Analyzer →**](https://devfolioanalyzer.vercel.app)

<br />

</div>

---

## Overview

DevFolio Analyzer is a full-stack developer profiling and GitHub profile analysis tool that evaluates a developer's GitHub activity and portfolio website against a structured scoring system. It acts as a recruiter-style GitHub profile analyzer, helping developers understand how their profile appears to hiring managers.

Users receive a weighted composite developer score, detailed breakdowns, and AI-generated improvement suggestions to optimize their GitHub profile, portfolio, and overall developer presence.

The scoring engine runs two independent analysis pipelines:

- **GitHub pipeline** — evaluates contribution frequency, repository quality, profile completeness, and activity patterns via the GitHub API
- **Portfolio pipeline** — crawls the provided URL and checks 12 signals including presence of project demos, tech stack documentation, resume link, SEO metadata, social proof, and mobile viewport

Results from both pipelines are merged into a single weighted composite score and stored against the authenticated user's history.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client (React)                    │
│                                                         │
│   Landing → Analyze → [ GitHub Score | Portfolio Score ]│
│                ↓               ↓                        │
│           AuthContext      API Layer (Axios)             │
│                ↓               ↓                        │
│         JWT token cache    REST API (private)            │
└─────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────────────────┐
              │     Scoring Engine        │
              │  GitHub API + Claude AI   │
              │  + Rule-based fallback    │
              └───────────────────────────┘
```

The frontend is a pure consumer — it holds no scoring logic. All analysis, AI calls, and persistence happen server-side. The React app is responsible for auth state, result rendering, and history display only.

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| UI Framework | React 18 (CRA) | Stable, well-supported, sufficient for this scope |
| Routing | React Router v6 | Nested layouts, protected routes via `<Outlet>` |
| Data Fetching | Axios | Interceptor-based auth token injection |
| Charts | Recharts | Composable, responsive, React-native |
| Auth | JWT + Context API | Stateless auth, no external auth dependency |
| Deployment | Vercel | Zero-config CI/CD from GitHub |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js           # Sticky nav — blur-on-scroll, mobile hamburger
│   ├── Sidebar.js          # Dashboard layout sidebar
│   ├── Footer.js
│   ├── AnalysisResult.js   # Tabbed result panel (GitHub / Portfolio / Combined)
│   ├── ScoreRing.js        # Animated SVG ring — score via stroke-dashoffset
│   ├── KpiCard.js          # Reusable metric card
│   └── Spinner.js          # Inline + full-screen PageLoader variants
│
├── context/
│   └── AuthContext.js      # JWT auth — provides user, login(), logout(), loading
│
├── pages/
│   ├── Home.js             # Public landing (Hero, Features, How It Works, CTA)
│   ├── Analyze.js          # Analysis entry point — form + result orchestration
│   ├── Dashboard.js        # Score history chart + KPI summary + activity table
│   ├── History.js          # Paginated saved analyses
│   └── Login.js            # Login / Register with client-side toggle
│
├── utils/
│   ├── api.js              # Axios instance — base URL + auth interceptor
│   └── helpers.js          # Score tier mapping, label formatting, date utils
│
├── App.js                  # Route definitions + layout composition
├── index.js
└── index.css               # CSS custom properties (design tokens) + global resets
```

**Key decisions:**
- `api.js` is the single integration point for all HTTP calls. No component imports `axios` directly.
- `AuthContext` is the only global state. There is no Redux or Zustand — the auth surface is small enough that Context + local state covers all cases cleanly.
- Pages own their data-fetching logic. There is no global data layer or cache — analyses are lightweight and don't benefit from one at this scale.

---

## Routes

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Auth — login or register, client-side toggle |
| `/analyze` | Optional | Run analysis — results saved only if authenticated |
| `/dashboard` | Optional | Score trends + KPIs — empty state for guests |
| `/history` | Required | Full paginated analysis history |

Guest mode is intentional. Users can run a full analysis without an account; the gate is only on persistence and history access.

---

## Local Development

### Prerequisites

- Node.js v18+
- npm v9+

### Setup

```bash
git clone https://github.com/najmulcodes/devfolio-analyzer.git
cd devfolio-analyzer
npm install
cp .env.example .env
```

### Environment

```env
REACT_APP_API_URL=https://your-api-url.com/api
```

### Run

```bash
npm start          # Development server → localhost:3000
npm run build      # Production build → /build
```

---

## Deployment

The app deploys to Vercel with zero configuration. Vercel auto-detects CRA, sets build command to `npm run build`, and serves from `/build`.

```bash
# Required environment variable on Vercel
REACT_APP_API_URL = https://your-api-url.com/api
```

Every push to `main` triggers a production deploy. PRs get preview deployments automatically.

---

## Known Limitations

- **No real-time updates** — analysis results are point-in-time. Re-running the same username reflects the current state of the GitHub API at that moment.
- **Portfolio crawling depends on server-side rendering** — SPAs that require JavaScript to render content may return incomplete signal results.
- **AI fallback is silent** — when Claude AI is unavailable, the app falls back to rule-based scoring without surfacing a degraded-mode warning to the user. This should be made explicit in a future iteration.
- **CRA** — Create React App is in maintenance mode. Migration to Vite is the recommended next step for improved build times and DX.

---

## Roadmap

- [ ] Migrate from CRA to Vite
- [ ] Add comparison view — score two GitHub profiles side by side
- [ ] Webhook-based score refresh when GitHub activity changes
- [ ] Export analysis as PDF report
- [ ] Public profile pages — shareable score card URLs

---

## Contributing

```bash
# Branch naming
git checkout -b feat/your-feature      # new functionality
git checkout -b fix/issue-description  # bug fixes
git checkout -b chore/task-name        # non-functional changes

# Commit format (conventional commits)
git commit -m "feat: add comparison view for dual profile scoring"
git commit -m "fix: score ring animation breaks on Safari < 16"

# Open a pull request against main
```

PRs should include a clear description of what changed and why. Screenshots for UI changes.

---

## License

MIT © 2026 [najmulcodes](https://github.com/najmulcodes)

<!--
SEO Keywords:
GitHub profile analyzer, developer portfolio analyzer, AI GitHub analysis tool, GitHub score tool, developer profile optimization, portfolio review tool, recruiter GitHub evaluation, MERN stack project, React dashboard project
-->
