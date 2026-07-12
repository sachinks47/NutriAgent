import React, { useState, useEffect, useCallback, useRef } from 'react'
import { foodAPI, mealsAPI } from '../api/client.js'
import GlassButton from '../components/GlassButton.jsx'
import { Search, Plus, Zap, X, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingScreen from '../components/LoadingScreen.jsx'

function NutritionBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{value}g</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '75%', marginBottom: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 28 }} />)}
      </div>
    </div>
  )
}

export default function FoodSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [logModal, setLogModal] = useState(null)
  const [logQty, setLogQty] = useState('100g')
  const [logMealType, setLogMealType] = useState('snack')
  const [logging, setLogging] = useState(false)
  const debounceRef = useRef(null)

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    try {
      const r = await foodAPI.search(q)
      setResults(r.data.results || [])
    } catch (e) {
      toast.error('Search failed: ' + (e.friendlyMessage || e.message))
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 350)
    return () => clearTimeout(debounceRef.current)
  }, [query, doSearch])

  const handleLogFood = async () => {
    if (!logModal) return
    setLogging(true)
    try {
      await mealsAPI.log({
        meal_name: logModal.food_name,
        meal_type: logMealType,
        quantity_description: logQty,
        input_method: 'text',
        food_items: [],
      })
      toast.success(`${logModal.food_name} logged successfully!`)
      setLogModal(null)
    } catch (e) {
      toast.error('Failed to log: ' + (e.friendlyMessage || e.message))
    } finally {
      setLogging(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header animate-slide-up">
        <h1 className="page-title">Food Search</h1>
        <p className="page-subtitle">Powered by USDA FoodData Central + IBM AI summaries</p>
      </div>

      {/* Search Bar */}
      <div style={s.searchWrapper} className="animate-slide-up delay-100">
        <div style={s.searchBox} className="glass-card">
          <Search size={20} color="#22c55e" style={{ flexShrink: 0 }} />
          <input
            style={s.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for any food — apple, salmon, oatmeal, chicken breast…"
            autoFocus
          />
          {query && (
            <button style={s.clearBtn} onClick={() => { setQuery(''); setResults([]) }}>
              <X size={16} />
            </button>
          )}
        </div>
        {results.length > 0 && (
          <div style={s.resultCount} className="animate-fade-in">
            <span style={s.resultBadge}>{results.length} results</span> from USDA database
          </div>
        )}
      </div>

      {/* Loading State */}
      {searching && (
        <div style={s.skeletonGrid} className="animate-fade-in">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Results */}
      {!searching && results.length > 0 && (
        <div style={s.resultsGrid} className="animate-fade-in">
          {results.map((food, i) => (
            <div
              key={food.fdc_id || i}
              className="glass-card animate-slide-up interactive"
              style={{ ...s.foodCard, animationDelay: `${i * 60}ms` }}
              onClick={() => setSelectedFood(food === selectedFood ? null : food)}
            >
              <div style={s.foodHeader}>
                <div style={{ flex: 1 }}>
                  <h3 style={s.foodName}>{food.food_name}</h3>
                  {food.brand && <span style={s.foodBrand}>{food.brand}</span>}
                  {food.category && <span style={s.foodCategory}>{food.category}</span>}
                </div>
                <div style={s.caloriesBadge}>
                  <span style={s.calNum}>{food.calories_per_100g}</span>
                  <span style={s.calUnit}>kcal/100g</span>
                </div>
              </div>

              {/* Macro bars */}
              <div style={s.macros}>
                <NutritionBar label="Protein"  value={food.protein_g} max={50}  color="#3b82f6" />
                <NutritionBar label="Carbs"    value={food.carbs_g}   max={100} color="#f59e0b" />
                <NutritionBar label="Fat"      value={food.fat_g}     max={50}  color="#ef4444" />
                <NutritionBar label="Fiber"    value={food.fiber_g}   max={28}  color="#8b5cf6" />
              </div>

              {/* AI Summary */}
              {food.ai_summary && (
                <div style={s.aiSummary}>
                  <Zap size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={s.aiText}>{food.ai_summary}</p>
                </div>
              )}

              {/* Vitamin / Mineral chips (expanded) */}
              {selectedFood === food && Object.keys(food.vitamins || {}).length > 0 && (
                <div style={s.microSection} className="animate-fade-in">
                  <div style={s.microLabel}>Vitamins & Minerals (per 100g)</div>
                  <div style={s.microChips}>
                    {Object.entries({ ...food.vitamins, ...food.minerals }).slice(0, 8).map(([k, v]) => (
                      <span key={k} className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                        {k.replace(/_/g, ' ').replace('mg', '').replace('mcg', '').trim()}: {v}{k.includes('mcg') ? 'mcg' : 'mg'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={s.cardFooter}>
                <GlassButton size="sm" icon={Plus} onClick={(e) => { e.stopPropagation(); setLogModal(food) }}>
                  Add to Meal Log
                </GlassButton>
                <span style={s.tapHint}><Info size={13} /> Tap to expand</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!searching && query && results.length === 0 && (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon"><Search size={36} /></div>
          <p className="empty-state-title">No results for "{query}"</p>
          <p className="empty-state-desc">Try a different spelling or more general term (e.g., "apple" instead of "apple pie")</p>
        </div>
      )}

      {!query && (
        <div className="empty-state animate-fade-in" style={{ paddingTop: 60 }}>
          <div className="empty-state-icon animate-float"><Search size={36} /></div>
          <p className="empty-state-title">Search any food</p>
          <p className="empty-state-desc">Get real nutritional data from the USDA FoodData Central database with AI-powered summaries</p>
          <div style={s.suggestions}>
            {['Avocado', 'Salmon', 'Brown Rice', 'Greek Yogurt', 'Almonds'].map(s => (
              <button key={s} style={s2.suggChip} onClick={() => setQuery(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Log Modal */}
      {logModal && (
        <div style={s.modalOverlay} onClick={() => setLogModal(null)}>
          <div style={s.modal} className="glass-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 20, fontSize: '1.1rem', fontWeight: 700 }}>Log: {logModal.food_name}</h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Quantity / Serving</label>
              <input className="form-input" value={logQty} onChange={e => setLogQty(e.target.value)} placeholder="e.g. 100g, 1 cup, 2 pieces" />
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Meal Type</label>
              <select className="form-select" value={logMealType} onChange={e => setLogMealType(e.target.value)}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <GlassButton icon={Plus} loading={logging} onClick={handleLogFood} fullWidth>Log Food</GlassButton>
              <GlassButton variant="ghost" onClick={() => setLogModal(null)}>Cancel</GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  searchWrapper: { marginBottom: 28 },
  searchBox: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', background: 'transparent', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', padding: 4 },
  resultCount: { marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' },
  resultBadge: { background: 'rgba(34,197,94,0.12)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  foodCard: { padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 },
  foodHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  foodName: { fontSize: '0.97rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 },
  foodBrand: { display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 },
  foodCategory: { display: 'inline-block', fontSize: '0.68rem', background: 'rgba(34,197,94,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 6, marginTop: 4 },
  caloriesBadge: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 },
  calNum: { fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', fontFamily: "'Nunito', sans-serif", lineHeight: 1 },
  calUnit: { fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 1 },
  macros: {},
  aiSummary: { display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(34,197,94,0.06)', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(34,197,94,0.12)' },
  aiText: { fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 },
  microSection: { paddingTop: 8 },
  microLabel: { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  microChips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
  tapHint: { fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4 },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { padding: '32px 36px', minWidth: 340, maxWidth: 480, width: '90%' },
}

const s2 = {
  suggChip: { padding: '6px 16px', border: '1px solid var(--border-solid)', borderRadius: 20, background: 'var(--bg-card)', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500, transition: 'all 0.2s' },
}
