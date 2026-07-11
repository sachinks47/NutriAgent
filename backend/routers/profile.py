import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import UserProfile
from schemas import UserProfileCreate, UserProfileUpdate, UserProfileResponse

router = APIRouter(prefix="/api/profile", tags=["profile"])
logger = logging.getLogger(__name__)


def _serialize_profile(profile: UserProfile) -> UserProfileResponse:
    """Convert DB model to response schema, deserializing JSON fields."""
    bmi = None
    if profile.weight_kg and profile.height_cm:
        bmi = round(profile.weight_kg / ((profile.height_cm / 100) ** 2), 1)

    return UserProfileResponse(
        id=profile.id,
        name=profile.name,
        age=profile.age,
        gender=profile.gender,
        weight_kg=profile.weight_kg,
        height_cm=profile.height_cm,
        fitness_goal=profile.fitness_goal,
        health_conditions=json.loads(profile.health_conditions or "[]"),
        allergies=json.loads(profile.allergies or "[]"),
        cultural_preference=profile.cultural_preference,
        daily_calorie_goal=profile.daily_calorie_goal,
        bmi=bmi,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.get("", response_model=UserProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    """Get the current user profile (first profile in DB)."""
    profile = db.query(UserProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please create one first.")
    return _serialize_profile(profile)


@router.post("", response_model=UserProfileResponse, status_code=201)
def create_profile(data: UserProfileCreate, db: Session = Depends(get_db)):
    """Create a new user profile."""
    existing = db.query(UserProfile).first()
    if existing:
        raise HTTPException(status_code=409, detail="Profile already exists. Use PUT to update.")

    profile = UserProfile(
        name=data.name,
        age=data.age,
        gender=data.gender,
        weight_kg=data.weight_kg,
        height_cm=data.height_cm,
        fitness_goal=data.fitness_goal,
        health_conditions=json.dumps(data.health_conditions or []),
        allergies=json.dumps(data.allergies or []),
        cultural_preference=data.cultural_preference,
        daily_calorie_goal=data.daily_calorie_goal,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    logger.info(f"[Profile] Created profile for {profile.name}")
    return _serialize_profile(profile)


@router.put("", response_model=UserProfileResponse)
def update_profile(data: UserProfileUpdate, db: Session = Depends(get_db)):
    """Update the existing user profile."""
    profile = db.query(UserProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    profile.name = data.name
    profile.age = data.age
    profile.gender = data.gender
    profile.weight_kg = data.weight_kg
    profile.height_cm = data.height_cm
    profile.fitness_goal = data.fitness_goal
    profile.health_conditions = json.dumps(data.health_conditions or [])
    profile.allergies = json.dumps(data.allergies or [])
    profile.cultural_preference = data.cultural_preference
    profile.daily_calorie_goal = data.daily_calorie_goal
    profile.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(profile)
    logger.info(f"[Profile] Updated profile for {profile.name}")
    return _serialize_profile(profile)
