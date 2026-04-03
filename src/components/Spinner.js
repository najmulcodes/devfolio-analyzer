import React from 'react';

export default function Spinner({ size = 32, color = 'var(--orange)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid ${color}30`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '60vh', gap: 16,
    }}>
      <Spinner size={48} />
      <p style={{ color: 'var(--text-light)', fontSize: 14 }}>{message}</p>
    </div>
  );
}
