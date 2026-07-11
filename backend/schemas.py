from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime


# ── User Profile ──────────────────────────────────────────────────────────────

class UserProfileCreate(BaseModel):
    name: str = "User"
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    fitness_goal: Optional[str] = "general_health"
    health_conditions: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    cultural_preference: Optional[str] = "no_preference"
    daily_calorie_goal: Optional[int] = 2000


class UserProfileUpdate(UserProfileCreate):
    pass


class UserProfileResponse(BaseModel):
    id: int
    name: str
    age: Optional[int]
    gender: Optional[str]
    weight_kg: Optional[float]
    height_cm: Optional[float]
    fitness_goal: Optional[str]
    health_conditions: List[str] = []
    allergies: List[str] = []
    cultural_preference: Optional[str]
    daily_calorie_goal: Optional[int]
    bmi: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Meal Log ──────────────────────────────────────────────────────────────────

class FoodItem(BaseModel):
    name: str
    quantity: str
    calories: Optional[float] = 0
    protein_g: Optional[float] = 0
    carbs_g: Optional[float] = 0
    fat_g: Optional[float] = 0


class MealLogCreate(BaseModel):
    meal_name: str
    meal_type: str = "snack"
    food_items: Optional[List[FoodItem]] = []
    quantity_description: Optional[str] = None
    input_method: str = "text"
    notes: Optional[str] = None


class MealLogResponse(BaseModel):
    id: int
    user_id: int
    meal_name: str
    meal_type: str
    food_items: List[Any] = []
    quantity_description: Optional[str]
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    total_fiber_g: float
    vitamins: Dict[str, Any] = {}
    minerals: Dict[str, Any] = {}
    input_method: str
    ai_feedback: Optional[Dict[str, Any]] = None
    notes: Optional[str]
    logged_at: datetime

    class Config:
        from_attributes = True


# ── Diet Plan ─────────────────────────────────────────────────────────────────

class DietPlanResponse(BaseModel):
    id: int
    user_id: int
    plan_name: str
    plan_data: Dict[str, Any]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Food Search ───────────────────────────────────────────────────────────────

class NutritionData(BaseModel):
    food_name: str
    fdc_id: Optional[int] = None
    calories_per_100g: float = 0
    protein_g: float = 0
    carbs_g: float = 0
    fat_g: float = 0
    fiber_g: float = 0
    vitamins: Dict[str, float] = {}
    minerals: Dict[str, float] = {}
    ai_summary: Optional[str] = None


class FoodSearchResponse(BaseModel):
    query: str
    results: List[NutritionData]
    total: int


# ── Health Advisory ───────────────────────────────────────────────────────────

class HealthAdvisoryRequest(BaseModel):
    conditions: List[str]
    profile_id: Optional[int] = None


class HealthAdvisoryResponse(BaseModel):
    conditions: List[str]
    tips: List[str]
    foods_to_include: List[str]
    foods_to_avoid: List[str]
    warning_signs: List[str]
    general_advice: str


# ── Dashboard ─────────────────────────────────────────────────────────────────

class NutrientProgress(BaseModel):
    nutrient: str
    consumed: float
    goal: float
    unit: str
    percentage: float


class DailyDashboard(BaseModel):
    date: str
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    total_fiber_g: float
    meal_count: int
    nutrient_progress: List[NutrientProgress]
    meals: List[MealLogResponse]
    deficiencies: List[str]


class WeeklyDashboard(BaseModel):
    week_start: str
    week_end: str
    daily_data: List[Dict[str, Any]]
    weekly_averages: Dict[str, float]
    trend_data: List[Dict[str, Any]]


# ── AI Feedback ───────────────────────────────────────────────────────────────

class AIFeedback(BaseModel):
    score: int  # 0-100
    summary: str
    nutritional_gaps: List[str]
    suggestions: List[str]
    positive_aspects: List[str]
