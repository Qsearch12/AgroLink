from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User, UserRole
from app.schemas.user import User as UserSchema

router = APIRouter()

@router.get("/unverified-buyers", response_model=List[UserSchema])
def get_unverified_buyers(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    deps.check_role(current_user, [UserRole.ADMIN])
    buyers = db.query(User).filter(User.role == UserRole.BUYER, User.is_verified == False).all()
    return buyers

@router.post("/verify-buyer/{buyer_id}", response_model=UserSchema)
def verify_buyer(
    buyer_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    deps.check_role(current_user, [UserRole.ADMIN])
    buyer = db.query(User).filter(User.id == buyer_id, User.role == UserRole.BUYER).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    buyer.is_verified = True
    db.commit()
    db.refresh(buyer)
    return buyer

@router.get("/unverified-farmers", response_model=List[UserSchema])
def get_unverified_farmers(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    deps.check_role(current_user, [UserRole.ADMIN])
    farmers = db.query(User).filter(User.role == UserRole.FARMER, User.is_verified == False).all()
    return farmers

@router.post("/verify-farmer/{farmer_id}", response_model=UserSchema)
def verify_farmer(
    farmer_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    deps.check_role(current_user, [UserRole.ADMIN])
    farmer = db.query(User).filter(User.id == farmer_id, User.role == UserRole.FARMER).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    farmer.is_verified = True
    db.commit()
    db.refresh(farmer)
    return farmer

@router.get("/stats")
def get_platform_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get overall platform statistics (Admin only)."""
    deps.check_role(current_user, [UserRole.ADMIN])
    from app.models.crop import Crop
    from app.models.message import BuyerRequest
    
    total_users = db.query(User).count()
    total_farmers = db.query(User).filter(User.role == UserRole.FARMER).count()
    total_buyers = db.query(User).filter(User.role == UserRole.BUYER).count()
    total_crops = db.query(Crop).count()
    active_listings = db.query(Crop).filter(Crop.is_sold == False).count()
    total_requests = db.query(BuyerRequest).count()
    
    return {
        "users": total_users,
        "farmers": total_farmers,
        "buyers": total_buyers,
        "crops": total_crops,
        "active_listings": active_listings,
        "total_requests": total_requests
    }

@router.get("/recent-users", response_model=List[UserSchema])
def get_recent_users(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    limit: int = 5
) -> Any:
    """Get recent users (Admin only)."""
    deps.check_role(current_user, [UserRole.ADMIN])
    users = db.query(User).order_by(User.id.desc()).limit(limit).all()
    return users
