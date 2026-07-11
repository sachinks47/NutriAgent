import React, { useState, useEffect } from 'react'
import { dietAPI } from '../api/client.js'
import GlassButton from '../components/GlassButton.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import toast from 'react-hot-toast'
import { Sparkles, Printer, RefreshCw, ChevronDown, ChevronUp, Utensils } from 'lucide-react'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

function MealSlot({ title, meal, icon }) {
  if (!meal) return null
  const calories = meal.calories || 0
  const ingredients = meal.ingredients || []
  return (
    <div style={ds.slot}>
      <div style={ds.slotHeader}>
        <span style={ds.slotIcon}>{icon}</span>
        <span style={ds.slotTitle}>{title}</span>
        <span style={ds.slotCals}>{calories} kcal</span>
      </div>
      <p style={ds.slotMeal}>{meal.name}</p>
      {ingredients.length > 0 && (
        <div style={ds.ingChips}>
          {ingredients.slice(0, 4).map((ing, i) => (
            <span key={i} style={ds.ingChip}>{ing}</span>
          ))}
          {ingredients.length > 4 && <span style={ds.ingMore}>+{ingredients.length - 4}</span>}
        </div>
      )}
    </div>
  )
}

function DayCard({ day, dayData, isToday }) {
  const [expanded, setExpanded] = useState(isToday)
  const meals = dayData?.meals || {}
  const snacks = meals.snacks || []
  const total = ['breakfast','lunch','dinner'].reduce((s,k) => s + (meals[k]?.calories||0), 0)
    + snacks.reduce((s,sn) => s + (sn.calories||0), 0)

  return (
    <div
      className="glass-card"
      style={{ ...ds.dayCard, ...(isToday ? ds.dayCardToday : {}) }}
    >
      <div style={ds.dayHeader} onClick={() => setExpanded(e => !e)}>
        <div>
          <div style={{ ...ds.dayName, ...(isToday ? { color: '#15803d', fontWeight: 800 } : {}) }}>
            {isToday && <span style={ds.todayPip} />}
            {day}
          </div>
          <div style={ds.dayTotal}>{total} kcal est.</div>
        </div>
        <button style={ds.expandBtn}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div style={ds.slots} className="animate-slide-up">
          <MealSlot title="Breakfast" meal={meals.breakfast} icon="🌅" />
          <MealSlot title="Lunch"     meal={meals.lunch}     icon="☀️" />
          <MealSlot title="Dinner"    meal={meals.dinner}    icon="🌙" />
          {snacks.length > 0 && (
            <div style={ds.slot}>
              <div style={ds.slotHeader}>
                <span style={ds.slotIcon}>🍎</span>
                <span style={ds.slotTitle}>Snacks</span>
                <span style={ds.slotCals}>{snacks.reduce((s,sn) => s+(sn.calories||0), 0)} kcal</span>
              </div>
              <div style={ds.ingChips}>
                {snacks.map((sn, i) => <span key={i} style={{ ...ds.ingChip, background: 'rgba(139,92,246,0.08)', color: '#7c3aed' }}>{sn.name}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DietPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const todayDay = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

  useEffect(() => {
    dietAPI.getActive()
      .then(r => setPlan(r.data))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const r = await dietAPI.generate()
      setPlan(r.data)
      toast.success('New diet plan generated!')
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to generate plan — please create a profile first')
    } finally {
      setGenerating(false)
    }
  }

  if (loading || generating) return <LoadingScreen message={generating ? 'Generating your personalized plan…' : 'Loading diet plan…'} fullScreen={generating} />

  const days = plan?.plan_data?.days || []
  const avgCal = plan?.plan_data?.total_daily_calories_avg || 0
  const note = plan?.plan_data?.nutritionist_note

  return (
    <div className="page-container">
      <div className="page-header animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">7-Day Diet Plan</h1>
          <p className="page-subtitle">AI-personalized based on your health profile</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <GlassButton icon={RefreshCw} onClick={handleGenerate} loading={generating}>Generate New Plan</GlassButton>
          {plan && <GlassButton variant="secondary" icon={Printer} onClick={() => window.print()}>Print Plan</GlassButton>}
        </div>
      </div>

      {!plan ? (
        <div className="empty-state animate-fade-in" style={{ paddingTop: 60 }}>
          <div className="empty-state-icon animate-float">
            <Utensils size={36} />
          </div>
          <p className="empty-state-title">No diet plan yet</p>
          <p className="empty-state-desc">Click "Generate New Plan" to create a personalized 7-day meal plan based on your health profile</p>
          <GlassButton icon={Sparkles} onClick={handleGenerate} loading={generating} size="lg" style={{ marginTop: 8 }}>
            Generate My Plan
          </GlassButton>
        </div>
      ) : (
        <div className="animate-slide-up delay-100">
          {/* Summary Strip */}
          <div className="glass-card" style={ds.summaryStrip}>
            <div style={ds.summaryItem}>
              <span style={ds.summaryLabel}>Plan</span>
              <span style={ds.summaryVal}>{plan.plan_name}</span>
            </div>
            <div style={ds.summaryItem}>
              <span style={ds.summaryLabel}>Avg Daily Calories</span>
              <span style={{ ...ds.summaryVal, color: '#22c55e' }}>{Math.round(avgCal)} kcal</span>
            </div>
            <div style={ds.summaryItem}>
              <span style={ds.summaryLabel}>Created</span>
              <span style={ds.summaryVal}>{new Date(plan.created_at).toLocaleDateString()}</span>
            </div>
            <div style={ds.summaryItem}>
              <span style={ds.summaryLabel}>Status</span>
              <span className="badge badge-green">Active</span>
            </div>
          </div>

          {/* Nutritionist Note */}
          {note && (
            <div style={ds.noteCard} className="glass-card animate-fade-in delay-200">
              <span style={ds.noteIcon}>🥗</span>
              <p style={ds.noteText}>{note}</p>
            </div>
          )}

          {/* 7-day grid */}
          <div style={ds.daysGrid} className="animate-slide-up delay-200">
            {(days.length > 0 ? days : DAYS.map(d => ({ day: d, meals: {} }))).map((dayObj, i) => (
              <DayCard
                key={i}
                day={dayObj.day || DAYS[i]}
                dayData={dayObj}
                isToday={dayObj.day === todayDay}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ds = {
  summaryStrip: { display: 'flex', gap: 24, padding: '18px 28px', marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  summaryItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  summaryLabel: { fontSize: '0.7rem', fontWeight: 700, color: '#9dbfaa', textTransform: 'uppercase', letterSpacing: '0.06em' },
  summaryVal: { fontSize: '0.92rem', fontWeight: 700, color: '#0f2d1a' },
  noteCard: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 20px', marginBottom: 20, background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' },
  noteIcon: { fontSize: '1.4rem', flexShrink: 0 },
  noteText: { fontSize: '0.87rem', color: '#2d5a3d', lineHeight: 1.6, fontStyle: 'italic' },
  daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  dayCard: { overflow: 'hidden' },
  dayCardToday: { border: '2px solid rgba(34,197,94,0.4)', boxShadow: '0 0 0 4px rgba(34,197,94,0.08)' },
  dayHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', cursor: 'pointer' },
  dayName: { fontSize: '0.97rem', fontWeight: 700, color: '#0f2d1a', display: 'flex', alignItems: 'center', gap: 6 },
  todayPip: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.6)' },
  dayTotal: { fontSize: '0.75rem', color: '#6b8f76', marginTop: 2 },
  expandBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9dbfaa' },
  slots: { padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 },
  slot: { background: 'rgba(34,197,94,0.04)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(34,197,94,0.1)' },
  slotHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  slotIcon: { fontSize: '0.95rem' },
  slotTitle: { fontSize: '0.72rem', fontWeight: 700, color: '#9dbfaa', textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1 },
  slotCals: { fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 6 },
  slotMeal: { fontSize: '0.85rem', fontWeight: 600, color: '#0f2d1a', marginBottom: 6 },
  ingChips: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  ingChip: { fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(34,197,94,0.08)', color: '#15803d', borderRadius: 6, fontWeight: 500 },
  ingMore: { fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(34,197,94,0.15)', color: '#15803d', borderRadius: 6, fontWeight: 700 },
}
