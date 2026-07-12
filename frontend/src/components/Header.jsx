import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Bell, User, Leaf, Moon, Sun } from 'lucide-react'

const PAGE_TITLES = {
  '/':                { title: 'Dashboard',       subtitle: 'Your daily nutrition overview' },
  '/profile':         { title: 'My Profile',      subtitle: 'Manage your health profile'   },
  '/food-search':     { title: 'Food Search',     subtitle: 'Explore nutritional data'     },
  '/meal-log':        { title: 'Meal Log',        subtitle: 'Track your daily meals'       },
  '/diet-plan':       { title: 'Diet Plan',       subtitle: 'Your personalized meal plan'  },
  '/health-advisory': { title: 'Health Advisory', subtitle: 'Condition-specific guidance'  },
}

export default function Header({ onToggleMobileMenu }) {
  const { pathname } = useLocation()
  const { title, subtitle } = PAGE_TITLES[pathname] || PAGE_TITLES['/']

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <header style={styles.header} className="responsive-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="hamburger-btn" onClick={onToggleMobileMenu} style={{ marginRight: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <Link to="/dashboard" style={styles.headerLogo} title="Go to Dashboard">
          <div style={styles.headerLogoIcon}>🥑</div>
          NutriAgent
        </Link>
        
        {/* Breadcrumb / Title */}
        <div style={styles.titleBlock} className="desktop-only">
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      {/* Right side */}
      <div style={styles.right}>
        {/* Date pill */}
        <div style={styles.datePill}>
          <Leaf size={13} color="#22c55e" />
          <span style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Theme Toggle */}
        <button style={styles.themeToggle} onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          <div style={{ ...styles.toggleKnob, ...(theme === 'light' ? styles.knobLight : styles.knobDark) }}>
            {theme === 'light' ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} color="#1d4ed8" />}
          </div>
        </button>

        {/* Profile link */}
        <Link to="/profile" style={styles.avatar} title="My Profile">
          <User size={18} color="#15803d" />
        </Link>
      </div>
    </header>
  )
}

const styles = {
  header: {
    height: 68,
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    borderBottom: '1px solid var(--border-solid)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 36px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 12px rgba(34,197,94,0.06)',
  },
  headerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '1.25rem',
    fontWeight: 800,
    fontFamily: "'Nunito', sans-serif",
    textDecoration: 'none',
    color: 'var(--text-primary)',
  },
  headerLogoIcon: {
    background: 'rgba(34,197,94,0.15)',
    padding: '4px 6px',
    borderRadius: 8,
    fontSize: '1.1rem',
  },
  titleBlock: {},
  title: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    fontFamily: "'Nunito', sans-serif",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  datePill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 20,
  },
  dateText: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--primary-light)',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'rgba(34,197,94,0.15)',
    border: '1.5px solid rgba(34,197,94,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  themeToggle: {
    width: 56,
    height: 30,
    borderRadius: 20,
    background: 'rgba(34,197,94,0.1)',
    border: '1.5px solid rgba(34,197,94,0.2)',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    transition: 'background 0.3s',
    outline: 'none',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  knobLight: {
    transform: 'translateX(24px)',
  },
  knobDark: {
    transform: 'translateX(0)',
  },
}
