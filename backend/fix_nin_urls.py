from app.db.session import SessionLocal
from app.models.user import User

def fix_nin_urls():
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.nin_url.like("%storage.example.com%")).all()
        print(f"Found {len(users)} users with placeholder NIN URLs.")
        
        # Using a public placeholder image for testing
        test_img = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop"
        
        for u in users:
            print(f"Updating URL for {u.email}...")
            u.nin_url = test_img
            
        db.commit()
        print("Update complete!")
    finally:
        db.close()

if __name__ == "__main__":
    fix_nin_urls()
