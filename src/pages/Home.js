import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ── Fade-in on scroll ── */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-fade]');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.10 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [navigate]);
}

const fade = {
  opacity: 0,
  transform: 'translateY(24px)',
  transition: 'opacity 0.6s ease, transform 0.6s ease',
};

export default function Home() {
  const navigate = useNavigate();
  useFadeIn();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="home" className="home-hero" style={styles.hero}>
        <div style={styles.heroBlob1} />
        <div style={styles.heroBlob2} />

        <div style={styles.heroInner}>
          <div style={{ ...fade, ...styles.heroBadge }} data-fade>
            <span style={styles.badgeDot} />
            AI-Powered Portfolio & Github Analysis
          </div>

          <h1 style={{ ...fade, ...styles.heroTitle, transitionDelay: '0.1s' }} data-fade>
           Analyze Your Developer Portfolio & Github
             <span style={{ display: 'block', color: '#f59e0b', marginTop: 4 }}>
            Like a Recruiter
           </span>
            </h1>

          <p style={{ ...fade, ...styles.heroSub, transitionDelay: '0.2s' }} data-fade>
            Get instant insights, scores, and improvement suggestions for your GitHub profile.
            Know exactly what recruiters see — and how to stand out.
          </p>

          <div className="home-hero-btns" style={{ ...fade, ...styles.heroBtns, transitionDelay: '0.3s' }} data-fade>
            <button onClick={() => navigate('/analyze')} style={styles.primaryBtn}>
              Analyze Now
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button onClick={() => navigate('/login')} style={styles.secondaryBtn}>
              Sign In
            </button>
          </div>

          <div className="home-hero-stats" style={{ ...fade, ...styles.statsRow, transitionDelay: '0.4s' }} data-fade>
            {[
              { val: '100', label: 'Max Score'   },
              { val: '6',   label: 'Score Factors' },
              { val: 'AI',  label: 'Powered'     },
              { val: 'Free',label: 'To Use'      },
            ].map(st => (
              <div key={st.label} style={styles.statItem}>
                <div style={styles.statVal}>{st.val}</div>
                <div style={styles.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="home-preview-outer" style={{ ...fade, transitionDelay: "0.5s", width: '100%', maxWidth: 300, }} data-fade>
          <div className="home-preview-card" style={styles.previewCard}>
            <div style={styles.previewBar}>
              <div style={styles.previewDot} />
              <div style={styles.previewDot} />
              <div style={styles.previewDot} />
              <span style={styles.previewUrl}>devfolioanalyzer.vercel.app</span>
            </div>
            <div style={styles.previewBody}>
              <div style={styles.mockKpiRow}>
                {[{ l: 'Total', v: '12' }, { l: 'Avg Score', v: '74' }, { l: 'Best', v: '91' }].map(k => (
                  <div key={k.l} style={styles.mockKpi}>
                    <div style={styles.mockKpiVal}>{k.v}</div>
                    <div style={styles.mockKpiLabel}>{k.l}</div>
                  </div>
                ))}
              </div>
              <div style={styles.mockChart}>
                <svg width="100%" height="72" viewBox="0 0 300 72" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28"/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,55 C40,50 80,26 120,30 C160,34 200,10 240,14 C265,16 282,12 300,6" stroke="#f59e0b" strokeWidth="2.2" fill="none"/>
                  <path d="M0,55 C40,50 80,26 120,30 C160,34 200,10 240,14 C265,16 282,12 300,6 L300,72 L0,72Z" fill="url(#hg)"/>
                </svg>
              </div>
              {[
                { initials: 'NJ', name: '@najmulcodes',    score: 91, pct: '91%', bg: '#f59e0b' },
                { initials: 'PR', name: '@ProgrammingHero1', score: 78, pct: '78%', bg: '#6366f1' },
              ].map(r => (
                <div key={r.name} style={styles.mockRow}>
                  <div style={{ ...styles.mockAva, background: r.bg }}>{r.initials}</div>
                  <div style={styles.mockInfo}>
                    <div style={styles.mockName}>{r.name}</div>
                    <div style={styles.mockBar}>
                      <div style={{ ...styles.mockBarFill, width: r.pct }} />
                    </div>
                  </div>
                  <div style={styles.mockScore}>{r.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="home-features-section" style={styles.featuresSection}>
        <div style={styles.inner}>
          <div style={{ ...fade, ...styles.sectionTag }} data-fade>Features</div>
          <h2 style={{ ...fade, ...styles.sectionTitle, transitionDelay: '0.1s' }} data-fade>
            Everything you need to level up
          </h2>
          <p style={{ ...fade, ...styles.sectionSub, transitionDelay: '0.15s' }} data-fade>
            A complete toolkit for developers who want to present themselves professionally.
          </p>

          <div className="home-features-grid" style={styles.featGrid}>
            {features.map((f, i) => (
              <div
                key={f.title}
                style={{ ...fade, ...styles.featCard, transitionDelay: `${0.1 + i * 0.07}s` }}
                data-fade
              >
                <div style={{ ...styles.featIcon, background: f.iconBg }}>{f.icon}</div>
                <h3 style={styles.featTitle}>{f.title}</h3>
                <p style={styles.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="home-how-section" style={styles.howSection}>
        <div style={styles.inner}>
          <div style={{ ...fade, ...styles.sectionTag }} data-fade>Process</div>
          <h2 style={{ ...fade, ...styles.sectionTitle, transitionDelay: '0.1s' }} data-fade>
            Three steps to a better profile
          </h2>

          <div className="home-steps-grid" style={styles.stepsGrid}>
            {steps.map((st, i) => (
              <div
                key={st.step}
                style={{ ...fade, ...styles.stepCard, transitionDelay: `${0.1 + i * 0.1}s` }}
                data-fade
              >
                <div style={styles.stepNum}>{st.step}</div>
                <div style={styles.stepIcon}>{st.icon}</div>
                <h3 style={styles.stepTitle}>{st.title}</h3>
                <p style={styles.stepDesc}>{st.desc}</p>
                {i < steps.length - 1 && <div className="step-arrow" style={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="home-cta-section" style={styles.ctaSection}>
        <div style={{ ...fade, ...styles.ctaInner }} data-fade>
          <div style={styles.ctaGlow} />
          <h2 style={styles.ctaTitle}>Start improving your portfolio today</h2>
          <p style={styles.ctaSub}>
            It only takes 10 seconds. Enter your GitHub username and get your score instantly.
          </p>
          <button onClick={() => navigate('/analyze')} style={styles.ctaBtn}>
            Analyze My Profile
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <p style={styles.ctaNote}>No account required · Free forever</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Data ── */
const features = [
  {
    title: 'GitHub Score',
    desc: 'Get a comprehensive score based on repos, stars, commits, contribution activity, and more.',
    iconBg: 'rgba(245,158,11,0.10)',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: 'AI Feedback',
    desc: 'Receive personalized, actionable suggestions powered by AI to improve your developer presence.',
    iconBg: 'rgba(99,102,241,0.10)',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
    ),
  },
  {
    title: 'Portfolio Analysis',
    desc: 'Add your portfolio URL for bonus points and detailed feedback on your personal site.',
    iconBg: 'rgba(34,197,94,0.10)',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: 'Progress Tracking',
    desc: 'Save analyses over time and watch your score improve as you enhance your developer profile.',
    iconBg: 'rgba(239,68,68,0.10)',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

const steps = [
  {
    step: '01',
    title: 'Enter Username',
    desc: 'Type in any GitHub username — yours or someone else\'s — to get started instantly.',
    icon: (
      <svg width="26" height="26" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'AI Analysis',
    desc: 'Our AI fetches your GitHub data and scores it across 6 key dimensions in seconds.',
    icon: (
      <svg width="26" height="26" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Get Your Score',
    desc: 'Receive a detailed score, strengths, weaknesses, and actionable tips to improve.',
    icon: (
      <svg width="26" height="26" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

/* ── Styles ── */
const styles = {
  page: {
    background: 'linear-gradient(145deg, #ede8df 0%, #e8ddd0 40%, #dfd3c0 100%)',
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif',
  },
  inner: { maxWidth: 1080, margin: '0 auto' },

  /* hero */
  hero: {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '80px 48px 60px',
  display: 'flex',
  alignItems: 'center',
  gap: 60,
  flexWrap: 'wrap', 
},
  heroBlob1: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 68%)',
    top: -120, right: -80, pointerEvents: 'none',
  },
  heroBlob2: {
    position: 'absolute', width: 350, height: 350, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
    bottom: -60, left: 40, pointerEvents: 'none',
  },
  heroInner: { flex: 1, minWidth: 300, position: 'relative', zIndex: 1 },

  heroBadge: {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,

  padding: '6px 16px',
  borderRadius: 999,

  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',

  color: '#b45309',

  background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(251,191,36,0.10))',
  border: '1px solid rgba(245,158,11,0.35)',

  boxShadow: `
    inset 0 0 0 1px rgba(255,255,255,0.15),
    0 4px 12px rgba(245,158,11,0.20),
    0 0 24px rgba(245,158,11,0.12)
  `,

  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',

  marginBottom: 30, // kept same spacing as your original
},

badgeDot: {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#f59e0b',
  flexShrink: 0,

  boxShadow: `
    0 0 6px #f59e0b,
    0 0 12px rgba(245,158,11,0.7),
    0 0 20px rgba(245,158,11,0.5)
  `,

  animation: 'pulseGlow 2s ease-in-out infinite',
},
  heroTitle: {
    fontSize: 'clamp(32px, 4.5vw, 52px)',
    fontWeight: 700, color: '#1a1a1a', lineHeight: 1.18,
    marginBottom: 25, letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: 16, color: '#6b7280', lineHeight: 1.72, marginBottom: 25,
  },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 25 },

  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '13px 26px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white', fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(245,158,11,0.38)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    fontFamily: 'Poppins, sans-serif',
  },
  secondaryBtn: {
    padding: '13px 26px', borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.14)',
    background: 'rgba(255,255,255,0.65)',
    color: '#374151', fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.18s', fontFamily: 'Poppins, sans-serif',
  },
  statsRow: { display: 'flex', gap: 28, flexWrap: 'wrap' },
  statItem: {},
  statVal:  { fontSize: 26, fontWeight: 700, color: '#f59e0b', letterSpacing: '-0.5px' },
  statLabel:{ fontSize: 11.5, color: '#9ca3af', fontWeight: 500, marginTop: 1 },

  /* preview card */
  previewCard: {
    background: '#fff', borderRadius: 20,
    boxShadow: '0 20px 60px rgba(100,60,10,0.16)',
    overflow: 'hidden', width: 340, flexShrink: 0,
    border: '1px solid rgba(0,0,0,0.07)',
  },
  previewBar: {
    background: '#f9fafb', padding: '10px 16px',
    display: 'flex', alignItems: 'center', gap: 6,
    borderBottom: '1px solid #f0f0f0',
  },
  previewDot: { width: 9, height: 9, borderRadius: '50%', background: '#e5e7eb' },
  previewUrl: { fontSize: 10.5, color: '#9ca3af', marginLeft: 4, fontFamily: 'monospace' },
  previewBody:{ padding: 18, display: 'flex', flexDirection: 'column', gap: 13 },
  mockKpiRow: { display: 'flex', gap: 8 },
  mockKpi: {
    flex: 1, background: '#fef9f0', borderRadius: 10, padding: '9px 10px', textAlign: 'center',
  },
  mockKpiVal:  { fontSize: 18, fontWeight: 700, color: '#f59e0b', letterSpacing: '-0.5px' },
  mockKpiLabel:{ fontSize: 9.5, color: '#9ca3af', marginTop: 1 },
  mockChart:   { background: '#fef9f0', borderRadius: 10, padding: '6px 4px 0', overflow: 'hidden' },
  mockRow:     { display: 'flex', alignItems: 'center', gap: 9 },
  mockAva: {
    width: 30, height: 30, borderRadius: '50%', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10.5, fontWeight: 700, flexShrink: 0,
  },
  mockInfo:    { flex: 1 },
  mockName:    { fontSize: 11.5, fontWeight: 600, color: '#374151', marginBottom: 3 },
  mockBar:     { height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' },
  mockBarFill: { height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: 3 },
  mockScore:   { fontSize: 12.5, fontWeight: 700, color: '#f59e0b', width: 24, textAlign: 'right' },

  /* features */
  featuresSection: { padding: '30px 48px', background: '#fff' },
  sectionTag: {
    display: 'inline-block',
    background: 'rgba(245,158,11,0.10)',
    color: '#92400e', fontSize: 11, fontWeight: 700,
    padding: '4px 13px', borderRadius: 99, marginBottom: 16,
    textTransform: 'uppercase', letterSpacing: '0.1em',
  },
  sectionTitle: {
    fontSize: 'clamp(26px, 3.5vw, 38px)',
    fontWeight: 700, color: '#1a1a1a', marginBottom: 12, letterSpacing: '-0.4px',
  },
  sectionSub: {
    fontSize: 15.5, color: '#6b7280', lineHeight: 1.7, marginBottom: 50, maxWidth: 540,
  },
  featGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 22,
  },
  featCard: {
    background: '#fff', borderRadius: 18, padding: '26px 22px',
    border: '1.5px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  featIcon: {
    width: 48, height: 48, borderRadius: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  featTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 9, letterSpacing: '-0.2px' },
  featDesc:  { fontSize: 13.5, color: '#6b7280', lineHeight: 1.68 },

  /* how it works */
  howSection: { padding: '96px 48px', background: 'linear-gradient(180deg, #fef9f2 0%, #fff 100%)' },
  stepsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 22, position: 'relative',
  },
  stepCard: {
    background: '#fff', borderRadius: 18, padding: '30px 26px',
    boxShadow: '0 4px 20px rgba(100,60,10,0.07)',
    position: 'relative', textAlign: 'center',
    border: '1.5px solid rgba(245,158,11,0.10)',
  },
  stepNum: {
    fontSize: 44, fontWeight: 700, color: 'rgba(245,158,11,0.13)',
    lineHeight: 1, marginBottom: 12, letterSpacing: '-2px',
  },
  stepIcon: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 18px',
  },
  stepTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 9, letterSpacing: '-0.2px' },
  stepDesc:  { fontSize: 13.5, color: '#6b7280', lineHeight: 1.68 },
  stepArrow: {
    position: 'absolute', right: -13, top: '50%', transform: 'translateY(-50%)',
    fontSize: 22, color: '#f59e0b', fontWeight: 700, zIndex: 1,
  },

  /* cta */
  ctaSection: { padding: '96px 48px', background: '#1a1a1a' },
  ctaInner:   { maxWidth: 620, margin: '0 auto', textAlign: 'center', position: 'relative' },
  ctaGlow: {
    position: 'absolute', width: 440, height: 440, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
  },
  ctaTitle: {
    fontSize: 'clamp(26px, 3.8vw, 42px)',
    fontWeight: 700, color: '#fff', marginBottom: 16,
    position: 'relative', letterSpacing: '-0.4px',
  },
  ctaSub:  { fontSize: 15.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 34, position: 'relative' },
  ctaBtn:  {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 32px', borderRadius: 13, border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 8px 28px rgba(245,158,11,0.38)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    fontFamily: 'Poppins, sans-serif', position: 'relative',
  },
  ctaNote: {
    marginTop: 16, fontSize: 12.5, color: 'rgba(255,255,255,0.30)', position: 'relative',
  },
};
