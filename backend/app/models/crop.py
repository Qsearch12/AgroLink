from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.hybrid import hybrid_property
from app.db.session import Base
from app.models.user import User

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, index=True)
    description = Column(String)
    price_per_unit = Column(Float, nullable=False)
    unit = Column(String, nullable=False)  # kg, bag, crate, etc.
    quantity_available = Column(Float, nullable=False)
    location = Column(String, nullable=False)
    image_url = Column(String)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", backref="crops")

    @hybrid_property
    def owner_name(self):
        return self.owner.full_name if self.owner else "Unknown Farmer"

    @hybrid_property
    def is_owner_verified(self):
        return self.owner.is_verified if self.owner else False

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_sold = Column(Boolean, default=False)

class SavedCrop(Base):
    __tablename__ = "saved_crops"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="saved_crops_list")
    crop = relationship("Crop")
