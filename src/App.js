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

/* Page title map */
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/analyze':   'Analyze',
  '/history':   'History',
};

function TopHeader({ onMenuOpen }) {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'DevFolio';

  return (
    <div style={headerS.bar}>
      {/* Mobile hamburger */}
      <button onClick={onMenuOpen} style={headerS.hamburger}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <h2 style={headerS.title}>{title}</h2>

      <div style={headerS.right}>
        {user ? (
          <div style={headerS.userPill}>
            <div style={headerS.userAva}>{user.email[0].toUpperCase()}</div>
            <span style={headerS.userLabel}>{user.email.split('@')[0]}</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        ) : (
          <a href="/login" style={headerS.signInBtn}>Sign in</a>
        )}
      </div>
    </div>
  );
}

const headerS = {
  bar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 28, gap: 16,
  },
  hamburger: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text-700)', padding: 4, display: 'none',
  },
  title: {
    fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800,
    color: 'var(--text-900)', flex: 1,
  },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  userPill: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.9)',
    padding: '8px 14px 8px 8px', borderRadius: 40,
    boxShadow: '0 2px 12px rgba(160,110,50,0.08)',
    cursor: 'pointer',
  },
  userAva: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'linear-gradient(135deg, #f59e0b, #e07800)',
    color: 'white', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  userLabel: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-900)' },
  signInBtn: {
    padding: '8px 18px', borderRadius: 20,
    background: 'linear-gradient(135deg, #f59e0b, #e07800)',
    color: 'white', fontSize: 13.5, fontWeight: 600,
    boxShadow: '0 4px 12px rgba(245,158,11,0.28)',
  },
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const { loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <PageLoader />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      <Route path="/*" element={
        <div className="app-layout">
          <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <main className="main-content">
            <TopHeader onMenuOpen={() => setMobileOpen(true)} />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze"   element={<Analyze />} />
              <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="*"          element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
