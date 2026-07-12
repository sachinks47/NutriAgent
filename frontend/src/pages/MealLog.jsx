import React, { useState, useEffect, useRef } from 'react'
import { mealsAPI } from '../api/client.js'
import GlassButton from '../components/GlassButton.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import toast from 'react-hot-toast'
import { Mic, MicOff, Type, Trash2, Star, Zap } from 'lucide-react'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

function ScoreBadge({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ ...sb.ring, borderColor: color }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 800, color, fontFamily: "'Nunito', sans-serif" }}>{score}</span>
      </div>
      <div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Nutrition Score</div>
      </div>
    </div>
  )
}

const sb = {
  ring: { width: 54, height: 54, borderRadius: '50%', border: '3px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' },
}

function FeedbackCard({ feedback }) {
  if (!feedback) return null
  return (
    <div className="glass-card animate-slide-up" style={s.feedbackCard}>
      <div style={s.feedbackHeader}>
        <Zap size={18} color="#22c55e" />
        <h3 style={s.feedbackTitle}>AI Nutritional Feedback</h3>
        <ScoreBadge score={feedback.score || 70} />
      </div>
      <p style={s.feedbackSummary}>{feedback.summary}</p>
      <div style={s.feedbackGrid}>
        {feedback.positive_aspects?.length > 0 && (
          <div style={s.feedbackSection}>
            <div style={{ ...s.feedbackLabel, color: 'var(--primary-light)' }}>✅ Positive</div>
            {feedback.positive_aspects.map((p, i) => <div key={i} style={{ ...s.feedbackItem, color: 'var(--text-secondary)' }}>• {p}</div>)}
          </div>
        )}
        {feedback.nutritional_gaps?.length > 0 && (
          <div style={s.feedbackSection}>
            <div style={{ ...s.feedbackLabel, color: 'var(--amber)' }}>⚠️ Gaps</div>
            {feedback.nutritional_gaps.map((g, i) => <div key={i} style={{ ...s.feedbackItem, color: 'var(--text-secondary)' }}>• {g}</div>)}
          </div>
        )}
        {feedback.suggestions?.length > 0 && (
          <div style={s.feedbackSection}>
            <div style={{ ...s.feedbackLabel, color: 'var(--blue)' }}>💡 Suggestions</div>
            {feedback.suggestions.map((sug, i) => <div key={i} style={{ ...s.feedbackItem, color: 'var(--text-secondary)' }}>• {sug}</div>)}
          </div>
        )}
      </div>
    </div>
  )
}

function MealLogItem({ meal, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div className="glass-card" style={s.mealItem}>
      <div style={s.mealLeft}>
        <span style={s.mealTypeIcon}>{typeIcon(meal.meal_type)}</span>
        <div>
          <div style={s.mealName}>{meal.meal_name}</div>
          <div style={s.mealMeta}>
            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{meal.meal_type}</span>
            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{meal.input_method}</span>
            <span style={{ color: '#9dbfaa', fontSize: '0.73rem' }}>
              {new Date(meal.logged_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
      <div style={s.mealNutrients}>
        <NutrientPill val={meal.total_calories} unit="kcal" color="#22c55e" />
        <NutrientPill val={meal.total_protein_g} unit="P" color="#3b82f6" />
        <NutrientPill val={meal.total_carbs_g} unit="C" color="#f59e0b" />
        <NutrientPill val={meal.total_fat_g} unit="F" color="#ef4444" />
      </div>
      {confirming ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <GlassButton variant="danger" size="sm" onClick={() => { onDelete(meal.id); setConfirming(false) }}>Yes</GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={() => setConfirming(false)}>No</GlassButton>
        </div>
      ) : (
        <button style={s.deleteBtn} onClick={() => setConfirming(true)}><Trash2 size={15} /></button>
      )}
    </div>
  )
}

function NutrientPill({ val, unit, color }) {
  return (
    <div style={{ ...s.nutrientPill, borderColor: color + '30', background: color + '0d' }}>
      <span style={{ color, fontWeight: 700, fontSize: '0.82rem' }}>{Math.round(val || 0)}</span>
      <span style={{ color: 'var(--text-light)', fontSize: '0.7rem' }}>{unit}</span>
    </div>
  )
}

function typeIcon(t) {
  const m = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }
  return m[t] || '🍽️'
}

