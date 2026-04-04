import React from 'react';
import { getScoreColor, getScoreLabel } from '../utils/helpers';

export default function ScoreRing({ score, size = 140 }) {
  const r = (size - 18) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(180,140,90,0.12)" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: size > 110 ? 30 : 22, fontWeight: 800, color, lineHeight: 1, animation: 'scoreCount 0.6s ease both' }}>
          {score}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-500)', marginTop: 3, fontWeight: 600 }}>
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}
