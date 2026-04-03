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

  // Auto-run if user= param provided
  useEffect(() => {
    const u = searchParams.get('user');
    if (u) { setGithubUsername(u); }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUsername.trim()) {
      setError('GitHub username is required');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
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
    <div style={styles.page}>
      <div className="fade-up">
        <h1 style={styles.title}>Analyze a Profile</h1>
        <p style={styles.sub}>
          Enter a GitHub username to get a score, strengths, weaknesses, and suggestions.
          {!user && ' Sign in to save results.'}
        </p>
      </div>

      {/* Input Form */}
      <div style={styles.formCard} className="fade-up">
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>GitHub Username *</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </span>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. torvalds"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Portfolio URL <span style={styles.optional}>(optional)</span></label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                style={styles.input}
              />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? (
              <><Spinner size={18} color="white" /> Analyzing…</>
            ) : (
              '🔍 Analyze Profile'
            )}
          </button>
        </form>

        {!user && (
          <div style={styles.guestNote}>
            ℹ️ Results won't be saved. <a href="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>Sign in</a> to track history.
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={styles.loadingPanel} className="fade-up">
          <Spinner size={40} />
          <div style={styles.loadingSteps}>
            <p style={styles.loadingText}>Fetching GitHub data…</p>
            <p style={styles.loadingTextFaint}>Calculating score…</p>
            <p style={styles.loadingTextFaint}>Generating insights…</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ animation: 'fadeUp 0.5s ease both' }}>
          {result.saved && (
            <div style={styles.savedBadge}>✅ Analysis saved to your history</div>
          )}
          <AnalysisResult result={result} />
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-dark)' },
  sub: { fontSize: 14, color: 'var(--text-light)', marginTop: 6 },
  formCard: {
    background: 'white', borderRadius: 'var(--radius)', padding: 28,
    boxShadow: 'var(--shadow-sm)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text-mid)' },
  optional: { fontWeight: 400, color: 'var(--text-light)' },
  inputWrapper: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--text-light)', display: 'flex',
  },
  input: {
    width: '100%', padding: '12px 14px 12px 44px',
    borderRadius: 12, border: '1.5px solid var(--cream-dark)',
    fontSize: 14, color: 'var(--text-dark)',
    background: 'var(--cream)', outline: 'none',
    transition: 'border-color 0.15s',
  },
  error: {
    background: '#fef2f2', color: '#ef4444', padding: '10px 14px',
    borderRadius: 10, fontSize: 13,
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '14px 28px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
    color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  guestNote: {
    marginTop: 16, padding: '10px 14px',
    background: 'var(--orange-pale)', borderRadius: 10,
    fontSize: 13, color: 'var(--text-mid)',
  },
  loadingPanel: {
    background: 'white', borderRadius: 'var(--radius)', padding: 32,
    boxShadow: 'var(--shadow-sm)',
    display: 'flex', alignItems: 'center', gap: 24,
  },
  loadingSteps: { display: 'flex', flexDirection: 'column', gap: 4 },
  loadingText: { fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' },
  loadingTextFaint: { fontSize: 13, color: 'var(--text-light)' },
  savedBadge: {
    background: '#f0fdf4', color: '#22c55e', padding: '10px 16px',
    borderRadius: 10, fontSize: 13, fontWeight: 500, marginBottom: 8,
  },
};
