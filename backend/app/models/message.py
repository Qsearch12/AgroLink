from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum, Float
import enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.hybrid import hybrid_property
from app.db.session import Base
from app.models.user import User
from app.models.crop import Crop

class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

class BuyerRequest(Base):
    __tablename__ = "buyer_requests"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    quantity = Column(Float, nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    message = Column(String) # Initial request message
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    buyer = relationship("User", foreign_keys=[buyer_id])
    crop = relationship("Crop")

    @hybrid_property
    def buyer_name(self):
        return self.buyer.full_name if self.buyer else "Unknown Buyer"

    @hybrid_property
    def crop_name(self):
        return self.crop.name if self.crop else "Unknown Crop"

    @hybrid_property
    def crop_price(self):
        return self.crop.price_per_unit if self.crop else 0.0

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    request_id = Column(Integer, ForeignKey("buyer_requests.id"), nullable=True)
    content = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    request = relationship("BuyerRequest", backref="messages")
