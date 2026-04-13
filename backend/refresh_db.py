import os
import sys
from sqlalchemy import create_engine
from app.db.session import Base
from dotenv import load_dotenv

# Add backend to sys.path
sys.path.append(os.getcwd())

load_dotenv()
db_url = os.getenv("DATABASE_URL")
print(f"Refreshing tables for: {db_url}")

try:
    engine = create_engine(db_url, connect_args={"connect_timeout": 30})
    
    # Import all models to ensure they are registered with Base.metadata
    from app.models.user import User
    from app.models.crop import Crop
    from app.models.message import BuyerRequest, Message
    
    # Drop all tables
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Tables refreshed successfully!")
except Exception as e:
    print(f"Failed to refresh tables: {e}")
