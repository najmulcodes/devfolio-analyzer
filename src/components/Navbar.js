import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <span style={styles.logoText}>DevFolio</span>
        </Link>

        {/* Desktop Nav */}
        <div style={styles.desktopLinks}>
          <button onClick={() => scrollTo('home')} style={styles.navLink}>Home</button>
          <button onClick={() => scrollTo('features')} style={styles.navLink}>Features</button>
          <button onClick={() => scrollTo('how-it-works')} style={styles.navLink}>How It Works</button>

          {user ? (
            <button onClick={() => navigate('/dashboard')} style={styles.navLink}>Dashboard</button>
          ) : (
            <button onClick={() => navigate('/login')} style={styles.navLink}>Login</button>
          )}

          <button onClick={() => navigate('/analyze')} style={styles.analyzeBtn}>
            Analyze Now
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ ...styles.bar, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.bar, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <button onClick={() => scrollTo('home')} style={styles.mobileLink}>Home</button>
          <button onClick={() => scrollTo('features')} style={styles.mobileLink}>Features</button>
          <button onClick={() => scrollTo('how-it-works')} style={styles.mobileLink}>How It Works</button>
          {user ? (
            <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} style={styles.mobileLink}>Dashboard</button>
          ) : (
            <button onClick={() => { navigate('/login'); setMenuOpen(false); }} style={styles.mobileLink}>Login / Register</button>
          )}
          <button onClick={() => { navigate('/analyze'); setMenuOpen(false); }} style={styles.mobileAnalyzeBtn}>
            Analyze Now →
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    transition: 'all 0.3s ease',
    padding: '0 24px',
  },
  navScrolled: {
    background: 'rgba(253, 246, 239, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 2px 24px rgba(139,69,19,0.08)',
    borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
  },
  inner: {
    maxWidth: 1120, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 68,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none',
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg, #f59e0b, #ff6b35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(245,158,11,0.35)',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 20, fontWeight: 800,
    color: '#1f2937',
  },
  desktopLinks: {
    display: 'flex', alignItems: 'center', gap: 6,
  },
  navLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '8px 14px', borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: '#4b5563',
    transition: 'color 0.15s, background 0.15s',
    fontFamily: 'Poppins, sans-serif',
  },
  analyzeBtn: {
    padding: '9px 20px', borderRadius: 10,
    background: 'linear-gradient(135deg, #f59e0b, #ff6b35)',
    border: 'none', color: 'white',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    fontFamily: 'Poppins, sans-serif',
    marginLeft: 8,
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column', gap: 4,
    background: 'none', border: 'none', cursor: 'pointer', padding: 8,
  },
  bar: {
    display: 'block', width: 22, height: 2,
    background: '#1f2937', borderRadius: 2,
    transition: 'all 0.25s ease',
  },
  mobileMenu: {
    background: 'rgba(253,246,239,0.97)',
    backdropFilter: 'blur(16px)',
    padding: '16px 24px 24px',
    display: 'flex', flexDirection: 'column', gap: 4,
    borderTop: '1px solid rgba(245,158,11,0.12)',
  },
  mobileLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '12px 8px', textAlign: 'left',
    fontSize: 15, fontWeight: 500, color: '#374151',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    fontFamily: 'Poppins, sans-serif',
  },
  mobileAnalyzeBtn: {
    marginTop: 12, padding: '13px 20px', borderRadius: 10,
    background: 'linear-gradient(135deg, #f59e0b, #ff6b35)',
    border: 'none', color: 'white',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
};
