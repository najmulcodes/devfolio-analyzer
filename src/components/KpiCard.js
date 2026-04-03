import React from 'react';

export default function KpiCard({ label, value, sub, icon, color = 'var(--orange)', delay = 0 }) {
  return (
    <div style={{ ...styles.card, animationDelay: `${delay}ms` }} className="fade-up">
      <div style={{ ...styles.iconWrap, background: color + '18' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: 'var(--radius)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 32, fontWeight: 800, color: 'var(--text-dark)',
    lineHeight: 1,
  },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--text-light)' },
  sub: { fontSize: 12, color: 'var(--text-light)', marginTop: 2 },
};
