import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import UserProfile
from schemas import HealthAdvisoryRequest, HealthAdvisoryResponse
from agents.health_advisory_agent import get_health_advisory

router = APIRouter(prefix="/api/health-advisory", tags=["health-advisory"])
logger = logging.getLogger(__name__)


@router.post("", response_model=HealthAdvisoryResponse)
async def health_advisory(request: HealthAdvisoryRequest, db: Session = Depends(get_db)):
    """Get personalized health advisory for specified conditions."""
    profile = db.query(UserProfile).first() if request.profile_id else None
    if not profile:
        profile = db.query(UserProfile).first()

    logger.info(f"[Advisory] Generating advisory for conditions: {request.conditions}")
    advisory = await get_health_advisory(request.conditions, profile)

    return HealthAdvisoryResponse(
        conditions=advisory.get("conditions", request.conditions),
        tips=advisory.get("tips", []),
        foods_to_include=advisory.get("foods_to_include", []),
        foods_to_avoid=advisory.get("foods_to_avoid", []),
        warning_signs=advisory.get("warning_signs", []),
        general_advice=advisory.get("general_advice", ""),
    )
