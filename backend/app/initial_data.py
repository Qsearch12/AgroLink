from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine, Base
from app.crud import user as crud_user
from app.schemas.user import UserCreate
from app.models.user import UserRole, User
from app.models.crop import Crop, SavedCrop
from app.models.market import MarketHistory
from app.models.message import BuyerRequest, Message

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    user = crud_user.get_by_email(db, email="admin@agrolink.com")
    if not user:
        user_in = UserCreate(
            email="admin@agrolink.com",
            password="adminpassword",
            full_name="Initial Admin",
            role=UserRole.ADMIN,
        )
        user = crud_user.create(db, obj_in=user_in)
        user.is_superuser = True
        user.is_verified = True
        db.add(user)
        db.commit()

def main() -> None:
    db = SessionLocal()
    init_db(db)

if __name__ == "__main__":
    main()
