import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('All fields are required'); return; }
    setError(''); setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page" style={s.page}>

      {/* ── Left decorative panel ── */}
      <div className="login-left" style={s.left}>
        <div style={s.leftBlob1} />
        <div style={s.leftBlob2} />

        <div style={s.leftInner}>
          {/* Brand */}
          <div style={s.brand}>
            <div style={s.brandIcon}>
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={s.brandName}>DevFolio Analyzer</span>
          </div>

          <h2 style={s.leftTitle}>
            Your GitHub profile,<br />
            <span style={{ color: 'var(--primary)' }}>scored like a recruiter.</span>
          </h2>

          <p style={s.leftSub}>
            Track your improvement over time, get AI feedback,
            and stand out from other developers.
          </p>

          {/* Stats */}
          <div className="login-stats-row" style={s.statsRow}>
            {[
              { v: '100', l: 'Max Score' },
              { v: 'AI',  l: 'Powered'   },
              { v: 'Free',l: 'Forever'   },
            ].map(item => (
              <div key={item.l} style={s.statItem}>
                <div style={s.statVal}>{item.v}</div>
                <div style={s.statLabel}>{item.l}</div>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div style={s.featureList}>
            {[
              'Instant score out of 100',
              'AI-powered improvement tips',
              'Portfolio URL analysis',
              'Full analysis history',
            ].map(f => (
              <div key={f} style={s.featureItem}>
                <span style={s.featureCheck}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-right" style={s.right}>
        <div className="login-form-wrap fade-up" style={s.formWrap}>

          {/* Tab switcher */}
          <div style={s.tabs}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{ ...s.tab, ...(mode === m ? s.tabActive : {}) }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={s.formHeader}>
            <h1 style={s.formTitle}>
              {mode === 'login' ? 'Welcome back 👋' : 'Create account'}
            </h1>
            <p style={s.formSub}>
              {mode === 'login'
                ? 'Sign in to access your dashboard'
                : 'Start tracking your developer portfolio'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px', fontSize: 14, justifyContent: 'center', opacity: loading ? 0.75 : 1 }}
            >
              {loading
                ? <><Spinner size={16} color="white" />{mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={s.orDivider}><span style={s.orText}>or</span></div>

          {/* Guest CTA */}
          <button onClick={() => navigate('/analyze')} style={s.guestBtn}>
            Continue as Guest
          </button>

          {/* Switch mode */}
          <p style={s.switchText}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={s.switchLink}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(145deg, #ede8df 0%, #e8ddd0 40%, #dfd3c0 100%)',
  },

  /* left */
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 52px',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBlob1: {
    position: 'absolute', width: 480, height: 480, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 68%)',
    top: -100, right: -80, pointerEvents: 'none',
  },
  leftBlob2: {
    position: 'absolute', width: 320, height: 320, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(217,119,6,0.09) 0%, transparent 70%)',
    bottom: -60, left: 10, pointerEvents: 'none',
  },
  leftInner: { position: 'relative', zIndex: 1, maxWidth: 440 },

  brand:    { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44 },
  brandIcon:{
    width: 40, height: 40, borderRadius: 11,
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 5px 16px rgba(245,158,11,0.30)',
  },
  brandName: { fontSize: 17, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.2px' },

  leftTitle: {
    fontSize: 'clamp(30px,3.5vw,44px)',
    fontWeight: 700, color: '#1a1a1a', lineHeight: 1.22, marginBottom: 16,
  },
  leftSub: {
    fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 36,
  },

  statsRow:  { display: 'flex', gap: 32, marginBottom: 36 },
  statItem:  { textAlign: 'center' },
  statVal:   { fontSize: 28, fontWeight: 700, color: '#f59e0b', letterSpacing: '-1px' },
  statLabel: { fontSize: 11.5, color: '#9ca3af', marginTop: 2, fontWeight: 500 },

  featureList: { display: 'flex', flexDirection: 'column', gap: 10 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#374151' },
  featureCheck:{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,158,11,0.14)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },

  /* right */
  right: {
    width: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 40px', background: 'rgba(255,255,255,0.40)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255,255,255,0.55)',
  },
  formWrap: { width: '100%', maxWidth: 400 },

  tabs: {
    display: 'flex', background: 'rgba(0,0,0,0.06)',
    borderRadius: 12, padding: 4, marginBottom: 28,
  },
  tab: {
    flex: 1, padding: '9px', borderRadius: 9, border: 'none',
    background: 'transparent', fontSize: 13.5, fontWeight: 600,
    color: 'var(--text-500)', cursor: 'pointer', transition: 'all 0.18s',
    fontFamily: 'Poppins, sans-serif',
  },
  tabActive: {
    background: '#fff', color: 'var(--text-900)',
    boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
  },

  formHeader: { marginBottom: 22 },
  formTitle:  { fontSize: 22, fontWeight: 700, color: 'var(--text-900)', marginBottom: 5, letterSpacing: '-0.3px' },
  formSub:    { fontSize: 13, color: 'var(--text-500)' },

  form:      { display: 'flex', flexDirection: 'column', gap: 15 },
  field:     { display: 'flex', flexDirection: 'column', gap: 7 },
  label:     { fontSize: 12.5, fontWeight: 600, color: 'var(--text-700)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1, pointerEvents: 'none' },

  orDivider: {
    position: 'relative', textAlign: 'center',
    margin: '20px 0 16px',
    borderTop: '1px solid rgba(0,0,0,0.09)',
  },
  orText: {
    position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(255,255,255,0.85)',
    padding: '0 12px', fontSize: 11.5, color: 'var(--text-300)',
    backdropFilter: 'blur(4px)',
  },
  guestBtn: {
    width: '100%', padding: '11px', borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.12)',
    background: 'rgba(255,255,255,0.55)',
    color: 'var(--text-700)', fontSize: 13.5, fontWeight: 600,
    cursor: 'pointer', marginBottom: 18,
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.16s',
  },
  switchText: { textAlign: 'center', fontSize: 13, color: 'var(--text-500)' },
  switchLink: {
    background: 'none', border: 'none', color: '#d97706',
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
};
