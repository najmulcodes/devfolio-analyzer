import React, { useEffect, useState } from 'react';

const scoreColor = (s) => {
  if (s >= 80) return '#22c55e';
  if (s >= 60) return '#f59e0b';
  if (s >= 40) return '#ff6b35';
  return '#ef4444';
};

export default function ScoreRing({ score = 0, size = 120, stroke = 10 }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate the number
  useEffect(() => {
    const target = score;
    const duration = 900;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplayScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const radius      = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (score / 100) * circumference;
  const color       = scoreColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--cream-dark)"
          strokeWidth={stroke}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </svg>
      {/* Score number */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: size >= 100 ? '1.75rem' : size >= 70 ? '1.25rem' : '1rem',
          color,
          lineHeight: 1,
        }}>
          {displayScore}
        </span>
        {size >= 100 && (
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6875rem',
            color: 'var(--text-light)',
            marginTop: 2,
          }}>
            / 100
          </span>
        )}
      </div>
    </div>
  );
}
