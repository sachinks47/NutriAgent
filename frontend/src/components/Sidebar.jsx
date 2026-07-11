import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, Search, UtensilsCrossed,
  CalendarDays, HeartPulse, ChevronLeft, ChevronRight, Leaf
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',                icon: LayoutDashboard, label: 'Dashboard'     },
  { path: '/profile',         icon: User,            label: 'My Profile'    },
  { path: '/food-search',     icon: Search,          label: 'Food Search'   },
  { path: '/meal-log',        icon: UtensilsCrossed, label: 'Meal Log'      },
  { path: '/diet-plan',       icon: CalendarDays,    label: 'Diet Plan'     },
  { path: '/health-advisory', icon: HeartPulse,      label: 'Health Advisory'},
]

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 240 }}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon} className="animate-pulse-glow">
          <Leaf size={22} color="#fff" />
        </div>
        {!collapsed && (
          <div style={styles.logoText} className="animate-fade-in">
            <span style={styles.logoName}>NutriAgent</span>
            <span style={styles.logoTagline}>AI Nutrition</span>
          </div>
        )}
      </div>

      <div style={styles.divider} />

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              data-tooltip={collapsed ? label : undefined}
            >
              <span style={{ ...styles.navIcon, ...(active ? styles.navIconActive : {}) }}>
                <Icon size={18} />
              </span>
              {!collapsed && (
                <span style={{ ...styles.navLabel, ...(active ? styles.navLabelActive : {}) }}>
                  {label}
                </span>
              )}
              {active && <span style={styles.activeBar} />}
            </NavLink>
          )
        })}
      </nav>

      {/* IBM Badge */}
      {!collapsed && (
        <div style={styles.ibmBadge} className="animate-fade-in">
          <div style={styles.ibmDot} />
          <span style={styles.ibmText}>Powered by IBM watsonx.ai</span>
        </div>
      )}

      {/* Collapse toggle */}
      <button style={styles.collapseBtn} onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRight: '1px solid rgba(34,197,94,0.18)',
    boxShadow: '4px 0 24px rgba(34,197,94,0.07)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '22px 16px 18px',
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #22c55e, #15803d)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(34,197,94,0.35)',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  logoName: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#0f2d1a',
    fontFamily: "'Nunito', sans-serif",
    whiteSpace: 'nowrap',
  },
  logoTagline: {
    fontSize: '0.68rem',
    color: '#6b8f76',
    fontWeight: 500,
    marginTop: -2,
    whiteSpace: 'nowrap',
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)',
    margin: '0 12px 8px',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '0 8px',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 12,
    textDecoration: 'none',
    color: '#6b8f76',
    fontWeight: 500,
    fontSize: '0.88rem',
    transition: 'all 0.2s ease',
    position: 'relative',
    minHeight: 42,
  },
  navItemActive: {
    background: 'rgba(34,197,94,0.1)',
    color: '#15803d',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    flexShrink: 0,
    color: 'inherit',
    transition: 'color 0.2s',
  },
  navIconActive: {
    color: '#16a34a',
  },
  navLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'inherit',
    fontFamily: "'Inter', sans-serif",
  },
  navLabelActive: {
    color: '#15803d',
    fontWeight: 600,
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: '20%',
    bottom: '20%',
    width: 3,
    borderRadius: '3px 0 0 3px',
    background: 'linear-gradient(180deg, #22c55e, #15803d)',
  },
  ibmBadge: {
    margin: '12px 12px',
    padding: '10px 12px',
    background: 'rgba(34,197,94,0.06)',
    border: '1px solid rgba(34,197,94,0.15)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  ibmDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#22c55e',
    flexShrink: 0,
    boxShadow: '0 0 6px rgba(34,197,94,0.6)',
  },
  ibmText: {
    fontSize: '0.68rem',
    color: '#6b8f76',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  collapseBtn: {
    margin: '8px',
    padding: '8px',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b8f76',
    transition: 'all 0.2s',
  },
}
