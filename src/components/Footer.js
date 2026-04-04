import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/');
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>

        {/* Left: Brand */}
        <div style={styles.brand}>
          <div style={styles.logoRow}>
            {/* Icon version inverted for dark footer */}
            <img
              src="/logo-icon.svg"
              alt="DevFolio"
              width={34}
              height={34}
              style={styles.logoImg}
              draggable={false}
            />
            <span style={styles.logoText}>DevFolio Analyzer</span>
          </div>
          <p style={styles.brandDesc}>
            Instantly score and improve your developer portfolio with AI-powered insights.
          </p>
          <div style={styles.socialRow}>
            <a
              href="https://github.com/najmulcodes"
              target="_blank" rel="noreferrer"
              style={styles.socialLink}
              aria-label="GitHub"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/najmulcodes"
              target="_blank" rel="noreferrer"
              style={styles.socialLink}
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Middle: Links */}
        <div style={styles.linkGroup}>
          <div style={styles.linkTitle}>Navigate</div>
          <button onClick={() => scrollTo('home')} style={styles.footerLink}>Home</button>
          <button onClick={() => scrollTo('features')} style={styles.footerLink}>Features</button>
          <button onClick={() => scrollTo('how-it-works')} style={styles.footerLink}>How It Works</button>
          <Link to="/analyze" style={styles.footerLinkA}>Analyze</Link>
          <Link to="/login" style={styles.footerLinkA}>Login</Link>
        </div>

        {/* Right: Contact */}
        <div style={styles.linkGroup}>
          <div style={styles.linkTitle}>Contact</div>
          <a href="mailto:hello@najmulcodes.dev" style={styles.footerLinkA}>
            hello@najmulcodes.dev
          </a>
          <a href="https://github.com/najmulcodes/devfolio-analyzer" target="_blank" rel="noreferrer" style={styles.footerLinkA}>
            View on GitHub
          </a>
          <a href="https://github.com/najmulcodes/devfolio-analyzer-server" target="_blank" rel="noreferrer" style={styles.footerLinkA}>
            Backend Repo
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <span>© {year} DevFolio Analyzer. Built for learning purposes.</span>
        <span style={styles.bottomRight}>Made with ☕ by najmulcodes</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1f2937',
    padding: '60px 24px 0',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: 1120, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: 48, paddingBottom: 48,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  brand: { display: 'flex', flexDirection: 'column', gap: 14 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  /* The icon SVG has a dark (#0F172A) background — it reads well on the dark footer */
  logoImg: {
    objectFit: 'contain',
    borderRadius: 8,
    /* Slight brightness boost so it reads clearly against #1f2937 */
    filter: 'brightness(1.15)',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: 'white',
  },
  brandDesc: { fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 300 },
  socialRow: { display: 'flex', gap: 10, marginTop: 4 },
  socialLink: {
    width: 36, height: 36, borderRadius: 8,
    background: 'rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.6)',
    transition: 'background 0.15s, color 0.15s',
  },
  linkGroup: { display: 'flex', flexDirection: 'column', gap: 10 },
  linkTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700,
    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 4,
  },
  footerLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, color: 'rgba(255,255,255,0.55)',
    textAlign: 'left', padding: 0, fontFamily: 'Poppins, sans-serif',
    transition: 'color 0.15s',
  },
  footerLinkA: {
    fontSize: 14, color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none', fontFamily: 'Poppins, sans-serif',
    transition: 'color 0.15s',
  },
  bottomBar: {
    maxWidth: 1120, margin: '0 auto',
    padding: '20px 0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 8,
    fontSize: 13, color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Poppins, sans-serif',
  },
  bottomRight: { color: 'rgba(255,255,255,0.3)' },
};
