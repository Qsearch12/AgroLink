from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class MarketHistory(Base):
    __tablename__ = "market_history"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True, nullable=False)
    avg_price = Column(Float, nullable=False)
    listing_count = Column(Integer, default=0)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
