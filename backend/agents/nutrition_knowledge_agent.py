# Nutrition Knowledge Agent
# Fetches real nutritional data from USDA FoodData Central and generates AI summaries.

import os
import httpx
import logging
from typing import Optional
from agents.ibm_client import generate_text

logger = logging.getLogger(__name__)

USDA_API_KEY = os.getenv("USDA_API_KEY", "DEMO_KEY")
USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1"

# Nutrient ID mappings from USDA FoodData Central
NUTRIENT_MAP = {
    1008: "calories",
    1003: "protein_g",
    1005: "carbs_g",
    1004: "fat_g",
    1079: "fiber_g",
    1087: "calcium_mg",
    1089: "iron_mg",
    1090: "magnesium_mg",
    1091: "phosphorus_mg",
    1092: "potassium_mg",
    1093: "sodium_mg",
    1095: "zinc_mg",
    1162: "vitamin_c_mg",
    1165: "thiamin_mg",
    1166: "riboflavin_mg",
    1167: "niacin_mg",
    1175: "vitamin_b6_mg",
    1177: "folate_mcg",
    1178: "vitamin_b12_mcg",
    1180: "choline_mg",
    1183: "vitamin_e_mg",
    1185: "vitamin_k_mcg",
    1106: "vitamin_a_mcg",
    1114: "vitamin_d_mcg",
}

VITAMIN_KEYS = {"vitamin_c_mg", "thiamin_mg", "riboflavin_mg", "niacin_mg",
                "vitamin_b6_mg", "folate_mcg", "vitamin_b12_mcg", "vitamin_e_mg",
                "vitamin_k_mcg", "vitamin_a_mcg", "vitamin_d_mcg", "choline_mg"}

MINERAL_KEYS = {"calcium_mg", "iron_mg", "magnesium_mg", "phosphorus_mg",
                "potassium_mg", "sodium_mg", "zinc_mg"}


async def search_foods(query: str, page_size: int = 5) -> list[dict]:
    """Search USDA FoodData Central for foods matching the query."""
    url = f"{USDA_BASE_URL}/foods/search"
    params = {
        "query": query,
        "api_key": USDA_API_KEY,
        "pageSize": page_size,
        "dataType": "Foundation,SR Legacy,Branded",
        "sortBy": "dataType.keyword",
        "sortOrder": "asc",
    }
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            foods = data.get("foods", [])
            return [_parse_food(f) for f in foods[:page_size]]
    except httpx.HTTPStatusError as e:
        logger.warning(f"[USDA] HTTP error: {e.response.status_code} — returning mock data")
        return _mock_food_results(query)
    except Exception as e:
        logger.warning(f"[USDA] Request failed: {e} — returning mock data")
        return _mock_food_results(query)


def _parse_food(food: dict) -> dict:
    """Parse a USDA food item into our standardized format."""
    nutrients = {}
    for n in food.get("foodNutrients", []):
        nutrient_id = n.get("nutrientId")
        value = n.get("value", 0)
        if nutrient_id in NUTRIENT_MAP:
            nutrients[NUTRIENT_MAP[nutrient_id]] = round(float(value or 0), 2)

    vitamins = {k: v for k, v in nutrients.items() if k in VITAMIN_KEYS}
    minerals = {k: v for k, v in nutrients.items() if k in MINERAL_KEYS}

    return {
        "food_name": food.get("description", "Unknown Food"),
        "fdc_id": food.get("fdcId"),
        "brand": food.get("brandOwner", ""),
        "category": food.get("foodCategory", ""),
        "calories_per_100g": nutrients.get("calories", 0),
        "protein_g": nutrients.get("protein_g", 0),
        "carbs_g": nutrients.get("carbs_g", 0),
        "fat_g": nutrients.get("fat_g", 0),
        "fiber_g": nutrients.get("fiber_g", 0),
        "vitamins": vitamins,
        "minerals": minerals,
        "ai_summary": None,
    }


async def get_food_with_summary(query: str) -> list[dict]:
    """Fetch foods + generate AI summary for the top result."""
    foods = await search_foods(query)
    if not foods:
        return []

    # Generate AI summary for the top result only (to save tokens)
    top_food = foods[0]
    prompt = (
        f"Provide a concise 2-sentence nutritional summary for {top_food['food_name']}. "
        f"Per 100g: {top_food['calories_per_100g']} calories, "
        f"{top_food['protein_g']}g protein, {top_food['carbs_g']}g carbs, "
        f"{top_food['fat_g']}g fat, {top_food['fiber_g']}g fiber. "
        f"Highlight key health benefits and any important nutritional considerations."
    )
    system_prompt = (
        "You are a certified nutritionist. Provide clear, accurate, and helpful nutritional guidance. "
        "Keep responses concise and evidence-based."
    )
    summary = await generate_text(prompt, system_prompt, max_tokens=150)
    foods[0]["ai_summary"] = summary

    return foods


def _mock_food_results(query: str) -> list[dict]:
    """Return mock nutritional data when USDA API is unavailable."""
    return [
        {
            "food_name": f"{query.title()} (estimated)",
            "fdc_id": None,
            "brand": "",
            "category": "Mock Data",
            "calories_per_100g": 150,
            "protein_g": 5.2,
            "carbs_g": 20.1,
            "fat_g": 4.8,
            "fiber_g": 2.3,
            "vitamins": {"vitamin_c_mg": 8.5, "vitamin_a_mcg": 25.0},
            "minerals": {"calcium_mg": 45.0, "iron_mg": 1.2, "potassium_mg": 220.0},
            "ai_summary": f"{query.title()} provides a good balance of nutrients as part of a healthy diet. It contains moderate calories with useful amounts of vitamins and minerals.",
        }
    ]
