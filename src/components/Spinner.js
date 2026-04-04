import React from 'react';

export default function Spinner({ size = 28, color = 'var(--amber)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2.5px solid ${color}28`,
      borderTop: `2.5px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
      <Spinner size={44} />
      <p style={{ color: 'var(--text-500)', fontSize: 13.5, fontWeight: 500 }}>{message}</p>
    </div>
  );
}

export function SkeletonCard({ height = 120 }) {
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height, borderRadius: 12 }} />
    </div>
  );
}
