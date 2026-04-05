import React from 'react';

export default function KpiCard({ label, value, sub, icon, trend }) {
  const isPositive = trend > 0;
  const isNeutral  = trend === 0 || trend === undefined;

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--text-light)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {label}
        </div>
        {icon && (
          <span style={{
            fontSize: '1.25rem',
            background: 'var(--orange-pale)',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
          }}>
            {icon}
          </span>
        )}
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '2rem',
        color: 'var(--text-dark)',
        lineHeight: 1,
      }}>
        {value ?? '—'}
      </div>

      {(sub || trend !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend !== undefined && !isNeutral && (
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: isPositive ? 'var(--score-excellent)' : 'var(--score-poor)',
            }}>
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}
            </span>
          )}
          {sub && (
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              color: 'var(--text-light)',
            }}>
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
