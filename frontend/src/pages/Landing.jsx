import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, CornerUpLeft, Menu, X, Activity, Leaf, Droplets, Sun, ArrowUpRight } from 'lucide-react'
import GlassButton from '../components/GlassButton.jsx'

const PANELS = [
  { icon: Activity, bg: '#000', title: 'Experience our newly enhanced natural AI formula' },
  { icon: Leaf, bg: '#166534', title: 'Pure organic ingredients tracked sustainably' },
  { icon: Droplets, bg: '#155e75', title: 'Advanced tracking for maximum wellness' },
  { icon: Sun, bg: '#b45309', title: 'Clinically tested for daily energy & vitality' }
]

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePanel(p => (p + 1) % PANELS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={s.container}>
      {/* Background */}
      <div style={s.bg} />

      {/* Navbar */}
      <nav style={s.nav} className="animate-fade-in">
        <div style={s.brand} className="animate-slide-left delay-200">
          NutriAgent
        </div>
        <div style={s.navLinks} className="animate-fade-in delay-400">
          <a href="#" style={s.navLink}>About</a>
          <a href="#" style={s.navLink}>Features</a>
          <a href="#" style={s.navLink}>Pricing</a>
          <a href="#" style={s.navLink}>Contact</a>
        </div>
        <div style={s.navRight} className="animate-slide-right delay-300">
          <Search size={20} strokeWidth={1.5} color="#fff" style={{ cursor: 'pointer' }} />
          <ShoppingBag size={20} strokeWidth={1.5} color="#fff" style={{ cursor: 'pointer' }} />
          <div style={s.avatar} />
          <button style={s.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X color="#fff" /> : <Menu color="#fff" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          <a href="#" style={s.mobileLink}>About</a>
          <a href="#" style={s.mobileLink}>Features</a>
          <a href="#" style={s.mobileLink}>Pricing</a>
          <a href="#" style={s.mobileLink}>Contact</a>
        </div>
      )}

      {/* Hero Section */}
      <section style={s.hero}>
        <h1 style={s.headline}>
          <div style={s.line1}>
            <span className="animate-slide-up delay-200" style={s.word}>The</span>
            <span className="animate-slide-up delay-300" style={s.word}>Power</span>
            <span className="animate-slide-up delay-400" style={{ ...s.word, color: 'rgba(255,255,255,0.45)' }}>of</span>
          </div>
          <div style={s.line2}>
            <span className="animate-slide-up delay-500" style={{ ...s.word, color: 'rgba(255,255,255,0.45)' }}>AI</span>
            <span className="animate-slide-up delay-600" style={{ ...s.word, color: 'rgba(255,255,255,0.45)' }}>in</span>
            <span className="animate-slide-up delay-700" style={s.word}>Every</span>
          </div>
          <div style={s.line3}>
            <span className="animate-slide-up delay-800" style={s.word}>Meal</span>
            <img src="/inline_capsule.png" alt="Capsule" style={s.inlineImg} className="animate-scale-in delay-1000" />
          </div>
        </h1>

        {/* CTA Section */}
        <div style={s.ctaSection} className="animate-slide-up delay-600">
          <button style={s.ctaBtn} onClick={() => navigate('/profile')}>
            Get Started <ArrowUpRight size={24} />
          </button>
          <p style={s.ctaDesc}>
            Discover our new AI-powered personalized nutrition assistant for daily balance and clean energy.
          </p>
        </div>
      </section>

      {/* Mobile Product Image */}
      <img src="/product_mockup.png" alt="App Mockup" style={s.mobileProduct} className="animate-scale-in delay-800" />

      {/* Desktop Floating Product Image */}
      <img src="/product_mockup.png" alt="App Mockup" style={s.desktopProduct} className="animate-scale-in delay-700" />

      {/* Bottom Panels */}
      <div style={s.footerGrid}>
        {/* Panel 1 */}
        <div style={s.panel1} className="animate-slide-up delay-400">
          <h2 style={s.panel1Text}>Start your personalized path to natural balance</h2>
          <a href="#" style={s.panel1Link} onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>Personal Assessment</a>
        </div>

        {/* Panel 2 */}
        <div style={s.panel2} className="animate-slide-up delay-500">
          <div style={s.carouselWrapper}>
            {PANELS.map((p, i) => {
              const Icon = p.icon
              const active = i === activePanel
              return (
                <div key={i} style={{ ...s.carouselSlide, opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(16px)' }}>
                  <div style={{ ...s.carouselIconBox, background: p.bg }}>
                    <Icon color="#fff" size={24} />
                  </div>
                  <p style={s.carouselText}>{p.title}</p>
                </div>
              )
            })}
          </div>
          <div style={s.dots}>
            {PANELS.map((_, i) => (
              <div key={i} style={{ ...s.dot, background: i === activePanel ? '#000' : 'rgba(0,0,0,0.2)' }} />
            ))}
          </div>
        </div>

        {/* Panel 3 */}
        <div style={s.panel3} className="animate-slide-up delay-600">
          <div style={s.panel3Left}>
            <Activity color="#22c55e" size={48} />
          </div>
          <div style={s.panel3Right}>
            <div style={s.panel3Stat}>+14K</div>
            <div style={s.panel3Desc}>People have already optimized their wellness</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: '#000',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/landing_bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
    opacity: 0.8,
  },
  nav: {
    position: 'relative',
    zIndex: 40,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
  },
  brand: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: '28px',
    color: '#fff',
    letterSpacing: '-0.05em',
  },
  navLinks: {
    display: 'none',
    gap: '40px',
    '@media (min-width: 1024px)': { display: 'flex' }
  },
  navLink: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#22c55e',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
  },
  mobileMenu: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.95)',
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
  },
  mobileLink: {
    color: '#fff',
    fontSize: '24px',
    textDecoration: 'none',
    fontWeight: 600,
  },
  hero: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    paddingBottom: '120px',
  },
  headline: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(48px, 8vw, 130px)',
    lineHeight: 1.1,
    letterSpacing: '-0.05em',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  line1: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  line2: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  line3: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  word: { display: 'inline-block' },
  inlineImg: {
    height: 'clamp(60px, 8vw, 120px)',
    width: 'auto',
    marginLeft: '16px',
    borderRadius: '100px',
    boxShadow: '0 0 30px rgba(34,197,94,0.4)',
  },
  ctaSection: {
    marginTop: '60px',
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  ctaBtn: {
    background: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '0 32px',
    height: '64px',
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 8px 30px rgba(34,197,94,0.4)',
  },
  ctaDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    maxWidth: '320px',
    lineHeight: 1.5,
  },
  mobileProduct: {
    position: 'relative',
    zIndex: 10,
    width: '150%',
    maxWidth: '800px',
    margin: '0 auto',
    marginTop: '-100px',
    marginBottom: '-150px',
    display: 'block',
    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
  },
  desktopProduct: {
    position: 'absolute',
    zIndex: 5,
    width: 'clamp(500px, 50vw, 900px)',
    bottom: '-5%',
    right: '-5%',
    display: 'none',
    filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
  },
  footerGrid: {
    position: 'relative',
    zIndex: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    background: '#000',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  panel1: {
    background: '#ECEDEC',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px',
  },
  panel1Text: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#000',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    maxWidth: '300px',
  },
  panel1Link: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    color: '#000',
    textDecoration: 'underline',
    marginTop: '20px',
  },
  panel2: {
    background: '#FEFDF9',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px',
  },
  carouselWrapper: {
    position: 'relative',
    flex: 1,
  },
  carouselSlide: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  carouselIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '18px',
    color: '#000',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  dots: {
    display: 'flex',
    gap: '8px',
    marginTop: '20px',
  },
  dot: {
    height: '4px',
    flex: 1,
    borderRadius: '2px',
    transition: 'background 0.3s',
  },
  panel3: {
    background: '#0a0a0a',
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    minHeight: '220px',
  },
  panel3Left: {
    width: '120px',
    height: '120px',
    background: 'rgba(34,197,94,0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel3Right: {
    flex: 1,
  },
  panel3Stat: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '36px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.05em',
  },
  panel3Desc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.4,
    marginTop: '8px',
  },
}
