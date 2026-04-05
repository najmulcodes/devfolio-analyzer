import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// ✅ FIX: AuthContext is now a named export from AuthContext.js
import { AuthContext } from '../context/AuthContext';

/* ── Inline logo SVG — matches favicon, scalable ───────────────────── */
const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#f59e0b"/>
    <path d="M10 11L5 16L10 21" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 11L27 16L22 21" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 16.5L15.5 18.5L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NAV_LINKS = [
  { to: '/',          label: 'Home'      },
  { to: '/analyze',   label: 'Analyze'   },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history',   label: 'History'   },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Consume via context — AuthContext is exported so useContext works here
  const { user, logout } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '10px 0' : '14px 0',
        background: scrolled
          ? 'rgba(253, 246, 239, 0.92)'
          : 'rgba(253, 246, 239, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #f0e4d4' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <LogoMark />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.125rem',
              color: 'var(--text-dark)',
              letterSpacing: '-0.03em',
            }}>
              Dev<span style={{ color: 'var(--orange)' }}>Folio</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: isActive(to) ? 'var(--orange)' : 'var(--text-mid)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive(to) ? 'var(--orange-pale)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive(to)) {
                    e.currentTarget.style.background = 'var(--cream-dark)';
                    e.currentTarget.style.color = 'var(--text-dark)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(to)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-mid)';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth section — desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-nav">
            {user ? (
              <>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  color: 'var(--text-light)',
                }}>
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    border: '1.5px solid var(--card-border)',
                    color: 'var(--text-mid)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--orange)';
                    e.currentTarget.style.color = 'var(--orange)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.color = 'var(--text-mid)';
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
                  color: 'white',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 5,
              padding: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--text-dark)',
                borderRadius: 2,
                transition: 'all 0.2s ease',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 40,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'rgba(253, 246, 239, 0.98)',
          backdropFilter: 'blur(12px)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          animation: 'fadeIn 0.2s ease',
        }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '1.125rem',
                color: isActive(to) ? 'var(--orange)' : 'var(--text-dark)',
                textDecoration: 'none',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: isActive(to) ? 'var(--orange-pale)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--card-border)', margin: '8px 0' }} />
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '1rem',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--orange-pale)',
                border: 'none',
                color: 'var(--orange)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '1rem',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
                color: 'white',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      )}

      {/* Height offset for fixed nav */}
      <div style={{ height: 30 }} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
