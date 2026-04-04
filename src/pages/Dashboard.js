import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import { PageLoader, SkeletonCard } from '../components/Spinner';
import { getScoreColor, formatDate } from '../utils/helpers';

/* KPI icons */
const kpiIcons = {
  total: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  avg:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  best:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  last:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

/* Custom tooltip for chart */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(160,110,50,0.12)' }}>
      <div style={{ fontWeight: 700, color: '#1a1207', marginBottom: 3 }}>{label}</div>
      <div style={{ color: '#f59e0b', fontWeight: 600 }}>Score: {payload[0].value}</div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLoader message="Loading dashboard…" />;

  /* Guest / empty state */
  if (!user || (stats && stats.totalAnalyses === 0)) {
    return (
      <div style={s.emptyWrap}>
        <div className="glass-card fade-up" style={s.emptyCard}>
          <div style={s.emptyEmoji}>{!user ? '🔍' : '🚀'}</div>
          <h1 style={s.emptyTitle}>{!user ? 'Analyze Any Developer Profile' : 'Run Your First Analysis'}</h1>
          <p style={s.emptySub}>
            {!user
              ? 'Enter a GitHub username for an instant score, strengths, weaknesses, and AI suggestions.'
              : 'Your dashboard will populate after your first analysis.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/analyze')} className="btn-primary">Analyze a Profile</button>
            {!user && <button onClick={() => navigate('/login')} style={s.secondaryBtn}>Sign In</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* Page header */}
      <div style={s.pageHeader} className="fade-up">
        <div>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <p style={s.pageSub}>Welcome back, <strong>{user.email.split('@')[0]}</strong></p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          New Analysis
        </button>
      </div>

      {error && <div style={s.errorBox}>{error}</div>}

      {/* KPI row */}
      <div style={s.kpiGrid}>
        <KpiCard label="Total Analyses"  value={stats.totalAnalyses} icon={kpiIcons.total} color="#6366f1" delay={0} />
        <KpiCard label="Average Score"   value={stats.averageScore}  sub="out of 100" icon={kpiIcons.avg}   color="#f59e0b" delay={60} />
        <KpiCard label="Highest Score"   value={stats.highestScore}  icon={kpiIcons.best}  color="#22c55e" delay={120} />
        <KpiCard label="Latest Score"    value={stats.latestScore}   icon={kpiIcons.last}  color="#ef4444" delay={180} />
      </div>

      {/* Middle row: chart + top performers */}
      <div style={s.midRow}>

        {/* KPI score chart — matches reference bar chart */}
        <div className="glass-card fade-up" style={s.chartCard}>
          <div style={s.chartHeader}>
            <div>
              <div style={s.chartTitle}>Average KPI Score</div>
              <div style={s.chartBig}>{stats.averageScore}<span style={s.chartPct}>%</span></div>
            </div>
            <div style={s.chartBadge}>Score trend</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            {stats.chartData?.length > 1 ? (
              <BarChart data={stats.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,140,90,0.1)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: '#b0a090' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: '#b0a090' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,158,11,0.06)', radius: 6 }} />
                <Bar dataKey="score" fill="url(#barGrad)" radius={[6,6,0,0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={stats.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,140,90,0.1)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: '#b0a090' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: '#b0a090' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Top performers — dark card matching reference */}
        <div className="dark-card fade-up" style={{ ...s.darkPanel, animationDelay: '80ms' }}>
          <div style={s.darkTitle}>Top Analyses</div>
          <div style={s.performerList}>
            {stats.recentActivity?.slice(0, 4).map((row, i) => (
              <div key={row.id} style={s.performer}>
                <div style={{ ...s.performerRank, background: i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}>
                  {i + 1}
                </div>
                <div style={s.performerAva}>
                  {row.username[0].toUpperCase()}
                </div>
                <div style={s.performerInfo}>
                  <div style={s.performerName}>@{row.username}</div>
                  <div style={s.performerDate}>{formatDate(row.date)}</div>
                </div>
                <div style={{ ...s.performerScore, color: getScoreColor(row.score) }}>
                  {row.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employees / Recent activity table */}
      {stats.recentActivity?.length > 0 && (
        <div className="glass-card fade-up" style={{ ...s.tableCard, animationDelay: '160ms' }}>
          <div style={s.tableHeader}>
            <div style={s.tableTitle}>Recent Analyses</div>
            <button onClick={() => navigate('/history')} className="btn-ghost">
              View all →
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ ...s.tableAva, background: getScoreColor(row.score) + '22', color: getScoreColor(row.score) }}>
                          {row.username[0].toUpperCase()}
                        </div>
                        <a href={`https://github.com/${row.username}`} target="_blank" rel="noreferrer"
                          style={{ fontWeight: 600, color: 'var(--text-900)' }}>
                          @{row.username}
                        </a>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: getScoreColor(row.score) }}>
                        {row.score}
                      </span>
                    </td>
                    <td>
                      <div style={s.perfBar}>
                        <div style={{ ...s.perfFill, width: `${row.score}%`, background: getScoreColor(row.score) }} />
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-300)', fontSize: 12.5 }}>{formatDate(row.date)}</td>
                    <td>
                      <button onClick={() => navigate(`/analyze?user=${row.username}`)} style={s.rerunBtn}>
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
  pageTitle: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-900)' },
  pageSub: { fontSize: 13.5, color: 'var(--text-500)', marginTop: 3 },
  errorBox: { background: 'rgba(239,68,68,0.08)', color: '#ef4444', padding: '11px 16px', borderRadius: 12, fontSize: 13 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 14 },
  midRow: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 },
  chartCard: { padding: '24px 24px 16px' },
  chartHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  chartTitle: { fontSize: 13, fontWeight: 600, color: 'var(--text-500)', marginBottom: 6 },
  chartBig: { fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800, color: 'var(--text-900)', lineHeight: 1 },
  chartPct: { fontSize: 20, fontWeight: 600, color: 'var(--text-500)' },
  chartBadge: {
    background: 'rgba(245,158,11,0.1)', color: '#92400e',
    fontSize: 11.5, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
  },
  darkPanel: { padding: '24px 22px' },
  darkTitle: { fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 20 },
  performerList: { display: 'flex', flexDirection: 'column', gap: 14 },
  performer: { display: 'flex', alignItems: 'center', gap: 10 },
  performerRank: {
    width: 22, height: 22, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0,
  },
  performerAva: {
    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(245,158,11,0.25)', color: '#f59e0b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700,
  },
  performerInfo: { flex: 1 },
  performerName: { fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' },
  performerDate: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 },
  performerScore: { fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800 },
  tableCard: { padding: '20px 24px' },
  tableHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  tableTitle: { fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-900)' },
  tableAva: {
    width: 30, height: 30, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  perfBar: { height: 6, background: 'rgba(180,140,90,0.12)', borderRadius: 3, width: 100, overflow: 'hidden' },
  perfFill: { height: '100%', borderRadius: 3, transition: 'width 0.8s ease' },
  rerunBtn: {
    padding: '5px 12px', borderRadius: 8, border: 'none',
    background: 'rgba(245,158,11,0.1)', color: '#92400e',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  emptyWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' },
  emptyCard: { padding: '52px 44px', textAlign: 'center', maxWidth: 460 },
  emptyEmoji: { fontSize: 52, marginBottom: 18 },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text-900)', marginBottom: 12 },
  emptySub: { fontSize: 14.5, color: 'var(--text-500)', lineHeight: 1.7, marginBottom: 28 },
  secondaryBtn: {
    padding: '10px 22px', borderRadius: 14,
    border: '1.5px solid rgba(180,140,90,0.2)', background: 'transparent',
    color: 'var(--text-700)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
};
