import logging
from fastapi import APIRouter, Query
from agents.nutrition_knowledge_agent import get_food_with_summary
from schemas import FoodSearchResponse

router = APIRouter(prefix="/api/food", tags=["food"])
logger = logging.getLogger(__name__)


@router.get("/search", response_model=FoodSearchResponse)
async def search_food(query: str = Query(..., min_length=1, description="Food name to search")):
    """Search USDA FoodData Central for nutritional information."""
    logger.info(f"[Food] Searching for: {query}")
    results = await get_food_with_summary(query)
    return FoodSearchResponse(
        query=query,
        results=results,
        total=len(results),
    )
