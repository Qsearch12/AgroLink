from sqlalchemy import Boolean, Column, Integer, String, Enum
import enum
from app.db.session import Base

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    BUYER = "buyer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    phone_number = Column(String)
    address = Column(String)
    nin_url = Column(String) # URL to uploaded NIN card
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # Buyers must be verified
    is_superuser = Column(Boolean, default=False)
