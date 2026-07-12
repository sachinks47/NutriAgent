import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, LineChart, Line, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { dashboardAPI } from '../api/client.js'
import { macroColors, rechartsPalette } from '../theme.js'
import LoadingScreen from '../components/LoadingScreen.jsx'
import GlassButton from '../components/GlassButton.jsx'
import { UtensilsCrossed, Search, HeartPulse, TrendingUp, AlertTriangle, Leaf, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const MACRO_META = [
  { key: 'calories',    label: 'Calories',       unit: 'kcal', color: '#22c55e', icon: '🔥' },
  { key: 'protein_g',  label: 'Protein',         unit: 'g',    color: '#3b82f6', icon: '💪' },
  { key: 'carbs_g',    label: 'Carbohydrates',   unit: 'g',    color: '#f59e0b', icon: '🌾' },
  { key: 'fat_g',      label: 'Fat',             unit: 'g',    color: '#ef4444', icon: '🥑' },
]

function ProgressRing({ pct, color, size = 90 }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(pct, 100) / 100) * circ
  const over = pct > 100

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#dcfce7" strokeWidth={8} fill="none" transform={`rotate(-90 ${size/2} ${size/2})`} />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={over ? '#f59e0b' : color}
          strokeWidth={8} fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-ring-value" style={{ fontSize: '0.8rem', color: over ? '#f59e0b' : color }}>
        {Math.round(pct)}%
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [daily, setDaily] = useState(null)
  const [weekly, setWeekly] = useState(null)
  const [view, setView] = useState('daily')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [d, w] = await Promise.all([dashboardAPI.getDaily(), dashboardAPI.getWeekly()])
      setDaily(d.data)
      setWeekly(w.data)
    } catch (e) {
      const msg = e.friendlyMessage || e.message || 'Network Error'
      setError(msg)
      toast.error('Could not load dashboard: ' + msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingScreen message="Loading dashboard..." fullScreen={false} />

  // ── Error State with Retry ───────────────────────────────────────────────
  if (error && !daily) return (
    <div className="page-container">
      <div style={errStyle.box} className="glass-card animate-scale-in">
        <div style={errStyle.iconWrap}>
          <span style={{ fontSize: '2.5rem' }}>⚠️</span>
        </div>
        <h3 style={errStyle.title}>Could not reach the backend</h3>
        <p style={errStyle.msg}>{error}</p>
        <div style={errStyle.steps}>
          <p style={errStyle.stepsTitle}>Quick checklist:</p>
          <ol style={errStyle.ol}>
            <li>Make sure the backend is running:<br /><code style={errStyle.code}>uvicorn main:app --reload --port 8000</code></li>
            <li>Open <a href="http://localhost:8000/health" target="_blank" rel="noreferrer" style={{ color: '#22c55e' }}>http://localhost:8000/health</a> — should return <code style={errStyle.code}>{"{"}"status":"healthy"{"}"}</code></li>
            <li>If using Docker, make sure both containers are running</li>
          </ol>
        </div>
        <GlassButton icon={RefreshCw} onClick={load} size="lg">Retry Connection</GlassButton>
      </div>
    </div>
  )

  const d = daily || {}
  const progress = d.nutrient_progress || []
  const meals = d.meals || []
  const deficiencies = d.deficiencies || []
  const calorieGoal = d.calorie_goal || 2000

  // Bar chart data — today's meals
  const mealBarData = meals.map(m => ({
    name: m.meal_name?.length > 14 ? m.meal_name.slice(0, 14) + '…' : m.meal_name,
    Calories: Math.round(m.total_calories || 0),
    Protein: Math.round(m.total_protein_g || 0),
  }))

  // Weekly trend data
  const weeklyTrend = (weekly?.trend_data || []).map(d => ({
    ...d,
    Calories: Math.round(d.calories || 0),
    Protein: Math.round(d.protein || 0),
    Carbs: Math.round(d.carbs || 0),
  }))

  // Radar data for micronutrients — mock if no data
  const radarData = [
    { subject: 'Vitamin C', A: Math.min(((d.vitamins?.vitamin_c_mg || 0) / 90) * 100, 100) },
    { subject: 'Calcium',   A: Math.min(((d.minerals?.calcium_mg || 0) / 1000) * 100, 100) },
    { subject: 'Iron',      A: Math.min(((d.minerals?.iron_mg || 0) / 18) * 100, 100) },
    { subject: 'Potassium', A: Math.min(((d.minerals?.potassium_mg || 0) / 4700) * 100, 100) },
    { subject: 'Fiber',     A: Math.min(((d.total_fiber_g || 0) / 28) * 100, 100) },
    { subject: 'Protein',   A: Math.min(((d.total_protein_g || 0) / 50) * 100, 100) },
  ]

  return (
    <div className="page-container">
      {/* Header Row */}
      <div style={s.headerRow} className="animate-slide-up responsive-header-row">
        <div>
          <h1 className="page-title">Good {getGreeting()}! 👋</h1>
          <p className="page-subtitle">
            {d.meal_count > 0
              ? `You've logged ${d.meal_count} meal${d.meal_count > 1 ? 's' : ''} today — ${Math.round(d.total_calories || 0)} / ${calorieGoal} kcal`
              : "No meals logged today yet. Start tracking!"}
          </p>
        </div>
        <div style={s.quickActions} className="responsive-quick-actions">
          <GlassButton size="sm" icon={UtensilsCrossed} onClick={() => navigate('/meal-log')}>Log Meal</GlassButton>
          <GlassButton size="sm" variant="secondary" icon={Search} onClick={() => navigate('/food-search')}>Search Food</GlassButton>
          <GlassButton size="sm" variant="secondary" icon={HeartPulse} onClick={() => navigate('/health-advisory')}>Advisory</GlassButton>
          <GlassButton size="sm" variant="ghost" icon={RefreshCw} onClick={load} loading={loading}>Refresh</GlassButton>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="cards-grid-4 animate-slide-up delay-100" style={{ marginBottom: 24 }}>
        {MACRO_META.map((m, i) => {
          const prog = progress.find(p => p.nutrient.toLowerCase().includes(m.label.toLowerCase().split(' ')[0]))
          const consumed = d[`total_${m.key}`] || 0
          const goal = prog?.goal || (m.key === 'calories' ? calorieGoal : 50)
          const pct = goal > 0 ? (consumed / goal) * 100 : 0

          return (
            <div key={m.key} className="glass-card responsive-ring-card" style={{ ...s.ringCard, animationDelay: `${i * 80}ms` }}>
              <ProgressRing pct={pct} color={m.color} size={82} />
              <div style={s.ringInfo}>
                <div style={s.ringLabel}>{m.icon} {m.label}</div>
                <div style={s.ringValue}>{consumed.toFixed(m.key === 'calories' ? 0 : 1)}<span style={s.ringUnit}>{m.unit}</span></div>
                <div style={s.ringGoal}>Goal: {goal.toFixed(0)}{m.unit}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* View Toggle */}
      <div style={s.viewToggle} className="animate-fade-in delay-200">
        {['daily', 'weekly'].map(v => (
          <button
            key={v}
            style={{ ...s.toggleBtn, ...(view === v ? s.toggleActive : {}) }}
            onClick={() => setView(v)}
          >
            {v === 'daily' ? '📅 Today' : '📊 This Week'}
          </button>
        ))}
      </div>

      {view === 'daily' ? (
        <div className="cards-grid-2 animate-slide-up delay-200">
          {/* Meal Calories Bar Chart */}
          <div className="glass-card responsive-chart-card" style={s.chartCard}>
            <h3 style={s.chartTitle}><TrendingUp size={16} /> Today's Meals</h3>
            {mealBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mealBarData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dcfce7', fontSize: '0.8rem' }} />
                  <Bar dataKey="Calories" fill="#22c55e" radius={[6,6,0,0]} />
                  <Bar dataKey="Protein" fill="#3b82f6" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><UtensilsCrossed size={32} /></div>
                <p className="empty-state-title">No meals logged today</p>
              </div>
            )}
          </div>

          {/* Micronutrient Radar */}
          <div className="glass-card responsive-chart-card" style={s.chartCard}>
            <h3 style={s.chartTitle}><Leaf size={16} /> Micronutrient Coverage</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Radar name="Today" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} dot={{ fill: '#22c55e', r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="glass-card animate-slide-up delay-200 responsive-chart-card" style={s.chartCard}>
          <h3 style={s.chartTitle}><TrendingUp size={16} /> Weekly Nutrition Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-solid)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.8rem' }} />
              <Legend />
              <Line type="monotone" dataKey="Calories" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }} />
              <Line type="monotone" dataKey="Protein"  stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="Carbs"    stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Deficiency Alerts */}
      {deficiencies.length > 0 && (
        <div style={s.defSection} className="animate-slide-up delay-300">
          <div className="section-label"><AlertTriangle size={14} /> Nutrient Deficiencies</div>
          <div style={s.defGrid}>
            {deficiencies.map((d, i) => (
              <div key={i} className="glass-card" style={s.defCard}>
                <AlertTriangle size={16} color="#f59e0b" />
                <span style={s.defText}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Meals */}
      {meals.length > 0 && (
        <div style={{ marginTop: 28 }} className="animate-slide-up delay-400">
          <div className="section-label">Today's Meals ({meals.length})</div>
          <div style={s.mealList}>
            {meals.slice(0, 5).map(m => (
              <div key={m.id} className="glass-card responsive-meal-item" style={s.mealItem}>
                <div style={s.mealIcon}>{getMealIcon(m.meal_type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.mealName}>{m.meal_name}</div>
                  <div style={s.mealMeta}>
                    <span style={s.mealType}>{m.meal_type}</span>
                    · {formatTime(m.logged_at)}
                  </div>
                </div>
                <div style={s.mealRight} className="responsive-meal-right">
                  <div style={s.mealCals}>{Math.round(m.total_calories)} kcal</div>
                  <div style={s.mealMacros}>
                    <span style={{ color: '#3b82f6' }}>P {Math.round(m.total_protein_g)}g</span>
                    <span style={{ color: '#f59e0b' }}>C {Math.round(m.total_carbs_g)}g</span>
                    <span style={{ color: '#ef4444' }}>F {Math.round(m.total_fat_g)}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  return 'Evening'
}

function getMealIcon(type) {
  const icons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }
  return icons[type] || '🍽️'
}

function formatTime(isoString) {
  if (!isoString) return ''
  try {
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

const s = {
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' },
  quickActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  ringCard: { display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' },
  ringInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  ringLabel: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  ringValue: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Nunito', sans-serif", lineHeight: 1.1 },
  ringUnit: { fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 2 },
  ringGoal: { fontSize: '0.75rem', color: 'var(--text-light)' },
  viewToggle: { display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid var(--border-solid)' },
  toggleBtn: { padding: '7px 18px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-muted)', transition: 'all 0.2s' },
  toggleActive: { background: '#22c55e', color: '#fff', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' },
  chartCard: { padding: '20px 24px' },
  chartTitle: { fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  defSection: { marginTop: 24 },
  defGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 },
  defCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(254,243,199,0.6)', borderColor: 'rgba(245,158,11,0.2)' },
  defText: { fontSize: '0.84rem', color: '#92400e', fontWeight: 500 },
  mealList: { display: 'flex', flexDirection: 'column', gap: 10 },
  mealItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' },
  mealIcon: { fontSize: '1.5rem', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.15)', borderRadius: 10 },
  mealName: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' },
  mealMeta: { fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  mealType: { textTransform: 'capitalize', background: 'rgba(34,197,94,0.1)', color: '#15803d', padding: '1px 7px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 },
  mealRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 },
  mealCals: { fontSize: '0.95rem', fontWeight: 800, color: '#15803d', whiteSpace: 'nowrap', fontFamily: "'Nunito', sans-serif" },
  mealMacros: { display: 'flex', gap: 8, fontSize: '0.72rem', fontWeight: 600 },
}

const errStyle = {
  box: {
    maxWidth: 560,
    margin: '60px auto',
    padding: '40px 44px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    textAlign: 'center',
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'rgba(245,158,11,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: '1.2rem', fontWeight: 800,
    color: '#0f2d1a', fontFamily: "'Nunito', sans-serif",
  },
  msg: {
    fontSize: '0.87rem', color: '#6b8f76',
    background: 'rgba(239,68,68,0.05)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: 10, padding: '8px 16px',
    fontFamily: 'monospace',
  },
  steps: {
    background: 'rgba(34,197,94,0.05)',
    border: '1px solid rgba(34,197,94,0.15)',
    borderRadius: 12, padding: '16px 20px',
    textAlign: 'left', width: '100%',
  },
  stepsTitle: {
    fontSize: '0.82rem', fontWeight: 700, color: '#2d5a3d',
    marginBottom: 10,
  },
  ol: {
    paddingLeft: 20,
    display: 'flex', flexDirection: 'column', gap: 8,
    fontSize: '0.83rem', color: '#6b8f76', lineHeight: 1.6,
  },
  code: {
    background: 'rgba(34,197,94,0.1)', color: '#15803d',
    padding: '2px 8px', borderRadius: 6,
    fontSize: '0.78rem', fontFamily: 'monospace',
    display: 'inline-block', marginTop: 2,
  },
}
