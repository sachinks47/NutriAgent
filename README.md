# 🥗 NutriAgent — AI-Powered Nutrition Assistant

An intelligent, multi-agent nutrition platform built with React, Python FastAPI, IBM watsonx.ai, and USDA FoodData Central.

---

## ✨ Features

- **Personalized Diet Plans** — AI-generated 7-day meal plans based on your profile
- **Food Data RAG** — Real-time nutritional data from USDA FoodData Central + IBM AI summaries
- **Multi-Modal Meal Logging** — Log meals via text, image upload, or voice
- **Health Advisory** — Condition-specific guidance (diabetes, hypertension, heart disease)
- **Visualization Dashboard** — Charts for daily/weekly nutrient intake and goal progress
- **Glassmorphic UI** — Modern white & green theme with smooth animations

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Recharts, Lucide React |
| Backend | Python 3.11, FastAPI, SQLAlchemy |
| Database | SQLite (file-based, zero config) |
| AI | IBM watsonx.ai (Granite models) with mock fallback |
| Food Data | USDA FoodData Central API |
| Deployment | Docker + docker-compose + Nginx |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone / enter the project directory
cd nutrition-agent

# 2. Copy and fill in environment variables
cp .env.example .env
# Edit .env with your credentials (IBM API key optional — app works with mocks)

# 3. Start everything
docker-compose up --build

# App is live at:
# Frontend → http://localhost:80
# Backend API → http://localhost:8000
# API Docs → http://localhost:8000/docs
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp ../.env.example .env
# Edit .env as needed

uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp ../.env.example .env.local
# Set VITE_API_URL=http://localhost:8000/api in .env.local

npm run dev
# Frontend → http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IBM_WATSONX_API_KEY` | Optional | IBM Cloud API key (get from cloud.ibm.com) |
| `IBM_PROJECT_ID` | Optional | watsonx.ai project ID |
| `IBM_WATSONX_URL` | Optional | watsonx.ai service URL (e.g. https://us-south.ml.cloud.ibm.com) |
| `USDA_API_KEY` | Optional | USDA FoodData API key (default: DEMO_KEY) |
| `DATABASE_URL` | Optional | SQLite path (default: sqlite:///./nutrition.db) |
| `VITE_API_URL` | Optional | Backend URL for frontend (default: http://localhost:8000/api) |

> **Note:** IBM credentials are optional. When not provided, the app uses realistic mock AI responses automatically.

---

## 🤖 IBM watsonx.ai Setup (Free Lite Plan)

1. Sign up at [cloud.ibm.com](https://cloud.ibm.com) (no credit card needed)
2. Create a **Watson Machine Learning** instance (Lite tier)
3. Launch **watsonx.ai** → create a project → copy the **Project ID**
4. Go to **Manage → API Keys** → create and copy your **API Key**
5. Add both to your `.env` file

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET/POST/PUT | `/api/profile` | User profile management |
| GET | `/api/food/search?query=` | Search food nutrition data |
| POST/GET | `/api/meals` | Log and retrieve meals |
| DELETE | `/api/meals/{id}` | Delete a meal log |
| POST/GET | `/api/diet-plan` | Generate/retrieve diet plan |
| POST | `/api/health-advisory` | Get health advisory |
| GET | `/api/dashboard` | Nutrition dashboard data |

Interactive API docs available at `http://localhost:8000/docs`

---

## 🐳 Docker Architecture

```
nginx:80 (frontend)
    └── proxy /api → backend:8000
backend:8000 (FastAPI)
    └── nutrition.db (SQLite volume)
```

---

## 🛠️ Troubleshooting

**Port already in use:**
```bash
docker-compose down
docker-compose up --build
```

**Database reset:**
```bash
docker-compose down -v  # removes volumes
docker-compose up --build
```

**View backend logs:**
```bash
docker-compose logs -f backend
```
