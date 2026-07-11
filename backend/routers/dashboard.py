import json
import logging
from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import MealLog, UserProfile
from agents.food_log_feedback_agent import calculate_deficiencies

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
logger = logging.getLogger(__name__)

# Daily Recommended Values for display
DISPLAY_DRV = {
    "calories": {"label": "Calories", "unit": "kcal", "value": 2000},
    "protein_g": {"label": "Protein", "unit": "g", "value": 50},
    "carbs_g": {"label": "Carbohydrates", "unit": "g", "value": 275},
    "fat_g": {"label": "Fat", "unit": "g", "value": 78},
    "fiber_g": {"label": "Fiber", "unit": "g", "value": 28},
}


def _serialize_meal_inline(meal: MealLog) -> dict:
    """Serialize a MealLog ORM object to a plain dict — no circular imports."""
    return {
        "id":                  meal.id,
        "user_id":             meal.user_id,
        "meal_name":           meal.meal_name,
        "meal_type":           meal.meal_type or "snack",
        "food_items":          json.loads(meal.food_items or "[]"),
        "quantity_description": meal.quantity_description,
        "total_calories":      meal.total_calories or 0,
        "total_protein_g":     meal.total_protein_g or 0,
        "total_carbs_g":       meal.total_carbs_g or 0,
        "total_fat_g":         meal.total_fat_g or 0,
        "total_fiber_g":       meal.total_fiber_g or 0,
        "vitamins":            json.loads(meal.vitamins or "{}"),
        "minerals":            json.loads(meal.minerals or "{}"),
        "input_method":        meal.input_method or "text",
        "ai_feedback":         json.loads(meal.ai_feedback) if meal.ai_feedback else None,
        "notes":               meal.notes,
        "logged_at":           meal.logged_at.isoformat() if meal.logged_at else None,
    }


def _aggregate_meals(meals: list) -> dict:
    """Sum nutrients across a list of meal DB objects."""
    totals = {
        "total_calories": 0,
        "total_protein_g": 0,
        "total_carbs_g": 0,
        "total_fat_g": 0,
        "total_fiber_g": 0,
        "vitamins": {},
        "minerals": {},
    }
    for meal in meals:
        totals["total_calories"] += meal.total_calories or 0
        totals["total_protein_g"] += meal.total_protein_g or 0
        totals["total_carbs_g"] += meal.total_carbs_g or 0
        totals["total_fat_g"] += meal.total_fat_g or 0
        totals["total_fiber_g"] += meal.total_fiber_g or 0

        # Aggregate vitamins/minerals
        for key, val_dict in [("vitamins", json.loads(meal.vitamins or "{}")),
                              ("minerals", json.loads(meal.minerals or "{}"))]:
            for k, v in val_dict.items():
                totals[key][k] = round(totals[key].get(k, 0) + (v or 0), 2)
    return totals


def _build_nutrient_progress(totals: dict, calorie_goal: int) -> list:
    """Build progress bars vs DRV."""
    goal_ratio = calorie_goal / 2000
    progress = []
    for key, meta in DISPLAY_DRV.items():
        raw_key = key
        consumed = totals.get(f"total_{raw_key}" if not raw_key.startswith("total") else raw_key, 0)
        # Handle key naming conventions
        if key == "calories":
            consumed = totals.get("total_calories", 0)
        else:
            consumed = totals.get(f"total_{key}", 0)

        goal = meta["value"] * goal_ratio
        pct = min(round((consumed / goal) * 100, 1), 150) if goal > 0 else 0
        progress.append({
            "nutrient": meta["label"],
            "consumed": round(consumed, 1),
            "goal": round(goal, 1),
            "unit": meta["unit"],
            "percentage": pct,
        })
    return progress


@router.get("")
def get_dashboard(
    range_param: str = Query("daily", description="daily or weekly"),
    db: Session = Depends(get_db),
):
    """Get nutrition dashboard data for daily or weekly view."""
    user = db.query(UserProfile).first()
    calorie_goal = user.daily_calorie_goal if user else 2000

    today = date.today()

    if range_param == "weekly":
        # Get last 7 days
        start_date = today - timedelta(days=6)
        all_meals = (
            db.query(MealLog)
            .filter(
                MealLog.logged_at >= datetime.combine(start_date, datetime.min.time()),
                MealLog.logged_at <= datetime.combine(today, datetime.max.time()),
            )
            .all()
        )

        daily_data = []
        trend_data = []
        for i in range(7):
            day = start_date + timedelta(days=i)
            day_meals = [m for m in all_meals if m.logged_at and m.logged_at.date() == day]
            day_totals = _aggregate_meals(day_meals)
            daily_data.append({
                "date": day.strftime("%Y-%m-%d"),
                "day_label": day.strftime("%a"),
                **{k: round(v, 1) for k, v in day_totals.items() if isinstance(v, (int, float))},
                "meal_count": len(day_meals),
            })
            trend_data.append({
                "date": day.strftime("%b %d"),
                "calories": round(day_totals["total_calories"], 0),
                "protein": round(day_totals["total_protein_g"], 1),
                "carbs": round(day_totals["total_carbs_g"], 1),
                "fat": round(day_totals["total_fat_g"], 1),
            })

        weekly_totals = _aggregate_meals(all_meals)
        weekly_averages = {
            k: round(v / 7, 1) for k, v in weekly_totals.items() if isinstance(v, (int, float))
        }

        return {
            "range": "weekly",
            "week_start": start_date.strftime("%Y-%m-%d"),
            "week_end": today.strftime("%Y-%m-%d"),
            "daily_data": daily_data,
            "weekly_averages": weekly_averages,
            "trend_data": trend_data,
            "calorie_goal": calorie_goal,
        }

    # Daily view
    today_meals = (
        db.query(MealLog)
        .filter(
            MealLog.logged_at >= datetime.combine(today, datetime.min.time()),
            MealLog.logged_at <= datetime.combine(today, datetime.max.time()),
        )
        .order_by(MealLog.logged_at.asc())
        .all()
    )

    totals = _aggregate_meals(today_meals)
    nutrient_progress = _build_nutrient_progress(totals, calorie_goal)

    deficiency_input = {
        "protein_g": totals["total_protein_g"],
        "fiber_g": totals["total_fiber_g"],
        "vitamin_c_mg": totals["vitamins"].get("vitamin_c_mg", 0),
        "calcium_mg": totals["minerals"].get("calcium_mg", 0),
        "iron_mg": totals["minerals"].get("iron_mg", 0),
    }
    deficiencies = calculate_deficiencies(deficiency_input, calorie_goal)

    # Serialize meals inline — avoids circular import with routers.meals
    serialized_meals = [_serialize_meal_inline(m) for m in today_meals]

    return {
        "range": "daily",
        "date": today.strftime("%Y-%m-%d"),
        "total_calories": round(totals["total_calories"], 1),
        "total_protein_g": round(totals["total_protein_g"], 1),
        "total_carbs_g": round(totals["total_carbs_g"], 1),
        "total_fat_g": round(totals["total_fat_g"], 1),
        "total_fiber_g": round(totals["total_fiber_g"], 1),
        "meal_count": len(today_meals),
        "nutrient_progress": nutrient_progress,
        "meals": serialized_meals,
        "deficiencies": deficiencies,
        "calorie_goal": calorie_goal,
        "vitamins": totals["vitamins"],
        "minerals": totals["minerals"],
    }
