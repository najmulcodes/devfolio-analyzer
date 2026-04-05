import React from 'react';

// ── Named export: Spinner ─────────────────────────────────────────────────────
// Usage: import { Spinner } from '../components/Spinner'
//        import Spinner    from '../components/Spinner'   ← both work
export function Spinner({ size = 32, color = 'var(--orange)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ animation: 'spin 0.8s linear infinite', display: 'block' }}
      aria-label="Loading"
      role="status"
    >
      {/* Track */}
      <circle
        cx="16" cy="16" r="12"
        fill="none"
        stroke="var(--cream-dark, #f7ede0)"
        strokeWidth="3"
      />
      {/* Spinner arc */}
      <circle
        cx="16" cy="16" r="12"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="50 26"
      />
    </svg>
  );
}

// ── Named export: PageLoader ──────────────────────────────────────────────────
// Full-screen loading overlay with blur — used in Analyze.js and Login.js
// Usage: import { PageLoader } from '../components/Spinner'
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'rgba(253, 246, 239, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
    >
      <Spinner size={48} />
      <p style={{
        fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
        fontSize: '0.9375rem',
        color: 'var(--text-mid, #4a3728)',
        fontWeight: 500,
        margin: 0,
      }}>
        {message}
      </p>
    </div>
  );
}

// ── Default export: Spinner ───────────────────────────────────────────────────
// Allows: import Spinner from '../components/Spinner'
// Used in Analyze.js and Login.js which do a default import.
export default Spinner;
