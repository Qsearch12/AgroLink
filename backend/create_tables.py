import os
from sqlalchemy import create_engine
from app.db.session import Base
from dotenv import load_dotenv
import sys

# Add backend to sys.path
sys.path.append(os.getcwd())

load_dotenv()
db_url = os.getenv("DATABASE_URL")
print(f"Creating tables for: {db_url}")

try:
    engine = create_engine(db_url, connect_args={"connect_timeout": 30})
    from app.models.user import User
    from app.models.crop import Crop
    from app.models.message import BuyerRequest, Message
    
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
except Exception as e:
    print(f"Failed to create tables: {e}")
