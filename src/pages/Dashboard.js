import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import { PageLoader } from '../components/Spinner';
import { getScoreColor, formatDate } from '../utils/helpers';

/* ── KPI icons ── */
const kpiIcons = {
  total: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  avg: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  best: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  last: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div style={{ fontWeight: 600, color: 'var(--text-900)', marginBottom: 3 }}>{label}</div>
      <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Score: {payload[0].value}</div>
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

  if (!user || (stats && stats.totalAnalyses === 0)) {
    return (
      <div style={s.emptyWrap}>
        <div className="card fade-up" style={s.emptyCard}>
          <div style={s.emptyEmoji}>{!user ? '🔍' : '🚀'}</div>
          <h1 style={s.emptyTitle}>
            {!user ? 'Analyze Any Developer Profile' : 'Run Your First Analysis'}
          </h1>
          <p style={s.emptySub}>
            {!user
              ? 'Enter a GitHub username for an instant score, strengths, weaknesses, and AI suggestions.'
              : 'Your dashboard will populate after your first analysis.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/analyze')} className="btn-primary">Analyze a Profile</button>
            {!user && <button onClick={() => navigate('/login')} className="btn-outline">Sign In</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">
            Welcome back, <strong style={{ color: 'var(--text-900)', fontWeight: 600 }}>
              {user.email?.split('@')[0] || 'User'}
            </strong>
          </p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary">
          New Analysis
        </button>
      </div>

      {error && <div className="error-box fade-up">{error}</div>}

      <div className="kpi-grid fade-up" style={{ animationDelay: '40ms' }}>
        <KpiCard label="Total Analyses" value={stats.totalAnalyses} icon={kpiIcons.total} color="#6366f1" delay={0} />
        <KpiCard label="Average Score"  value={stats.averageScore}  sub="out of 100" icon={kpiIcons.avg}  color="#f59e0b" delay={50} />
        <KpiCard label="Highest Score"  value={stats.highestScore}  icon={kpiIcons.best} color="#22c55e" delay={100} />
        <KpiCard label="Latest Score"   value={stats.latestScore}   icon={kpiIcons.last} color="#ef4444" delay={150} />
      </div>

      <div className="dash-mid-row" style={s.midRow}>
        <div className="card fade-up dash-chart-card" style={{ ...s.chartCard, animationDelay: '80ms' }}>
          <div style={s.chartTop}>
            <div>
              <div style={s.chartLabel}>Average KPI Score</div>
              <div style={s.chartBig}>{stats.averageScore}<span style={s.chartPct}>%</span></div>
            </div>
            <span className="badge-amber">Score trend</span>
          </div>

          <ResponsiveContainer width="100%" height={190}>
            {stats.chartData?.length > 1 ? (
              <BarChart data={stats.chartData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: 'var(--text-300)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: 'var(--text-300)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,158,11,0.06)', radius: 6 }} />
                <Bar dataKey="score" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={stats.chartData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: 'var(--text-300)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: 'var(--text-300)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="dark-card fade-up" style={{ ...s.darkPanel, animationDelay: '110ms' }}>
          <div style={s.darkTitle}>Top Analyses</div>
          <div style={s.perfList}>
            {stats.recentActivity?.slice(0, 4).map((row, i) => (
              <div key={row.id || i} style={s.perfRow}>
                <div style={{
                  ...s.perfRank,
                  background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.08)',
                  color: i === 0 ? '#fff' : '#999',
                }}>{i + 1}</div>
                {/* FIX: Use fallback for initials if username is missing */}
                <div style={s.perfAva}>{row.username ? row.username[0].toUpperCase() : 'P'}</div>
                <div style={s.perfInfo}>
                  <div style={s.perfName}>{row.username ? `@${row.username}` : 'Portfolio Analysis'}</div>
                  <div style={s.perfDate}>{formatDate(row.date)}</div>
                </div>
                <div style={{ ...s.perfScore, color: getScoreColor(row.score) }}>{row.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats.recentActivity?.length > 0 && (
        <div className="card fade-up" style={{ ...s.tableCard, animationDelay: '150ms' }}>
          <div style={s.tableHead}>
            <div style={s.tableTitle}>Recent Analyses</div>
            <button onClick={() => navigate('/history')} className="btn-ghost">View all →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((row, idx) => (
                  <tr key={row.id || idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: getScoreColor(row.score) + '18',
                          color: getScoreColor(row.score),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11.5, fontWeight: 700,
                        }}>
                          {row.username ? row.username[0].toUpperCase() : 'P'}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-900)' }}>
                          {row.username ? `@${row.username}` : 'Portfolio Only'}
                        </span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 15, fontWeight: 700, color: getScoreColor(row.score) }}>{row.score}</span></td>
                    <td>
                      <div className="perf-bar">
                        <div className="perf-fill" style={{ width: `${row.score}%`, background: getScoreColor(row.score) }} />
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-300)', fontSize: 12 }}>{formatDate(row.date)}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/analyze?${row.username ? `user=${row.username}` : `url=${row.portfolioUrl}`}`)} 
                        style={s.rerunBtn}
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
  page: { display: 'flex', flexDirection: 'column', gap: 18 },
  emptyWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' },
  emptyCard: { padding: '52px 44px', textAlign: 'center', maxWidth: 460 },
  emptyEmoji: { fontSize: 50, marginBottom: 18 },
  emptyTitle: { fontSize: 24, fontWeight: 700, color: 'var(--text-900)', marginBottom: 12 },
  emptySub:   { fontSize: 14, color: 'var(--text-500)', marginBottom: 28 },
  midRow: { display: 'grid', gridTemplateColumns: '1fr 310px', gap: 16 },
  chartCard: { padding: '22px 24px 14px' },
  chartTop:  { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  chartLabel:{ fontSize: 12, color: 'var(--text-500)', marginBottom: 4 },
  chartBig:  { fontSize: 36, fontWeight: 700, color: 'var(--text-900)', lineHeight: 1 },
  chartPct:  { fontSize: 18, color: 'var(--text-500)' },
  darkPanel: { padding: '22px 20px', background: '#111', borderRadius: 16 },
  darkTitle: { fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 18 },
  perfList:  { display: 'flex', flexDirection: 'column', gap: 14 },
  perfRow:   { display: 'flex', alignItems: 'center', gap: 9 },
  perfRank: { width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 700 },
  perfAva: { width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,158,11,0.18)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  perfInfo:  { flex: 1, minWidth: 0 },
  perfName:  { fontSize: 12.5, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' },
  perfDate:  { fontSize: 10.5, color: '#666' },
  perfScore: { fontSize: 17, fontWeight: 700 },
  tableCard:  { padding: '20px 24px' },
  tableHead:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  tableTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text-900)' },
  rerunBtn: { padding: '5px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.09)', color: '#92400e', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', border: 'none' },
};