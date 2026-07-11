import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import UserProfile, DietPlan
from schemas import DietPlanResponse
from agents.diet_recommendation_agent import generate_diet_plan, calculate_plan_summary

router = APIRouter(prefix="/api/diet-plan", tags=["diet-plan"])
logger = logging.getLogger(__name__)


def _serialize_plan(plan: DietPlan) -> DietPlanResponse:
    return DietPlanResponse(
        id=plan.id,
        user_id=plan.user_id,
        plan_name=plan.plan_name,
        plan_data=json.loads(plan.plan_data),
        is_active=plan.is_active,
        created_at=plan.created_at,
    )


@router.post("", response_model=DietPlanResponse, status_code=201)
async def create_diet_plan(db: Session = Depends(get_db)):
    """Generate a new personalized 7-day diet plan for the current user."""
    user = db.query(UserProfile).first()
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found. Please create a profile first.")

    logger.info(f"[DietPlan] Generating plan for user {user.id}")

    # Deactivate previous plans
    db.query(DietPlan).filter(DietPlan.user_id == user.id).update({"is_active": False})
    db.commit()

    plan_data = await generate_diet_plan(user)
    summary = calculate_plan_summary(plan_data)

    avg_cal = summary.get("average_daily_calories", 0)
    plan_name = f"Personalized Plan — ~{avg_cal:.0f} kcal/day"

    plan = DietPlan(
        user_id=user.id,
        plan_name=plan_name,
        plan_data=json.dumps(plan_data),
        is_active=True,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    logger.info(f"[DietPlan] Created plan ID {plan.id}")
    return _serialize_plan(plan)


@router.get("/active", response_model=DietPlanResponse)
def get_active_plan(db: Session = Depends(get_db)):
    """Get the currently active diet plan."""
    user = db.query(UserProfile).first()
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found.")

    plan = (
        db.query(DietPlan)
        .filter(DietPlan.user_id == user.id, DietPlan.is_active == True)
        .order_by(DietPlan.created_at.desc())
        .first()
    )
    if not plan:
        raise HTTPException(status_code=404, detail="No active diet plan found. Generate one first.")
    return _serialize_plan(plan)


@router.get("", response_model=list[DietPlanResponse])
def list_plans(db: Session = Depends(get_db)):
    """List all diet plans for the current user."""
    user = db.query(UserProfile).first()
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found.")

    plans = (
        db.query(DietPlan)
        .filter(DietPlan.user_id == user.id)
        .order_by(DietPlan.created_at.desc())
        .all()
    )
    return [_serialize_plan(p) for p in plans]
