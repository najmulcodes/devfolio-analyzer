import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const mainItems = [
    { to: '/dashboard', label: 'Dashboard', icon: dashIcon },
    { to: '/analyze',   label: 'Analyze',   icon: searchIcon },
    ...(user ? [{ to: '/history', label: 'History', icon: clockIcon }] : []),
  ];

  return (
    <aside style={s.sidebar}>
      {/* Logo */}
      <div style={s.logoWrap}>
        <div style={s.logoMark}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div style={s.logoName}>DevFolio</div>
          <div style={s.logoSub}>Analyzer</div>
        </div>
      </div>

      {/* Main nav */}
      <div style={s.sectionLabel}>Main Menu</div>
      <nav style={s.nav}>
        {mainItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onClose}
            style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
            {({ isActive }) => (
              <>
                <span style={{ ...s.iconBox, ...(isActive ? s.iconBoxActive : {}) }}>
                  {item.icon(isActive)}
                </span>
                <span style={s.linkLabel}>{item.label}</span>
                {isActive && <span style={s.dot} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User */}
      <div style={s.userSection}>
        {user ? (
          <>
            <div style={s.userCard}>
              <div style={s.avatar}>{user.email[0].toUpperCase()}</div>
              <div style={{ minWidth: 0 }}>
                <div style={s.userName}>{user.email.split('@')[0]}</div>
                <div style={s.userMeta}>{user.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>
              {logoutIcon} Sign out
            </button>
          </>
        ) : (
          <div>
            <div style={s.guestNote}>Guest — results not saved</div>
            <button onClick={() => navigate('/login')} style={s.signInBtn}>
              Sign in to save history
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── SVG icon factories ── */
const mkIcon = (path, fill = false) => (active) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const dashIcon   = mkIcon('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z');
const searchIcon = mkIcon('M21 21l-4.35-4.35M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z');
const clockIcon  = mkIcon('M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z');
const logoutIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

const s = {
  sidebar: {
    width: 240, minWidth: 240, height: '100vh',
    background: 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
    borderRight: '1px solid rgba(255,255,255,0.88)',
    display: 'flex', flexDirection: 'column',
    padding: '22px 12px 20px', flexShrink: 0,
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '2px 8px 20px',
    borderBottom: '1px solid rgba(180,140,90,0.1)', marginBottom: 20,
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 11,
    background: 'linear-gradient(135deg, #f59e0b, #e07800)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(245,158,11,0.3)', flexShrink: 0,
  },
  logoName: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 800, color: '#1a1207' },
  logoSub: { fontSize: 9.5, color: '#c0a880', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, color: '#c0a880',
    textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px 8px',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 2 },
  link: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 10px', borderRadius: 12,
    color: '#7c6a55', fontSize: 13.5, fontWeight: 500,
    textDecoration: 'none', transition: 'all 0.15s',
    position: 'relative',
  },
  linkActive: { background: 'rgba(245,158,11,0.11)', color: '#92400e', fontWeight: 600 },
  iconBox: {
    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(180,140,90,0.08)', color: '#9ca3af',
    transition: 'all 0.15s',
  },
  iconBoxActive: { background: 'rgba(245,158,11,0.16)', color: '#f59e0b' },
  linkLabel: { flex: 1 },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)',
  },
  userSection: { borderTop: '1px solid rgba(180,140,90,0.1)', paddingTop: 14 },
  userCard: {
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '9px 10px', borderRadius: 12,
    background: 'rgba(245,158,11,0.06)', marginBottom: 8,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #f59e0b, #e07800)',
    color: 'white', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 13, fontWeight: 700,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#1a1207', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userMeta: { fontSize: 11, color: '#b0a090', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 7,
    width: '100%', padding: '8px 10px', borderRadius: 10,
    background: 'none', border: '1px solid rgba(180,140,90,0.14)',
    color: '#a09080', fontSize: 12.5, fontWeight: 500, transition: 'all 0.15s',
  },
  guestNote: { fontSize: 11.5, color: '#b0a090', marginBottom: 10, padding: '0 2px' },
  signInBtn: {
    width: '100%', padding: '10px', borderRadius: 11, border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #e07800)',
    color: 'white', fontSize: 13, fontWeight: 600,
    boxShadow: '0 4px 14px rgba(245,158,11,0.28)',
  },
};
