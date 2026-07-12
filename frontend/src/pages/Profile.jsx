import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { User, Save, Activity } from 'lucide-react'
import { profileAPI } from '../api/client.js'
import GlassButton from '../components/GlassButton.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'

const FITNESS_GOALS = [
  { value: 'weight_loss',    label: 'Weight Loss' },
  { value: 'muscle_gain',   label: 'Muscle Gain' },
  { value: 'maintenance',   label: 'Weight Maintenance' },
  { value: 'general_health',label: 'General Health' },
  { value: 'endurance',     label: 'Endurance / Athletic' },
]

const CULTURAL_PREFS = [
  { value: 'no_preference', label: 'No Preference' },
  { value: 'vegetarian',    label: 'Vegetarian' },
  { value: 'vegan',         label: 'Vegan' },
  { value: 'halal',         label: 'Halal' },
  { value: 'kosher',        label: 'Kosher' },
  { value: 'gluten_free',   label: 'Gluten-Free' },
  { value: 'paleo',         label: 'Paleo' },
  { value: 'keto',          label: 'Ketogenic' },
]

const HEALTH_CONDITIONS = ['diabetes', 'hypertension', 'heart_disease', 'obesity', 'thyroid', 'kidney_disease', 'celiac_disease']
const COMMON_ALLERGIES  = ['gluten', 'dairy', 'nuts', 'shellfish', 'eggs', 'soy', 'fish', 'wheat']

const DEFAULT = {
  name: '', age: '', gender: '', weight_kg: '', height_cm: '',
  fitness_goal: 'general_health', health_conditions: [], allergies: [],
  cultural_preference: 'no_preference', daily_calorie_goal: 2000,
}

function computeBMI(w, h) {
  const wn = parseFloat(w), hn = parseFloat(h)
  if (!wn || !hn || hn <= 0) return null
  return (wn / ((hn / 100) ** 2)).toFixed(1)
}

function BMICategory(bmi) {
  if (!bmi) return null
  const b = parseFloat(bmi)
  if (b < 18.5) return { label: 'Underweight', color: '#3b82f6' }
  if (b < 25)   return { label: 'Normal',      color: '#22c55e' }
  if (b < 30)   return { label: 'Overweight',  color: '#f59e0b' }
  return { label: 'Obese', color: '#ef4444' }
}

