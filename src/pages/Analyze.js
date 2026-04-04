import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import AnalysisResult from '../components/AnalysisResult';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

export default function Analyze() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [githubUsername, setGithubUsername] = useState(searchParams.get('user') || '');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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

      {/* ── Header ── */}
      <div className="fade-up">
        <h1 className="page-title">Analyze a Profile</h1>
        <p className="page-sub">Enter a GitHub username to get an instant score with AI-powered feedback.</p>
      </div>

      {/* ── Form card ── */}
      <div className="card fade-up" style={{ ...s.formCard, animationDelay: '40ms' }}>

        {/* Card inner header */}
        <div style={s.cardHeader}>
          <div style={s.cardHeaderIcon}>
            <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div>
            <div style={s.cardHeaderTitle}>Profile Analyzer</div>
            <div style={s.cardHeaderSub}>Powered by AI • Instant results</div>
          </div>
        </div>

        <div style={s.divider} />

        <form onSubmit={handleSubmit} style={s.form}>
          <div className="analyze-field-row" style={s.fieldRow}>

            {/* GitHub username */}
            <div style={s.field}>
              <label style={s.label}>
                GitHub Username
                <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
              </label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="text"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Portfolio URL */}
            <div style={s.field}>
              <label style={s.label}>
                Portfolio URL
                <span style={s.optLabel}>(optional · +10 pts)</span>
              </label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="url"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="analyze-footer" style={s.formFooter}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '11px 26px', fontSize: 13.5, opacity: loading ? 0.75 : 1 }}
            >
              {loading
                ? <><Spinner size={16} color="white" /> Analyzing…</>
                : <><SearchIcon /> Analyze Profile</>
              }
            </button>

            {!user && (
              <div className="info-box" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>ℹ️</span>
                <span>
                  Results won't be saved.{' '}
                  <a href="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600, textDecoration: 'none' }}>
                    Sign in
                  </a>{' '}
                  to track history.
                </span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* ── Loading panel ── */}
      {loading && (
        <div className="card fade-up" style={s.loadingPanel}>
          <div style={s.loadingSpinWrap}><Spinner size={32} /></div>
          <div>
            <div style={s.loadingTitle}>Fetching and analyzing…</div>
            <div style={s.loadingSteps}>
              Fetching GitHub data &nbsp;→&nbsp; Calculating score &nbsp;→&nbsp; Generating insights
            </div>
          </div>
        </div>
      )}

      {/* ── Saved badge ── */}
      {result && !loading && result.saved && (
        <div className="success-box fade-up" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✅</span> Analysis saved to your history
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && <AnalysisResult result={result} />}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 18 },

  /* form card */
  formCard: { padding: '24px 28px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18 },
  cardHeaderIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'rgba(245,158,11,0.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardHeaderTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text-900)', letterSpacing: '-0.2px' },
  cardHeaderSub:   { fontSize: 12, color: 'var(--text-300)', marginTop: 1 },
  divider: { height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 20 },

  form:     { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:    { display: 'flex', flexDirection: 'column', gap: 7 },
  label:    { fontSize: 12.5, fontWeight: 600, color: 'var(--text-700)' },
  optLabel: { marginLeft: 6, fontWeight: 400, color: 'var(--text-300)', fontSize: 11.5 },
  inputWrap:{ position: 'relative' },
  inputIcon:{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1, pointerEvents: 'none' },

  formFooter: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', paddingTop: 2 },

  /* loading */
  loadingPanel:   { padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 },
  loadingSpinWrap:{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.07)', borderRadius: 14, flexShrink: 0 },
  loadingTitle:   { fontSize: 14.5, fontWeight: 600, color: 'var(--text-900)', marginBottom: 4 },
  loadingSteps:   { fontSize: 12.5, color: 'var(--text-300)' },
};
