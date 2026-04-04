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
    const trimmedUsername = githubUsername.trim();
    const trimmedPortfolio = portfolioUrl.trim();

    // Fix: Allow submission if at least one field is present
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

      const res = await api.post('/analysis/run', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setGithubUsername('');
    setPortfolioUrl('');
    setResult(null);
    setError('');
  };

  const isSubmitDisabled = loading || (!githubUsername.trim() && !portfolioUrl.trim());

  return (
    <div style={s.page}>
      <div className="fade-up">
        <h1 className="page-title">Analyze a Profile</h1>
        <p className="page-sub">
          Enter a GitHub username, a Portfolio URL, or both for an AI-powered score.
        </p>
      </div>

      <div className="card fade-up" style={{ ...s.formCard, animationDelay: '40ms' }}>
        <div style={s.cardHeader}>
          <div style={s.cardHeaderIcon}>
            <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div>
            <div style={s.cardHeaderTitle}>Profile Analyzer</div>
            <div style={s.cardHeaderSub}>Powered by AI · Provide at least one field to begin</div>
          </div>
        </div>

        <div style={s.divider} />

        <form onSubmit={handleSubmit} style={s.form}>
          <div className="analyze-field-row" style={s.fieldRow}>
            <div style={s.field}>
              <label style={s.label}>
                GitHub Username
                <span style={s.optionalBadge}>optional</span>
              </label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}><GitHubIcon /></span>
                <input
                  className="premium-input"
                  type="text"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  style={{ paddingLeft: 42 }}
                  autoFocus
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>
                Portfolio URL
                <span style={s.optionalBadge}>optional</span>
              </label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}><GlobeIcon /></span>
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

          {error && (
            <div className="error-box" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="analyze-footer" style={s.formFooter}>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="btn-primary"
              style={{
                padding: '11px 26px',
                fontSize: 13.5,
                opacity: isSubmitDisabled ? 0.65 : 1,
                cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <><Spinner size={16} color="white" /> Analyzing…</> : <><SearchIcon /> Analyze Profile</>}
            </button>

            {result && !loading && (
              <button type="button" onClick={handleClear} className="btn-ghost" style={{ padding: '11px 18px' }}>
                ✕ Clear Results
              </button>
            )}
          </div>
        </form>
      </div>
      {/* ... rest of original icons and styles remain the same ... */}
    </div>
  );
}