export default function MealLog() {
  const [mode, setMode] = useState('text')
  const [form, setForm] = useState({ meal_name: '', meal_type: 'snack', notes: '' })
  const [meals, setMeals] = useState([])
  const [lastFeedback, setLastFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    mealsAPI.getAll(today)
      .then(r => setMeals(r.data || []))
      .catch(() => {})
      .finally(() => setPageLoading(false))
  }, [])

  const refreshMeals = () =>
    mealsAPI.getAll(today).then(r => setMeals(r.data || [])).catch(() => {})

  const handleDelete = async (id) => {
    await mealsAPI.delete(id)
    toast.success('Meal removed')
    refreshMeals()
  }

  // TEXT submit
  const handleTextSubmit = async (e) => {
    e.preventDefault()
    if (!form.meal_name.trim()) return toast.error('Please enter a meal name')
    setLoading(true)
    try {
      const r = await mealsAPI.log({ ...form, input_method: 'text' })
      setLastFeedback(r.data.ai_feedback)
      toast.success('Meal logged!')
      setForm(f => ({ ...f, meal_name: '', notes: '' }))
      refreshMeals()
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to log meal')
    } finally {
      setLoading(false)
    }
  }


  // VOICE
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return toast.error('Voice input not supported in this browser')
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = e => {
      const transcript = e.results[0][0].transcript
      setForm(f => ({ ...f, meal_name: transcript }))
      setMode('text')
      toast.success(`Heard: "${transcript}"`)
    }
    rec.onerror = () => { setListening(false); toast.error('Voice recognition error') }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  if (pageLoading) return <LoadingScreen message="Loading meal log..." fullScreen={false} />
  if (loading)     return <LoadingScreen message="Analyzing your meal..." />

  return (
    <div className="page-container">
      <div className="page-header animate-slide-up">
        <h1 className="page-title">Meal Log</h1>
        <p className="page-subtitle">Log meals via text, image, or voice — get instant AI feedback</p>
      </div>

      <div style={s.layout}>
        {/* Left: Input Panel */}
        <div>
          {/* Mode Tabs */}
          <div style={s.tabs} className="animate-slide-up delay-100">
            {[
              { id: 'text',  icon: Type,   label: 'Text'  },
              { id: 'voice', icon: Mic,    label: 'Voice' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                style={{ ...s.tab, ...(mode === id ? s.tabActive : {}) }}
                onClick={() => setMode(id)}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Meal Type & Notes (shared) */}
          <div className="glass-card animate-slide-up delay-200" style={s.inputCard}>
            {/* Meal type selector */}
            <div style={s.mealTypeRow}>
              {MEAL_TYPES.map(t => (
                <button
                  key={t}
                  style={{ ...s.typeBtn, ...(form.meal_type === t ? s.typeBtnActive : {}) }}
                  onClick={() => setForm(f => ({ ...f, meal_type: t }))}
                >
                  {typeIcon(t)} {t}
                </button>
              ))}
            </div>

            {/* TEXT mode */}
            {mode === 'text' && (
              <form onSubmit={handleTextSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Meal / Food Name</label>
                  <input
                    className="form-input"
                    value={form.meal_name}
                    onChange={e => setForm(f => ({ ...f, meal_name: e.target.value }))}
                    placeholder="e.g. Grilled chicken salad, Oatmeal with berries…"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Extra details…" />
                </div>
                <GlassButton type="submit" icon={Zap} fullWidth>Log & Analyze Meal</GlassButton>
              </form>
            )}


            {/* VOICE mode */}
            {mode === 'voice' && (
              <div style={s.voicePanel}>
                <div style={{ ...s.voiceRing, ...(listening ? s.voiceRingActive : {}) }} className={listening ? 'animate-pulse-glow' : ''}>
                  {listening ? <MicOff size={32} color="#ef4444" /> : <Mic size={32} color="#22c55e" />}
                </div>
                <p style={s.voiceInstruction}>
                  {listening ? '🔴 Listening… speak your meal name' : 'Tap the microphone and say what you ate'}
                </p>
                <GlassButton
                  icon={listening ? MicOff : Mic}
                  variant={listening ? 'danger' : 'primary'}
                  onClick={listening ? stopListening : startListening}
                >
                  {listening ? 'Stop Listening' : 'Start Voice Input'}
                </GlassButton>
                {form.meal_name && (
                  <div style={s.voiceTranscript} className="animate-scale-in">
                    <span style={s.voiceHear}>Heard:</span>
                    <span style={s.voiceText}>"{form.meal_name}"</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Feedback */}
          {lastFeedback && <FeedbackCard feedback={lastFeedback} />}
        </div>

        {/* Right: Meal History */}
        <div>
          <div className="section-label animate-fade-in">Today's Meals ({meals.length})</div>
          {meals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><span style={{ fontSize: 32 }}>🍽️</span></div>
              <p className="empty-state-title">No meals logged today</p>
              <p className="empty-state-desc">Start tracking to see your nutritional breakdown</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {meals.map(m => <MealLogItem key={m.id} meal={m} onDelete={handleDelete} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' },
  tabs: { display: 'flex', gap: 4, background: 'rgba(34,197,94,0.06)', padding: 4, borderRadius: 14, marginBottom: 16, border: '1px solid var(--border-solid)', width: 'fit-content' },
  tab: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' },
  tabActive: { background: 'var(--glass-bg)', color: 'var(--primary)', boxShadow: '0 2px 8px rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.2)' },
  inputCard: { padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 },
  mealTypeRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  typeBtn: { padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.2)', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'capitalize', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' },
  typeBtnActive: { background: 'rgba(34,197,94,0.1)', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 },
  dropzone: { border: '2px dashed rgba(34,197,94,0.3)', borderRadius: 14, padding: 28, cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(34,197,94,0.03)' },
  dropzoneActive: { borderColor: '#22c55e', background: 'rgba(34,197,94,0.08)' },
  removeImg: { position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  voicePanel: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '20px 0' },
  voiceRing: { width: 100, height: 100, borderRadius: '50%', border: '3px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.05)', transition: 'all 0.3s' },
  voiceRingActive: { borderColor: '#ef4444', background: 'rgba(239,68,68,0.05)', animation: 'pulse-glow 1s ease infinite' },
  voiceInstruction: { fontSize: '0.87rem', color: 'var(--text-muted)', textAlign: 'center' },
  voiceTranscript: { display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(34,197,94,0.08)', padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' },
  voiceHear: { fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 },
  voiceText: { fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, fontStyle: 'italic' },
  feedbackCard: { padding: '22px 24px', marginTop: 20 },
  feedbackHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
  feedbackTitle: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1 },
  feedbackSummary: { fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16, padding: '10px 14px', background: 'rgba(34,197,94,0.05)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.1)' },
  feedbackGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 },
  feedbackSection: { display: 'flex', flexDirection: 'column', gap: 5 },
  feedbackLabel: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  feedbackItem: { fontSize: '0.8rem', lineHeight: 1.5 },
  mealItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', flexWrap: 'wrap' },
  mealLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
  mealTypeIcon: { fontSize: '1.4rem' },
  mealName: { fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' },
  mealMeta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' },
  mealNutrients: { display: 'flex', gap: 5, flexWrap: 'wrap' },
  nutrientPill: { display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 8, border: '1px solid' },
  deleteBtn: { width: 30, height: 30, border: 'none', background: 'rgba(239,68,68,0.08)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', transition: 'all 0.2s' },
}

// Responsive fix
const mq = window.matchMedia('(max-width: 768px)')
if (mq.matches) s.layout.gridTemplateColumns = '1fr'
