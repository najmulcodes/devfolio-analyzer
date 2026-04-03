import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card} className="fade-up">
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div style={styles.brandName}>DevFolio Analyzer</div>
        </div>

        <h1 style={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={styles.sub}>
          {mode === 'login'
            ? 'Sign in to access your analysis history'
            : 'Sign up to save and track your analyses'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              autoComplete="email"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              style={styles.input}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading
              ? <><Spinner size={18} color="white" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <div style={styles.toggle}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={styles.toggleBtn}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        <div style={styles.divider}>or</div>

        <button onClick={() => navigate('/analyze')} style={styles.guestBtn}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'var(--cream)', padding: 20,
  },
  card: {
    background: 'white', borderRadius: 24, padding: '40px 36px',
    boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 420,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  brandIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'var(--orange)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandName: { fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark)' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 },
  sub: { fontSize: 14, color: 'var(--text-light)', marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text-mid)' },
  input: {
    padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid var(--cream-dark)',
    fontSize: 14, color: 'var(--text-dark)',
    background: 'var(--cream)', outline: 'none',
  },
  error: {
    background: '#fef2f2', color: '#ef4444',
    padding: '10px 14px', borderRadius: 10, fontSize: 13,
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '14px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
    color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
    marginTop: 4,
  },
  toggle: { textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-light)' },
  toggleBtn: {
    background: 'none', border: 'none',
    color: 'var(--orange)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
  divider: {
    textAlign: 'center', color: 'var(--text-light)', fontSize: 13,
    margin: '16px 0', position: 'relative',
  },
  guestBtn: {
    width: '100%', padding: '12px', borderRadius: 12,
    border: '1.5px solid var(--cream-dark)', background: 'white',
    color: 'var(--text-mid)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
  },
};
