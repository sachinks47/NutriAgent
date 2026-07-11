import json
import logging
import base64
from datetime import datetime, date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from database import get_db
from models import MealLog, UserProfile
from schemas import MealLogCreate, MealLogResponse
from agents.nutrition_knowledge_agent import search_foods
from agents.food_log_feedback_agent import analyze_meal_log

router = APIRouter(prefix="/api/meals", tags=["meals"])
logger = logging.getLogger(__name__)


def _serialize_meal(meal: MealLog) -> MealLogResponse:
    """Convert DB model to response schema."""
    return MealLogResponse(
        id=meal.id,
        user_id=meal.user_id,
        meal_name=meal.meal_name,
        meal_type=meal.meal_type,
        food_items=json.loads(meal.food_items or "[]"),
        quantity_description=meal.quantity_description,
        total_calories=meal.total_calories or 0,
        total_protein_g=meal.total_protein_g or 0,
        total_carbs_g=meal.total_carbs_g or 0,
        total_fat_g=meal.total_fat_g or 0,
        total_fiber_g=meal.total_fiber_g or 0,
        vitamins=json.loads(meal.vitamins or "{}"),
        minerals=json.loads(meal.minerals or "{}"),
        input_method=meal.input_method or "text",
        ai_feedback=json.loads(meal.ai_feedback) if meal.ai_feedback else None,
        notes=meal.notes,
        logged_at=meal.logged_at,
    )


async def _enrich_meal_nutrition(meal_name: str, food_items: list) -> dict:
    """Fetch nutritional data from USDA for the meal."""
    total = {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "fiber_g": 0}
    vitamins = {}
    minerals = {}

    # If pre-computed food items exist, sum them
    if food_items:
        for item in food_items:
            total["calories"] += item.get("calories", 0)
            total["protein_g"] += item.get("protein_g", 0)
            total["carbs_g"] += item.get("carbs_g", 0)
            total["fat_g"] += item.get("fat_g", 0)
        return total, vitamins, minerals

    # Otherwise fetch from USDA
    foods = await search_foods(meal_name, page_size=1)
    if foods:
        f = foods[0]
        # Assume ~250g serving (reasonable default)
        factor = 2.5
        total["calories"] = round(f["calories_per_100g"] * factor, 1)
        total["protein_g"] = round(f["protein_g"] * factor, 1)
        total["carbs_g"] = round(f["carbs_g"] * factor, 1)
        total["fat_g"] = round(f["fat_g"] * factor, 1)
        total["fiber_g"] = round(f["fiber_g"] * factor, 1)
        vitamins = {k: round(v * factor, 2) for k, v in f.get("vitamins", {}).items()}
        minerals = {k: round(v * factor, 2) for k, v in f.get("minerals", {}).items()}

    return total, vitamins, minerals


def _get_or_create_user(db: Session) -> UserProfile:
    """Get first user or create a default one."""
    user = db.query(UserProfile).first()
    if not user:
        user = UserProfile(name="User", daily_calorie_goal=2000)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.post("", response_model=MealLogResponse, status_code=201)
