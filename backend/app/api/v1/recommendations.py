from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models.user import User, UserRole
from app.models.crop import Crop
from app.models.message import BuyerRequest
from app.schemas.recommendation import BuyerRecommendation, FarmerRecommendation

router = APIRouter()

@router.get("/buyer", response_model=List[BuyerRecommendation])
def get_buyer_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Recommend crops to buyers based on location and popularity.
    Score = (10 if location matches else 0) + number of requests for this crop
    """
    deps.check_role(current_user, [UserRole.BUYER])
    
    # Subquery for request counts per crop
    request_counts = db.query(
        BuyerRequest.crop_id,
        func.count(BuyerRequest.id).label("total_requests")
    ).group_by(BuyerRequest.crop_id).subquery()

    # Query crops with their request counts
    crops_query = db.query(
        Crop,
        func.coalesce(request_counts.c.total_requests, 0).label("req_count")
    ).outerjoin(request_counts, Crop.id == request_counts.c.crop_id).filter(Crop.is_sold == False)

    recommendations = []
    buyer_location = (current_user.address or "").lower()

    for crop, req_count in crops_query.all():
        score = 0
        # Location match (case-insensitive)
        if buyer_location and crop.location and buyer_location in crop.location.lower():
            score += 10
        elif buyer_location and crop.location and crop.location.lower() in buyer_location:
            score += 10
        
        # Popularity match
        score += req_count

        recommendations.append({
            "crop_id": crop.id,
            "crop_name": crop.name,
            "category": crop.category,
            "description": crop.description,
            "price": crop.price_per_unit,
            "unit": crop.unit,
            "quantity": crop.quantity_available,
            "location": crop.location,
            "farmer_name": crop.owner_name,
            "is_verified": crop.is_owner_verified,
            "score": float(score)
        })

    # Sort by score descending
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:10]  # Top 10

@router.get("/farmer", response_model=List[FarmerRecommendation])
def get_farmer_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Recommend buyers to farmers based on location and buyer activity.
    Score = (10 if location matches else 0) + 
            (5 if buyer has requested crops that this farmer grows) +
            number of requests made by this buyer
    """
    deps.check_role(current_user, [UserRole.FARMER])
    
    # Get names of crops this farmer grows
    farmer_crop_names = [c.name for c in db.query(Crop.name).filter(Crop.owner_id == current_user.id).distinct().all()]

    # Subquery for total requests per buyer
    buyer_activity = db.query(
        BuyerRequest.buyer_id,
        func.count(BuyerRequest.id).label("total_requests")
    ).group_by(BuyerRequest.buyer_id).subquery()

    # Get buyers who have requested crops this farmer grows
    similar_interest_buyers = []
    if farmer_crop_names:
        similar_interest_buyers = [r.buyer_id for r in db.query(BuyerRequest.buyer_id).join(Crop).filter(Crop.name.in_(farmer_crop_names)).distinct().all()]

    # Query all buyers with their activity
    buyers_query = db.query(
        User,
        func.coalesce(buyer_activity.c.total_requests, 0).label("req_count")
    ).outerjoin(buyer_activity, User.id == buyer_activity.c.buyer_id).filter(User.role == UserRole.BUYER)

    recommendations = []
    farmer_location = (current_user.address or "").lower()

    for buyer, req_count in buyers_query.all():
        score = 0
        # Location match
        buyer_loc = (buyer.address or "").lower()
        if farmer_location and buyer_loc and (farmer_location in buyer_loc or buyer_loc in farmer_location):
            score += 10
        
        # Similar crop interest match
        if buyer.id in similar_interest_buyers:
            score += 5

        # Activity score
        score += req_count

        recommendations.append({
            "buyer_id": buyer.id,
            "buyer_name": buyer.full_name,
            "location": buyer.address or "Unknown",
            "request_count": int(req_count),
            "score": float(score)
        })

    # Sort by score descending
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:10]
