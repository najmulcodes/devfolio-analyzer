import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import AnalysisResult from '../components/AnalysisResult';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

/* ─── Usage quota indicator (non-intrusive, same design tokens) ─── */
function UsagePill({ used, limit, isGuest }) {
  const remaining = limit - used;
  const pct = Math.round((used / limit) * 100);
  const color = remaining === 0 ? '#ef4444' : remaining === 1 ? '#f59e0b' : '#22c55e';

  return (
    <div style={usageS.wrap}>
      <div style={usageS.label}>
        <span style={{ color, fontWeight: 700 }}>{remaining}</span>
        <span style={usageS.sub}> / {limit} analyses remaining today</span>
        {isGuest && <span style={usageS.guestHint}> — sign in for {limit + 2}</span>}
      </div>
      <div style={usageS.track}>
        <div style={{ ...usageS.fill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const usageS = {
  wrap:      { marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', borderRadius: 10 },
  label:     { fontSize: 12.5, marginBottom: 6, color: 'var(--text-700)' },
  sub:       { fontWeight: 400, color: 'var(--text-500)' },
  guestHint: { color: 'var(--text-300)', fontStyle: 'italic' },
  track:     { height: 5, background: 'rgba(180,140,90,0.14)', borderRadius: 3, overflow: 'hidden' },
  fill:      { height: '100%', borderRadius: 3, transition: 'width 0.5s ease' },
};

/* ─── Multi-score header (shown when combined mode) ─── */
function ScoreSummary({ result }) {
  const { mode, githubScore, portfolioScore, combinedScore, sources } = result;
  if (mode === 'github' || mode === 'portfolio') return null; // single score handled by AnalysisResult

  return (
    <div style={ss.wrap} className="glass-card fade-up">
      <div style={ss.label}>Combined Analysis</div>
      <div style={ss.scoreRow}>
        {githubScore !== null && (
          <div style={ss.scoreBlock}>
            <div style={ss.scoreVal}>{githubScore}</div>
            <div style={ss.scoreSub}>GitHub Score</div>
          </div>
        )}
        <div style={ss.divider}>+</div>
        {portfolioScore !== null && (
          <div style={ss.scoreBlock}>
            <div style={ss.scoreVal}>{portfolioScore}</div>
            <div style={ss.scoreSub}>Portfolio Score</div>
          </div>
        )}
        <div style={ss.divider}>=</div>
        <div style={{ ...ss.scoreBlock, ...ss.combinedBlock }}>
          <div style={{ ...ss.scoreVal, fontSize: 40, color: 'var(--amber)' }}>{combinedScore}</div>
          <div style={ss.scoreSub}>Combined (60/40)</div>
        </div>
      </div>
      <div style={ss.formula}>
        Weighted: GitHub × 60% + Portfolio × 40%
      </div>
    </div>
  );
}

const ss = {
  wrap:          { padding: '22px 28px', marginBottom: 4 },
  label:         { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-900)', marginBottom: 16 },
  scoreRow:      { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  scoreBlock:    { textAlign: 'center', padding: '12px 20px', background: 'rgba(245,158,11,0.06)', borderRadius: 14 },
  combinedBlock: { background: 'rgba(245,158,11,0.12)', border: '1.5px solid rgba(245,158,11,0.25)' },
  scoreVal:      { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-900)', lineHeight: 1 },
  scoreSub:      { fontSize: 11.5, color: 'var(--text-500)', marginTop: 5, fontWeight: 500 },
  divider:       { fontSize: 24, color: 'var(--text-300)', fontWeight: 700 },
  formula:       { marginTop: 14, fontSize: 12, color: 'var(--text-300)', fontStyle: 'italic' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   Main Analyze page
   ─────────────────────────────────────────────────────────────────────────
   Logic changes vs original:
     • Validation: GitHub OR Portfolio (not both required)
     • Error handling: rate limit (429) shown clearly
     • Usage quota fetched on mount and updated after analysis
     • Multi-score result passed to AnalysisResult (score field = primary)
   UI: unchanged (same class names, same style objects, same layout)
═══════════════════════════════════════════════════════════════════════════ */
export default function Analyze() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [githubUsername, setGithubUsername] = useState(searchParams.get('user') || '');
  const [portfolioUrl, setPortfolioUrl]     = useState('');
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState(null);
  const [error, setError]                   = useState('');
  const [usageInfo, setUsageInfo]           = useState(null);
  const [rateLimited, setRateLimited]       = useState(false);

  // Pre-fill from URL param
  useEffect(() => {
    const u = searchParams.get('user');
    if (u) setGithubUsername(u);
  }, [searchParams]);

  // Fetch usage quota on mount
  useEffect(() => {
    api.get('/analysis/usage')
      .then(r => setUsageInfo(r.data))
      .catch(() => {}); // non-critical — silently fail
  }, [user]);

  /* ── Validation (updated: either input is sufficient) ── */
  const validate = () => {
    const hasGithub    = githubUsername.trim().length > 0;
    const hasPortfolio = portfolioUrl.trim().length > 0;

    if (!hasGithub && !hasPortfolio) {
      setError('Please enter a GitHub username, a portfolio URL, or both.');
      return false;
    }

    if (hasPortfolio) {
      try {
        new URL(portfolioUrl.trim()); // throws if not a valid URL
      } catch {
        setError('Portfolio URL must be a valid URL (e.g. https://yoursite.com)');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setError('');
    setResult(null);
    setRateLimited(false);
    setLoading(true);

    try {
      const payload = {};
      if (githubUsername.trim()) payload.githubUsername = githubUsername.trim();
      if (portfolioUrl.trim())   payload.portfolioUrl   = portfolioUrl.trim();

      const res = await api.post('/analysis/run', payload);
      setResult(res.data);

      // Refresh usage after successful analysis
      api.get('/analysis/usage')
        .then(r => setUsageInfo(r.data))
        .catch(() => {});
    } catch (err) {
      // Handle rate limit specially
      if (err.message?.toLowerCase().includes('daily analysis limit')) {
        setRateLimited(true);
        setError(err.message);
        api.get('/analysis/usage').then(r => setUsageInfo(r.data)).catch(() => {});
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived state ── */
  const hasGithub     = githubUsername.trim().length > 0;
  const hasPortfolio  = portfolioUrl.trim().length > 0;
  const canSubmit     = (hasGithub || hasPortfolio) && !loading;
  const analysisMode  = hasGithub && hasPortfolio ? 'both' : hasGithub ? 'github' : hasPortfolio ? 'portfolio' : null;

  const modeBadge = {
    both:      '⚡ GitHub + Portfolio',
    github:    '🐙 GitHub only',
    portfolio: '🌐 Portfolio only',
  };

  return (
    <div style={s.page}>

      {/* Header — unchanged */}
      <div className="fade-up" style={s.header}>
        <h1 style={s.title}>Analyze a Profile</h1>
        <p style={s.sub}>
          Enter a GitHub username, a portfolio URL, or both for a combined score.
        </p>
      </div>

      {/* Form card — same layout, updated validation behavior */}
      <div className="glass-card fade-up" style={s.formCard}>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.fieldRow}>

            {/* GitHub username */}
            <div style={s.field}>
              <label style={s.label}>
                GitHub Username
                <span style={s.opt}> (optional)</span>
              </label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="#b0a090" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </span>
                <input
                  className="premium-input"
                  type="text"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            {/* Portfolio URL */}
            <div style={s.field}>
              <label style={s.label}>
                Portfolio URL
                <span style={s.opt}> (optional)</span>
              </label>
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
                  type="url"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>
          </div>

          {/* Mode indicator badge */}
          {analysisMode && (
            <div style={s.modeBadge}>
              {modeBadge[analysisMode]}
              {analysisMode === 'both' && <span style={s.modeNote}> — combined score (60% GitHub + 40% Portfolio)</span>}
            </div>
          )}

          {/* Error / rate limit message */}
          {error && (
            <div style={{ ...s.errorBox, ...(rateLimited ? s.rateLimitBox : {}) }}>
              {rateLimited && <div style={s.rateLimitIcon}>🚫</div>}
              <div>
                <div style={rateLimited ? s.rateLimitTitle : {}}>{error}</div>
                {rateLimited && !user && (
                  <div style={s.rateLimitHint}>
                    <a href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</a> to get 5 analyses per day instead of 3.
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={s.formFooter}>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: 14.5, opacity: canSubmit ? 1 : 0.65 }}
            >
              {loading
                ? <><Spinner size={17} color="white" /> Analyzing…</>
                : analysisMode === 'both'
                  ? '⚡ Analyze Both'
                  : '🔍 Analyze Profile'}
            </button>

            {!user && (
              <div style={s.guestNote}>
                Results won't be saved. <a href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</a> to track history.
              </div>
            )}
          </div>
        </form>

        {/* Usage quota indicator */}
        {usageInfo && (
          <UsagePill
            used={usageInfo.used}
            limit={usageInfo.limit}
            isGuest={usageInfo.isGuest}
          />
        )}
      </div>

      {/* Loading panel — unchanged */}
      {loading && (
        <div className="glass-card fade-up" style={s.loadingPanel}>
          <Spinner size={36} />
          <div>
            <div style={s.loadingTitle}>
              {analysisMode === 'both'
                ? 'Fetching GitHub + scanning portfolio…'
                : analysisMode === 'github'
                  ? 'Fetching GitHub data…'
                  : 'Scanning portfolio website…'}
            </div>
            <div style={s.loadingSteps}>
              {analysisMode === 'both'
                ? 'GitHub data → Portfolio scan → Scoring → AI insights'
                : 'Fetching data → Calculating score → Generating insights'}
            </div>
          </div>
        </div>
      )}

      {/* Saved badge */}
      {result && !loading && result.saved && (
        <div style={s.savedBadge} className="fade-up">✅ Analysis saved to your history</div>
      )}

      {/* Combined score summary (shown only in combined mode) */}
      {result && !loading && result.mode === 'combined' && (
        <ScoreSummary result={result} />
      )}

      {/* Main result panel — same component, backward-compat */}
      {result && !loading && <AnalysisResult result={result} />}
    </div>
  );
}

/* ─── Styles (same as before — no visual changes) ─── */
const s = {
  page:         { display: 'flex', flexDirection: 'column', gap: 20 },
  header:       {},
  title:        { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-900)' },
  sub:          { fontSize: 13.5, color: 'var(--text-500)', marginTop: 5 },
  formCard:     { padding: '26px 28px' },
  form:         { display: 'flex', flexDirection: 'column', gap: 18 },
  fieldRow:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:        { display: 'flex', flexDirection: 'column', gap: 7 },
  label:        { fontSize: 12.5, fontWeight: 600, color: 'var(--text-700)' },
  opt:          { color: 'var(--text-300)', fontWeight: 400 },
  inputWrap:    { position: 'relative' },
  inputIcon:    { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1 },
  modeBadge:    {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
    color: '#92400e', fontSize: 12.5, fontWeight: 600,
    padding: '6px 14px', borderRadius: 20, alignSelf: 'flex-start',
  },
  modeNote:     { fontWeight: 400, color: '#b07830', fontSize: 12 },
  errorBox:     { background: 'rgba(239,68,68,0.07)', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13 },
  rateLimitBox: {
    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 12, padding: '14px 16px',
    display: 'flex', alignItems: 'flex-start', gap: 10,
  },
  rateLimitIcon:  { fontSize: 20, flexShrink: 0 },
  rateLimitTitle: { fontWeight: 700, color: '#ef4444', marginBottom: 4 },
  rateLimitHint:  { fontSize: 12.5, color: 'var(--text-500)', marginTop: 4 },
  formFooter:   { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  guestNote:    { fontSize: 13, color: 'var(--text-500)', padding: '9px 14px', background: 'rgba(245,158,11,0.07)', borderRadius: 10 },
  loadingPanel: { padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 },
  loadingTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-900)', marginBottom: 5 },
  loadingSteps: { fontSize: 12.5, color: 'var(--text-500)' },
  savedBadge:   { background: 'rgba(34,197,94,0.08)', color: '#16a34a', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500 },
};
