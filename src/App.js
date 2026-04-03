import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Login from './pages/Login';
import { PageLoader } from './components/Spinner';

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
      {/* Public landing page — no sidebar */}
      <Route path="/" element={<Home />} />

      {/* Auth pages — no sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />

      {/* App pages — with sidebar */}
      <Route
        path="/*"
        element={
          <div className="app-layout">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <main className="main-content">
              {/* Mobile header */}
              <div style={mobileHeader}>
                <button onClick={() => setMobileOpen(true)} style={hamburger}>
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
                <span style={mobileBrand}>DevFolio</span>
              </div>

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

const mobileHeader = {
  display: 'flex',
  alignItems: 'center', gap: 12,
  marginBottom: 20,
};
const hamburger = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-dark)', padding: 4,
};
const mobileBrand = {
  fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark)',
};
