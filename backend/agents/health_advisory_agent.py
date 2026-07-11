# Health Advisory Agent
# Provides evidence-based preventive health and chronic disease diet guidance.

import json
import logging
from typing import List
from agents.ibm_client import generate_text, get_mock_health_advisory

logger = logging.getLogger(__name__)

SUPPORTED_CONDITIONS = ["diabetes", "hypertension", "heart_disease", "obesity"]

CONDITION_PROMPTS = {
    "diabetes": (
        "diabetes mellitus (Type 2). Focus on: glycemic index, carbohydrate counting, "
        "blood sugar management, insulin sensitivity foods, and meal timing."
    ),
    "hypertension": (
        "hypertension (high blood pressure). Focus on: DASH diet principles, sodium reduction, "
        "potassium-rich foods, magnesium, and blood pressure lowering nutrients."
    ),
    "heart_disease": (
        "cardiovascular heart disease. Focus on: cholesterol management, omega-3 fatty acids, "
        "antioxidants, fiber, Mediterranean diet principles, and heart-healthy fats."
    ),
    "obesity": (
        "obesity and weight management. Focus on: caloric deficit strategies, satiety foods, "
        "metabolism boosting nutrients, portion control, and sustainable dietary habits."
    ),
}


async def get_health_advisory(conditions: List[str], profile=None) -> dict:
    """
    Generate comprehensive health advisory for the given conditions.
    Returns structured advice with tips, food lists, and warnings.
    """
    valid_conditions = [c for c in conditions if c in SUPPORTED_CONDITIONS]

    if not valid_conditions:
        valid_conditions = ["obesity"]  # Default advisory

    # If multiple conditions, combine them
    if len(valid_conditions) == 1:
        return await _get_single_condition_advisory(valid_conditions[0], profile)
    else:
        return await _get_combined_advisory(valid_conditions, profile)


async def _get_single_condition_advisory(condition: str, profile=None) -> dict:
    """Get advisory for a single condition."""
    condition_detail = CONDITION_PROMPTS.get(condition, CONDITION_PROMPTS["obesity"])

    profile_ctx = ""
    if profile:
        profile_ctx = (
            f"Patient profile: Age {profile.age or 'unknown'}, "
            f"Gender {profile.gender or 'unknown'}, "
            f"BMI {round(profile.weight_kg / ((profile.height_cm / 100) ** 2), 1) if profile.weight_kg and profile.height_cm else 'unknown'}"
        )

    prompt = f"""Provide comprehensive dietary advisory for a patient with {condition_detail}

{profile_ctx}

Return a JSON object with this exact structure:
{{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "foods_to_include": ["food1", "food2", "food3", "food4", "food5", "food6", "food7", "food8", "food9", "food10"],
  "foods_to_avoid": ["food1", "food2", "food3", "food4", "food5", "food6", "food7", "food8"],
  "warning_signs": ["sign1", "sign2", "sign3", "sign4", "sign5", "sign6"],
  "general_advice": "A comprehensive paragraph of evidence-based dietary advice for this condition."
}}

Provide practical, evidence-based, actionable advice. Return only valid JSON."""

    system_prompt = (
        "You are a certified clinical nutritionist specializing in chronic disease management. "
        "Provide evidence-based, practical dietary guidance. "
        "Always return valid JSON only, no additional text."
    )

    response_text = await generate_text(prompt, system_prompt, max_tokens=1000)

    try:
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start >= 0 and end > start:
            advisory_data = json.loads(response_text[start:end])
            advisory_data["conditions"] = [condition]
            return advisory_data
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning(f"[HealthAdvisory] Failed to parse AI response: {e}")

    # Fallback to mock
    mock = get_mock_health_advisory(condition)
    mock["conditions"] = [condition]
    return mock


async def _get_combined_advisory(conditions: List[str], profile=None) -> dict:
    """Merge advisories for multiple conditions."""
    advisories = []
    for condition in conditions[:3]:  # Limit to 3 conditions max
        advisory = await _get_single_condition_advisory(condition, profile)
        advisories.append(advisory)

    if not advisories:
        return get_mock_health_advisory("obesity")

    # Merge: combine unique tips, foods, warnings
    combined = {
        "conditions": conditions,
        "tips": [],
        "foods_to_include": [],
        "foods_to_avoid": [],
        "warning_signs": [],
        "general_advice": "",
    }

    seen_tips = set()
    seen_include = set()
    seen_avoid = set()
    seen_warnings = set()
    advice_parts = []

    for a in advisories:
        for tip in a.get("tips", []):
            if tip not in seen_tips:
                combined["tips"].append(tip)
                seen_tips.add(tip)
        for food in a.get("foods_to_include", []):
            if food not in seen_include:
                combined["foods_to_include"].append(food)
                seen_include.add(food)
        for food in a.get("foods_to_avoid", []):
            if food not in seen_avoid:
                combined["foods_to_avoid"].append(food)
                seen_avoid.add(food)
        for sign in a.get("warning_signs", []):
            if sign not in seen_warnings:
                combined["warning_signs"].append(sign)
                seen_warnings.add(sign)
        if a.get("general_advice"):
            advice_parts.append(a["general_advice"])

    combined["tips"] = combined["tips"][:8]
    combined["foods_to_include"] = combined["foods_to_include"][:12]
    combined["foods_to_avoid"] = combined["foods_to_avoid"][:10]
    combined["warning_signs"] = combined["warning_signs"][:8]
    combined["general_advice"] = " ".join(advice_parts[:2])

    return combined
