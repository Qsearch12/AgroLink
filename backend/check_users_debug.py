from app.db.session import SessionLocal
from app.models.user import User, UserRole

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total users: {len(users)}")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}, Verified: {u.is_verified}, NIN: {u.nin_url}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
