import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  analyze: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  history: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { to: '/analyze', label: 'Analyze', icon: icons.analyze },
    ...(user ? [{ to: '/history', label: 'History', icon: icons.history }] : []),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            zIndex: 99, display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div style={styles.logoName}>DevFolio</div>
            <div style={styles.logoSub}>Analyzer</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User / Auth */}
        <div style={styles.bottom}>
          {user ? (
            <>
              <div style={styles.userCard}>
                <div style={styles.avatar}>
                  {user.email[0].toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <div style={styles.userEmail}>{user.email}</div>
                  <div style={styles.userRole}>Authenticated</div>
                </div>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                {icons.logout} Sign out
              </button>
            </>
          ) : (
            <div style={styles.guestCard}>
              <div style={styles.guestText}>Guest mode</div>
              <button onClick={() => navigate('/login')} style={styles.loginBtn}>
                Sign in to save history
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width, 260px)',
    minWidth: 260,
    height: '100vh',
    background: 'var(--text-dark)',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 16px',
    flexShrink: 0,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 8px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 24,
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'var(--orange)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoName: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1.1,
  },
  logoSub: {
    fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', borderRadius: 12,
    color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 500,
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(255,107,53,0.18)',
    color: 'var(--orange)',
  },
  navIcon: { flexShrink: 0 },
  bottom: { borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 },
  userCard: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', marginBottom: 8,
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'var(--orange)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userEmail: {
    color: 'white', fontSize: 13, fontWeight: 500,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  userRole: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '10px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: 'none',
    color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  guestCard: { padding: '0 4px' },
  guestText: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 8 },
  loginBtn: {
    width: '100%', padding: '10px 16px', borderRadius: 10,
    background: 'var(--orange)', border: 'none',
    color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
};
