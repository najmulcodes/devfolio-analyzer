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

    const trimmedUsername = githubUsername.trim();
    const trimmedPortfolio = portfolioUrl.trim();

    if (!trimmedUsername && !trimmedPortfolio) {
      setError('Please provide at least a GitHub username or a Portfolio URL');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const payload = {};

      if (trimmedUsername) payload.githubUsername = trimmedUsername;
      if (trimmedPortfolio) payload.portfolioUrl = trimmedPortfolio;

      const res = await api.post('/api/analysis/run', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>

      <div className="fade-up" style={s.headerWrap}>
        <div>
          <h1 style={s.title}>Analyze a Profile</h1>
          <p style={s.sub}>
            Enter a GitHub username, a Portfolio URL, or both.
          </p>
        </div>
        <div style={s.aiBadge}>
          <span style={s.aiBadgeDot} />
          AI Powered
        </div>
      </div>

      <form onSubmit={handleSubmit}>
  <div className="glass-card fade-up" style={s.formCard}>

    <div style={s.formCardLabel}>
      Profile Input
    </div>

    <div style={s.fieldRow}>

      <div style={s.field}>
        <label style={s.label}>
          GitHub Username
          <span style={s.opt}> (optional)</span>
        </label>
        <div style={s.inputWrap}>
          <span style={s.inputIcon}><GithubIcon /></span>
          <input
            className="premium-input"
            type="text"
            value={githubUsername}
            onChange={e => setGithubUsername(e.target.value)}
            placeholder="e.g. najmulcodes"
            style={{ paddingLeft: 44 }}
          />
        </div>
      </div>

      <div style={s.field}>
        <label style={s.label}>
          Portfolio URL
          <span style={s.opt}> (optional)</span>
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
      </div>
    </div>

    {error && <div style={s.errorBox}>{error}</div>}

    <div style={s.formFooter}>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? <Spinner size={16} color="white" /> : 'Analyze Profile'}
      </button>
    </div>

  </div>
</form>

      {loading && <LoadingSteps />}
      {result && !loading && <AnalysisResult result={result} />}
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Poppins, sans-serif'},
  headerWrap: { display: 'flex', justifyContent: 'space-between' },
  breadcrumb: { fontSize: 11 },
  title: { fontSize: 30 },
  sub: { fontSize: 13 },
aiBadge: {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,

  padding: '5px 14px',
  borderRadius: 999,

  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',

  color: '#b45309',

  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
},
aiBadgeDot: {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#f59e0b',
  flexShrink: 0,

  boxShadow: `
    0 0 4px #f59e0b,
    0 0 6px rgba(245,158,11,0.7),
    0 0 8px rgba(245,158,11,0.5)
  `,

  animation: 'pulseGlow 2s ease-in-out infinite',
},
  formCard: { padding: 20 },
  formCardLabel: { fontSize: 12 },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: 13 },
  opt: { fontSize: 11 },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 10, top: '50%' },
  errorBox: { color: 'red' },
  formFooter: { marginTop: 10 },
  loadingCard: { padding: 20 },
  loadingHeader: { display: 'flex', gap: 10 },
  loadingTitle: { fontWeight: 'bold' },
  loadingSubtitle: { fontSize: 12 },
  stepList: { marginTop: 10 },
  step: { display: 'flex', gap: 10 },
  stepDot: { width: 20, height: 20 },
  stepLabel: {}
};