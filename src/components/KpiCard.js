import React from 'react';

export default function KpiCard({ label, value, sub, icon, color = '#f59e0b', delay = 0 }) {
  return (
    <div
      className="glass-card glass-card-lift fade-up"
      style={{ ...s.card, animationDelay: `${delay}ms` }}
    >
      <div style={{ ...s.iconWrap, background: color + '16' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={s.value}>{value ?? '—'}</div>
      <div style={s.label}>{label}</div>
      {sub && <div style={s.sub}>{sub}</div>}
    </div>
  );
}

const s = {
  card: {
    padding: '22px 20px',
    display: 'flex', flexDirection: 'column', gap: 5,
    cursor: 'default',
  },
  iconWrap: {
    width: 42, height: 42, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, flexShrink: 0,
  },
  value: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 30, fontWeight: 800, color: 'var(--text-900)', lineHeight: 1,
  },
  label: { fontSize: 12.5, fontWeight: 500, color: 'var(--text-500)' },
  sub:   { fontSize: 11.5, color: 'var(--text-300)', marginTop: 1 },
};
