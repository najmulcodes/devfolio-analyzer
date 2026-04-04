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

      {/* Header */}
      <div className="fade-up" style={s.header}>
        <h1 style={s.title}>Analyze a Profile</h1>
        <p style={s.sub}>Enter a GitHub username to get an instant score with AI-powered feedback.</p>
      </div>

      {/* Form */}
      <div className="glass-card fade-up" style={s.formCard}>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.fieldRow}>

            {/* GitHub username */}
            <div style={s.field}>
              <label style={s.label}>GitHub Username <span style={s.req}>*</span></label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="text" value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            {/* Portfolio URL */}
            <div style={s.field}>
              <label style={s.label}>Portfolio URL <span style={s.opt}>(optional +10 pts)</span></label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="url" value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          <div style={s.formFooter}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 28px', fontSize: 14.5, opacity: loading ? 0.75 : 1 }}>
              {loading ? <><Spinner size={17} color="white" /> Analyzing…</> : '🔍 Analyze Profile'}
            </button>
            {!user && (
              <div style={s.guestNote}>
                ℹ️ Results won't be saved. <a href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</a> to track history.
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Loading panel */}
      {loading && (
        <div className="glass-card fade-up" style={s.loadingPanel}>
          <Spinner size={36} />
          <div>
            <div style={s.loadingTitle}>Fetching and analyzing…</div>
            <div style={s.loadingSteps}>
              Fetching GitHub data → Calculating score → Generating insights
            </div>
          </div>
        </div>
      )}

      {/* Saved badge */}
      {result && !loading && result.saved && (
        <div style={s.savedBadge} className="fade-up">✅ Analysis saved to your history</div>
      )}

      {/* Results */}
      {result && !loading && <AnalysisResult result={result} />}
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: {},
  title: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-900)' },
  sub: { fontSize: 13.5, color: 'var(--text-500)', marginTop: 5 },
  formCard: { padding: '26px 28px' },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-700)' },
  req: { color: '#ef4444' },
  opt: { color: 'var(--text-300)', fontWeight: 400 },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1 },
  errorBox: { background: 'rgba(239,68,68,0.07)', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13 },
  formFooter: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  guestNote: { fontSize: 13, color: 'var(--text-500)', padding: '9px 14px', background: 'rgba(245,158,11,0.07)', borderRadius: 10 },
  loadingPanel: { padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 },
  loadingTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-900)', marginBottom: 5 },
  loadingSteps: { fontSize: 12.5, color: 'var(--text-500)' },
  savedBadge: { background: 'rgba(34,197,94,0.08)', color: '#16a34a', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500 },
};
