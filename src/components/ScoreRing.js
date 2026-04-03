import React from 'react';
import { getScoreColor, getScoreLabel } from '../utils/helpers';

export default function ScoreRing({ score, size = 160 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#f0e8e0" strokeWidth="12"
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: size > 120 ? 36 : 24,
          fontWeight: 800, color,
          lineHeight: 1,
          animation: 'scoreCount 0.6s ease both',
        }}>
          {score}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}
