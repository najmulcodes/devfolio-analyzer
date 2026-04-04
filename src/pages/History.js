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

      <div className="fade-up" style={s.header}>
        <div>
          <h1 style={s.title}>Analysis History</h1>
          <p style={s.sub}>{total} total {total === 1 ? 'analysis' : 'analyses'} saved</p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary">+ New Analysis</button>
      </div>

      {error && <div style={s.errorBox}>{error}</div>}

      {analyses.length === 0 && !loading && (
        <div className="glass-card fade-up" style={s.emptyCard}>
          <div style={s.emptyEmoji}>📂</div>
          <h2 style={s.emptyTitle}>No history yet</h2>
          <p style={s.emptySub}>Analyze a profile to start building your history.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary">Analyze a Profile</button>
        </div>
      )}

      <div style={s.grid}>
        {analyses.map((a, i) => (
          <div key={a._id} className="glass-card glass-card-lift fade-up"
            style={{ ...s.card, animationDelay: `${i * 55}ms` }}>

            {/* Score ring */}
            <div style={s.cardLeft}>
              <ScoreRing score={a.score} size={78} />
            </div>

            {/* Info */}
            <div style={s.cardBody}>
              <div style={s.cardTop}>
                <div style={s.cardUsername}>@{a.githubUsername}</div>
                {a.aiGenerated && <span style={s.aiPill}>✨ AI</span>}
              </div>
              <div style={s.cardDate}>{formatDate(a.createdAt)}</div>
              {a.strengths?.[0] && (
                <div style={s.strength}>
                  <span style={{ color: '#22c55e', fontSize: 12 }}>✓</span> {a.strengths[0]}
                </div>
              )}
              {a.weaknesses?.[0] && (
                <div style={s.weakness}>
                  <span style={{ color: '#ef4444', fontSize: 12 }}>✗</span> {a.weaknesses[0]}
                </div>
              )}
            </div>

            {/* Score badge + actions */}
            <div style={s.cardRight}>
              <div style={{ ...s.scoreBadge, background: getScoreColor(a.score) + '14', color: getScoreColor(a.score) }}>
                {a.score}<span style={{ fontSize: 11, fontWeight: 400 }}>/100</span>
              </div>
              <button onClick={() => navigate(`/analyze?user=${a.githubUsername}`)} className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>
                Re-run
              </button>
              <a href={`https://github.com/${a.githubUsername}`} target="_blank" rel="noreferrer"
                style={s.ghLink}>GitHub ↗</a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div style={s.pagination}>
          <button disabled={page === 1} onClick={() => load(page - 1)}
            style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
          <span style={s.pageInfo}>Page {page} of {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => load(page + 1)}
            style={{ ...s.pageBtn, opacity: page >= Math.ceil(total / limit) ? 0.4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 18 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-900)' },
  sub: { fontSize: 13.5, color: 'var(--text-500)', marginTop: 4 },
  errorBox: { background: 'rgba(239,68,68,0.07)', color: '#ef4444', padding: '11px 16px', borderRadius: 12, fontSize: 13 },
  grid: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: { padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 },
  cardLeft: { flexShrink: 0 },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardUsername: { fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-900)' },
  aiPill: { background: 'rgba(245,158,11,0.1)', color: '#92400e', fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20 },
  cardDate: { fontSize: 11.5, color: 'var(--text-300)', marginBottom: 8 },
  strength: { fontSize: 12.5, color: 'var(--text-500)', marginBottom: 3, display: 'flex', gap: 6, alignItems: 'flex-start' },
  weakness: { fontSize: 12.5, color: 'var(--text-500)', display: 'flex', gap: 6, alignItems: 'flex-start' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  scoreBadge: { fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, padding: '5px 12px', borderRadius: 12 },
  ghLink: { fontSize: 12, color: 'var(--text-300)', fontWeight: 500 },
  emptyCard: { padding: '52px', textAlign: 'center', maxWidth: 420, margin: '0 auto' },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text-900)', marginBottom: 8 },
  emptySub: { fontSize: 14, color: 'var(--text-500)', marginBottom: 24 },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 },
  pageBtn: { padding: '8px 18px', borderRadius: 10, border: '1.5px solid rgba(180,140,90,0.18)', background: 'rgba(255,255,255,0.6)', color: 'var(--text-700)', fontSize: 13, fontWeight: 500, cursor: 'pointer', backdropFilter: 'blur(8px)' },
  pageInfo: { fontSize: 13, color: 'var(--text-500)' },
};
