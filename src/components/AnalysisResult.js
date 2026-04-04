import React from 'react';
import ScoreRing from './ScoreRing';
import { getScoreColor } from '../utils/helpers';

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const X = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const Info = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function AnalysisResult({ result }) {
  if (!result) return null;
  const { score, strengths, weaknesses, suggestions, githubData, scoreBreakdown, aiGenerated, summary } = result;

  const breakdown = [
    { label: 'Repositories', val: scoreBreakdown?.repos ?? 0, max: 25 },
    { label: 'Stars',        val: scoreBreakdown?.stars ?? 0, max: 20 },
    { label: 'Followers',    val: scoreBreakdown?.followers ?? 0, max: 15 },
    { label: 'Recent Activity', val: scoreBreakdown?.recentActivity ?? 0, max: 20 },
    { label: 'Profile',      val: scoreBreakdown?.profileCompleteness ?? 0, max: 10 },
    { label: 'Portfolio',    val: scoreBreakdown?.portfolioBonus ?? 0, max: 10 },
  ];

  return (
    <div style={s.wrap}>

      {/* Header card — avatar + score + summary */}
      <div className="glass-card fade-up" style={s.headerCard}>
        <div style={s.profileRow}>
          <div style={s.profileLeft}>
            {githubData?.avatarUrl && (
              <img src={githubData.avatarUrl} alt="avatar" style={s.avatar} />
            )}
            <div>
              <div style={s.profileName}>{githubData?.name || result.githubUsername}</div>
              <a href={`https://github.com/${result.githubUsername}`} target="_blank" rel="noreferrer"
                style={s.profileHandle}>@{result.githubUsername} ↗</a>
              {githubData?.bio && <div style={s.profileBio}>{githubData.bio}</div>}
              <div style={s.langRow}>
                {githubData?.topLanguages?.slice(0, 4).map(l => (
                  <span key={l} style={s.langTag}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={s.scoreCol}>
            <ScoreRing score={score} size={130} />
            {aiGenerated && <div style={s.aiBadge}>✨ AI Analysis</div>}
          </div>
        </div>
        {summary && <div style={s.summaryBox}><p style={s.summaryText}>{summary}</p></div>}
      </div>

      {/* Score breakdown + GitHub stats row */}
      <div style={s.midRow}>

        {/* Score breakdown */}
        <div className="glass-card fade-up" style={{ ...s.breakdownCard, animationDelay: '80ms' }}>
          <div style={s.cardTitle}>Score Breakdown</div>
          <div style={s.breakdownList}>
            {breakdown.map(b => (
              <div key={b.label} style={s.breakdownItem}>
                <div style={s.bLabel}>{b.label}</div>
                <div style={s.bTrack}>
                  <div style={{
                    ...s.bFill,
                    width: `${(b.val / b.max) * 100}%`,
                    background: `linear-gradient(90deg, ${getScoreColor(Math.round((b.val / b.max) * 100))}, ${getScoreColor(Math.round((b.val / b.max) * 100))}cc)`,
                  }} />
                </div>
                <div style={s.bScore}>{b.val}<span style={s.bMax}>/{b.max}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub stats */}
        <div className="glass-card fade-up" style={{ ...s.statsCard, animationDelay: '140ms' }}>
          <div style={s.cardTitle}>GitHub Stats</div>
          <div style={s.statGrid}>
            {[
              { label: 'Repos',    val: githubData?.publicRepos },
              { label: 'Stars',    val: githubData?.totalStars },
              { label: 'Followers',val: githubData?.followers },
              { label: 'Following',val: githubData?.following },
              { label: 'Active (90d)', val: githubData?.recentActiveRepos },
              { label: 'Profile README', val: githubData?.hasProfileReadme ? '✓' : '✗' },
            ].map(s2 => (
              <div key={s2.label} style={s.statItem}>
                <div style={s.statVal}>{s2.val ?? '—'}</div>
                <div style={s.statLabel}>{s2.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths / Weaknesses / Suggestions */}
      <div style={s.triGrid}>
        {[
          { title: 'Strengths',   items: strengths,   icon: Check, accent: '#22c55e', bg: 'rgba(34,197,94,0.06)' },
          { title: 'Weaknesses',  items: weaknesses,  icon: X,     accent: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
          { title: 'Suggestions', items: suggestions, icon: Info,  accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
        ].map((col, i) => (
          <div key={col.title} className="glass-card fade-up"
            style={{ ...s.triCard, animationDelay: `${200 + i * 70}ms` }}>
            <div style={{ ...s.cardTitle, color: col.accent }}>{col.title}</div>
            <div style={s.listWrap}>
              {col.items?.length ? col.items.map((item, j) => (
                <div key={j} style={{ ...s.listItem, background: col.bg }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}><col.icon /></span>
                  <span style={s.listText}>{item}</span>
                </div>
              )) : <div style={s.empty}>None detected</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 16 },
  headerCard: { padding: '24px 28px' },
  profileRow: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
  },
  profileLeft: { display: 'flex', alignItems: 'flex-start', gap: 18, flex: 1 },
  avatar: { width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid rgba(245,158,11,0.2)' },
  profileName: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-900)' },
  profileHandle: { fontSize: 13, color: 'var(--amber)', fontWeight: 600, display: 'block', marginTop: 2 },
  profileBio: { fontSize: 13, color: 'var(--text-500)', lineHeight: 1.6, marginTop: 6, maxWidth: 380 },
  langRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 },
  langTag: {
    background: 'rgba(245,158,11,0.1)', color: '#92400e',
    fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
  },
  scoreCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 },
  aiBadge: {
    background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(255,124,0,0.15))',
    border: '1px solid rgba(245,158,11,0.25)',
    color: '#92400e', fontSize: 11.5, fontWeight: 600,
    padding: '4px 12px', borderRadius: 20,
  },
  summaryBox: {
    marginTop: 18, padding: '14px 18px',
    background: 'rgba(245,158,11,0.06)',
    borderRadius: 14, borderLeft: '3px solid rgba(245,158,11,0.4)',
  },
  summaryText: { fontSize: 13.5, color: 'var(--text-700)', lineHeight: 1.7 },
  midRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  breakdownCard: { padding: '22px 24px' },
  statsCard: { padding: '22px 24px' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-900)', marginBottom: 16 },
  breakdownList: { display: 'flex', flexDirection: 'column', gap: 11 },
  breakdownItem: { display: 'flex', alignItems: 'center', gap: 10 },
  bLabel: { width: 120, fontSize: 12.5, color: 'var(--text-500)', flexShrink: 0 },
  bTrack: { flex: 1, height: 7, borderRadius: 4, background: 'rgba(180,140,90,0.12)', overflow: 'hidden' },
  bFill:  { height: '100%', borderRadius: 4, transition: 'width 1s ease' },
  bScore: { width: 36, fontSize: 12, fontWeight: 700, color: 'var(--text-900)', textAlign: 'right' },
  bMax:   { fontWeight: 400, color: 'var(--text-300)' },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  statItem: { textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: 'rgba(245,158,11,0.05)' },
  statVal:   { fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-900)', lineHeight: 1 },
  statLabel: { fontSize: 10.5, color: 'var(--text-500)', marginTop: 4 },
  triGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 },
  triCard: { padding: '20px 22px' },
  listWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 11px', borderRadius: 10 },
  listText: { fontSize: 13, color: 'var(--text-700)', lineHeight: 1.55 },
  empty: { fontSize: 13, color: 'var(--text-300)', fontStyle: 'italic' },
};
