import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Brain, ClipboardList, TrendingUp } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={s.container}>
      {/* Hero Section Background */}
      <div style={s.bgWrapper}>
        <div style={s.bgOverlay} />
      </div>

      {/* Navbar */}
      <nav style={s.nav} className="animate-fade-in responsive-nav">
        <div style={s.logo}>
          <div style={s.logoIcon}>🥑</div>
          NutriAgent
        </div>
        <div style={s.navLinks} className="responsive-nav-links">
        </div>
        <div style={s.navRight}>
          <button style={s.navCta} onClick={() => navigate('/profile')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={s.hero} className="responsive-hero">
        <div style={s.heroLeft} className="animate-slide-in-left">
          <div style={s.badge}>
            <Sparkles size={14} color="#4ade80" />
            <span>AI NUTRITION ASSISTANT</span>
          </div>
          
          <h1 style={s.title}>
            Meet Your<br />
            <span style={s.titleHighlight}>AI Nutrition<br />Assistant</span>
          </h1>
          
          <p style={s.subtitle}>
            Personalized meal plans, smart tracking, and real-time insights to help you eat better, stay healthy and live your best life.
          </p>
          
          <div style={s.ctaGroup} className="cta-group">
            <button style={s.primaryBtn} onClick={() => navigate('/profile')}>
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={s.howItWorks}>
        <div style={s.hiwHeader}>
          <h2 style={s.hiwTitle}>How NutriAgent Works 🌿</h2>
          <p style={s.hiwSubtitle}>Your journey to better health in 4 simple steps</p>
        </div>

        <div style={s.stepsContainer} className="responsive-steps-container">
          {/* Step 1 */}
          <div style={s.stepCard}>
            <div style={s.stepNumber}>1</div>
            <div style={s.stepIconBox}><User size={28} color="#4ade80" /></div>
            <h4 style={s.stepTitle}>Create Your Profile</h4>
            <p style={s.stepDesc}>Tell us about yourself, your goals and preferences.</p>
          </div>
          
          <div style={s.stepConnector} className="responsive-step-connector" />

          {/* Step 2 */}
          <div style={s.stepCard}>
            <div style={s.stepNumber}>2</div>
            <div style={s.stepIconBox}><Brain size={28} color="#4ade80" /></div>
            <h4 style={s.stepTitle}>AI Analyzes</h4>
            <p style={s.stepDesc}>Our AI analyzes your data and creates a personalized plan.</p>
          </div>

          <div style={s.stepConnector} className="responsive-step-connector" />

          {/* Step 3 */}
          <div style={s.stepCard}>
            <div style={s.stepNumber}>3</div>
            <div style={s.stepIconBox}><ClipboardList size={28} color="#4ade80" /></div>
            <h4 style={s.stepTitle}>Get Your Plan</h4>
            <p style={s.stepDesc}>Receive customized meal plans, recipes and nutrition tips.</p>
          </div>

          <div style={s.stepConnector} className="responsive-step-connector" />

          {/* Step 4 */}
          <div style={s.stepCard}>
            <div style={s.stepNumber}>4</div>
            <div style={s.stepIconBox}><TrendingUp size={28} color="#4ade80" /></div>
            <h4 style={s.stepTitle}>Track & Improve</h4>
            <p style={s.stepDesc}>Track your progress and improve your health every day.</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section style={s.showcaseSection}>
        <div style={s.showcaseContainer} className="responsive-showcase">
          <div style={s.showcaseLeft}>
            <div style={s.showcaseBadge}>
              <Sparkles size={12} color="#4ade80" /> SMART DASHBOARD
            </div>
            <h2 style={s.showcaseTitle}>
              Everything You Need,<br/>All in One Place
            </h2>
            <p style={s.showcaseDesc}>
              Track, analyze and improve your nutrition with our powerful and beautiful dashboard.
            </p>
            <button style={s.showcaseBtn} onClick={() => navigate('/profile')}>
              Explore Dashboard <ArrowRight size={16} />
            </button>
          </div>
          <div style={s.showcaseRight}>
            <div style={s.showcaseMockup} className="responsive-mockup">
              <div style={s.mockSidebar} className="responsive-mockup-sidebar">
                <div style={s.mockLogo}>🥑 NutriAgent</div>
                <div style={s.mockNavItemActive}>🏠 Overview</div>
                <div style={s.mockNavItem}>🍴 Meals</div>
                <div style={s.mockNavItem}>📊 Analytics</div>
                <div style={s.mockNavItem}>📈 Progress</div>
                <div style={s.mockNavItem}>🍳 Recipes</div>
              </div>
              <div style={s.mockMain} className="responsive-mockup-main">
                <div style={s.mockHeader}>Dashboard Overview</div>
                <div style={s.mockCards} className="responsive-mockup-cards">
                  <div style={s.mockCard}>
                    <div style={s.mockCardTitle}>Calories</div>
                    <div style={s.mockCardValue}>1820 <span style={s.mockCardSub}>kcal</span></div>
                    <div style={s.mockChartPlaceholder} />
                  </div>
                  <div style={s.mockCard}>
                    <div style={s.mockCardTitle}>Protein</div>
                    <div style={s.mockCardValue}>110 <span style={s.mockCardSub}>g</span></div>
                    <div style={{...s.mockChartPlaceholder, opacity: 0.6}} />
                  </div>
                  <div style={s.mockCard}>
                    <div style={s.mockCardTitle}>Water</div>
                    <div style={s.mockCardValue}>2.8 <span style={s.mockCardSub}>L</span></div>
                    <div style={{...s.mockChartPlaceholder, background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)'}} />
                  </div>
                </div>
                <div style={s.mockBottomArea} className="responsive-mockup-cards">
                  <div style={{...s.mockCard, flex: 2}}>
                    <div style={s.mockCardTitle}>Nutrition Trend</div>
                    <div style={{height: '100px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(180deg, rgba(74,222,128,0.15) 0%, transparent 100%)', position: 'relative', marginTop: 10}}>
                      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M0,80 Q25,20 50,60 T100,40" fill="none" stroke="#4ade80" strokeWidth="2"/></svg>
                    </div>
                  </div>
                  <div style={{...s.mockCard, flex: 1}}>
                    <div style={s.mockCardTitle}>Today</div>
                    <div style={s.mockRing}>
                      <div style={s.mockRingValue}>82%</div>
                      <div style={s.mockRingSub}>Goal Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

const s = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#03170a', // Dark forest green background
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
    color: '#fff',
  },
  bgWrapper: {
    position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
    backgroundImage: 'url(/hero_bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  bgOverlay: {
    position: 'absolute', inset: 0, 
    background: 'linear-gradient(90deg, #021207 0%, rgba(2, 18, 7, 0.8) 40%, rgba(2, 18, 7, 0.2) 100%)',
  },
  nav: {
    position: 'relative', zIndex: 10,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 48px',
    maxWidth: '1400px', margin: '0 auto', width: '100%',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Nunito', sans-serif",
  },
  logoIcon: {
    background: 'rgba(255,255,255,0.1)', padding: 6, borderRadius: 8, fontSize: '1.2rem',
  },
  navLinks: {
    display: 'flex', gap: '32px',
  },
  navLink: {
    color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
    transition: 'color 0.2s',
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '24px' },
  navCta: {
    background: '#4ade80', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px',
    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s',
  },
  hero: {
    position: 'relative', zIndex: 10,
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
    padding: '60px 48px 120px', maxWidth: '1400px', margin: '0 auto', width: '100%', gap: '60px',
    minHeight: '80vh',
  },
  heroLeft: {
    flex: '1 1 500px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)',
    padding: '6px 16px', borderRadius: '100px', width: 'fit-content',
    color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
  },
  title: {
    fontSize: 'clamp(3.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1,
    fontFamily: "'Nunito', sans-serif", margin: 0, color: '#fff',
  },
  titleHighlight: {
    color: '#4ade80',
  },
  subtitle: {
    fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '500px', margin: '8px 0 16px',
  },
  ctaGroup: {
    display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#4ade80', color: '#064e3b', border: 'none', padding: '16px 32px', borderRadius: '12px',
    fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px',
    cursor: 'pointer', transition: 'transform 0.2s',
  },
  
  // How It Works
  howItWorks: {
    position: 'relative', zIndex: 10,
    background: 'linear-gradient(180deg, transparent 0%, #031408 100%)',
    padding: '80px 48px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  hiwHeader: {
    textAlign: 'center', marginBottom: '60px',
  },
  hiwTitle: {
    fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: '12px', color: '#fff',
  },
  hiwSubtitle: {
    fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
  },
  stepsContainer: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    gap: '20px', maxWidth: '1200px', width: '100%',
    flexWrap: 'nowrap',
  },
  stepCard: {
    flex: '1',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', position: 'relative',
    background: 'rgba(255,255,255,0.03)', padding: '30px 20px', borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(20px)',
  },
  stepNumber: {
    position: 'absolute', top: '-16px',
    width: '32px', height: '32px', borderRadius: '50%', background: '#122619', color: '#4ade80',
    border: '2px solid #4ade80',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 20px rgba(74,222,128,0.3)',
  },
  stepIconBox: {
    width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(74,222,128,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
  },
  stepTitle: {
    fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', color: '#fff',
  },
  stepDesc: {
    fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
  },
  stepConnector: {
    flex: '0 0 30px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)',
    marginTop: '60px',
  },

  // Showcase Section
  showcaseSection: {
    position: 'relative', zIndex: 10,
    background: '#031408', padding: '80px 48px 120px',
  },
  showcaseContainer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    maxWidth: '1200px', margin: '0 auto', gap: '60px', flexWrap: 'wrap',
  },
  showcaseLeft: {
    flex: '1 1 400px', maxWidth: '450px',
  },
  showcaseBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(74,222,128,0.1)', padding: '6px 12px', borderRadius: '8px',
    color: '#4ade80', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '20px',
  },
  showcaseTitle: {
    fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#fff', lineHeight: 1.2, marginBottom: '20px',
  },
  showcaseDesc: {
    fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '32px',
  },
  showcaseBtn: {
    background: '#4ade80', color: '#000', border: 'none', padding: '14px 28px', borderRadius: '8px',
    fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
  },
  showcaseRight: {
    flex: '1 1 600px',
  },
  showcaseMockup: {
    background: '#121e17', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
  },
  mockSidebar: {
    width: '160px', background: '#0a140d', padding: '20px', borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  mockLogo: { fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', color: '#fff' },
  mockNavItemActive: { background: 'rgba(74,222,128,0.15)', color: '#4ade80', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 },
  mockNavItem: { color: 'rgba(255,255,255,0.5)', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 500 },
  mockMain: {
    flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
  },
  mockHeader: { fontSize: '1.05rem', fontWeight: 600, color: '#fff' },
  mockCards: { display: 'flex', gap: '12px' },
  mockCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', flex: 1 },
  mockCardTitle: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' },
  mockCardValue: { fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '12px' },
  mockCardSub: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  mockChartPlaceholder: { height: '30px', background: 'linear-gradient(90deg, #4ade80 0%, #16a34a 100%)', borderRadius: '4px', opacity: 0.8 },
  mockBottomArea: { display: 'flex', gap: '12px' },
  mockRing: { width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(74,222,128,0.3)', borderTopColor: '#4ade80', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginTop: '10px' },
  mockRingValue: { fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1 },
  mockRingSub: { fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 },
}
