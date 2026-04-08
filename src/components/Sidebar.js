import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const LogoMark = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#f59e0b"/>
    <path d="M10 11L5 16L10 21" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 11L27 16L22 21" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 16.5L15.5 18.5L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NAV_ITEMS = [
  { to: '/analyze',   label: 'Analyze',   icon: '🔍' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/history',   label: 'History',   icon: '📋' },
];

export default function Sidebar({ className = "", onNavigate }) 
{
  const location             = useLocation();
  const navigate             = useNavigate();
  const { user, logout }     = useContext(AuthContext);

  const isActive     = (path) => location.pathname.startsWith(path);
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className={className}>
        <Link
  to="/"
  onClick={onNavigate}
  style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
>
          <LogoMark />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.125rem',
            color: 'white',
            letterSpacing: '-0.03em',
          }}>
            Dev<span style={{ color: 'var(--orange)' }}>Folio</span>
          </span>
        </Link>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              marginBottom: 4,
              background: isActive(to) ? 'rgba(245,158,11,0.15)' : 'transparent',
              color: isActive(to) ? 'var(--orange)' : 'var(--sidebar-text)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!isActive(to)) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={e => {
              if (!isActive(to)) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{icon}</span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}>
              {label}
            </span>
            {isActive(to) && (
              <span style={{
                marginLeft: 'auto',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--orange)',
              }} />
            )}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 'auto',
        }}>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Signed in as
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.875rem',
            color: 'var(--sidebar-text)',
            marginBottom: 12,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--sidebar-text)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
