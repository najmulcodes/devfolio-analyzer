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
    <div style={s.page}>
      {/* Left decorative panel */}
      <div style={s.left}>
        <div style={s.leftInner}>

          {/* ── Brand — logo-full.svg ── */}
          <div style={s.brand}>
            <img
              src="/logo-full.svg"
              alt="DevFolio Analyzer"
              height={38}
              width={190}
              style={{ objectFit: 'contain' }}
              draggable={false}
            />
          </div>

          <h2 style={s.leftTitle}>Your GitHub profile,<br/>scored like a recruiter.</h2>
          <p style={s.leftSub}>Track your improvement over time, get AI feedback, and stand out from other developers.</p>
          <div style={s.statsRow}>
            {[{ v: '100', l: 'Max Score' }, { v: 'AI', l: 'Powered' }, { v: 'Free', l: 'Forever' }].map(s2 => (
              <div key={s2.l} style={s.statItem}>
                <div style={s.statVal}>{s2.v}</div>
                <div style={s.statLabel}>{s2.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative blobs */}
        <div style={s.blob1} /><div style={s.blob2} />
      </div>

      {/* Right form panel */}
      <div style={s.right}>
        <div className="glass-card fade-up" style={s.card}>

          {/* Tab switcher */}
          <div style={s.tabs}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{ ...s.tab, ...(mode === m ? s.tabActive : {}) }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div style={s.formHeader}>
            <h1 style={s.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p style={s.formSub}>{mode === 'login' ? 'Sign in to your account' : 'Start tracking your portfolio'}</p>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="15" height="15" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input className="premium-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  style={{ paddingLeft: 42 }} />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="15" height="15" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input className="premium-input" type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingLeft: 42 }} />
              </div>
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ padding: '13px', fontSize: 15, justifyContent: 'center', opacity: loading ? 0.75 : 1 }}>
              {loading
                ? <><Spinner size={17} color="white" />{mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={s.divider}><span style={s.dividerText}>or</span></div>

          <button onClick={() => navigate('/analyze')} style={s.guestBtn}>
            Continue as Guest
          </button>

          <div style={s.switchText}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={s.switchLink}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #fef3e8, #fde9cc, #f5dfc0)' },
  left: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 48px', position: 'relative', overflow: 'hidden',
  },
  leftInner: { position: 'relative', zIndex: 1, maxWidth: 420 },
  brand: { marginBottom: 40 },
  leftTitle: { fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800, color: '#1a1207', lineHeight: 1.2, marginBottom: 16 },
  leftSub: { fontSize: 15, color: '#7c6a55', lineHeight: 1.7, marginBottom: 36 },
  statsRow: { display: 'flex', gap: 28 },
  statItem: { textAlign: 'center' },
  statVal: { fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: '#f59e0b' },
  statLabel: { fontSize: 11.5, color: '#b0a090', marginTop: 2, fontWeight: 500 },
  blob1: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', top: -80, right: -60, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)', bottom: -40, left: 20, pointerEvents: 'none' },
  right: { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' },
  card: { width: '100%', padding: '36px 32px' },
  tabs: { display: 'flex', background: 'rgba(180,140,90,0.08)', borderRadius: 12, padding: 4, marginBottom: 28 },
  tab: { flex: 1, padding: '9px', borderRadius: 9, border: 'none', background: 'transparent', fontSize: 13.5, fontWeight: 600, color: 'var(--text-500)', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'white', color: 'var(--text-900)', boxShadow: '0 2px 8px rgba(180,140,90,0.1)' },
  formHeader: { marginBottom: 22 },
  formTitle: { fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-900)', marginBottom: 5 },
  formSub: { fontSize: 13.5, color: 'var(--text-500)' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-700)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1 },
  errorBox: { background: 'rgba(239,68,68,0.07)', color: '#ef4444', padding: '10px 13px', borderRadius: 10, fontSize: 13 },
  divider: { position: 'relative', textAlign: 'center', margin: '18px 0 14px', borderTop: '1px solid rgba(180,140,90,0.15)' },
  dividerText: { position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 12px', fontSize: 12, color: 'var(--text-300)' },
  guestBtn: { width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid rgba(180,140,90,0.2)', background: 'rgba(255,255,255,0.5)', color: 'var(--text-700)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', marginBottom: 18 },
  switchText: { textAlign: 'center', fontSize: 13, color: 'var(--text-500)' },
  switchLink: { background: 'none', border: 'none', color: '#f59e0b', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
};
