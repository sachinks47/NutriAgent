from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

from database import engine, Base
import models  # ensure models are registered

from routers import profile, food, meals, diet, advisory, dashboard

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    logger.info("🚀 NutriAgent API starting up...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    yield
    logger.info("🛑 NutriAgent API shutting down")


app = FastAPI(
    title="NutriAgent API",
    description="AI-Powered Nutrition Agent — IBM watsonx.ai + USDA FoodData Central",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(profile.router)
app.include_router(food.router)
app.include_router(meals.router)
app.include_router(diet.router)
app.include_router(advisory.router)
app.include_router(dashboard.router)


@app.get("/health")
def health_check():
    """Health check endpoint for Docker."""
    return {"status": "healthy", "service": "NutriAgent API", "version": "1.0.0"}


@app.get("/")
def root():
    return {
        "message": "NutriAgent API — AI-Powered Nutrition Assistant",
        "docs": "/docs",
        "health": "/health",
    }
