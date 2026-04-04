import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ScoreRing from '../components/ScoreRing';
import { PageLoader } from '../components/Spinner';
import { formatDate, getScoreColor } from '../utils/helpers';

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
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1); }, []);

  if (loading) return <PageLoader message="Loading history…" />;

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Analysis History</h1>
          <p className="page-sub">
            {total} total {total === 1 ? 'analysis' : 'analyses'} saved
          </p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Analysis
        </button>
      </div>

      {error && <div className="error-box fade-up">{error}</div>}

      {/* ── Empty state ── */}
      {analyses.length === 0 && !loading && (
        <div className="card fade-up" style={s.emptyCard}>
          <div style={s.emptyEmoji}>📂</div>
          <h2 style={s.emptyTitle}>No history yet</h2>
          <p style={s.emptySub}>Analyze a profile to start building your history.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary">
            Analyze a Profile
          </button>
        </div>
      )}

      {/* ── Cards grid ── */}
      <div style={s.grid}>
        {analyses.map((a, i) => (
          <div
            key={a._id}
            className="card glass-card-lift fade-up history-card"
            style={{ ...s.card, animationDelay: `${i * 45}ms` }}
          >
            {/* Score ring */}
            <div style={s.cardLeft}>
              <ScoreRing score={a.score} size={74} />
            </div>

            {/* Info */}
            <div style={s.cardBody}>
              <div style={s.cardTop}>
                <div style={s.cardUsername}>@{a.githubUsername}</div>
                {a.aiGenerated && <span className="badge-amber">✨ AI</span>}
              </div>
              <div style={s.cardDate}>{formatDate(a.createdAt)}</div>

              {a.strengths?.[0] && (
                <div style={s.factRow}>
                  <span style={{ color: '#22c55e', fontSize: 11, flexShrink: 0 }}>✓</span>
                  <span style={s.factText}>{a.strengths[0]}</span>
                </div>
              )}
              {a.weaknesses?.[0] && (
                <div style={s.factRow}>
                  <span style={{ color: '#ef4444', fontSize: 11, flexShrink: 0 }}>✗</span>
                  <span style={s.factText}>{a.weaknesses[0]}</span>
                </div>
              )}
            </div>

            {/* Score badge + actions */}
            <div className="history-card-right" style={s.cardRight}>
              <div style={{
                ...s.scoreBadge,
                background: getScoreColor(a.score) + '14',
                color: getScoreColor(a.score),
              }}>
                {a.score}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 1 }}>/100</span>
              </div>
              <button
                onClick={() => navigate(`/analyze?user=${a.githubUsername}`)}
                className="btn-ghost"
                style={{ padding: '6px 13px', fontSize: 12 }}
              >
                Re-run
              </button>
              <a
                href={`https://github.com/${a.githubUsername}`}
                target="_blank" rel="noreferrer"
                style={s.ghLink}
              >
                GitHub ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      {total > limit && (
        <div style={s.pagination}>
          <button
            disabled={page === 1}
            onClick={() => load(page - 1)}
            className="btn-ghost"
            style={{ opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span style={s.pageInfo}>Page {page} of {Math.ceil(total / limit)}</span>
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => load(page + 1)}
            className="btn-ghost"
            style={{ opacity: page >= Math.ceil(total / limit) ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 16 },

  emptyCard:  { padding: '52px 44px', textAlign: 'center', maxWidth: 420, margin: '0 auto' },
  emptyEmoji: { fontSize: 46, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: 'var(--text-900)', marginBottom: 8 },
  emptySub:   { fontSize: 13.5, color: 'var(--text-500)', marginBottom: 22, lineHeight: 1.6 },

  grid: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 18 },

  cardLeft: { flexShrink: 0 },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop:  { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 },
  cardUsername: { fontSize: 15, fontWeight: 700, color: 'var(--text-900)', letterSpacing: '-0.2px' },
  cardDate:     { fontSize: 11.5, color: 'var(--text-300)', marginBottom: 8 },

  factRow:  { display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 3 },
  factText: { fontSize: 12.5, color: 'var(--text-500)', lineHeight: 1.45 },

  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  scoreBadge:{ fontSize: 19, fontWeight: 700, padding: '5px 11px', borderRadius: 10 },
  ghLink:    { fontSize: 12, color: 'var(--text-300)', fontWeight: 500, textDecoration: 'none' },

  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 4 },
  pageInfo:   { fontSize: 13, color: 'var(--text-500)' },
};
