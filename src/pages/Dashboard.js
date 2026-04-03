import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import { PageLoader } from '../components/Spinner';
import { getScoreColor, formatDate } from '../utils/helpers';

const kpiIcons = {
  total: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  avg:   <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  best:  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  last:  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
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
      .then((r) => setStats(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLoader message="Loading dashboard..." />;

  // Guest dashboard
  if (!user) {
    return (
      <div style={styles.guestWrap} className="fade-up">
        <div style={styles.guestCard}>
          <div style={styles.guestEmoji}>🔍</div>
          <h1 style={styles.guestTitle}>Analyze Any Developer Profile</h1>
          <p style={styles.guestSub}>
            Enter a GitHub username to get an instant score, strengths, weaknesses, and AI-powered suggestions.
            Sign in to track improvement over time.
          </p>
          <div style={styles.guestBtns}>
            <button onClick={() => navigate('/analyze')} style={styles.primaryBtn}>
              Start Analyzing
            </button>
            <button onClick={() => navigate('/login')} style={styles.secondaryBtn}>
              Sign in for History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (stats && stats.totalAnalyses === 0) {
    return (
      <div style={styles.guestWrap} className="fade-up">
        <div style={styles.guestCard}>
          <div style={styles.guestEmoji}>🚀</div>
          <h1 style={styles.guestTitle}>Run Your First Analysis</h1>
          <p style={styles.guestSub}>
            Your dashboard will populate after you analyze a GitHub profile.
          </p>
          <button onClick={() => navigate('/analyze')} style={styles.primaryBtn}>
            Analyze a Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader} className="fade-up">
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSub}>Welcome back, {user.email.split('@')[0]}</p>
        </div>
        <button onClick={() => navigate('/analyze')} style={styles.primaryBtn}>
          + New Analysis
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KpiCard label="Total Analyses" value={stats.totalAnalyses} icon={kpiIcons.total} delay={0} />
        <KpiCard label="Average Score" value={stats.averageScore} sub="out of 100" icon={kpiIcons.avg} color="#6366f1" delay={80} />
        <KpiCard label="Highest Score" value={stats.highestScore} icon={kpiIcons.best} color="#22c55e" delay={160} />
        <KpiCard label="Latest Score" value={stats.latestScore} icon={kpiIcons.last} color="#f59e0b" delay={240} />
      </div>

      {/* Chart */}
      {stats.chartData?.length > 1 && (
        <div style={styles.chartCard} className="fade-up">
          <div style={styles.chartTitle}>Score History</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9b8374' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9b8374' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }}
                formatter={(val) => [`${val}`, 'Score']}
              />
              <Line
                type="monotone" dataKey="score" stroke="var(--orange)"
                strokeWidth={3} dot={{ r: 5, fill: 'var(--orange)', strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Activity Table */}
      {stats.recentActivity?.length > 0 && (
        <div style={styles.tableCard} className="fade-up">
          <div style={styles.chartTitle}>Recent Activity</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Username', 'Score', 'Date', ''].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((row) => (
                  <tr key={row.id} style={styles.tr}>
                    <td style={styles.td}>
                      <a
                        href={`https://github.com/${row.username}`}
                        target="_blank" rel="noreferrer"
                        style={{ color: 'var(--text-dark)', fontWeight: 500 }}
                      >
                        @{row.username}
                      </a>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.scoreBadge, background: getScoreColor(row.score) + '18', color: getScoreColor(row.score) }}>
                        {row.score}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: 'var(--text-light)', fontSize: 13 }}>
                      {formatDate(row.date)}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => navigate(`/analyze?user=${row.username}`)}
                        style={styles.reRunBtn}
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

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  pageHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    gap: 16, flexWrap: 'wrap',
  },
  pageTitle: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-dark)' },
  pageSub: { fontSize: 14, color: 'var(--text-light)', marginTop: 4 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  chartCard: {
    background: 'white', borderRadius: 'var(--radius)', padding: 24,
    boxShadow: 'var(--shadow-sm)',
  },
  chartTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700,
    color: 'var(--text-dark)', marginBottom: 20,
  },
  tableCard: {
    background: 'white', borderRadius: 'var(--radius)', padding: 24,
    boxShadow: 'var(--shadow-sm)',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', fontSize: 12, fontWeight: 600,
    color: 'var(--text-light)', textTransform: 'uppercase',
    letterSpacing: '0.06em', padding: '8px 12px',
    borderBottom: '1px solid var(--cream-dark)',
  },
  tr: { borderBottom: '1px solid var(--cream-dark)' },
  td: { padding: '12px 12px', fontSize: 14, color: 'var(--text-dark)' },
  scoreBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: 20,
    fontSize: 13, fontWeight: 700,
  },
  reRunBtn: {
    padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
    background: 'var(--cream-dark)', border: 'none', color: 'var(--text-mid)', cursor: 'pointer',
  },
  guestWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  guestCard: {
    background: 'white', borderRadius: 'var(--radius)', padding: '48px 40px',
    boxShadow: 'var(--shadow-md)', textAlign: 'center', maxWidth: 480,
  },
  guestEmoji: { fontSize: 48, marginBottom: 16 },
  guestTitle: { fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12 },
  guestSub: { fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 28 },
  guestBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '12px 24px', borderRadius: 12, border: 'none',
    background: 'var(--orange)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '12px 24px', borderRadius: 12,
    border: '1.5px solid var(--cream-dark)', background: 'white',
    color: 'var(--text-mid)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  error: {
    background: '#fef2f2', color: '#ef4444', padding: '12px 16px',
    borderRadius: 10, fontSize: 13,
  },
};
