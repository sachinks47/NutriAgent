from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, default="User")
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    fitness_goal = Column(String(50), nullable=True, default="general_health")
    health_conditions = Column(Text, nullable=True, default="[]")  # JSON array
    allergies = Column(Text, nullable=True, default="[]")  # JSON array
    cultural_preference = Column(String(50), nullable=True, default="no_preference")
    daily_calorie_goal = Column(Integer, nullable=True, default=2000)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    meal_logs = relationship("MealLog", back_populates="user", cascade="all, delete-orphan")
    diet_plans = relationship("DietPlan", back_populates="user", cascade="all, delete-orphan")


class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    meal_name = Column(String(200), nullable=False)
    meal_type = Column(String(20), nullable=False, default="snack")  # breakfast/lunch/dinner/snack
    food_items = Column(Text, nullable=True, default="[]")  # JSON array of food items
    quantity_description = Column(String(200), nullable=True)
    total_calories = Column(Float, nullable=True, default=0)
    total_protein_g = Column(Float, nullable=True, default=0)
    total_carbs_g = Column(Float, nullable=True, default=0)
    total_fat_g = Column(Float, nullable=True, default=0)
    total_fiber_g = Column(Float, nullable=True, default=0)
    vitamins = Column(Text, nullable=True, default="{}")  # JSON object
    minerals = Column(Text, nullable=True, default="{}")  # JSON object
    input_method = Column(String(20), nullable=True, default="text")  # text/image/voice
    ai_feedback = Column(Text, nullable=True)  # JSON feedback from AI
    notes = Column(Text, nullable=True)
    logged_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserProfile", back_populates="meal_logs")


class DietPlan(Base):
    __tablename__ = "diet_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    plan_name = Column(String(200), nullable=False)
    plan_data = Column(Text, nullable=False)  # JSON: 7-day meal plan
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserProfile", back_populates="diet_plans")