export default function Profile() {
  const [form, setForm] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exists, setExists] = useState(false)

  useEffect(() => {
    profileAPI.get()
      .then(r => {
        const d = r.data
        setForm({
          name: d.name || '',
          age: d.age || '',
          gender: d.gender || '',
          weight_kg: d.weight_kg || '',
          height_cm: d.height_cm || '',
          fitness_goal: d.fitness_goal || 'general_health',
          health_conditions: d.health_conditions || [],
          allergies: d.allergies || [],
          cultural_preference: d.cultural_preference || 'no_preference',
          daily_calorie_goal: d.daily_calorie_goal || 2000,
        })
        setExists(true)
      })
      .catch(() => setExists(false))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      age: form.age ? parseInt(form.age) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      daily_calorie_goal: parseInt(form.daily_calorie_goal) || 2000,
    }
    try {
      if (exists) await profileAPI.update(payload)
      else await profileAPI.create(payload)
      setExists(true)
      toast.success('Profile saved successfully!')
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const toggleArray = (field, value) =>
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(x => x !== value)
        : [...f[field], value],
    }))

  const bmi = computeBMI(form.weight_kg, form.height_cm)
  const bmiCat = BMICategory(bmi)

  if (loading) return <LoadingScreen message="Loading profile..." fullScreen={false} />

  return (
    <div className="page-container">
      <div className="page-header animate-slide-up">
        <h1 className="page-title">My Health Profile</h1>
        <p className="page-subtitle">Your profile drives all AI personalization — keep it up to date</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={s.grid}>
          {/* Personal Info */}
          <div className="glass-card animate-slide-up delay-100" style={s.section}>
            <h3 style={s.sectionTitle}><User size={16} /> Personal Information</h3>
            <div style={s.fields}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Enter your name" required />
              </div>
              <div style={s.row2}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input className="form-input" type="number" min="1" max="120" value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} placeholder="Years" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={s.row2}>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input className="form-input" type="number" step="0.1" value={form.weight_kg} onChange={e => setForm(f => ({...f, weight_kg: e.target.value}))} placeholder="kg" />
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input className="form-input" type="number" step="0.1" value={form.height_cm} onChange={e => setForm(f => ({...f, height_cm: e.target.value}))} placeholder="cm" />
                </div>
              </div>

              {/* BMI Display */}
              {bmi && (
                <div style={{ ...s.bmiCard, borderColor: bmiCat?.color + '40', background: bmiCat?.color + '0d' }} className="animate-scale-in">
                  <Activity size={18} color={bmiCat?.color} />
                  <div>
                    <div style={s.bmiLabel}>Body Mass Index (BMI)</div>
                    <div style={s.bmiValue}>
                      <span style={{ color: bmiCat?.color, fontSize: '1.5rem', fontWeight: 800 }}>{bmi}</span>
                      <span style={s.bmiCat}> — {bmiCat?.label}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Daily Calorie Goal</label>
                <input className="form-input" type="number" min="800" max="5000" step="50" value={form.daily_calorie_goal} onChange={e => setForm(f => ({...f, daily_calorie_goal: e.target.value}))} />
              </div>
            </div>
          </div>

          {/* Goals & Preferences */}
          <div className="glass-card animate-slide-up delay-200" style={s.section}>
            <h3 style={s.sectionTitle}>🎯 Goals & Dietary Preferences</h3>
            <div style={s.fields}>
              <div className="form-group">
                <label className="form-label">Fitness Goal</label>
                <select className="form-select" value={form.fitness_goal} onChange={e => setForm(f => ({...f, fitness_goal: e.target.value}))}>
                  {FITNESS_GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cultural / Dietary Preference</label>
                <select className="form-select" value={form.cultural_preference} onChange={e => setForm(f => ({...f, cultural_preference: e.target.value}))}>
                  {CULTURAL_PREFS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              {/* Health Conditions */}
              <div className="form-group">
                <label className="form-label">Health Conditions</label>
                <div style={s.chips}>
                  {HEALTH_CONDITIONS.map(c => (
                    <button key={c} type="button"
                      onClick={() => toggleArray('health_conditions', c)}
                      style={{ ...s.chip, ...(form.health_conditions.includes(c) ? s.chipActive : {}) }}
                    >
                      {c.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="form-group">
                <label className="form-label">Allergies</label>
                <div style={s.chips}>
                  {COMMON_ALLERGIES.map(a => (
                    <button key={a} type="button"
                      onClick={() => toggleArray('allergies', a)}
                      style={{ ...s.chip, ...(form.allergies.includes(a) ? s.chipDanger : {}) }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }} className="animate-slide-up delay-300">
          <GlassButton type="submit" size="lg" icon={Save} loading={saving} fullWidth={false}>
            {exists ? 'Update Profile' : 'Create Profile'}
          </GlassButton>
        </div>
      </form>
    </div>
  )
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },
  section: { padding: '28px 28px' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 },
  fields: { display: 'flex', flexDirection: 'column', gap: 16 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  bmiCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1.5px solid', borderRadius: 12 },
  bmiLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 },
  bmiValue: { display: 'flex', alignItems: 'baseline', gap: 2 },
  bmiCat: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    padding: '5px 14px', border: '1.5px solid var(--border-solid)', borderRadius: 20,
    background: 'var(--bg-card)', cursor: 'pointer', fontSize: '0.8rem',
    fontWeight: 500, color: 'var(--text-secondary)', transition: 'all 0.2s', textTransform: 'capitalize',
  },
  chipActive: { background: 'rgba(34,197,94,0.15)', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 },
  chipDanger: { background: 'rgba(239,68,68,0.1)', borderColor: 'var(--red)', color: 'var(--red)', fontWeight: 700 },
}
