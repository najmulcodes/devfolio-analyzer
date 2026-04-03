import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ScoreRing from '../components/ScoreRing';
import { PageLoader } from '../components/Spinner';
import { formatDate } from '../utils/helpers';

export default function History() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 10;

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/analysis/history?page=${p}&limit=${limit}`);
      setAnalyses(res.data.analyses);
      setTotal(res.data.total);
      setPage(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  if (loading) return <PageLoader message="Loading history..." />;

  return (
    <div style={styles.page}>
      <div className="fade-up">
        <h1 style={styles.title}>Analysis History</h1>
        <p style={styles.sub}>{total} total {total === 1 ? 'analysis' : 'analyses'} saved</p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {analyses.length === 0 && !loading && (
        <div style={styles.emptyCard} className="fade-up">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
          <h2 style={styles.emptyTitle}>No history yet</h2>
          <p style={styles.emptySub}>Analyze a profile to start building your history.</p>
          <button onClick={() => navigate('/analyze')} style={styles.btn}>
            Analyze a Profile
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {analyses.map((a, i) => (
          <div
            key={a._id}
            style={{ ...styles.card, animationDelay: `${i * 60}ms` }}
            className="fade-up"
          >
            <div style={styles.cardLeft}>
              <ScoreRing score={a.score} size={80} />
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardUsername}>@{a.githubUsername}</div>
              <div style={styles.cardDate}>{formatDate(a.createdAt)}</div>
              {a.strengths?.length > 0 && (
                <div style={styles.cardStrength}>✓ {a.strengths[0]}</div>
              )}
              {a.weaknesses?.length > 0 && (
                <div style={styles.cardWeakness}>✗ {a.weaknesses[0]}</div>
              )}
              {a.aiGenerated && <span style={styles.aiTag}>AI</span>}
            </div>
            <div style={styles.cardActions}>
              <button
                onClick={() => navigate(`/analyze?user=${a.githubUsername}`)}
                style={styles.rerunBtn}
              >
                Re-run
              </button>
              <a
                href={`https://github.com/${a.githubUsername}`}
                target="_blank" rel="noreferrer"
                style={styles.ghLink}
              >
                GitHub ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div style={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => load(page - 1)}
            style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span style={styles.pageInfo}>Page {page} of {Math.ceil(total / limit)}</span>
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => load(page + 1)}
            style={{ ...styles.pageBtn, opacity: page >= Math.ceil(total / limit) ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-dark)' },
  sub: { fontSize: 14, color: 'var(--text-light)', marginTop: 4 },
  error: { background: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: 10, fontSize: 13 },
  grid: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    background: 'white', borderRadius: 'var(--radius)', padding: '20px 24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex', alignItems: 'center', gap: 20,
  },
  cardLeft: { flexShrink: 0 },
  cardBody: { flex: 1, minWidth: 0 },
  cardUsername: { fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--text-dark)' },
  cardDate: { fontSize: 12, color: 'var(--text-light)', marginTop: 2, marginBottom: 6 },
  cardStrength: { fontSize: 13, color: '#22c55e', marginBottom: 2 },
  cardWeakness: { fontSize: 13, color: '#ef4444' },
  aiTag: {
    display: 'inline-block', marginTop: 6,
    background: 'var(--orange-pale)', color: 'var(--orange)',
    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
  },
  cardActions: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
  rerunBtn: {
    padding: '8px 16px', borderRadius: 10, border: 'none',
    background: 'var(--orange)', color: 'white',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  ghLink: {
    padding: '7px 16px', borderRadius: 10,
    border: '1.5px solid var(--cream-dark)',
    color: 'var(--text-mid)', fontSize: 13, fontWeight: 500, textAlign: 'center',
  },
  emptyCard: {
    background: 'white', borderRadius: 'var(--radius)', padding: '48px 40px',
    boxShadow: 'var(--shadow-sm)', textAlign: 'center',
  },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 },
  emptySub: { fontSize: 14, color: 'var(--text-light)', marginBottom: 24 },
  btn: {
    padding: '12px 24px', borderRadius: 12, border: 'none',
    background: 'var(--orange)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 },
  pageBtn: {
    padding: '8px 20px', borderRadius: 10,
    border: '1.5px solid var(--cream-dark)', background: 'white',
    color: 'var(--text-mid)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
  pageInfo: { fontSize: 13, color: 'var(--text-light)' },
};
