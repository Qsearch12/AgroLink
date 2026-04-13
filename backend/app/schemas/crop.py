from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class CropBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    price_per_unit: float
    unit: str
    quantity_available: float
    location: str
    image_url: Optional[str] = None

class CropCreate(CropBase):
    pass

class CropUpdate(CropBase):
    name: Optional[str] = None
    price_per_unit: Optional[float] = None
    unit: Optional[str] = None
    quantity_available: Optional[float] = None
    location: Optional[str] = None

class Crop(CropBase):
    id: int
    owner_id: int
    owner_name: Optional[str] = None
    is_owner_verified: bool = False
    created_at: datetime
    is_sold: bool

    class Config:
        from_attributes = True
