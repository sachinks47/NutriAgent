import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Bell, User, Leaf } from 'lucide-react'

const PAGE_TITLES = {
  '/':                { title: 'Dashboard',       subtitle: 'Your daily nutrition overview' },
  '/profile':         { title: 'My Profile',      subtitle: 'Manage your health profile'   },
  '/food-search':     { title: 'Food Search',     subtitle: 'Explore nutritional data'     },
  '/meal-log':        { title: 'Meal Log',        subtitle: 'Track your daily meals'       },
  '/diet-plan':       { title: 'Diet Plan',       subtitle: 'Your personalized meal plan'  },
  '/health-advisory': { title: 'Health Advisory', subtitle: 'Condition-specific guidance'  },
}

export default function Header() {
  const { pathname } = useLocation()
  const { title, subtitle } = PAGE_TITLES[pathname] || PAGE_TITLES['/']

  return (
    <header style={styles.header}>
      {/* Breadcrumb / Title */}
      <div style={styles.titleBlock}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
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
}
