import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, ArrowRight, Activity, Droplet, Flame } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={s.container}>
      {/* Background with floating elements - simulating the screenshot */}
      <div style={s.bgWrapper}>
        <div style={s.bgOverlay} />
      </div>

      {/* Navbar */}
      <nav style={s.nav} className="animate-fade-in">
        <div style={s.logo}>
          <div style={s.logoIcon}>🥑</div>
          NutriAgent
        </div>
        <div style={s.navLinks}>
          <a href="#" style={s.navLink}>Features</a>
          <a href="#" style={s.navLink}>How It Works</a>
          <a href="#" style={s.navLink}>Pricing</a>
          <a href="#" style={s.navLink}>About Us</a>
          <a href="#" style={s.navLink}>Blog</a>
        </div>
        <div style={s.navRight}>
          <button style={s.loginBtn}>Log in</button>
          <button style={s.navCta} onClick={() => navigate('/profile')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={s.hero}>
        
        {/* Left Content */}
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
          
          <div style={s.ctaGroup}>
            <button style={s.primaryBtn} onClick={() => navigate('/profile')}>
              Get Started <ArrowRight size={18} />
            </button>
            <button style={s.secondaryBtn}>
              <Play size={18} fill="currentColor" /> Watch Demo
            </button>
          </div>
          
          <div style={s.trustBadge}>
            <div style={s.avatars}>
              {/* Dummy avatars */}
              <div style={{...s.avatarImg, backgroundImage: 'url(https://i.pravatar.cc/100?img=11)', zIndex: 4}} />
              <div style={{...s.avatarImg, backgroundImage: 'url(https://i.pravatar.cc/100?img=12)', zIndex: 3, marginLeft: -12}} />
              <div style={{...s.avatarImg, backgroundImage: 'url(https://i.pravatar.cc/100?img=13)', zIndex: 2, marginLeft: -12}} />
              <div style={{...s.avatarImg, backgroundImage: 'url(https://i.pravatar.cc/100?img=14)', zIndex: 1, marginLeft: -12}} />
            </div>
            <div>
              <div style={s.stars}>⭐⭐⭐⭐⭐</div>
              <div style={s.trustText}>Trusted by 10,000+ users</div>
            </div>
          </div>
        </div>

        {/* Right Content - Dashboard Mockup */}
        <div style={s.heroRight} className="animate-slide-in-right delay-200">
          <div style={s.mockup}>
            
            {/* Mockup Header */}
            <div style={s.mockupHeader}>
              <div style={s.mockupProfile}>
                <div style={{...s.mockupAvatar, backgroundImage: 'url(https://i.pravatar.cc/150?img=68)'}} />
                <div>
                  <div style={s.mockupGreeting}>Hello, Sachin 👋</div>
                  <div style={s.mockupSubGreeting}>Let's make today healthy!</div>
                </div>
              </div>
              
              <div style={s.mockupScoreBadge}>
                <div>
                  <div style={s.mockupScoreLabel}><Sparkles size={10} style={{marginRight: 4}}/> AI Score</div>
                  <div style={s.mockupScoreValue}>92%</div>
                </div>
                <div style={s.mockupScoreRing}></div>
              </div>
            </div>

            {/* Mockup Grid */}
            <h3 style={s.mockupSectionTitle}>Today's Overview</h3>
            <div style={s.mockupGrid}>
              
              {/* Left Column (Bars) */}
              <div style={s.mockupCol}>
                <div style={s.mockupCard}>
                  <div style={s.cardHeader}>
                    <Flame size={14} color="#eab308" /> <span>Calories</span>
                  </div>
                  <div style={s.cardValue}>1820 <span style={s.cardSubValue}>/ 2200 kcal</span></div>
                  <div style={s.progressBarTrack}><div style={{...s.progressBarFill, width: '82%', background: '#4ade80'}} /></div>
                </div>

                <div style={s.mockupCard}>
                  <div style={s.cardHeader}>
                    <Activity size={14} color="#a3e635" /> <span>Protein</span>
                  </div>
                  <div style={s.cardValue}>110 <span style={s.cardSubValue}>/ 150 g</span></div>
                  <div style={s.progressBarTrack}><div style={{...s.progressBarFill, width: '73%', background: '#4ade80'}} /></div>
                </div>

                <div style={s.mockupCard}>
                  <div style={s.cardHeader}>
                    <Droplet size={14} color="#38bdf8" /> <span>Water</span>
                  </div>
                  <div style={s.cardValue}>2.8 <span style={s.cardSubValue}>/ 3.5 L</span></div>
                  <div style={s.progressBarTrack}><div style={{...s.progressBarFill, width: '80%', background: '#38bdf8'}} /></div>
                </div>
              </div>

              {/* Right Column (Donut & Chat) */}
              <div style={s.mockupCol}>
                <div style={{...s.mockupCard, flex: 1}}>
                  <div style={s.cardHeader}>Macros Balance</div>
                  <div style={s.donutContainer}>
                    <div style={s.donutChart}>
                      <div style={s.donutCenter}>
                        <div style={s.donutValue}>1820</div>
                        <div style={s.donutLabel}>kcal</div>
                      </div>
                    </div>
                    <div style={s.donutLegend}>
                      <div style={s.legendItem}><span style={{...s.legendDot, background: '#a855f7'}}></span> Carbs <br/><span style={s.legendSub}>45% (205g)</span></div>
                      <div style={s.legendItem}><span style={{...s.legendDot, background: '#4ade80'}}></span> Protein <br/><span style={s.legendSub}>30% (110g)</span></div>
                      <div style={s.legendItem}><span style={{...s.legendDot, background: '#eab308'}}></span> Fats <br/><span style={s.legendSub}>25% (60g)</span></div>
                    </div>
                  </div>
                </div>

                <div style={{...s.mockupCard, background: 'rgba(255,255,255,0.03)', padding: '16px'}}>
                  <div style={s.cardHeader}><Sparkles size={12} color="#60a5fa" style={{marginRight: 6}} /> AI Nutrition Coach</div>
                  <div style={s.chatBubbleUser}>What should I eat after gym?</div>
                  <div style={s.chatBubbleAiWrapper}>
                    <div style={s.aiAvatar}>🤖</div>
                    <div style={s.chatBubbleAi}>Great question! Try a high protein meal with complex carbs. Here are some perfect options for you.</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Floating Footer Pill */}
      <div style={s.floatingFooter}>
        <Sparkles size={16} color="#4ade80" /> Personalized. Intelligent. Always with you.
      </div>

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
    position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
  },
  bgOverlay: {
    position: 'absolute', inset: 0, 
    background: 'radial-gradient(circle at 70% 30%, rgba(34,197,94,0.15) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(34,197,94,0.05) 0%, transparent 50%)',
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
    display: 'none', gap: '32px',
  },
  navLink: {
    color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
    transition: 'color 0.2s',
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '24px' },
  loginBtn: {
    background: 'none', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
  },
  navCta: {
    background: '#4ade80', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px',
    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s',
  },
  hero: {
    position: 'relative', zIndex: 10,
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
    padding: '40px 48px 80px', maxWidth: '1400px', margin: '0 auto', width: '100%', gap: '60px',
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
  secondaryBtn: {
    background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
    padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '1.05rem',
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s',
  },
  trustBadge: {
    display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px',
  },
  avatars: { display: 'flex' },
  avatarImg: {
    width: 36, height: 36, borderRadius: '50%', backgroundSize: 'cover', border: '2px solid #03170a',
  },
  stars: { fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '4px' },
  trustText: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' },
  
  heroRight: {
    flex: '1 1 500px', maxWidth: '700px', position: 'relative',
  },
  mockup: {
    background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
  },
  mockupHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
  },
  mockupProfile: { display: 'flex', alignItems: 'center', gap: '12px' },
  mockupAvatar: { width: 44, height: 44, borderRadius: '50%', backgroundSize: 'cover' },
  mockupGreeting: { fontSize: '1.05rem', fontWeight: 600, color: '#fff' },
  mockupSubGreeting: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
  mockupScoreBadge: {
    display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)',
    padding: '8px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
  },
  mockupScoreLabel: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', fontWeight: 600 },
  mockupScoreValue: { fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1 },
  mockupScoreRing: {
    width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(74,222,128,0.2)', borderTopColor: '#4ade80',
  },
  mockupSectionTitle: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: '#fff' },
  mockupGrid: {
    display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px',
  },
  mockupCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  mockupCard: {
    background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)',
  },
  cardHeader: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  cardValue: { fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'baseline', gap: '4px' },
  cardSubValue: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  progressBarTrack: { height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: '4px' },
  
  donutContainer: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' },
  donutChart: {
    width: 90, height: 90, borderRadius: '50%',
    background: 'conic-gradient(#a855f7 0% 45%, #4ade80 45% 75%, #eab308 75% 100%)',
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  donutCenter: { width: 70, height: 70, background: '#121e17', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  donutValue: { fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 },
  donutLabel: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' },
  donutLegend: { display: 'flex', flexDirection: 'column', gap: '8px' },
  legendItem: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.3 },
  legendDot: { width: 6, height: 6, borderRadius: '50%', marginTop: 2, display: 'inline-block' },
  legendSub: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginLeft: 12 },
  
  chatBubbleUser: { background: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '12px 12px 0 12px', fontSize: '0.8rem', color: '#fff', marginLeft: 'auto', width: 'fit-content', marginBottom: '12px' },
  chatBubbleAiWrapper: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  aiAvatar: { width: 28, height: 28, background: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 },
  chatBubbleAi: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', padding: '10px 14px', borderRadius: '12px 12px 12px 0', fontSize: '0.8rem', color: '#fff', lineHeight: 1.5 },
  
  floatingFooter: {
    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)', padding: '10px 24px', borderRadius: '100px',
    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#fff', zIndex: 10,
  }
}
