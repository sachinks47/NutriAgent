// Design tokens (JS-side) — mirrors index.css variables for use in inline styles / Recharts

export const colors = {
  green50:  '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',

  primary:      '#22c55e',
  primaryDark:  '#15803d',
  primaryLight: '#86efac',

  textPrimary:   '#0f2d1a',
  textSecondary: '#2d5a3d',
  textMuted:     '#6b8f76',

  red:   '#ef4444',
  amber: '#f59e0b',
  blue:  '#3b82f6',

  bgPage:    '#f8fffe',
  bgSurface: 'rgba(255,255,255,0.85)',
  bgCard:    'rgba(255,255,255,0.70)',
}

export const rechartsPalette = [
  '#22c55e',
  '#16a34a',
  '#4ade80',
  '#86efac',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
]

export const macroColors = {
  calories: '#22c55e',
  protein:  '#3b82f6',
  carbs:    '#f59e0b',
  fat:      '#ef4444',
  fiber:    '#8b5cf6',
}

export const glassCard = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(34,197,94,0.25)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(34,197,94,0.08), 0 2px 8px rgba(0,0,0,0.06)',
}
