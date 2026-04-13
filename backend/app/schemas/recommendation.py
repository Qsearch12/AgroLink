from typing import List
from pydantic import BaseModel

class BuyerRecommendation(BaseModel):
    crop_id: int
    crop_name: str
    category: str | None = None
    description: str | None = None
    price: float
    unit: str
    quantity: float
    location: str
    farmer_name: str
    is_verified: bool
    score: float

class FarmerRecommendation(BaseModel):
    buyer_id: int
    buyer_name: str
    location: str
    request_count: int
    score: float
