# Diet Recommendation Agent
# Generates personalized 7-day meal plans based on user profile using IBM watsonx.ai.

import json
import logging
from agents.ibm_client import generate_text, get_mock_diet_plan

logger = logging.getLogger(__name__)


def _build_profile_context(profile) -> str:
    """Build a human-readable profile description for the AI prompt."""
    conditions = json.loads(profile.health_conditions or "[]")
    allergies = json.loads(profile.allergies or "[]")

    bmi = None
    if profile.weight_kg and profile.height_cm:
        bmi = round(profile.weight_kg / ((profile.height_cm / 100) ** 2), 1)

    parts = [
        f"Name: {profile.name}",
        f"Age: {profile.age or 'Not specified'}",
        f"Gender: {profile.gender or 'Not specified'}",
        f"Weight: {profile.weight_kg or 'Not specified'} kg",
        f"Height: {profile.height_cm or 'Not specified'} cm",
        f"BMI: {bmi or 'Not calculated'}",
        f"Fitness Goal: {profile.fitness_goal or 'general health'}",
        f"Health Conditions: {', '.join(conditions) if conditions else 'None'}",
        f"Allergies: {', '.join(allergies) if allergies else 'None'}",
        f"Cultural/Dietary Preference: {profile.cultural_preference or 'No preference'}",
        f"Daily Calorie Goal: {profile.daily_calorie_goal or 2000} kcal",
    ]
    return "\n".join(parts)


async def generate_diet_plan(profile) -> dict:
    """
    Generate a personalized 7-day diet plan for the given user profile.
    Returns a structured dict with daily meal plans.
    """
    profile_context = _build_profile_context(profile)
    conditions = json.loads(profile.health_conditions or "[]")
    allergies = json.loads(profile.allergies or "[]")

    health_notes = ""
    if conditions:
        health_notes += f"IMPORTANT: This person has {', '.join(conditions)}. Adjust meals accordingly. "
    if allergies:
        health_notes += f"STRICTLY AVOID these allergens: {', '.join(allergies)}. "

    prompt = f"""Create a detailed 7-day meal plan for the following person:

{profile_context}

{health_notes}

Return a JSON object with this exact structure:
{{
  "days": [
    {{
      "day": "Monday",
      "meals": {{
        "breakfast": {{"name": "...", "calories": 0, "ingredients": [...]}},
        "lunch": {{"name": "...", "calories": 0, "ingredients": [...]}},
        "dinner": {{"name": "...", "calories": 0, "ingredients": [...]}},
        "snacks": [{{"name": "...", "calories": 0}}]
      }}
    }}
  ],
  "total_daily_calories_avg": 0,
  "nutritionist_note": "..."
}}

Provide all 7 days (Monday through Sunday). Make meals practical, nutritious, and appropriate for the person's profile."""

    system_prompt = (
        "You are an expert nutritionist and dietitian. Create evidence-based, practical meal plans "
        "that are culturally sensitive, allergy-aware, and tailored to the individual's health goals. "
        "Always return valid JSON only, no additional text."
    )

    response_text = await generate_text(prompt, system_prompt, max_tokens=2000)

    try:
        # Try to extract JSON from response
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start >= 0 and end > start:
            plan_data = json.loads(response_text[start:end])
            return plan_data
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning(f"[DietAgent] Failed to parse AI response as JSON: {e}")

    # Fallback to mock
    logger.info("[DietAgent] Using mock diet plan as fallback")
    return get_mock_diet_plan()


def calculate_plan_summary(plan_data: dict) -> dict:
    """Calculate caloric totals and nutritional summary for a diet plan."""
    days = plan_data.get("days", [])
    daily_totals = []

    for day in days:
        meals = day.get("meals", {})
        day_calories = 0
        for meal_type in ["breakfast", "lunch", "dinner"]:
            meal = meals.get(meal_type, {})
            day_calories += meal.get("calories", 0)
        for snack in meals.get("snacks", []):
            day_calories += snack.get("calories", 0)
        daily_totals.append({"day": day.get("day"), "total_calories": day_calories})

    avg_calories = sum(d["total_calories"] for d in daily_totals) / len(daily_totals) if daily_totals else 0
    return {"daily_totals": daily_totals, "average_daily_calories": round(avg_calories, 0)}