async def log_meal_text(data: MealLogCreate, db: Session = Depends(get_db)):
    """Log a meal from text input."""
    user = _get_or_create_user(db)
    food_items_dicts = [item.model_dump() for item in data.food_items] if data.food_items else []

    nutrition, vitamins, minerals = await _enrich_meal_nutrition(data.meal_name, food_items_dicts)

    # Get today's logs for context
    today = date.today()
    daily_logs = [
        _serialize_meal(m).model_dump()
        for m in db.query(MealLog)
        .filter(MealLog.user_id == user.id)
        .all()
        if m.logged_at and m.logged_at.date() == today
    ]

    meal_data = {
        "meal_name": data.meal_name,
        "total_calories": nutrition["calories"],
        "total_protein_g": nutrition["protein_g"],
        "total_carbs_g": nutrition["carbs_g"],
        "total_fat_g": nutrition["fat_g"],
        "total_fiber_g": nutrition["fiber_g"],
    }
    feedback = await analyze_meal_log(meal_data, daily_logs)

    meal = MealLog(
        user_id=user.id,
        meal_name=data.meal_name,
        meal_type=data.meal_type,
        food_items=json.dumps(food_items_dicts),
        quantity_description=data.quantity_description,
        total_calories=nutrition["calories"],
        total_protein_g=nutrition["protein_g"],
        total_carbs_g=nutrition["carbs_g"],
        total_fat_g=nutrition["fat_g"],
        total_fiber_g=nutrition["fiber_g"],
        vitamins=json.dumps(vitamins),
        minerals=json.dumps(minerals),
        input_method=data.input_method,
        ai_feedback=json.dumps(feedback),
        notes=data.notes,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    logger.info(f"[Meals] Logged: {meal.meal_name} ({meal.total_calories} kcal)")
    return _serialize_meal(meal)


@router.post("/image", response_model=MealLogResponse, status_code=201)
async def log_meal_image(
    file: UploadFile = File(...),
    meal_type: str = Form("snack"),
    notes: str = Form(""),
    db: Session = Depends(get_db),
):
    """Log a meal from an image upload (mock vision analysis)."""
    user = _get_or_create_user(db)

    # Read and encode image
    image_bytes = await file.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    # Mock vision analysis — in production this would call a vision model
    meal_name = _analyze_image_mock(file.filename, len(image_bytes))

    nutrition, vitamins, minerals = await _enrich_meal_nutrition(meal_name, [])
    meal_data = {
        "meal_name": meal_name,
        "total_calories": nutrition["calories"],
        "total_protein_g": nutrition["protein_g"],
        "total_carbs_g": nutrition["carbs_g"],
        "total_fat_g": nutrition["fat_g"],
        "total_fiber_g": nutrition["fiber_g"],
    }
    feedback = await analyze_meal_log(meal_data, [])

    meal = MealLog(
        user_id=user.id,
        meal_name=meal_name,
        meal_type=meal_type,
        food_items=json.dumps([]),
        quantity_description="Detected from image",
        total_calories=nutrition["calories"],
        total_protein_g=nutrition["protein_g"],
        total_carbs_g=nutrition["carbs_g"],
        total_fat_g=nutrition["fat_g"],
        total_fiber_g=nutrition["fiber_g"],
        vitamins=json.dumps(vitamins),
        minerals=json.dumps(minerals),
        input_method="image",
        ai_feedback=json.dumps(feedback),
        notes=notes,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return _serialize_meal(meal)


@router.get("", response_model=list[MealLogResponse])
def get_meals(
    date_filter: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Get meal logs, optionally filtered by date (YYYY-MM-DD)."""
    user = _get_or_create_user(db)
    query = db.query(MealLog).filter(MealLog.user_id == user.id)

    if date_filter:
        try:
            filter_date = datetime.strptime(date_filter, "%Y-%m-%d").date()
            query = query.filter(
                MealLog.logged_at >= datetime.combine(filter_date, datetime.min.time()),
                MealLog.logged_at <= datetime.combine(filter_date, datetime.max.time()),
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    meals = query.order_by(MealLog.logged_at.desc()).limit(limit).all()
    return [_serialize_meal(m) for m in meals]


@router.delete("/{meal_id}", status_code=204)
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    """Delete a meal log entry."""
    meal = db.query(MealLog).filter(MealLog.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found.")
    db.delete(meal)
    db.commit()
    logger.info(f"[Meals] Deleted meal ID {meal_id}")


def _analyze_image_mock(filename: str, size_bytes: int) -> str:
    """Mock image analysis — returns a plausible meal name."""
    meal_suggestions = [
        "Mixed Vegetable Salad",
        "Grilled Chicken with Rice",
        "Pasta with Tomato Sauce",
        "Fruit Bowl",
        "Oatmeal with Berries",
        "Sandwich with Vegetables",
        "Rice Bowl with Protein",
        "Stir-Fried Vegetables",
    ]
    # Use file size as a deterministic seed for mock variety
    idx = size_bytes % len(meal_suggestions)
    return meal_suggestions[idx]
