import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Sidebar from './components/Sidebar.jsx'
import Header  from './components/Header.jsx'

import Dashboard      from './pages/Dashboard.jsx'
import Profile        from './pages/Profile.jsx'
import FoodSearch     from './pages/FoodSearch.jsx'
import MealLog        from './pages/MealLog.jsx'
import DietPlan       from './pages/DietPlan.jsx'
import HealthAdvisory from './pages/HealthAdvisory.jsx'
import Landing        from './pages/Landing.jsx'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* App Layout for all other routes */}
        <Route path="/*" element={
          <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <div
              className="main-content"
              style={{ marginLeft: collapsed ? 64 : 240, transition: 'margin-left 0.35s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <Header onToggleMobileMenu={() => setMobileMenuOpen(o => !o)} />
              <main style={{ flex: 1, overflowY: 'auto' }}>
                <Routes>
                  <Route path="/dashboard"       element={<Dashboard />}      />
                  <Route path="/profile"         element={<Profile />}        />
                  <Route path="/food-search"     element={<FoodSearch />}     />
                  <Route path="/meal-log"        element={<MealLog />}        />
                  <Route path="/diet-plan"       element={<DietPlan />}       />
                  <Route path="/health-advisory" element={<HealthAdvisory />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(34,197,94,0.2)',
            color: '#0f2d1a',
            boxShadow: '0 8px 24px rgba(34,197,94,0.12)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  )
}
