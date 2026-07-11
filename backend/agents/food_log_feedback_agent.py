# Food Log & Feedback Agent
# Analyzes meal logs and provides instant nutritional feedback using IBM watsonx.ai.

import json
import logging
from agents.ibm_client import generate_text, get_mock_meal_feedback

logger = logging.getLogger(__name__)

# Daily Recommended Values (standard adult, 2000 kcal diet)
DRV = {
    "calories": 2000,
    "protein_g": 50,
    "carbs_g": 275,
    "fat_g": 78,
    "fiber_g": 28,
    "vitamin_c_mg": 90,
    "calcium_mg": 1000,
    "iron_mg": 18,
    "potassium_mg": 4700,
    "sodium_mg": 2300,
}


async def analyze_meal_log(meal_data: dict, daily_logs: list = None) -> dict:
    """
    Analyze a meal log entry and provide nutritional feedback.

    Args:
        meal_data: The meal that was just logged
        daily_logs: All meals logged today (for context)

    Returns:
        dict with score, summary, gaps, suggestions, positive_aspects
    """
    meal_name = meal_data.get("meal_name", "your meal")
    calories = meal_data.get("total_calories", 0)
    protein = meal_data.get("total_protein_g", 0)
    carbs = meal_data.get("total_carbs_g", 0)
    fat = meal_data.get("total_fat_g", 0)
    fiber = meal_data.get("total_fiber_g", 0)

    # Calculate daily totals if we have context
    daily_context = ""
    if daily_logs:
        daily_calories = sum(m.get("total_calories", 0) for m in daily_logs) + calories
        daily_protein = sum(m.get("total_protein_g", 0) for m in daily_logs) + protein
        daily_carbs = sum(m.get("total_carbs_g", 0) for m in daily_logs) + carbs
        daily_fat = sum(m.get("total_fat_g", 0) for m in daily_logs) + fat
        daily_fiber = sum(m.get("total_fiber_g", 0) for m in daily_logs) + fiber

        daily_context = (
            f"\nToday's running totals after this meal: "
            f"{daily_calories:.0f} kcal, {daily_protein:.1f}g protein, "
            f"{daily_carbs:.1f}g carbs, {daily_fat:.1f}g fat, {daily_fiber:.1f}g fiber."
            f"\nDaily goals: {DRV['calories']} kcal, {DRV['protein_g']}g protein, "
            f"{DRV['carbs_g']}g carbs, {DRV['fat_g']}g fat, {DRV['fiber_g']}g fiber."
        )

    prompt = f"""Analyze this meal log entry and provide nutritional feedback:

Meal: {meal_name}
Calories: {calories:.0f} kcal
Protein: {protein:.1f}g
Carbohydrates: {carbs:.1f}g
Fat: {fat:.1f}g
Fiber: {fiber:.1f}g
{daily_context}

Return a JSON object with this exact structure:
{{
  "score": 75,
  "summary": "Brief overall assessment of this meal (1-2 sentences)",
  "nutritional_gaps": ["gap1", "gap2", "gap3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "positive_aspects": ["positive1", "positive2", "positive3"]
}}

Score 0-100 based on: nutritional balance (40%), portion appropriateness (30%), food quality (30%).
Be encouraging but honest. Return only valid JSON."""

    system_prompt = (
        "You are a supportive nutritional coach providing meal-by-meal feedback. "
        "Be encouraging, specific, and actionable. "
        "Always return valid JSON only, no additional text."
    )

    response_text = await generate_text(prompt, system_prompt, max_tokens=500)

    try:
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start >= 0 and end > start:
            feedback = json.loads(response_text[start:end])
            # Ensure score is within bounds
            feedback["score"] = max(0, min(100, int(feedback.get("score", 70))))
            return feedback
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning(f"[FoodLogAgent] Failed to parse AI feedback: {e}")

    # Fallback: calculate score heuristically
    return _heuristic_feedback(meal_name, calories, protein, carbs, fat, fiber)


def _heuristic_feedback(
    meal_name: str,
    calories: float,
    protein: float,
    carbs: float,
    fat: float,
    fiber: float,
) -> dict:
    """Calculate feedback heuristically when AI is unavailable."""
    score = 60  # Base score
    gaps = []
    suggestions = []
    positives = []

    # Evaluate protein
    if protein >= 15:
        score += 10
        positives.append(f"Good protein content ({protein:.1f}g) supports muscle maintenance")
    elif protein < 5:
        score -= 10
        gaps.append("Low protein content")
        suggestions.append("Add a lean protein source like chicken, fish, eggs, or legumes")

    # Evaluate fiber
    if fiber >= 5:
        score += 10
        positives.append(f"Good fiber content ({fiber:.1f}g) supports digestive health")
    elif fiber < 2:
        score -= 5
        gaps.append("Low dietary fiber")
        suggestions.append("Include vegetables, whole grains, or legumes to boost fiber")

    # Evaluate calories
    if 300 <= calories <= 700:
        score += 10
        positives.append(f"Appropriate calorie portion ({calories:.0f} kcal) for a single meal")
    elif calories > 800:
        score -= 10
        gaps.append("High calorie content for a single meal")
        suggestions.append("Consider reducing portion size or choosing lower-calorie alternatives")

    # Evaluate fat
    fat_pct = (fat * 9 / calories * 100) if calories > 0 else 0
    if fat_pct > 40:
        score -= 5
        gaps.append("High fat percentage of total calories")
        suggestions.append("Choose leaner cooking methods and reduce added fats")
    elif 15 <= fat_pct <= 35:
        positives.append("Healthy fat proportion within recommended range")

    score = max(0, min(100, score))

    if not gaps:
        gaps = ["Consider tracking micronutrients like vitamins and minerals"]
    if not suggestions:
        suggestions = ["Maintain variety in your diet to ensure all nutrients are covered"]
    if not positives:
        positives = ["You're actively tracking your nutrition — great habit!"]

    return {
        "score": score,
        "summary": f"Your {meal_name} provides {calories:.0f} kcal with {protein:.1f}g protein. {('Well-balanced meal!' if score >= 70 else 'Some improvements could enhance nutritional value.')}",
        "nutritional_gaps": gaps[:3],
        "suggestions": suggestions[:3],
        "positive_aspects": positives[:3],
    }


def calculate_deficiencies(daily_totals: dict, goal_calories: int = 2000) -> list:
    """
    Calculate which nutrients are significantly below daily recommended values.
    Returns list of deficiency descriptions.
    """
    deficiencies = []

    # Scale DRV by calorie goal ratio
    calorie_ratio = goal_calories / 2000

    checks = [
        ("protein_g", "protein", "g", 0.6),
        ("fiber_g", "fiber", "g", 0.5),
        ("calcium_mg", "calcium", "mg", 0.5),
        ("iron_mg", "iron", "mg", 0.5),
        ("vitamin_c_mg", "vitamin C", "mg", 0.5),
    ]

    for key, name, unit, threshold in checks:
        drv_val = DRV.get(key, 0) * calorie_ratio
        consumed = daily_totals.get(key, 0)
        if drv_val > 0 and consumed < drv_val * threshold:
            pct = int((consumed / drv_val) * 100)
            deficiencies.append(f"{name.title()} — only {pct}% of daily goal")

    return deficiencies
