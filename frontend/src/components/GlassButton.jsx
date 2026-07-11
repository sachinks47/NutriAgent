import React, { useRef } from 'react'

export default function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  fullWidth = false,
  type = 'button',
  style: extraStyle = {},
}) {
  const btnRef = useRef(null)

  const handleClick = (e) => {
    if (disabled || loading) return

    // Ripple effect
    const btn = btnRef.current
    if (btn) {
      const circle = document.createElement('span')
      const diameter = Math.max(btn.clientWidth, btn.clientHeight)
      const rect = btn.getBoundingClientRect()
      circle.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        transform: scale(0);
        animation: ripple 0.55s linear;
        pointer-events: none;
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${e.clientX - rect.left - diameter / 2}px;
        top: ${e.clientY - rect.top - diameter / 2}px;
      `
      const existing = btn.querySelector('.ripple-el')
      if (existing) existing.remove()
      circle.classList.add('ripple-el')
      btn.appendChild(circle)
      setTimeout(() => circle.remove(), 600)
    }

    onClick && onClick(e)
  }

  const base = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontFamily: "'Nunito', 'Inter', sans-serif",
    fontWeight: 700,
    letterSpacing: '0.01em',
    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.55 : 1,
  }

  const sizes = {
    sm: { padding: '7px 16px', fontSize: '0.82rem', borderRadius: '10px' },
    md: { padding: '10px 22px', fontSize: '0.9rem', borderRadius: '14px' },
    lg: { padding: '13px 30px', fontSize: '1rem', borderRadius: '16px' },
    xl: { padding: '16px 40px', fontSize: '1.05rem', borderRadius: '18px' },
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(34,197,94,0.35), 0 1px 4px rgba(0,0,0,0.1)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      color: '#15803d',
      border: '1.5px solid rgba(34,197,94,0.3)',
      boxShadow: '0 2px 10px rgba(34,197,94,0.12)',
    },
    ghost: {
      background: 'transparent',
      color: '#15803d',
      border: '1.5px solid rgba(34,197,94,0.2)',
    },
    danger: {
      background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
    },
    amber: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
    },
  }

  const hoverStyle = {
    primary:   { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(34,197,94,0.45)' },
    secondary: { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(34,197,94,0.2)' },
    ghost:     { background: 'rgba(34,197,94,0.08)' },
    danger:    { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(239,68,68,0.4)' },
    amber:     { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(245,158,11,0.4)' },
  }

  const [hovered, setHovered] = React.useState(false)

  const finalStyle = {
    ...base,
    ...sizes[size] || sizes.md,
    ...variants[variant] || variants.primary,
    ...(hovered && !disabled && !loading ? hoverStyle[variant] : {}),
    ...extraStyle,
  }

  return (
    <button
      ref={btnRef}
      type={type}
      style={finalStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading ? (
        <>
          <span style={spinnerStyle} className="animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          {children}
        </>
      )}
    </button>
  )
}

const spinnerStyle = {
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: '#ffffff',
  display: 'inline-block',
}
