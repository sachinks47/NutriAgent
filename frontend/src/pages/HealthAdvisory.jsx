import React, { useState, useEffect } from 'react'
import { advisoryAPI, profileAPI } from '../api/client.js'
import GlassButton from '../components/GlassButton.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import toast from 'react-hot-toast'
import { HeartPulse, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react'

const ALL_CONDITIONS = [
  { id: 'diabetes',      label: 'Diabetes',       icon: '🩸', color: '#3b82f6' },
  { id: 'hypertension',  label: 'Hypertension',   icon: '💓', color: '#ef4444' },
  { id: 'heart_disease', label: 'Heart Disease',  icon: '❤️', color: '#f59e0b' },
  { id: 'obesity',       label: 'Obesity / Weight Management', icon: '⚖️', color: '#8b5cf6' },
]

function AdvisorySection({ icon, title, items, variant }) {
  const colors = {
    include: { bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.2)',  text: '#15803d', badgeBg: 'rgba(34,197,94,0.12)',  icon: '#22c55e' },
    avoid:   { bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.2)',  text: '#b91c1c', badgeBg: 'rgba(239,68,68,0.1)',   icon: '#ef4444' },
    tips:    { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', text: '#1d4ed8', badgeBg: 'rgba(59,130,246,0.1)',  icon: '#3b82f6' },
    warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', text: '#92400e', badgeBg: 'rgba(245,158,11,0.1)', icon: '#f59e0b' },
  }
  const c = colors[variant] || colors.tips
  if (!items || items.length === 0) return null

  return (
    <div style={{ ...ha.section, background: c.bg, borderColor: c.border }} className="glass-card-flat animate-slide-up">
      <div style={ha.sectionHeader}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <h4 style={{ ...ha.sectionTitle, color: c.text }}>{title}</h4>
      </div>
      {variant === 'include' || variant === 'avoid' ? (
        <div style={ha.chips}>
          {items.map((item, i) => (
            <span key={i} style={{ ...ha.chip, background: c.badgeBg, color: c.text, animationDelay: `${i * 40}ms` }} className="animate-scale-in">
              {variant === 'include' ? '✓' : '✗'} {item}
            </span>
          ))}
        </div>
      ) : (
        <ul style={ha.list}>
          {items.map((item, i) => (
            <li key={i} style={{ ...ha.listItem, animationDelay: `${i * 50}ms` }} className="animate-slide-up">
              <span style={{ color: c.icon, flexShrink: 0 }}>{variant === 'warning' ? '⚠️' : '•'}</span>
              <span style={{ color: '#2d5a3d', fontSize: '0.88rem' }}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function HealthAdvisory() {
  const [selected, setSelected] = useState([])
  const [advisory, setAdvisory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    profileAPI.get()
      .then(r => {
        const conditions = r.data.health_conditions || []
        if (conditions.length > 0) setSelected(conditions)
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false))
  }, [])

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const handleGetAdvisory = async () => {
    if (selected.length === 0) return toast.error('Please select at least one condition')
    setLoading(true)
    setAdvisory(null)
    try {
      const r = await advisoryAPI.get(selected)
      setAdvisory(r.data)
      toast.success('Advisory generated!')
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to get advisory')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header animate-slide-up">
        <h1 className="page-title">Health Advisory</h1>
        <p className="page-subtitle">Evidence-based dietary guidance for chronic disease management</p>
      </div>

      {/* Condition Selector */}
      <div className="glass-card animate-slide-up delay-100" style={ha.condCard}>
        <h3 style={ha.condTitle}><HeartPulse size={18} /> Select Health Conditions</h3>
        <p style={ha.condSub}>Choose the conditions for personalized dietary recommendations</p>
        <div style={ha.condGrid}>
          {ALL_CONDITIONS.map(({ id, label, icon, color }) => {
            const active = selected.includes(id)
            return (
              <button
                key={id}
                style={{ ...ha.condBtn, ...(active ? { ...ha.condBtnActive, borderColor: color, boxShadow: `0 4px 16px ${color}25` } : {}) }}
                onClick={() => toggle(id)}
              >
                <span style={ha.condIcon}>{icon}</span>
                <span style={{ ...ha.condLabel, color: active ? color : '#2d5a3d' }}>{label}</span>
                {active && <CheckCircle size={16} color={color} style={{ flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>
        <div style={{ marginTop: 20 }}>
          <GlassButton icon={Zap} size="lg" onClick={handleGetAdvisory} loading={loading} disabled={selected.length === 0}>
            Get Personalized Advisory
          </GlassButton>
        </div>
      </div>

      {loading && <LoadingScreen message="Consulting health advisory agent…" fullScreen={false} />}

      {advisory && !loading && (
        <div className="animate-slide-up delay-200" style={{ marginTop: 28 }}>
          {/* Active conditions badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9dbfaa' }}>Advisory for:</span>
            {(advisory.conditions || selected).map(c => {
              const meta = ALL_CONDITIONS.find(a => a.id === c)
              return meta ? (
                <span key={c} className="badge" style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}40` }}>
                  {meta.icon} {meta.label}
                </span>
              ) : null
            })}
          </div>

          {/* General Advice */}
          {advisory.general_advice && (
            <div className="glass-card animate-slide-up" style={ha.generalCard}>
              <Zap size={18} color="#22c55e" style={{ flexShrink: 0 }} />
              <p style={ha.generalText}>{advisory.general_advice}</p>
            </div>
          )}

          <div style={ha.sectionsGrid}>
            <AdvisorySection icon="💡" title="Dietary Tips"        items={advisory.tips}             variant="tips"    />
            <AdvisorySection icon="✅" title="Foods to Include"    items={advisory.foods_to_include} variant="include" />
            <AdvisorySection icon="🚫" title="Foods to Avoid"      items={advisory.foods_to_avoid}   variant="avoid"   />
            <AdvisorySection icon="⚠️" title="Warning Signs"       items={advisory.warning_signs}    variant="warning" />
          </div>
        </div>
      )}

      {!advisory && !loading && (
        <div className="empty-state animate-fade-in" style={{ paddingTop: 40 }}>
          <div className="empty-state-icon animate-float"><HeartPulse size={36} /></div>
          <p className="empty-state-title">Select conditions above</p>
          <p className="empty-state-desc">Choose your health conditions and click "Get Personalized Advisory" for evidence-based dietary guidance</p>
        </div>
      )}
    </div>
  )
}

const ha = {
  condCard: { padding: '28px 32px', marginBottom: 8 },
  condTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#0f2d1a', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  condSub: { fontSize: '0.84rem', color: '#6b8f76', marginBottom: 20 },
  condGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 },
  condBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(34,197,94,0.2)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', backdropFilter: 'blur(8px)' },
  condBtnActive: { background: 'rgba(255,255,255,0.9)' },
  condIcon: { fontSize: '1.4rem' },
  condLabel: { flex: 1, fontSize: '0.88rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' },
  sectionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 },
  section: { padding: '18px 20px', border: '1px solid', borderRadius: 16 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: '0.92rem', fontWeight: 700 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 7 },
  chip: { fontSize: '0.78rem', fontWeight: 600, padding: '5px 12px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 },
  list: { display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none' },
  listItem: { display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.5 },
  generalCard: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '16px 20px', marginBottom: 20, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14 },
  generalText: { fontSize: '0.88rem', color: '#2d5a3d', lineHeight: 1.7, fontStyle: 'italic' },
}
