import React from 'react';
import ScoreRing from './ScoreRing';

const icons = {
  strength: (
    <svg width="16" height="16" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  weakness: (
    <svg width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  suggestion: (
    <svg width="16" height="16" fill="none" stroke="var(--orange)" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const { score, strengths, weaknesses, suggestions, githubData, scoreBreakdown, aiGenerated, summary } = result;

  return (
    <div style={styles.wrapper} className="fade-up">
      {/* Header: avatar + score */}
      <div style={styles.header}>
        <div style={styles.profileInfo}>
          {githubData?.avatarUrl && (
            <img src={githubData.avatarUrl} alt="avatar" style={styles.avatar} />
          )}
          <div>
            <div style={styles.profileName}>{githubData?.name || result.githubUsername}</div>
            <div style={styles.profileUsername}>@{result.githubUsername}</div>
            {githubData?.bio && <div style={styles.profileBio}>{githubData.bio}</div>}
          </div>
        </div>
        <div style={styles.scoreSection}>
          <ScoreRing score={score} size={140} />
        </div>
      </div>

      {/* AI badge */}
      {aiGenerated && (
        <div style={styles.aiBadge}>✨ AI-powered analysis</div>
      )}

      {/* Summary */}
      {summary && (
        <div style={styles.summaryBox}>
          <p style={styles.summaryText}>{summary}</p>
        </div>
      )}

      {/* Score Breakdown */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Score Breakdown</div>
        <div style={styles.breakdownGrid}>
          {[
            { label: 'Repositories', val: scoreBreakdown?.repos, max: 25 },
            { label: 'Stars', val: scoreBreakdown?.stars, max: 20 },
            { label: 'Followers', val: scoreBreakdown?.followers, max: 15 },
            { label: 'Recent Activity', val: scoreBreakdown?.recentActivity, max: 20 },
            { label: 'Profile Complete', val: scoreBreakdown?.profileCompleteness, max: 10 },
            { label: 'Portfolio Bonus', val: scoreBreakdown?.portfolioBonus, max: 10 },
          ].map((item) => (
            <div key={item.label} style={styles.breakdownItem}>
              <div style={styles.breakdownLabel}>{item.label}</div>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${((item.val || 0) / item.max) * 100}%`,
                  }}
                />
              </div>
              <div style={styles.breakdownScore}>{item.val || 0}/{item.max}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-column grid */}
      <div style={styles.triGrid}>
        {/* Strengths */}
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, color: '#22c55e' }}>Strengths</div>
          {strengths?.length ? (
            strengths.map((s, i) => (
              <div key={i} style={styles.listItem}>
                {icons.strength}
                <span>{s}</span>
              </div>
            ))
          ) : (
            <div style={styles.empty}>None detected</div>
          )}
        </div>

        {/* Weaknesses */}
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, color: '#ef4444' }}>Weaknesses</div>
          {weaknesses?.length ? (
            weaknesses.map((w, i) => (
              <div key={i} style={styles.listItem}>
                {icons.weakness}
                <span>{w}</span>
              </div>
            ))
          ) : (
            <div style={styles.empty}>None detected</div>
          )}
        </div>

        {/* Suggestions */}
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, color: 'var(--orange)' }}>Suggestions</div>
          {suggestions?.length ? (
            suggestions.map((s, i) => (
              <div key={i} style={styles.listItem}>
                {icons.suggestion}
                <span>{s}</span>
              </div>
            ))
          ) : (
            <div style={styles.empty}>No suggestions</div>
          )}
        </div>
      </div>

      {/* GitHub Stats */}
      {githubData && (
        <div style={styles.statsRow}>
          {[
            { label: 'Public Repos', val: githubData.publicRepos },
            { label: 'Total Stars', val: githubData.totalStars },
            { label: 'Followers', val: githubData.followers },
            { label: 'Following', val: githubData.following },
            { label: 'Active Repos (90d)', val: githubData.recentActiveRepos },
          ].map((s) => (
            <div key={s.label} style={styles.statPill}>
              <div style={styles.statVal}>{s.val ?? '—'}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Top Languages */}
      {githubData?.topLanguages?.length > 0 && (
        <div style={styles.langRow}>
          <span style={styles.langTitle}>Top Languages:</span>
          {githubData.topLanguages.map((l) => (
            <span key={l} style={styles.langTag}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: {
    background: 'white', borderRadius: 'var(--radius)', padding: 28,
    boxShadow: 'var(--shadow-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 24, flexWrap: 'wrap',
  },
  profileInfo: { display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 },
  avatar: { width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  profileName: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text-dark)' },
  profileUsername: { fontSize: 13, color: 'var(--text-light)', marginTop: 2 },
  profileBio: { fontSize: 13, color: 'var(--text-mid)', marginTop: 6, maxWidth: 360 },
  scoreSection: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiBadge: {
    display: 'inline-flex', alignSelf: 'flex-start',
    background: 'linear-gradient(135deg, #ff6b35, #f59e0b)',
    color: 'white', fontSize: 12, fontWeight: 600,
    padding: '4px 12px', borderRadius: 20,
  },
  summaryBox: {
    background: 'var(--orange-pale)', borderRadius: 'var(--radius-sm)',
    padding: '16px 20px', borderLeft: '3px solid var(--orange)',
  },
  summaryText: { fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7 },
  section: {
    background: 'white', borderRadius: 'var(--radius)', padding: 24,
    boxShadow: 'var(--shadow-sm)',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700,
    color: 'var(--text-dark)', marginBottom: 16,
  },
  breakdownGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  breakdownItem: { display: 'flex', alignItems: 'center', gap: 12 },
  breakdownLabel: { width: 140, fontSize: 13, color: 'var(--text-mid)', flexShrink: 0 },
  barTrack: {
    flex: 1, height: 8, borderRadius: 4,
    background: 'var(--cream-dark)', overflow: 'hidden',
  },
  barFill: {
    height: '100%', borderRadius: 4,
    background: 'linear-gradient(90deg, var(--orange), var(--orange-light))',
    transition: 'width 1s ease',
  },
  breakdownScore: { width: 40, fontSize: 12, color: 'var(--text-light)', textAlign: 'right' },
  triGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  card: {
    background: 'white', borderRadius: 'var(--radius)', padding: 20,
    boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 10,
  },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 4 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.5 },
  empty: { fontSize: 13, color: 'var(--text-light)', fontStyle: 'italic' },
  statsRow: {
    display: 'flex', gap: 12, flexWrap: 'wrap',
  },
  statPill: {
    background: 'white', borderRadius: 'var(--radius-sm)', padding: '12px 20px',
    boxShadow: 'var(--shadow-sm)', textAlign: 'center', flex: '1 1 80px',
  },
  statVal: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-dark)' },
  statLabel: { fontSize: 11, color: 'var(--text-light)', marginTop: 2 },
  langRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  langTitle: { fontSize: 13, fontWeight: 600, color: 'var(--text-mid)' },
  langTag: {
    background: 'var(--orange-pale)', color: 'var(--orange)',
    fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
  },
};
