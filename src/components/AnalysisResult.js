import React, { useState } from 'react';
import ScoreRing from './ScoreRing';
import ScrollStarPrompt from "../components/ScrollStarPrompt";

const scoreColor = (s) => {
  if (s >= 80) return 'var(--score-excellent)';
  if (s >= 60) return 'var(--score-good)';
  if (s >= 40) return 'var(--score-fair)';
  return 'var(--score-poor)';
};
const scoreLabel = (s) => {
  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 40) return 'Fair';
  return 'Needs Work';
};

/* ── Sub-components ──────────────────────────────────────────────────── */

function SectionCard({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--orange-pale)',
      }}>
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: 'var(--text-dark)',
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  );
}

function BreakdownBar({ label, value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 5,
      }}>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.8125rem',
          color: 'var(--text-mid)',
        }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: value > 0 ? 'var(--orange)' : 'var(--text-light)',
        }}>
          {value}/{max}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FeedbackList({ items, type }) {
  if (!items?.length) return null;

  const config = {
    strengths:   { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: '✓' },
    weaknesses:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '!' },
    suggestions: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '→' },
  }[type];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 10,
          padding: '10px 14px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: 'var(--radius-md)',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: config.color,
            minWidth: 18,
            marginTop: 1,
          }}>
            {config.icon}
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--text-dark)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatPill({ label, value, sub }) {
  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--cream)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.375rem',
        color: 'var(--text-dark)',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.7rem',
        color: 'var(--text-light)',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </div>
      {sub && (
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.6875rem',
          color: 'var(--orange)',
          marginTop: 2,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PortfolioSignalGrid({ portfolioData }) {
  const signals = [
    { label: 'Live & Reachable',    value: portfolioData.reachable,    icon: '🌐' },
    { label: 'Projects Section',    value: portfolioData.hasProjects,   icon: '📁' },
    { label: 'Bio / About',         value: portfolioData.hasBio,        icon: '👤' },
    { label: 'Contact / Links',     value: portfolioData.hasLinks,      icon: '🔗' },
    { label: 'Meta Description',    value: portfolioData.hasMetaDesc,   icon: '🏷️' },
    { label: 'OG: Title',           value: portfolioData.hasOgTitle,    icon: '📊' },
    { label: 'OG: Share Image',     value: portfolioData.hasOgImage,    icon: '🖼️' },
    { label: 'GitHub Link',         value: portfolioData.hasGithubLink, icon: '💻' },
    { label: 'Resume / CV',         value: portfolioData.hasResume,     icon: '📄' },
    { label: 'Demo / Live Links',   value: portfolioData.hasDemoLinks,  icon: '🚀' },
    { label: 'Social Links',        value: portfolioData.hasSocialLinks,icon: '📱' },
    { label: 'Responsive Design',   value: portfolioData.hasViewport,   icon: '📐' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 8,
    }}>
      {signals.map(({ label, value, icon }) => (
        <div key={label} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 12px',
          background: value ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${value ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: 'var(--radius-md)',
        }}>
          <span style={{ fontSize: '0.875rem' }}>{icon}</span>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.8rem',
            color: value ? '#166534' : '#991b1b',
            flex: 1,
          }}>
            {label}
          </span>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '0.75rem',
            color: value ? '#22c55e' : '#ef4444',
          }}>
            {value ? '✓' : '✗'}
          </span>
        </div>
      ))}
    </div>
  );
}

function TechStackBadges({ techStack }) {
  if (!techStack?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {techStack.map((tech) => (
        <span key={tech} className="chip">{tech}</span>
      ))}
    </div>
  );
}

