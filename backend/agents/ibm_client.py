# IBM watsonx.ai Client
# Uses real API when credentials are provided via environment variables.
# Falls back to realistic mock responses automatically when credentials are absent.

import os
import json
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

IBM_WATSONX_API_KEY = os.getenv("IBM_WATSONX_API_KEY", "")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID", "")
IBM_WATSONX_URL = os.getenv("IBM_WATSONX_URL", "https://us-south.ml.cloud.ibm.com")

_IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"
_cached_token: Optional[str] = None


async def _get_iam_token() -> Optional[str]:
    """Fetch IAM bearer token from IBM Cloud."""
    global _cached_token
    if _cached_token:
        return _cached_token
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                _IAM_TOKEN_URL,
                data={
                    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                    "apikey": IBM_WATSONX_API_KEY,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            resp.raise_for_status()
            _cached_token = resp.json()["access_token"]
            return _cached_token
    except Exception as e:
        logger.warning(f"[IBM] Failed to get IAM token: {e}")
        return None


MOCK_RESPONSES = {
    "diet_plan": {
        "days": [
            {
                "day": "Monday",
                "meals": {
                    "breakfast": {"name": "Oatmeal with Berries & Nuts", "calories": 380, "ingredients": ["rolled oats", "mixed berries", "almonds", "honey", "low-fat milk"]},
                    "lunch": {"name": "Grilled Chicken Salad", "calories": 450, "ingredients": ["grilled chicken breast", "mixed greens", "cherry tomatoes", "cucumber", "olive oil dressing"]},
                    "dinner": {"name": "Baked Salmon with Quinoa", "calories": 520, "ingredients": ["salmon fillet", "quinoa", "steamed broccoli", "lemon", "herbs"]},
                    "snacks": [{"name": "Greek Yogurt with Honey", "calories": 150}, {"name": "Apple with Almond Butter", "calories": 180}]
                }
            },
            {
                "day": "Tuesday",
                "meals": {
                    "breakfast": {"name": "Avocado Toast with Eggs", "calories": 420, "ingredients": ["whole grain bread", "avocado", "poached eggs", "cherry tomatoes", "black pepper"]},
                    "lunch": {"name": "Lentil Soup with Whole Grain Bread", "calories": 390, "ingredients": ["red lentils", "carrots", "celery", "spinach", "whole grain bread"]},
                    "dinner": {"name": "Stir-Fried Tofu with Brown Rice", "calories": 480, "ingredients": ["firm tofu", "brown rice", "bell peppers", "snap peas", "ginger", "soy sauce"]},
                    "snacks": [{"name": "Mixed Nuts", "calories": 160}, {"name": "Carrot Sticks with Hummus", "calories": 120}]
                }
            },
            {
                "day": "Wednesday",
                "meals": {
                    "breakfast": {"name": "Smoothie Bowl", "calories": 360, "ingredients": ["banana", "spinach", "protein powder", "almond milk", "granola topping"]},
                    "lunch": {"name": "Turkey Wrap", "calories": 430, "ingredients": ["whole grain wrap", "turkey breast", "lettuce", "tomato", "mustard"]},
                    "dinner": {"name": "Grilled Lean Beef with Sweet Potato", "calories": 550, "ingredients": ["lean beef steak", "sweet potato", "green beans", "garlic butter"]},
                    "snacks": [{"name": "Banana", "calories": 90}, {"name": "Cottage Cheese", "calories": 140}]
                }
            },
            {
                "day": "Thursday",
                "meals": {
                    "breakfast": {"name": "Whole Grain Pancakes", "calories": 400, "ingredients": ["whole wheat flour", "eggs", "blueberries", "maple syrup", "low-fat milk"]},
                    "lunch": {"name": "Chickpea Buddha Bowl", "calories": 460, "ingredients": ["chickpeas", "farro", "roasted vegetables", "tahini dressing"]},
                    "dinner": {"name": "Baked Chicken Thighs with Roasted Vegetables", "calories": 510, "ingredients": ["chicken thighs", "zucchini", "bell peppers", "onion", "olive oil"]},
                    "snacks": [{"name": "Pear", "calories": 100}, {"name": "Walnut Halves", "calories": 180}]
                }
            },
            {
                "day": "Friday",
                "meals": {
                    "breakfast": {"name": "Greek Yogurt Parfait", "calories": 340, "ingredients": ["Greek yogurt", "granola", "strawberries", "blueberries", "honey"]},
                    "lunch": {"name": "Tuna Salad Sandwich", "calories": 420, "ingredients": ["tuna in water", "whole grain bread", "celery", "Greek yogurt mayo", "lettuce"]},
                    "dinner": {"name": "Shrimp Stir-Fry with Noodles", "calories": 490, "ingredients": ["shrimp", "soba noodles", "bok choy", "mushrooms", "sesame oil"]},
                    "snacks": [{"name": "Orange", "calories": 85}, {"name": "Trail Mix", "calories": 170}]
                }
            },
            {
                "day": "Saturday",
                "meals": {
                    "breakfast": {"name": "Veggie Omelette", "calories": 380, "ingredients": ["eggs", "spinach", "mushrooms", "bell peppers", "feta cheese"]},
                    "lunch": {"name": "Minestrone Soup", "calories": 350, "ingredients": ["mixed vegetables", "kidney beans", "whole grain pasta", "tomato broth"]},
                    "dinner": {"name": "Baked Cod with Asparagus", "calories": 460, "ingredients": ["cod fillet", "asparagus", "lemon", "herbs", "olive oil"]},
                    "snacks": [{"name": "Celery with Peanut Butter", "calories": 130}, {"name": "Kiwi", "calories": 70}]
                }
            },
            {
                "day": "Sunday",
                "meals": {
                    "breakfast": {"name": "Chia Seed Pudding", "calories": 310, "ingredients": ["chia seeds", "coconut milk", "mango", "kiwi", "vanilla"]},
                    "lunch": {"name": "Grain Bowl with Roasted Chickpeas", "calories": 470, "ingredients": ["quinoa", "roasted chickpeas", "kale", "avocado", "lemon tahini"]},
                    "dinner": {"name": "Herb-Roasted Chicken with Mashed Cauliflower", "calories": 530, "ingredients": ["chicken breast", "cauliflower", "garlic", "rosemary", "thyme"]},
                    "snacks": [{"name": "Dark Chocolate Square", "calories": 80}, {"name": "Mixed Berries", "calories": 90}]
                }
            }
        ],
        "total_daily_calories_avg": 1950,
        "nutritionist_note": "This plan is designed to provide balanced macronutrients with emphasis on whole foods, lean proteins, and complex carbohydrates. Adjust portion sizes based on your specific caloric needs."
    },
    "nutrition_summary": "This food is an excellent source of essential nutrients. It provides a good balance of macronutrients and contains important vitamins and minerals that support overall health. Regular consumption as part of a balanced diet can contribute to maintaining energy levels and supporting bodily functions.",
    "health_advisory": {
        "diabetes": {
            "tips": [
                "Monitor carbohydrate intake and choose low glycemic index foods",
                "Eat smaller, more frequent meals to maintain steady blood sugar",
                "Include fiber-rich foods to slow glucose absorption",
                "Stay hydrated with water instead of sugary beverages",
                "Combine carbohydrates with protein or healthy fats to reduce blood sugar spikes"
            ],
            "foods_to_include": ["leafy greens", "berries", "legumes", "nuts", "whole grains", "fish", "Greek yogurt", "cinnamon", "garlic", "olive oil"],
            "foods_to_avoid": ["white bread", "sugary drinks", "candy", "white rice", "processed snacks", "fried foods", "full-fat dairy", "alcohol"],
            "warning_signs": ["Frequent urination", "Unusual thirst", "Blurred vision", "Fatigue", "Slow-healing wounds", "Tingling in hands or feet"],
            "general_advice": "Managing diabetes through diet requires consistent monitoring and planning. Focus on complex carbohydrates, lean proteins, and healthy fats while limiting simple sugars. Regular blood glucose monitoring and consultation with your healthcare provider are essential."
        },
        "hypertension": {
            "tips": [
                "Follow the DASH diet — rich in fruits, vegetables, and low-fat dairy",
                "Reduce sodium intake to less than 2,300 mg per day",
                "Increase potassium intake through fruits and vegetables",
                "Limit alcohol consumption",
                "Maintain a healthy weight through portion control"
            ],
            "foods_to_include": ["bananas", "spinach", "beets", "oats", "berries", "fatty fish", "garlic", "dark chocolate", "pomegranate", "leafy greens"],
            "foods_to_avoid": ["table salt", "canned soups", "processed meats", "fast food", "pickles", "frozen meals", "full-fat cheese", "alcohol"],
            "warning_signs": ["Severe headache", "Chest pain", "Shortness of breath", "Nosebleeds", "Vision problems", "Blood in urine"],
            "general_advice": "The DASH (Dietary Approaches to Stop Hypertension) diet is clinically proven to lower blood pressure. Focus on reducing sodium, increasing potassium, and maintaining a healthy weight through regular physical activity."
        },
        "heart_disease": {
            "tips": [
                "Choose heart-healthy fats (omega-3s) over saturated and trans fats",
                "Increase soluble fiber intake to lower LDL cholesterol",
                "Eat fatty fish twice a week for omega-3 fatty acids",
                "Use olive oil as your primary cooking fat",
                "Eat plenty of antioxidant-rich fruits and vegetables"
            ],
            "foods_to_include": ["salmon", "walnuts", "flaxseeds", "oats", "beans", "avocado", "olive oil", "dark leafy greens", "berries", "tomatoes"],
            "foods_to_avoid": ["red meat", "full-fat dairy", "fried foods", "trans fats", "refined carbohydrates", "added sugars", "excessive salt", "alcohol"],
            "warning_signs": ["Chest pain or discomfort", "Shortness of breath", "Irregular heartbeat", "Fatigue", "Swelling in legs/ankles", "Dizziness"],
            "general_advice": "A heart-healthy diet centered on the Mediterranean diet principles can significantly reduce cardiovascular risk. Focus on plant-based foods, lean proteins, healthy fats, and minimizing processed foods and sodium."
        },
        "obesity": {
            "tips": [
                "Create a moderate caloric deficit of 500-750 calories per day",
                "Prioritize high-protein foods to maintain muscle mass",
                "Choose high-fiber foods that promote satiety",
                "Practice mindful eating and avoid emotional eating",
                "Stay well hydrated — sometimes thirst is mistaken for hunger"
            ],
            "foods_to_include": ["lean proteins", "vegetables", "fruits", "whole grains", "legumes", "low-fat dairy", "water", "green tea", "eggs", "Greek yogurt"],
            "foods_to_avoid": ["sugary beverages", "fast food", "processed snacks", "alcohol", "refined carbohydrates", "large portion sizes", "high-calorie condiments"],
            "warning_signs": ["Difficulty breathing during normal activity", "Joint pain", "Sleep apnea", "High blood pressure", "High blood sugar", "Fatigue"],
            "general_advice": "Sustainable weight loss requires a combination of moderate caloric restriction, increased physical activity, and behavioral changes. Focus on building healthy habits rather than quick fixes. Aim for 0.5-1 kg weight loss per week."
        }
    },
    "meal_feedback": {
        "score": 75,
        "summary": "Your meal provides good nutritional value with a balance of macronutrients. There are some areas for improvement to optimize your daily nutritional intake.",
        "nutritional_gaps": ["Could increase fiber intake", "Consider adding more vegetables", "Vitamin C could be higher"],
        "suggestions": ["Add a side salad to boost micronutrients", "Consider whole grain alternatives", "Include a fruit for natural vitamins"],
        "positive_aspects": ["Good protein content", "Moderate calorie count", "Contains essential minerals"]
    }
}


async def generate_text(
    prompt: str,
    system_prompt: str = "",
    model_id: str = "ibm/granite-13b-instruct-v2",
    max_tokens: int = 800,
) -> str:
    """
    Generate text using IBM watsonx.ai.
    Falls back to mock responses if credentials are not configured.
    """
    if not IBM_WATSONX_API_KEY or not IBM_PROJECT_ID:
        logger.warning("[IBM watsonx] Credentials not set — using mock response.")
        return _get_mock_response(prompt)

    token = await _get_iam_token()
    if not token:
        return _get_mock_response(prompt)

    url = f"{IBM_WATSONX_URL}/ml/v1/text/generation?version=2023-05-29"
    full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt

    payload = {
        "model_id": model_id,
        "project_id": IBM_PROJECT_ID,
        "input": full_prompt,
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": max_tokens,
            "min_new_tokens": 50,
            "stop_sequences": [],
            "temperature": 0.7,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                url,
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["results"][0]["generated_text"].strip()
    except Exception as e:
        logger.warning(f"[IBM watsonx] API call failed: {e} — using mock response.")
        return _get_mock_response(prompt)


def _get_mock_response(prompt: str) -> str:
    """Return a contextually relevant mock response based on prompt keywords."""
    prompt_lower = prompt.lower()

    if "diet plan" in prompt_lower or "meal plan" in prompt_lower or "weekly" in prompt_lower:
        return json.dumps(MOCK_RESPONSES["diet_plan"])

    if any(k in prompt_lower for k in ["nutrition", "nutritional", "food summary", "food data"]):
        return MOCK_RESPONSES["nutrition_summary"]

    if "diabetes" in prompt_lower:
        return json.dumps(MOCK_RESPONSES["health_advisory"]["diabetes"])
    if "hypertension" in prompt_lower or "blood pressure" in prompt_lower:
        return json.dumps(MOCK_RESPONSES["health_advisory"]["hypertension"])
    if "heart" in prompt_lower:
        return json.dumps(MOCK_RESPONSES["health_advisory"]["heart_disease"])
    if "obesity" in prompt_lower or "weight loss" in prompt_lower:
        return json.dumps(MOCK_RESPONSES["health_advisory"]["obesity"])

    if any(k in prompt_lower for k in ["meal feedback", "log analysis", "meal analysis", "nutritional feedback"]):
        return json.dumps(MOCK_RESPONSES["meal_feedback"])

    return "Based on the nutritional analysis, this represents a well-balanced choice. For optimal health, focus on variety, adequate hydration, and consistency with your dietary goals."


def get_mock_diet_plan() -> dict:
    return MOCK_RESPONSES["diet_plan"]


def get_mock_health_advisory(condition: str) -> dict:
    return MOCK_RESPONSES["health_advisory"].get(
        condition,
        MOCK_RESPONSES["health_advisory"]["obesity"]
    )


def get_mock_meal_feedback() -> dict:
    return MOCK_RESPONSES["meal_feedback"]
