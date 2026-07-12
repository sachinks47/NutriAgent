import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { profileAPI } from '../api/client.js'



export default function Landing() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')

  useEffect(() => {
    profileAPI.get()
      .then(res => setUsername(res.data?.name || ''))
      .catch(() => {}) // Ignore errors if profile doesn't exist
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
          {/* Removed top buttons as requested */}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {/* Hero Section */}
      <section style={s.hero}>
        <h1 style={s.headline}>
          <div style={s.line1}>
            <span className="animate-slide-up delay-200" style={s.word}>Welcome</span>
            <span className="animate-slide-up delay-300" style={{ ...s.word, color: 'rgba(255,255,255,0.45)' }}>
              {username ? username : 'User'}
            </span>
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
    </div>
  )
}

const s = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flex: 1,
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
