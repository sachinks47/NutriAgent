import React from 'react'

export default function LoadingScreen({ message = 'Analyzing nutrition...', fullScreen = true }) {
  const inner = (
    <div style={styles.inner}>
      {/* Animated DNA / leaf SVG */}
      <div style={styles.iconWrapper} className="animate-float">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="36" fill="rgba(34,197,94,0.12)" />
          <circle cx="36" cy="36" r="26" fill="rgba(34,197,94,0.18)" />
          {/* Leaf shape */}
          <path
            d="M36 16 C20 16 16 32 16 36 C16 52 36 56 36 56 C36 56 56 52 56 36 C56 32 52 16 36 16Z"
            fill="rgba(34,197,94,0.9)"
          />
          {/* Leaf vein */}
          <path
            d="M36 20 L36 52 M28 28 C30 34 34 38 36 40 M44 28 C42 34 38 38 36 40"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Orbiting dots */}
          <circle cx="36" cy="10" r="3" fill="#22c55e" opacity="0.8">
            <animateTransform attributeName="transform" type="rotate"
              from="0 36 36" to="360 36 36" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="36" cy="62" r="3" fill="#16a34a" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate"
              from="180 36 36" to="540 36 36" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="10" cy="36" r="2" fill="#4ade80" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate"
              from="90 36 36" to="450 36 36" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Spinner ring */}
      <div style={styles.spinnerRing}>
        <div style={styles.spinnerInner} className="animate-spin" />
      </div>

      <p style={styles.message}>{message}</p>
      <p style={styles.sub}>Powered by IBM watsonx.ai</p>

      {/* Animated dots */}
      <div style={styles.dots}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              ...styles.dot,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )

  if (!fullScreen) {
    return (
      <div style={styles.inline}>
        {inner}
      </div>
    )
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card} className="animate-scale-in glass-card">
        {inner}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 45, 26, 0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    padding: '48px 56px',
    textAlign: 'center',
    minWidth: 280,
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    marginBottom: 8,
    filter: 'drop-shadow(0 4px 12px rgba(34,197,94,0.4))',
  },
  spinnerRing: {
    position: 'relative',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerInner: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '3px solid rgba(34,197,94,0.2)',
    borderTopColor: '#22c55e',
    borderRightColor: '#16a34a',
  },
  message: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#0f2d1a',
    fontFamily: "'Nunito', sans-serif",
  },
  sub: {
    fontSize: '0.78rem',
    color: '#6b8f76',
    marginTop: -8,
  },
  dots: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'pulse-glow 1.2s ease infinite',
    display: 'inline-block',
  },
}
