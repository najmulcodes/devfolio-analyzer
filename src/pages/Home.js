import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── tiny hook: fade-in on scroll ─── */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-fade]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const fadeStyle = {
  opacity: 0,
  transform: 'translateY(28px)',
  transition: 'opacity 0.65s ease, transform 0.65s ease',
};

export default function Home() {
  const navigate = useNavigate();
  useFadeIn();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ══════════════ HERO ══════════════ */}
      <section id="home" style={styles.hero}>
        {/* decorative blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={styles.heroInner}>
          <div style={{ ...fadeStyle, ...styles.heroBadge }} data-fade>
            <span style={styles.badgeDot} />
            AI-Powered Portfolio Analysis
          </div>

          <h1 style={{ ...fadeStyle, ...styles.heroTitle, transitionDelay: '0.1s' }} data-fade>
            Analyze Your Developer Portfolio
            <span style={styles.heroAccent}> Like a Recruiter</span>
          </h1>

          <p style={{ ...fadeStyle, ...styles.heroSub, transitionDelay: '0.2s' }} data-fade>
            Get instant insights, scores, and improvement suggestions for your GitHub profile.
            Know exactly what recruiters see — and how to stand out.
          </p>

          <div style={{ ...fadeStyle, ...styles.heroBtns, transitionDelay: '0.3s' }} data-fade>
            <button onClick={() => navigate('/analyze')} style={styles.primaryBtn}>
              Analyze Now
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button onClick={() => navigate('/login')} style={styles.secondaryBtn}>
              Sign In
            </button>
          </div>

          {/* Stats row */}
          <div style={{ ...fadeStyle, ...styles.statsRow, transitionDelay: '0.4s' }} data-fade>
            {[
              { val: '100', label: 'Max Score' },
              { val: '6', label: 'Score Factors' },
              { val: 'AI', label: 'Powered' },
              { val: 'Free', label: 'To Use' },
            ].map((s) => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statVal}>{s.val}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview card */}
        <div style={{ ...fadeStyle, transitionDelay: '0.5s' }} data-fade>
          <div style={styles.previewCard}>
            <div style={styles.previewBar}>
              <div style={styles.previewDot} /><div style={styles.previewDot} /><div style={styles.previewDot} />
              <span style={styles.previewBarText}>devfolio-analyzer.vercel.app</span>
            </div>
            <div style={styles.previewBody}>
              {/* Mock dashboard */}
              <div style={styles.mockKpiRow}>
                {[
                  { label: 'Total', val: '12' },
                  { label: 'Avg Score', val: '74' },
                  { label: 'Best', val: '91' },
                ].map((k) => (
                  <div key={k.label} style={styles.mockKpi}>
                    <div style={styles.mockKpiVal}>{k.val}</div>
                    <div style={styles.mockKpiLabel}>{k.label}</div>
                  </div>
                ))}
              </div>
              <div style={styles.mockChart}>
                <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,60 C40,55 80,30 120,35 C160,40 200,15 240,20 C260,22 280,18 300,10" stroke="#f59e0b" strokeWidth="2.5" fill="none"/>
                  <path d="M0,60 C40,55 80,30 120,35 C160,40 200,15 240,20 C260,22 280,18 300,10 L300,80 L0,80Z" fill="url(#chartGrad)"/>
                </svg>
              </div>
              <div style={styles.mockRow}>
                <div style={styles.mockAvatar}>TL</div>
                <div style={styles.mockInfo}>
                  <div style={styles.mockName}>@torvalds</div>
                  <div style={styles.mockBar}><div style={{ ...styles.mockBarFill, width: '91%' }} /></div>
                </div>
                <div style={styles.mockScore}>91</div>
              </div>
              <div style={styles.mockRow}>
                <div style={{ ...styles.mockAvatar, background: '#6366f1' }}>DK</div>
                <div style={styles.mockInfo}>
                  <div style={styles.mockName}>@dan_abramov</div>
                  <div style={styles.mockBar}><div style={{ ...styles.mockBarFill, width: '78%' }} /></div>
                </div>
                <div style={styles.mockScore}>78</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionInner}>
          <div style={{ ...fadeStyle, ...styles.sectionLabel }} data-fade>Features</div>
          <h2 style={{ ...fadeStyle, ...styles.sectionTitle, transitionDelay: '0.1s' }} data-fade>
            Everything you need to level up
          </h2>
          <p style={{ ...fadeStyle, ...styles.sectionSub, transitionDelay: '0.15s' }} data-fade>
            A complete toolkit for developers who want to present themselves professionally.
          </p>

          <div style={styles.featuresGrid}>
            {features.map((f, i) => (
              <div
                key={f.title}
                style={{ ...fadeStyle, ...styles.featureCard, transitionDelay: `${0.1 + i * 0.08}s` }}
                data-fade
              >
                <div style={{ ...styles.featureIcon, background: f.iconBg }}>
                  {f.icon}
                </div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" style={styles.howSection}>
        <div style={styles.sectionInner}>
          <div style={{ ...fadeStyle, ...styles.sectionLabel }} data-fade>Process</div>
          <h2 style={{ ...fadeStyle, ...styles.sectionTitle, transitionDelay: '0.1s' }} data-fade>
            Three steps to a better profile
          </h2>

          <div style={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div
                key={s.step}
                style={{ ...fadeStyle, ...styles.stepCard, transitionDelay: `${0.1 + i * 0.1}s` }}
                data-fade
              >
                <div style={styles.stepNum}>{s.step}</div>
                <div style={styles.stepIcon}>{s.icon}</div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
                {i < steps.length - 1 && <div style={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={styles.ctaSection}>
        <div style={{ ...fadeStyle, ...styles.ctaInner }} data-fade>
          <div style={styles.ctaGlow} />
          <h2 style={styles.ctaTitle}>Start improving your portfolio today</h2>
          <p style={styles.ctaSub}>
            It only takes 10 seconds. Enter your GitHub username and get your score instantly.
          </p>
          <button onClick={() => navigate('/analyze')} style={styles.ctaBtn}>
            Analyze Now — It's Free
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <p style={styles.ctaNote}>No account needed for instant analysis</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Data ─── */
const features = [
  {
    title: 'GitHub Analysis',
    desc: 'Deep analysis of your repos, stars, followers, activity, and profile completeness across 6 scored dimensions.',
    iconBg: '#fff7ed',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    title: 'Portfolio Review',
    desc: 'Link your portfolio website for a bonus score. We check if it\'s live and factor it into your overall evaluation.',
    iconBg: '#f0fdf4',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: 'AI Suggestions',
    desc: 'Claude AI generates professional, human-like feedback with actionable suggestions specific to your profile.',
    iconBg: '#fdf4ff',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/>
        <path d="M22 2 12 12"/><path d="m17 2 5 5-5 5"/>
      </svg>
    ),
  },
  {
    title: 'Score Tracking',
    desc: 'Sign in to save every analysis and visualize your improvement over time with charts and trend indicators.',
    iconBg: '#eff6ff',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

const steps = [
  {
    step: '01',
    title: 'Enter GitHub Username',
    desc: 'Paste your GitHub username and optionally add your portfolio URL for a complete evaluation.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Get Your Analysis',
    desc: 'Receive a score from 0–100 with detailed breakdown, strengths, weaknesses, and AI-powered suggestions.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Improve & Track',
    desc: 'Act on the suggestions, re-run the analysis, and watch your score improve over time on your dashboard.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

/* ─── Styles ─── */
const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },

  /* Hero */
  hero: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef9f0 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexWrap: 'wrap', gap: 48,
    padding: '120px 40px 80px',
    position: 'relative', overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)',
    top: -100, right: -100, pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
    bottom: -80, left: -80, pointerEvents: 'none',
  },
  heroInner: { maxWidth: 560, flex: '1 1 400px', position: 'relative' },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
    color: '#92400e', fontSize: 13, fontWeight: 600,
    padding: '6px 14px', borderRadius: 20, marginBottom: 20,
    fontFamily: 'Poppins, sans-serif',
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#f59e0b', boxShadow: '0 0 6px #f59e0b',
    animation: 'pulse 2s infinite',
  },
  heroTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 800, color: '#1f2937', lineHeight: 1.15,
    marginBottom: 20,
  },
  heroAccent: { color: '#f59e0b' },
  heroSub: {
    fontSize: 17, color: '#6b7280', lineHeight: 1.7,
    marginBottom: 32, fontFamily: 'Poppins, sans-serif',
    fontWeight: 400,
  },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 },
  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 28px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #ff6b35)',
    color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    fontFamily: 'Poppins, sans-serif',
  },
  secondaryBtn: {
    padding: '14px 28px', borderRadius: 12,
    border: '2px solid rgba(245,158,11,0.35)',
    background: 'rgba(255,255,255,0.7)',
    color: '#92400e', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.18s',
    fontFamily: 'Poppins, sans-serif',
  },
  statsRow: {
    display: 'flex', gap: 24, flexWrap: 'wrap',
  },
  statItem: { textAlign: 'center' },
  statVal: {
    fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#f59e0b',
  },
  statLabel: { fontSize: 12, color: '#9ca3af', fontFamily: 'Poppins, sans-serif' },

  /* Preview card */
  previewCard: {
    background: 'white', borderRadius: 20,
    boxShadow: '0 24px 64px rgba(139,69,19,0.16)',
    overflow: 'hidden', width: 340, flexShrink: 0,
    border: '1px solid rgba(245,158,11,0.15)',
  },
  previewBar: {
    background: '#f9fafb', padding: '10px 16px',
    display: 'flex', alignItems: 'center', gap: 6,
    borderBottom: '1px solid #f3f4f6',
  },
  previewDot: { width: 10, height: 10, borderRadius: '50%', background: '#e5e7eb' },
  previewBarText: { fontSize: 11, color: '#9ca3af', marginLeft: 6, fontFamily: 'monospace' },
  previewBody: { padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  mockKpiRow: { display: 'flex', gap: 10 },
  mockKpi: {
    flex: 1, background: '#fef9f0', borderRadius: 10, padding: '10px 12px',
    textAlign: 'center',
  },
  mockKpiVal: { fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#f59e0b' },
  mockKpiLabel: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  mockChart: {
    background: '#fef9f0', borderRadius: 10, padding: '8px 4px', overflow: 'hidden',
  },
  mockRow: { display: 'flex', alignItems: 'center', gap: 10 },
  mockAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#f59e0b', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  mockInfo: { flex: 1 },
  mockName: { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 },
  mockBar: { height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  mockBarFill: { height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ff6b35)', borderRadius: 3 },
  mockScore: { fontSize: 13, fontWeight: 700, color: '#f59e0b', width: 28, textAlign: 'right' },

  /* Features */
  featuresSection: {
    padding: '100px 40px', background: 'white',
  },
  sectionInner: { maxWidth: 1080, margin: '0 auto' },
  sectionLabel: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    color: '#92400e', fontSize: 12, fontWeight: 700,
    padding: '4px 14px', borderRadius: 20, marginBottom: 16,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    fontFamily: 'Poppins, sans-serif',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: 800, color: '#1f2937', marginBottom: 12,
  },
  sectionSub: {
    fontSize: 16, color: '#6b7280', lineHeight: 1.7,
    marginBottom: 52, fontFamily: 'Poppins, sans-serif', maxWidth: 560,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 24,
  },
  featureCard: {
    background: 'white', borderRadius: 20, padding: '28px 24px',
    border: '1.5px solid #f3f4f6',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  featureIcon: {
    width: 52, height: 52, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 18,
  },
  featureTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700,
    color: '#1f2937', marginBottom: 10,
  },
  featureDesc: {
    fontSize: 14, color: '#6b7280', lineHeight: 1.7,
    fontFamily: 'Poppins, sans-serif',
  },

  /* How it works */
  howSection: {
    padding: '100px 40px',
    background: 'linear-gradient(135deg, #fef9f0, #fff)',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24, position: 'relative',
  },
  stepCard: {
    background: 'white', borderRadius: 20, padding: '32px 28px',
    boxShadow: '0 4px 20px rgba(139,69,19,0.08)',
    position: 'relative', textAlign: 'center',
    border: '1.5px solid rgba(245,158,11,0.1)',
  },
  stepNum: {
    fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 800,
    color: 'rgba(245,158,11,0.15)', lineHeight: 1, marginBottom: 12,
  },
  stepIcon: {
    width: 60, height: 60, borderRadius: '50%',
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700,
    color: '#1f2937', marginBottom: 10,
  },
  stepDesc: {
    fontSize: 14, color: '#6b7280', lineHeight: 1.7,
    fontFamily: 'Poppins, sans-serif',
  },
  stepArrow: {
    position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)',
    fontSize: 24, color: '#f59e0b', fontWeight: 700, zIndex: 1,
  },

  /* CTA */
  ctaSection: {
    padding: '100px 40px',
    background: '#1f2937',
  },
  ctaInner: {
    maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative',
  },
  ctaGlow: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    pointerEvents: 'none',
  },
  ctaTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(28px, 4vw, 44px)',
    fontWeight: 800, color: 'white', marginBottom: 16,
    position: 'relative',
  },
  ctaSub: {
    fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
    marginBottom: 36, fontFamily: 'Poppins, sans-serif',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '16px 36px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #ff6b35)',
    color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 8px 28px rgba(245,158,11,0.4)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    fontFamily: 'Poppins, sans-serif',
    position: 'relative',
  },
  ctaNote: {
    marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.35)',
    fontFamily: 'Poppins, sans-serif',
  },
};