function ScoreHeader({ score, label, sub, isAI }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '20px 24px',
      background: `linear-gradient(135deg, var(--orange-pale) 0%, #fff 60%)`,
      borderBottom: '1px solid var(--card-border)',
    }}>
      <ScoreRing score={score} size={80} stroke={7} />
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.5rem',
          color: 'var(--text-dark)',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.875rem',
          color: 'var(--text-light)',
          marginTop: 2,
        }}>
          {sub}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: scoreColor(score),
            color: 'white',
          }}>
            {scoreLabel(score)}
          </span>
          {isAI && (
            <span className="ai-badge">✦ AI Analysis</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tab switcher for combined mode ─────────────────────────────────── */
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '2px solid var(--card-border)',
      background: 'var(--cream)',
    }}>
      {tabs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            borderBottom: active === key ? '2px solid var(--orange)' : '2px solid transparent',
            marginBottom: -2,
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: active === key ? 'var(--orange)' : 'var(--text-light)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>{icon}</span> {label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   GITHUB PANEL
══════════════════════════════════════════════════════════════════════ */
function GitHubPanel({ data, score, breakdown, aiGenerated, strengths, weaknesses, suggestions, summary }) {
  if (!data) return null;

  const ghBreakdown = [
    { label: 'Public Repositories', value: breakdown.repos               ?? 0, max: 25 },
    { label: 'Total Stars',         value: breakdown.stars               ?? 0, max: 20 },
    { label: 'Followers',           value: breakdown.followers            ?? 0, max: 15 },
    { label: 'Recent Activity',     value: breakdown.recentActivity       ?? 0, max: 20 },
    { label: 'Profile Completeness',value: breakdown.profileCompleteness  ?? 0, max: 10 },
    { label: 'Portfolio Bonus',     value: breakdown.portfolioBonus       ?? 0, max: 10 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Profile stats */}
      <SectionCard title="GitHub Stats" icon="📊">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16,
        }}>
          {data.avatarUrl && (
            <img
              src={data.avatarUrl}
              alt={data.name}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '2px solid var(--orange-border)',
              }}
            />
          )}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'var(--text-dark)',
            }}>
              {data.name}
            </div>
            {data.bio && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--text-light)',
                marginTop: 2,
                maxWidth: 360,
              }}>
                {data.bio}
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 8,
          marginBottom: 16,
        }}>
          <StatPill label="Repos"     value={data.publicRepos}       />
          <StatPill label="Stars"     value={data.totalStars}        />
          <StatPill label="Followers" value={data.followers}         />
          <StatPill label="Active (90d)" value={data.recentActiveRepos} />
        </div>

        {data.topLanguages?.length > 0 && (
          <>
            <div className="section-label">Top Languages</div>
            <TechStackBadges techStack={data.topLanguages} />
          </>
        )}
      </SectionCard>

      {/* Score breakdown */}
      <SectionCard title="Score Breakdown" icon="🎯">
        {ghBreakdown.map(item => (
          <BreakdownBar key={item.label} {...item} />
        ))}
      </SectionCard>

      {/* AI feedback */}
      {summary && (
        <SectionCard title="Recruiter Summary" icon="🤖">
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-dark)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            "{summary}"
          </p>
        </SectionCard>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SectionCard title="Strengths" icon="💪">
          <FeedbackList items={strengths} type="strengths" />
        </SectionCard>
        <SectionCard title="Weaknesses" icon="⚠️">
          <FeedbackList items={weaknesses} type="weaknesses" />
        </SectionCard>
      </div>

      <SectionCard title="Suggestions" icon="💡">
        <FeedbackList items={suggestions} type="suggestions" />
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PORTFOLIO PANEL — rich output matching GitHub card design
══════════════════════════════════════════════════════════════════════ */
function PortfolioPanel({ data, score, breakdown, strengths, weaknesses, suggestions, summary }) {
  if (!data) return null;

  const portBreakdown = [
    { label: 'Site Reachability',    value: breakdown.portfolioReachable ?? 0, max: 25 },
    { label: 'Content Depth',        value: breakdown.portfolioContent    ?? 0, max: 35 },
    { label: 'SEO Signals',          value: breakdown.portfolioSEO        ?? 0, max: 20 },
    { label: 'Tech & Links',         value: breakdown.portfolioTech       ?? 0, max: 10 },
    { label: 'Performance Signals',  value: breakdown.portfolioPerf       ?? 0, max: 10 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Portfolio overview */}
      <SectionCard title="Portfolio Overview" icon="🌐">
        {data.title && (
          <div style={{ marginBottom: 12 }}>
            <div className="section-label">Page Title</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'var(--text-dark)',
            }}>
              {data.title}
            </div>
          </div>
        )}
        {data.description && (
          <div style={{ marginBottom: 16 }}>
            <div className="section-label">Meta Description</div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--text-mid)',
              lineHeight: 1.6,
              background: 'var(--cream)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--card-border)',
              margin: 0,
            }}>
              {data.description}
            </p>
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 8,
        }}>
          <StatPill label="Links Found"    value={data.linkCount ?? 0}     />
          <StatPill label="Projects"       value={data.projectCount ?? (data.hasProjects ? '✓' : '—')} />
          <StatPill label="Contact"        value={data.hasLinks ? '✓' : '—'} />
          <StatPill label="SEO Ready"      value={data.hasMetaDesc && data.hasOgTitle ? '✓' : '—'} />
        </div>
      </SectionCard>

      {/* Tech stack detected */}
      {data.techStack?.length > 0 && (
        <SectionCard title="Detected Tech Stack" icon="🛠️">
          <TechStackBadges techStack={data.techStack} />
        </SectionCard>
      )}

      {/* Signal checklist — visual grid */}
      <SectionCard title="Portfolio Signal Checklist" icon="✅">
        <PortfolioSignalGrid portfolioData={data} />
      </SectionCard>

      {/* Score breakdown */}
      <SectionCard title="Score Breakdown" icon="🎯">
        {portBreakdown.map(item => (
          <BreakdownBar key={item.label} {...item} />
        ))}
      </SectionCard>

      {/* Summary */}
      {summary && (
        <SectionCard title="Recruiter Summary" icon="🤖">
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-dark)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            "{summary}"
          </p>
        </SectionCard>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SectionCard title="Strengths" icon="💪">
          <FeedbackList items={strengths} type="strengths" />
        </SectionCard>
        <SectionCard title="Weaknesses" icon="⚠️">
          <FeedbackList items={weaknesses} type="weaknesses" />
        </SectionCard>
      </div>

      <SectionCard title="Suggestions" icon="💡">
        <FeedbackList items={suggestions} type="suggestions" />
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function AnalysisResult({ result }) {
  const [activeTab, setActiveTab] = useState(
    result.mode === 'portfolio' ? 'portfolio' : 'github'
  );

  const {
    mode,
    score,
    githubScore,
    portfolioScore,
    combinedScore,
    scoreBreakdown = {},
    githubData,
    portfolioData,
    strengths   = [],
    weaknesses  = [],
    suggestions = [],
    summary,
    aiGenerated,
    githubUsername,
    portfolioUrl,
  } = result;

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeInUp 0.4s ease',
    }}>
      {/* ── Combined score header ──────────────────────────────────────── */}
      {mode === 'combined' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 0,
          borderBottom: '1px solid var(--card-border)',
          background: 'linear-gradient(135deg, var(--orange-pale), #fff)',
        }}>
          {/* GitHub score */}
          <div style={{
            padding: '20px',
            borderRight: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <ScoreRing score={githubScore} size={64} stroke={6} />
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                GitHub Score
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: scoreColor(githubScore) }}>
                {githubScore}
              </div>
              {githubUsername && (
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  @{githubUsername}
                </div>
              )}
            </div>
          </div>

          {/* Combined score — center */}
          <div style={{
            padding: '20px',
            borderRight: '1px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(245,158,11,0.04)',
          }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Combined Score
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: scoreColor(combinedScore), lineHeight: 1 }}>
              {combinedScore}
            </div>
            <div style={{
              marginTop: 6,
              padding: '3px 12px',
              borderRadius: 'var(--radius-full)',
              background: scoreColor(combinedScore),
              color: 'white',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}>
              {scoreLabel(combinedScore)}
            </div>
            {aiGenerated && <span className="ai-badge" style={{ marginTop: 6 }}>✦ AI</span>}
          </div>

          {/* Portfolio score */}
          <div style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <ScoreRing score={portfolioScore} size={64} stroke={6} />
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                Portfolio Score
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: scoreColor(portfolioScore) }}>
                {portfolioScore}
              </div>
              {portfolioUrl && (
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-light)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {portfolioUrl.replace(/^https?:\/\//, '')}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Single-source header */
        <ScoreHeader
          score={score}
          label={mode === 'github'
            ? (githubData?.name || githubUsername || 'GitHub Profile')
            : (portfolioData?.title || portfolioUrl || 'Portfolio')}
          sub={mode === 'github'
            ? `@${githubUsername} · ${githubData?.publicRepos ?? 0} repos`
            : portfolioUrl}
          isAI={aiGenerated}
        />
      )}

      {/* ── Tab bar for combined mode ────────────────────────────────── */}
      {mode === 'combined' && (
        <TabBar
          tabs={[
            { key: 'github',    label: 'GitHub',    icon: '💻' },
            { key: 'portfolio', label: 'Portfolio',  icon: '🌐' },
            { key: 'feedback',  label: 'AI Feedback',icon: '🤖' },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* ── Tab bar for single-source ────────────────────────────────── */}
      {mode !== 'combined' && (
        <TabBar
          tabs={[
            { key: mode === 'portfolio' ? 'portfolio' : 'github', label: mode === 'portfolio' ? 'Analysis' : 'Analysis', icon: '📊' },
            { key: 'feedback', label: 'AI Feedback', icon: '🤖' },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* ── Panel content ────────────────────────────────────────────── */}
      <div style={{ padding: 20 }}>
        {/* GitHub panel */}
        {activeTab === 'github' && (
          <GitHubPanel
            data={githubData}
            score={githubScore ?? score}
            breakdown={scoreBreakdown}
            aiGenerated={aiGenerated}
            strengths={mode === 'combined' ? [] : strengths}
            weaknesses={mode === 'combined' ? [] : weaknesses}
            suggestions={mode === 'combined' ? [] : suggestions}
            summary={mode === 'combined' ? null : summary}
          />
        )}

        {/* Portfolio panel */}
        {activeTab === 'portfolio' && (
          <PortfolioPanel
            data={portfolioData}
            score={portfolioScore ?? score}
            breakdown={scoreBreakdown}
            strengths={mode === 'combined' ? [] : strengths}
            weaknesses={mode === 'combined' ? [] : weaknesses}
            suggestions={mode === 'combined' ? [] : suggestions}
            summary={mode === 'combined' ? null : summary}
          />
        )}

        {/* Shared AI feedback tab */}
        {activeTab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {summary && (
              <SectionCard title="Recruiter Summary" icon="🤖">
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                }}>
                  "{summary}"
                </p>
              </SectionCard>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <SectionCard title="Strengths" icon="💪">
                <FeedbackList items={strengths} type="strengths" />
              </SectionCard>
              <SectionCard title="Weaknesses" icon="⚠️">
                <FeedbackList items={weaknesses} type="weaknesses" />
              </SectionCard>
            </div>
            <SectionCard title="Suggestions" icon="💡">
              <FeedbackList items={suggestions} type="suggestions" />
            </SectionCard>
          </div>
        )}
      </div>
       <ScrollStarPrompt />


      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--cream)',
      }}>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.75rem',
          color: 'var(--text-light)',
        }}>
          {aiGenerated ? '✦ Dev bY najmulcodes' : '⚡ Rule-based analysis'}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.75rem',
          color: 'var(--text-light)',
        }}>
          DevFolio Analyzer
        </span>
      </div>
    </div>
  );
}
