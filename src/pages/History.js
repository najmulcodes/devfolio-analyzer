import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ScoreRing from '../components/ScoreRing';
import { PageLoader } from '../components/Spinner';
import { formatDate, getScoreColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const SORT_OPTIONS = [
  { value: 'date_desc',  label: 'Newest first' },
  { value: 'date_asc',   label: 'Oldest first' },
  { value: 'score_desc', label: 'Highest score' },
  { value: 'score_asc',  label: 'Lowest score' },
];

function ScoreTrendPill({ score }) {
  const color = getScoreColor(score);
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 999,
      background: color + '14', color,
      fontFamily: 'monospace, sans-serif', fontSize: 11, fontWeight: 600,
    }}>
      {label}
    </span>
  );
}

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyses, setAnalyses]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [sort, setSort]           = useState('date_desc');
  const limit = 10;

  const load = async (p = 1, sortVal = sort) => {
    setLoading(true);
    try {
      const res = await api.get(`/analysis/history?page=${p}&limit=${limit}`);
      let items = res.data.analyses || [];
      // client-side sort since the API may not support it
      if (sortVal === 'date_desc')  items = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (sortVal === 'date_asc')   items = [...items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (sortVal === 'score_desc') items = [...items].sort((a, b) => b.score - a.score);
      if (sortVal === 'score_asc')  items = [...items].sort((a, b) => a.score - b.score);
      setAnalyses(items);
      setTotal(res.data.total);
      setPage(p);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => { load(1, sort); }, [navigate]);

  const handleSort = (val) => { setSort(val); load(1, val); };

  if (loading) return <PageLoader message="Loading history…" />;

  return (
    <div style={s.page}>

      {/* Header */}
      <div className="fade-up" style={s.pageHeader}>
        <div>
          <div style={s.breadcrumb}>Records</div>
          <h1 style={s.title}>Analysis History</h1>
          <p style={s.sub}>
            {total > 0
              ? <>{total} {total === 1 ? 'analysis' : 'analyses'} saved to your account</>
              : 'Your past analyses will appear here'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sort dropdown */}
          {total > 1 && (
            <div style={s.sortWrap}>
              <svg width="13" height="13" fill="none" stroke="var(--text-300)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
              </svg>
              <select
                value={sort}
                onChange={e => handleSort(e.target.value)}
                style={s.sortSelect}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}
          <button onClick={() => navigate('/analyze')} className="btn-primary" style={{ padding: '10px 22px' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Analysis
          </button>
        </div>
      </div>

      {error && (
        <div style={s.errorBox}>
          <svg width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Empty state */}
      {analyses.length === 0 && !loading && (
        <div className="glass-card fade-up" style={s.emptyCard}>
          <div style={s.emptyGlow} />
          <div style={s.emptyIconRing}>
            <svg width="26" height="26" fill="none" stroke="#f59e0b" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h2 style={s.emptyTitle}>No history yet</h2>
          <p style={s.emptySub}>Analyze a GitHub profile to start building your history. Your analyses are saved automatically when you're signed in.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary" style={{ padding: '12px 28px', fontSize: 14.5 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Analyze a Profile
          </button>
        </div>
      )}

      {/* History cards */}
      {analyses.length > 0 && (
        <div style={s.grid}>
          {analyses.map((a, i) => (
            <div
              key={a._id}
              className="glass-card glass-card-lift fade-up"
              style={{ ...s.card, animationDelay: `${i * 45}ms` }}
            >
              {/* Score ring */}
              <div style={s.cardLeft}>
                <ScoreRing score={a.score} size={76} />
              </div>

              {/* Main content */}
              <div style={s.cardBody}>
                <div style={s.cardTop}>
                  <a
                    href={`https://github.com/${a.githubUsername}`}
                    target="_blank" rel="noreferrer"
                    style={s.cardUsername}
                  >
                    @{a.githubUsername}
                  </a>
                  <ScoreTrendPill score={a.score} />
                  {a.aiGenerated && <span style={s.aiPill}>✨ AI</span>}
                </div>

                <div style={s.cardMeta}>
                  <span style={s.cardDate}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {formatDate(a.createdAt)}
                  </span>
                  {a.portfolioUrl && (
                    <span style={s.portfolioPill}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/></svg>
                      Portfolio included
                    </span>
                  )}
                </div>

                <div style={s.insightRow}>
                  {a.strengths?.[0] && (
                    <div style={s.insightItem}>
                      <span style={{ color: '#22c55e', fontSize: 12, flexShrink: 0 }}>✓</span>
                      <span style={s.insightText}>{a.strengths[0]}</span>
                    </div>
                  )}
                  {a.weaknesses?.[0] && (
                    <div style={s.insightItem}>
                      <span style={{ color: '#ef4444', fontSize: 12, flexShrink: 0 }}>✗</span>
                      <span style={s.insightText}>{a.weaknesses[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={s.cardRight}>
                <div style={{ ...s.scoreBig, color: getScoreColor(a.score) }}>
                  {a.score}
                  <span style={s.scoreUnit}>/100</span>
                </div>
                <button
                  onClick={() => navigate(`/analyze?user=${a.githubUsername}`)}
                  className="btn-ghost"
                  style={{ padding: '7px 16px', fontSize: 12.5 }}
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
      )}

      {/* Pagination */}
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
          <div style={s.pageInfo}>
            <span style={{ fontWeight: 600, color: 'var(--text-900)' }}>{page}</span>
            <span style={{ color: 'var(--text-300)' }}> of {Math.ceil(total / limit)}</span>
          </div>
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
  page: { display: 'flex', flexDirection: 'column', gap: 20 },

  pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  breadcrumb: { fontFamily: 'monospace, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--text-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-900)', letterSpacing: '-0.03em' },
  sub: { fontSize: 13.5, color: 'var(--text-500)', marginTop: 4, fontFamily: 'Poppins, sans-serif' },

  sortWrap: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 14px', height: 40, borderRadius: 12,
    background: 'rgba(255,255,255,0.7)', border: '1.5px solid var(--card-border)',
    backdropFilter: 'blur(8px)',
  },
  sortSelect: {
    border: 'none', background: 'transparent', outline: 'none',
    fontFamily: 'monospace, sans-serif', fontSize: 13, color: 'var(--text-700)',
    fontWeight: 500, cursor: 'pointer', padding: 0, appearance: 'none',
  },

  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(239,68,68,0.07)', color: '#ef4444',
    padding: '11px 16px', borderRadius: 12, fontSize: 13,
    fontFamily: 'monospace, sans-serif', border: '1px solid rgba(239,68,68,0.14)',
  },

  /* empty */
  emptyCard: { padding: '56px 48px', textAlign: 'center', maxWidth: 460, margin: '0 auto', position: 'relative', overflow: 'hidden' },
  emptyGlow: {
    position: 'absolute', width: 280, height: 280, borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
  },
  emptyIconRing: {
    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 22px', position: 'relative',
    background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-900)', marginBottom: 12 },
  emptySub: { fontSize: 13.5, color: 'var(--text-500)', lineHeight: 1.7, marginBottom: 28, fontFamily: 'Poppins, sans-serif', maxWidth: 360, margin: '0 auto 28px' },

  /* cards */
  grid: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: { padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 },
  cardLeft: { flexShrink: 0 },
  cardBody: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 },
  cardTop: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardUsername: {
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-900)',
    textDecoration: 'none', transition: 'color 0.2s',
  },
  aiPill: {
    background: 'rgba(245,158,11,0.1)', color: '#92400e',
    fontFamily: 'monospace, sans-serif', fontSize: 10.5, fontWeight: 700,
    padding: '2px 8px', borderRadius: 20,
  },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  cardDate: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontFamily: 'monospace, sans-serif', fontSize: 11.5, color: 'var(--text-300)',
  },
  portfolioPill: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontFamily: 'monospace, sans-serif', fontSize: 11, color: '#22c55e',
    background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: 99,
  },
  insightRow: { display: 'flex', flexDirection: 'column', gap: 3 },
  insightItem: { display: 'flex', gap: 6, alignItems: 'flex-start' },
  insightText: { fontFamily: 'Poppins, sans-serif', fontSize: 12, color: 'var(--text-500)', lineHeight: 1.5 },

  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 9, flexShrink: 0 },
  scoreBig: { fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' },
  scoreUnit: { fontSize: 12, fontWeight: 400, color: 'var(--text-300)', marginLeft: 2 },
  ghLink: {
    fontFamily: 'monospace, sans-serif', fontSize: 11.5, color: 'var(--text-300)',
    fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s',
  },

  /* pagination */
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 8 },
  pageInfo: { fontFamily: 'monospace, sans-serif', fontSize: 13.5 },
};
