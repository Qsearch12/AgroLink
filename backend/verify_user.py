import os
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from dotenv import load_dotenv

# Add backend to sys.path
sys.path.append(os.getcwd())
load_dotenv()

def verify_user(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User with email {email} not found.")
            return
        
        user.is_verified = True
        db.add(user)
        db.commit()
        print(f"User {email} has been successfully verified!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_user.py <email>")
    else:
        verify_user(sys.argv[1])
