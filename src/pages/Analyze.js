import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import AnalysisResult from '../components/AnalysisResult';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

// Icons (Ensure these components exist or replace with your SVG/Icon library)
const GitHubIcon = () => <span>📁</span>; 
const GlobeIcon = () => <span>🌐</span>;
const SearchIcon = () => <span>🔍</span>;

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

    // Logic: At least one must be present
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

      <div className="card fade-up" style={s.formCard}>
        <div style={s.cardHeader}>
          <div>
            <div style={s.cardHeaderTitle}>Profile Analyzer</div>
            <div style={s.cardHeaderSub}>Provide at least one field to begin</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.fieldRow}>
            {/* GitHub field */}
            <div style={s.field}>
              <label style={s.label}>
                GitHub Username
                <span style={s.optionalBadge}>optional</span>
              </label>
              <div style={s.inputWrap}>
                <input
                  className="premium-input"
                  type="text"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                />
              </div>
            </div>

            {/* Portfolio field */}
            <div style={s.field}>
              <label style={s.label}>
                Portfolio URL
                <span style={s.optionalBadge}>optional</span>
              </label>
              <div style={s.inputWrap}>
                <input
                  className="premium-input"
                  type="url"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                />
              </div>
            </div>
          </div>

          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          <div style={s.formFooter}>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="btn-primary"
              style={{
                opacity: isSubmitDisabled ? 0.6 : 1,
                cursor: isSubmitDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? <Spinner size={16} color="white" /> : 'Analyze Profile'}
            </button>

            {result && !loading && (
              <button type="button" onClick={handleClear} className="btn-ghost">
                ✕ Clear Results
              </button>
            )}
          </div>
        </form>
      </div>

      {result && <AnalysisResult result={result} />}
    </div>
  );
}

// THE MISSING PIECE: Define the "s" object
const s = {
  page: { maxWidth: 900, margin: '0 auto', padding: '40px 20px' },
  formCard: { padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 32 },
  cardHeader: { marginBottom: 24 },
  cardHeaderTitle: { fontSize: 20, fontWeight: 700, color: '#111' },
  cardHeaderSub: { fontSize: 14, color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: '#444', display: 'flex', justifyContent: 'space-between' },
  optionalBadge: { fontWeight: 400, color: '#999', fontSize: 11, textTransform: 'uppercase' },
  inputWrap: { position: 'relative' },
  errorBox: { padding: '12px', background: '#fff5f5', color: '#e53e3e', borderRadius: 8, fontSize: 14 },
  formFooter: { display: 'flex', gap: 12, marginTop: 10 }
};