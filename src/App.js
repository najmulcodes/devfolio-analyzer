import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Login from './pages/Login';
import { PageLoader } from './components/Spinner';

/* Page meta map */
const pageMeta = {
  '/dashboard': { title: 'Dashboard', sub: 'Your analysis overview' },
  '/analyze': { title: 'Analyze', sub: 'Analyze any GitHub profile or Portfolio' },
  '/history': { title: 'History', sub: 'Past analyses' },
};

function TopHeader({ onMenuOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const meta = pageMeta[location.pathname] || {
    title: 'DevFolio',
    sub: '',
  };

  return (
    <div style={headerS.bar}>
      {/* Mobile hamburger */}
      <button onClick={onMenuOpen} style={headerS.hamburger}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div style={{ flex: 1 }}>
        <h2 style={headerS.title}>{meta.title}</h2>

        {meta.sub && (
          <p style={headerS.sub}>
            {meta.sub}
          </p>
        )}
      </div>

      {/* User */}
      <div style={headerS.right}>
        {user ? (
          <div style={headerS.userPill}>
            <div style={headerS.userAva}>
              {user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <span style={headerS.userLabel}>
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        ) : (
          <a href="/login" style={headerS.signInBtn}>
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}

/* Styles */
const headerS = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 16,
  },
  
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: '#0f0a00',
    letterSpacing: '-0.03em',
    marginBottom: 3,
  },
  sub: {
    fontSize: 12.5,
    color: '#b0a898',
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  hamburger: {
    background: 'none', 
    border: 'none', 
    cursor: 'pointer',
    color: 'var(--text-700)', 
    padding: 4, 
    display: 'none',
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 40,
    background: 'rgba(255,255,255,0.7)',
  },
  userAva: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#f59e0b',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
  },
  userLabel: {
    fontSize: 13.5,
    fontWeight: 600,
  },
  signInBtn: {
    padding: '8px 18px',
    borderRadius: 20,
    background: '#f59e0b',
    color: 'white',
    fontSize: 13.5,
    fontWeight: 600,
  },
};

/* Protected route */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

/* Layout */
function AppLayout() {
  const { loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <PageLoader />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <div className="app-layout">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <main className="main-content">
              <TopHeader onMenuOpen={() => setMobileOpen(true)} />

              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

/* Root */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}