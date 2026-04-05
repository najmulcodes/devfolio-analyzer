import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import AnalysisResult from '../components/AnalysisResult';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const GithubIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

/* Animated step progress during analysis */
const STEPS = [
  { label: 'Fetching GitHub profile', icon: '👤' },
  { label: 'Scanning repositories', icon: '📦' },
  { label: 'Calculating score metrics', icon: '📊' },
  { label: 'Generating AI insights', icon: '✨' },
];

function LoadingSteps() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card fade-up" style={s.loadingCard}>
      <div style={s.loadingHeader}>
        <Spinner size={28} />
        <div>
          <div style={s.loadingTitle}>Analyzing profile…</div>
          <div style={s.loadingSubtitle}>This usually takes 5–10 seconds</div>
        </div>
      </div>
      <div style={s.stepList}>
        {STEPS.map((step, i) => {
          const done    = i < activeStep;
          const active  = i === activeStep;
          return (
            <div key={i} style={{ ...s.step, opacity: i > activeStep ? 0.35 : 1 }}>
              <div style={{
                ...s.stepDot,
                background: done ? '#22c55e' : active ? '#f59e0b' : 'rgba(180,140,90,0.2)',
                boxShadow: active ? '0 0 0 4px rgba(245,158,11,0.15)' : 'none',
              }}>
                {done
                  ? <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize: 11 }}>{step.icon}</span>
                }
              </div>
              <span style={{ ...s.stepLabel, color: active ? 'var(--text-900)' : done ? 'var(--text-500)' : 'var(--text-300)', fontWeight: active ? 600 : 400 }}>
                {step.label}
              </span>
              {done && <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Analyze() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [githubUsername, setGithubUsername] = useState(searchParams.get('user') || '');
  const [portfolioUrl, setPortfolioUrl]     = useState('');
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState(null);
  const [error, setError]                   = useState('');

  useEffect(() => {
    const u = searchParams.get('user');
    if (u) setGithubUsername(u);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUsername.trim()) { setError('GitHub username is required'); return; }
    setError(''); setResult(null); setLoading(true);
    try {
      const res = await api.post('/analysis/run', {
        githubUsername: githubUsername.trim(),
        portfolioUrl: portfolioUrl.trim() || undefined,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div className="fade-up" style={s.headerWrap}>
        <div>
          <div style={s.breadcrumb}>Analysis</div>
          <h1 style={s.title}>Analyze a Profile</h1>
          <p style={s.sub}>Enter a GitHub username to get an instant score with AI-powered feedback.</p>
        </div>
        <div style={s.aiBadge}>
          <span style={s.aiBadgeDot} />
          AI Powered
        </div>
      </div>

      {/* Input card */}
      <div className="glass-card fade-up" style={s.formCard}>

        {/* Card label */}
        <div style={s.formCardLabel}>
          <svg width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Profile Input
        </div>

        <div style={s.fieldRow}>

          {/* GitHub username */}
          <div style={s.field}>
            <label style={s.label}>
              GitHub Username
              <span style={s.req}> *</span>
            </label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}><GithubIcon /></span>
              <input
                className="premium-input"
                type="text"
                value={githubUsername}
                onChange={e => setGithubUsername(e.target.value)}
                placeholder="e.g. torvalds"
                autoComplete="off"
                style={{ paddingLeft: 44 }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
            <div style={s.fieldHint}>Enter just the username, not the full URL</div>
          </div>

          {/* Portfolio URL */}
          <div style={s.field}>
            <label style={s.label}>
              Portfolio URL
              <span style={s.opt}> (optional · +10 pts)</span>
            </label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}><GlobeIcon /></span>
              <input
                className="premium-input"
                type="url"
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                style={{ paddingLeft: 44 }}
              />
            </div>
            <div style={s.fieldHint}>Earn bonus points for having a personal site</div>
          </div>
        </div>

        {error && (
          <div style={s.errorBox}>
            <svg width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <div style={s.formFooter}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '13px 32px', fontSize: 15 }}
          >
            {loading
              ? <><Spinner size={16} color="white" /> Analyzing…</>
              : <>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  Analyze Profile
                </>
            }
          </button>

          {!user && (
            <div style={s.guestNote}>
              <svg width="13" height="13" fill="none" stroke="#92400e" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Results won't be saved.{' '}
              <a href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</a>
              {' '}to track history.
            </div>
          )}
        </div>
      </div>

      {/* Loading state with step progress */}
      {loading && <LoadingSteps />}

      {/* Saved badge */}
      {result && !loading && result.saved && (
        <div style={s.savedBadge} className="fade-up">
          <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Analysis saved to your history
        </div>
      )}

      {/* Results */}
      {result && !loading && <AnalysisResult result={result} />}
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },

  headerWrap: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  breadcrumb: { fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--text-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-900)', letterSpacing: '-0.03em' },
  sub: { fontSize: 13.5, color: 'var(--text-500)', marginTop: 4, fontFamily: 'Poppins, sans-serif' },
  aiBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '7px 15px', borderRadius: 999, flexShrink: 0,
    background: 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(251,191,36,0.08))',
    border: '1px solid rgba(245,158,11,0.3)', color: '#92400e',
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
  },
  aiBadgeDot: {
    width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', flexShrink: 0,
    boxShadow: '0 0 6px #f59e0b, 0 0 12px rgba(245,158,11,0.6)',
    animation: 'pulseGlow 2s ease-in-out infinite',
  },

  formCard: { padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 22 },
  formCardLabel: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, fontWeight: 600,
    color: 'var(--text-500)', textTransform: 'uppercase', letterSpacing: '0.07em',
    paddingBottom: 18, borderBottom: '1px solid var(--card-border)', marginBottom: 0,
  },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-700)' },
  req: { color: '#ef4444' },
  opt: { color: 'var(--text-300)', fontWeight: 400, fontSize: 12 },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1, pointerEvents: 'none' },
  fieldHint: { fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'var(--text-300)', marginTop: 2 },

  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(239,68,68,0.07)', color: '#ef4444',
    padding: '11px 16px', borderRadius: 10, fontSize: 13,
    fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(239,68,68,0.15)',
  },
  formFooter: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingTop: 2 },
  guestNote: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12.5, color: 'var(--text-500)',
    padding: '9px 14px', background: 'rgba(245,158,11,0.07)',
    borderRadius: 10, fontFamily: 'DM Sans, sans-serif',
    border: '1px solid rgba(245,158,11,0.15)',
  },

  loadingCard: { padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 22 },
  loadingHeader: { display: 'flex', alignItems: 'center', gap: 16 },
  loadingTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-900)' },
  loadingSubtitle: { fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'var(--text-300)', marginTop: 3 },
  stepList: { display: 'flex', flexDirection: 'column', gap: 12 },
  step: { display: 'flex', alignItems: 'center', gap: 12, transition: 'opacity 0.4s ease' },
  stepDot: {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  stepLabel: { fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, transition: 'all 0.3s ease' },

  savedBadge: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(34,197,94,0.08)', color: '#16a34a',
    padding: '11px 18px', borderRadius: 12, fontSize: 13.5, fontWeight: 500,
    fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(34,197,94,0.2)',
  },
};
