import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import { PageLoader } from '../components/Spinner';
import { getScoreColor, formatDate } from '../utils/helpers';

/* ── Icons ── */
const Icons = {
  total: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  avg:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  best:  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  clock: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  analyze: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12,
      padding: '10px 14px', fontSize: 13, boxShadow: '0 8px 24px rgba(160,110,50,0.14)',
    }}>
      <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#1a1207', marginBottom: 3 }}>{label}</div>
      <div style={{ color: '#f59e0b', fontWeight: 600, fontFamily: 'monospace, sans-serif' }}>Score: {payload[0].value}</div>
    </div>
  );
};

function ScoreBar({ score }) {
  const color = getScoreColor(score);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ height: 6, background: 'rgba(180,140,90,0.12)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`, background: color,
          borderRadius: 3, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/api/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(e => {
  console.error(e);
  setError('Failed to load dashboard');
})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLoader message="Loading dashboard…" />;

  /* ── Empty / guest state ── */
  if (!user || stats?.totalAnalyses === 0) {
    return (
      <div style={s.emptyWrap}>
        <div className="glass-card fade-up" style={s.emptyCard}>
          <div style={s.emptyGlow} />
          <div style={s.emptyIconWrap}>
            {!user
              ? <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              : <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            }
          </div>
          <h2 style={s.emptyTitle}>{!user ? 'Analyze Any Developer' : 'Run Your First Analysis'}</h2>
          <p style={s.emptySub}>
            {!user
              ? 'Enter a GitHub username for an instant score, strengths, weaknesses, and AI-powered suggestions.'
              : 'Your dashboard will populate after your first analysis. It only takes 10 seconds.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/analyze')} className="btn-primary" style={{ padding: '12px 28px', fontSize: 14.5 }}>
              {Icons.analyze} Analyze a Profile
            </button>
            {!user && (
              <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '12px 24px', fontSize: 14.5 }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const sortedTop = [...(stats?.recentActivity || [])].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div style={s.page}>

      {/* Page header */}
      <div style={s.pageHeader} className="fade-up">
        <div>
          <div style={s.pageBreadcrumb}>Overview</div>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <p style={s.pageSub}>Welcome back, <strong style={{ color: 'var(--text-900)' }}>{user?.email?.split('@')[0] || 'User'}</strong></p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary" style={{ padding: '12px 24px', fontSize: 14.5 }}>
          {Icons.analyze} New Analysis
        </button>
      </div>

      if (loading) return <PageLoader message="Loading dashboard…" />;

if (error) {
  return <div style={s.errorBox}>{error}</div>;
}

      {/* KPI row */}
      <div style={s.kpiGrid}>
        <KpiCard label="Total Analyses"  value={stats?.totalAnalyses} icon={Icons.total} delay={0} />
        <KpiCard label="Average Score"   value={stats?.averageScore}  sub="out of 100" icon={Icons.avg} delay={60} />
        <KpiCard label="Highest Score"   value={stats?.highestScore}  icon={Icons.best} delay={120} />
        <KpiCard label="Latest Score"    value={stats?.latestScore}   icon={Icons.clock} delay={180} />
      </div>

      {/* Middle row: chart + top profiles */}
      <div style={s.midRow}>

        {/* Area chart */}
        <div className="glass-card fade-up" style={s.chartCard}>
          <div style={s.chartHeader}>
            <div>
              <div style={s.chartLabel}>Score Trend</div>
              <div style={s.chartBigNum}>
                {stats?.averageScore}
                <span style={s.chartUnit}>/100</span>
              </div>
            </div>
            <div style={s.chartBadge}>Avg Score</div>
          </div>

          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={stats?.chartData || []} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,140,90,0.1)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: '#b0a090', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: '#b0a090', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(245,158,11,0.2)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.2}
                fill="url(#areaGrad)" dot={{ r: 3.5, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#f59e0b', stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top profiles dark card */}
        <div className="dark-card fade-up" style={s.darkPanel}>
          <div style={s.darkPanelHeader}>
            <div style={s.darkTitle}>Top Profiles</div>
            <div style={s.darkBadge}>by score</div>
          </div>

          <div style={s.performerList}>
            {sortedTop.map((row, i) => (
              <div key={row.id || i} style={s.performer}>
                <div style={{
                  ...s.performerRank,
                  background: i === 0 ? '#f59e0b' : i === 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                  color: i === 0 ? '#1a1207' : 'rgba(255,255,255,0.5)',
                }}>
                  {i + 1}
                </div>
                <div style={s.performerAva}>
                  {row.username[0].toUpperCase()}
                </div>
                <div style={s.performerInfo}>
                  <div style={s.performerName}>@{row.username}</div>
                  <ScoreBar score={row.score} />
                </div>
                <div style={{ ...s.performerScore, color: getScoreColor(row.score) }}>
                  {row.score}
                </div>
              </div>
            ))}

            {sortedTop.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                No analyses yet
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/analyze')}
            style={s.darkCta}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
          >
            {Icons.analyze}
            Analyze New Profile
          </button>
        </div>
      </div>

      {/* Recent analyses table */}
      {stats?.recentActivity?.length > 0 && (
        <div className="glass-card fade-up" style={s.tableCard}>
          <div style={s.tableHeader}>
            <div>
              <div style={s.tableTitle}>Recent Analyses</div>
              <div style={s.tableSub}>{stats?.recentActivity.length} most recent</div>
            </div>
            <button onClick={() => navigate('/history')} className="btn-ghost" style={{ fontSize: 13 }}>
              View all →
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentActivity.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ ...s.tableAva, background: getScoreColor(row.score) + '18', color: getScoreColor(row.score) }}>
                          {row.username[0].toUpperCase()}
                        </div>
                        <a href={`https://github.com/${row.username}`} target="_blank" rel="noreferrer"
                          style={{ fontWeight: 600, color: 'var(--text-900)', fontFamily: 'monospace, sans-serif', fontSize: 14 }}>
                          @{row.username}
                        </a>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 17, fontWeight: 800, color: getScoreColor(row.score) }}>
                        {row.score}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-300)', marginLeft: 2 }}>/100</span>
                    </td>
                    <td style={{ width: 120 }}>
                      <div style={{ height: 6, background: 'rgba(180,140,90,0.12)', borderRadius: 3, overflow: 'hidden', width: 110 }}>
                        <div style={{ height: '100%', width: `${row.score}%`, background: getScoreColor(row.score), borderRadius: 3, transition: 'width 0.8s ease' }} />
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-300)', fontSize: 12.5 }}>{formatDate(row.date)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/analyze?user=${row.username}`)}
                        style={s.rerunBtn}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.16)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; }}
                      >
                        Re-run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },

  pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  pageBreadcrumb: { fontFamily: 'monospace, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--text-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
  pageTitle: { fontFamily: 'Poppins, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-900)', letterSpacing: '-0.03em' },
  pageSub: { fontSize: 13.5, color: 'var(--text-500)', marginTop: 3, fontFamily: 'monospace, sans-serif' },

  errorBox: { background: 'rgba(239,68,68,0.07)', color: '#ef4444', padding: '11px 16px', borderRadius: 12, fontSize: 13 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 14 },

  midRow: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 },

  chartCard: { padding: '24px 24px 16px' },
  chartHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  chartLabel: { fontFamily: 'monospace, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--text-300)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 },
  chartBigNum: { fontFamily: 'Poppins, sans-serif', fontSize: 40, fontWeight: 800, color: 'var(--text-900)', lineHeight: 1, letterSpacing: '-0.04em' },
  chartUnit: { fontSize: 18, fontWeight: 600, color: 'var(--text-300)' },
  chartBadge: {
    background: 'rgba(245,158,11,0.1)', color: '#92400e',
    fontFamily: 'monospace, sans-serif', fontSize: 11, fontWeight: 600,
    padding: '5px 12px', borderRadius: 20, letterSpacing: '0.02em',
  },

  darkPanel: { padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 18 },
  darkPanelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  darkTitle: { fontFamily: 'Poppins, sans-serif', fontSize: 17, fontWeight: 700, color: 'white' },
  darkBadge: { fontFamily: 'monospace, sans-serif', fontSize: 11, color: 'rgba(245,158,11,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em' },
  performerList: { display: 'flex', flexDirection: 'column', gap: 14 },
  performer: { display: 'flex', alignItems: 'center', gap: 10 },
  performerRank: {
    width: 22, height: 22, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontFamily: 'Poppins, sans-serif', fontWeight: 800, flexShrink: 0,
  },
  performerAva: {
    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(245,158,11,0.2)', color: '#f59e0b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
  },
  performerInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 5 },
  performerName: { fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace, sans-serif' },
  performerScore: { fontFamily: 'Poppins, sans-serif', fontSize: 16, fontWeight: 800, flexShrink: 0 },
  darkCta: {
    width: '100%', padding: '10px', borderRadius: 12, border: 'none',
    background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
    fontFamily: 'monospace, sans-serif', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.2s ease', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 'auto',
  },

  tableCard: { padding: '22px 24px' },
  tableHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 12 },
  tableTitle: { fontFamily: 'Poppins, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-900)' },
  tableSub: { fontSize: 12, color: 'var(--text-300)', marginTop: 2, fontFamily: 'monospace, sans-serif' },
  tableAva: {
    width: 30, height: 30, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: 'Poppins, sans-serif',
  },
  rerunBtn: {
    padding: '5px 14px', borderRadius: 8, border: 'none',
    background: 'rgba(245,158,11,0.08)', color: '#92400e',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease',
    fontFamily: 'monospace, sans-serif',
  },

  emptyWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' },
  emptyCard: { padding: '56px 48px', textAlign: 'center', maxWidth: 460, position: 'relative', overflow: 'hidden' },
  emptyGlow: {
    position: 'absolute', width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
  },
  emptyIconWrap: {
    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 22px',
    background: 'rgba(245,158,11,0.1)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-900)', marginBottom: 12, letterSpacing: '-0.02em' },
  emptySub: { fontSize: 14, color: 'var(--text-500)', lineHeight: 1.7, marginBottom: 28, fontFamily: 'Poppins, sans-serif' },
};
