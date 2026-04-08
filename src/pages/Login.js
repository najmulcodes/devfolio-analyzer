import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="9" fill="#f59e0b"/>
    <path d="M10 11L5 16L10 21" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 11L27 16L22 21" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 16.5L15.5 18.5L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FEATURES = [
  { icon: '📊', text: 'Track your score over time' },
  { icon: '✨', text: 'AI-powered improvement tips' },
  { icon: '🏆', text: 'See how you rank vs others' },
  { icon: '📋', text: 'Save unlimited analyses' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

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
    <div style={s.page}>

      {/* ── Left panel ── */}
      <div style={s.left} className="login-left">
        <div style={s.leftBlob1} />
        <div style={s.leftBlob2} />

        <div style={s.leftContent}>
          {/* Logo */}
          <Link to="/" style={s.logoLink}>
            <LogoMark />
            <span style={s.logoText}>Dev<span style={{ color: '#f59e0b' }}>Folio</span></span>
          </Link>

          <div style={s.leftMain}>
            <div style={s.leftBadge}>
              <span style={s.leftBadgeDot} />
              AI-Powered Analysis
            </div>

            <h2 style={s.leftTitle}>
              Your GitHub, scored{' '}
              <span style={s.leftTitleAccent}>like a recruiter.</span>
            </h2>
            <p style={s.leftSub}>
              Get instant insights, improvement suggestions, and track your developer profile over time.
            </p>

            <div style={s.featureList}>
              {FEATURES.map((f, i) => (
                <div key={i} style={s.featureItem}>
                  <span style={s.featureIcon}>{f.icon}</span>
                  <span style={s.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={s.statsRow}>
            {[{ v: '100', l: 'Max Score' }, { v: 'AI', l: 'Powered' }, { v: 'Free', l: 'Forever' }].map(st => (
              <div key={st.l} style={s.statItem}>
                <div style={s.statVal}>{st.v}</div>
                <div style={s.statLabel}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={s.right}>
        <div style={s.formOuter}>

          {/* Mode tabs */}
          <div style={s.tabs}>
            {[
              { key: 'login',    label: 'Sign In' },
              { key: 'register', label: 'Register' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setError(''); }}
                style={{ ...s.tab, ...(mode === key ? s.tabActive : {}) }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div className="glass-card fade-up" style={s.card}>
            <div style={s.formHeader}>
              <h1 style={s.formTitle}>
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p style={s.formSub}>
                {mode === 'login'
                  ? 'Sign in to access your dashboard and history.'
                  : 'Start tracking your developer portfolio today.'}
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              style={s.googleBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange-border)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={s.dividerRow}>
              <div style={s.dividerLine} />
              <span style={s.dividerLabel}>or continue with email</span>
              <div style={s.dividerLine} />
            </div>

            {/* Form */}
            <div style={s.form}>

              <div style={s.field}>
                <label style={s.label}>Email address</label>
                <div style={s.inputWrap}>
                  <span style={s.inputIcon}>
                    <svg width="15" height="15" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
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
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              <div style={s.field}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={s.label}>Password</label>
                  {mode === 'login' && (
                    <a href="/forgot-password" style={s.forgotLink}>Forgot password?</a>
                  )}
                </div>
                <div style={s.inputWrap}>
                  <span style={s.inputIcon}>
                    <svg width="15" height="15" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="premium-input"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={s.eyeBtn}
                    tabIndex={-1}
                  >
                    {showPass
                      ? <svg width="14" height="14" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="14" height="14" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div style={s.errorBox}>
                  <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 1 }}
              >
                {loading
                  ? <><Spinner size={16} color="white" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                  : mode === 'login' ? 'Sign In' : 'Create Account'
                }
              </button>
            </div>

            {/* Footer link */}
            <div style={s.footerText}>
              {mode === 'login'
                ? <>Don't have an account?{' '}<button onClick={() => { setMode('register'); setError(''); }} style={s.switchBtn}>Sign up</button></>
                : <>Already have an account?{' '}<button onClick={() => { setMode('login'); setError(''); }} style={s.switchBtn}>Sign in</button></>
              }
            </div>
          </div>

          {/* Back to Analyze */}
          <Link to="./Analyze" style={s.analyzelink}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
           Continue without signing in
          </Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', background: 'linear-gradient(145deg, #ede8df 0%, #e8ddd0 40%, #dfd3c0 100%)',
    fontFamily: 'Poppins, sans-serif',
  },

  /* Left */
  left: {
    flex: '1 1 100px', maxWidth: 480, position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(160deg, #1a1207 0%, #241a0e 55%, #1f1709 100%)',
    display: 'flex', flexDirection: 'column',
  },
  leftBlob1: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 65%)',
    top: -100, right: -100, pointerEvents: 'none',
  },
  leftBlob2: {
    position: 'absolute', width: 350, height: 350, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)',
    bottom: -80, left: -60, pointerEvents: 'none',
  },
  leftContent: { position: 'relative', zIndex: 1, padding: '36px 40px', display: 'flex', flexDirection: 'column', height: '100%', gap: 22, justifyContent: 'space-between', },
  logoLink: { display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20, },
  logoText: { fontFamily: 'Poppins, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' },
  leftMain: { display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'flex-start', },
  leftBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '6px 14px', borderRadius: 99,
    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
    color: '#f59e0b', fontFamily: 'monospace, sans-serif', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.02em', width: 'fit-content', marginTop: 2,
  },
  leftBadgeDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', flexShrink: 0,
    boxShadow: '0 0 6px #f59e0b, 0 0 12px rgba(245,158,11,0.6)',
    animation: 'pulseGlow 2s ease-in-out infinite', marginTop: 2,
  },
  leftTitle: {
    fontFamily: 'monospace, sans-serif', fontSize: 'clamp(28px, 3vw, 28px)', fontWeight: 800,
    color: 'white', lineHeight: 1.2, letterSpacing: '-0.03em',
  },
  leftTitleAccent: { color: '#f59e0b' },
  leftSub: {
    fontFamily: 'Poppins, sans-serif', fontSize: 14.5,
    color: 'rgba(255,255,255,0.5)', lineHeight: 1.72,
  },
  featureList: { display: 'flex', flexDirection: 'column', gap: 12 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10 },
  featureIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 16, flexShrink: 0,
  },
  featureText: { fontFamily: 'monospace, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500 },
  statsRow: { display: 'flex', gap: 30, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' },
  statItem: {},
  statVal: { fontFamily: 'monospace, sans-serif', fontSize: 24, fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.03em' },
  statLabel: { fontFamily: 'monospace, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },

  /* Right */
  right: {
    flex: 1, display: 'flex', 
    width: '100%', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', overflow: 'hidden',
  },
  formOuter: { width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 },

  /* Tabs */
  tabs: {
    display: 'flex', gap: 3,
    background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.8)', borderRadius: 14, padding: 4,
  },
  tab: {
    flex: 1, padding: '9px 16px', borderRadius: 10, border: 'none',
    background: 'transparent', fontFamily: 'monospace, sans-serif',
    fontSize: 14, fontWeight: 500, color: 'var(--text-500)', cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'white', color: 'var(--text-900)', fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },

  /* Card */
  card: { padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: 18 },
  formHeader: {},
  formTitle: { fontFamily: 'monospace, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-900)', letterSpacing: '-0.03em', marginBottom: 1 },
  formSub: { fontFamily: 'Poppins, sans-serif', fontSize: 13.5, color: 'var(--text-500)', lineHeight: 1.6 },

  /* Google button */
  googleBtn: {
    width: '100%', padding: '12px 20px', borderRadius: 12,
    border: '1.5px solid var(--card-border)', background: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontFamily: 'monospace, sans-serif', fontSize: 14.5, fontWeight: 500,
    color: 'var(--text-700)', cursor: 'pointer', transition: 'all 0.2s ease',
    boxShadow: 'none',
  },

  /* Divider */
  dividerRow: { display: 'flex', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, background: 'var(--card-border)' },
  dividerLabel: { fontFamily: 'monospace, sans-serif', fontSize: 12, color: 'var(--text-300)', whiteSpace: 'nowrap', fontWeight: 500 },

  /* Form fields */
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontFamily: 'monospace, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-700)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1, pointerEvents: 'none' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex',
  },
  forgotLink: {
    fontFamily: 'monospace, sans-serif', fontSize: 12.5, color: 'var(--orange)', fontWeight: 500,
    textDecoration: 'none', transition: 'color 0.2s',
  },

  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(239,68,68,0.07)', color: '#ef4444',
    padding: '10px 14px', borderRadius: 10, fontSize: 13,
    fontFamily: 'monospace, sans-serif', border: '1px solid rgba(239,68,68,0.14)',
  },

  footerText: {
    textAlign: 'center', fontFamily: 'monospace, sans-serif',
    fontSize: 13.5, color: 'var(--text-500)',
    paddingTop: 4,
  },
  switchBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--orange)', fontFamily: 'monospace, sans-serif',
    fontSize: 13.5, fontWeight: 600, padding: 0, display: 'inline',
    transition: 'color 0.2s',
  },

  analyzelink: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'monospace, sans-serif', fontSize: 13, color: 'var(--text-500)',
    textDecoration: 'none', transition: 'color 0.2s', justifyContent: 'center',
  },
};
