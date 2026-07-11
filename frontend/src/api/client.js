import axios from 'axios'

// Direct URL to backend — works for both local dev and Docker
// For local dev: backend runs on http://localhost:8000
// For Docker/production: set VITE_API_URL=http://your-server/api at build time
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// Response interceptor for uniform error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    error.friendlyMessage = message
    return Promise.reject(error)
  }
)

// ── Profile ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  get: () => client.get('/profile'),
  create: (data) => client.post('/profile', data),
  update: (data) => client.put('/profile', data),
}

// ── Food ─────────────────────────────────────────────────────────────────────
export const foodAPI = {
  search: (query) => client.get('/food/search', { params: { query } }),
}

// ── Meals ─────────────────────────────────────────────────────────────────────
export const mealsAPI = {
  log: (data) => client.post('/meals', data),
  logImage: (formData) =>
    client.post('/meals/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (dateFilter) =>
    client.get('/meals', { params: dateFilter ? { date_filter: dateFilter } : {} }),
  delete: (id) => client.delete(`/meals/${id}`),
}

// ── Diet Plan ─────────────────────────────────────────────────────────────────
export const dietAPI = {
  generate: () => client.post('/diet-plan'),
  getActive: () => client.get('/diet-plan/active'),
  getAll: () => client.get('/diet-plan'),
}

// ── Health Advisory ───────────────────────────────────────────────────────────
export const advisoryAPI = {
  get: (conditions) => client.post('/health-advisory', { conditions }),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getDaily: () => client.get('/dashboard', { params: { range: 'daily' } }),
  getWeekly: () => client.get('/dashboard', { params: { range: 'weekly' } }),
}

export default client
