from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.services.ai_service import ai_service
from pydantic import BaseModel

router = APIRouter()

class FarmDetails(BaseModel):
    soil_type: str
    location: str
    farm_size: float

@router.post("/recommend")
async def get_recommendation(
    *,
    details: FarmDetails,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """Get AI-powered crop recommendation."""
    recommendation = await ai_service.get_crop_recommendation(
        soil_type=details.soil_type,
        location=details.location,
        farm_size=details.farm_size
    )
    return recommendation
