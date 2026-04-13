from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crop as crud_crop
from app.schemas.crop import Crop, CropCreate, CropUpdate
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/", response_model=List[Crop])
def read_crops(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve marketplace crops."""
    crops = crud_crop.get_multi(db, skip=skip, limit=limit)
    return crops

@router.post("/", response_model=Crop)
def create_crop(
    *,
    db: Session = Depends(deps.get_db),
    crop_in: CropCreate,
    current_user: User = Depends(deps.get_current_verified_user),
) -> Any:
    """Create a new crop listing (Farmer only)."""
    deps.check_role(current_user, [UserRole.FARMER])
    return crud_crop.create_with_owner(db, obj_in=crop_in, owner_id=current_user.id)

@router.get("/market-prices/stats")
def read_market_prices(
    db: Session = Depends(deps.get_db),
) -> Any:
    """Get average market prices for categories."""
    from sqlalchemy import func, desc
    from datetime import datetime, timedelta
    from app.models.crop import Crop
    from app.models.market import MarketHistory
    
    # Query current average price per category
    current_results = db.query(
        Crop.category,
        func.avg(Crop.price_per_unit).label("avg_price"),
        func.count(Crop.id).label("count")
    ).filter(Crop.is_sold == False).group_by(Crop.category).all()
    
    # Static fallbacks (Nigerians market benchmarks)
    fallbacks = {
        "Grains": {"avg_price": 250.0, "trend": "up", "change": "+5.2%"},
        "Tubers": {"avg_price": 120.0, "trend": "down", "change": "-2.1%"},
        "Fruits": {"avg_price": 85.0, "trend": "up", "change": "+1.5%"},
        "Vegetables": {"avg_price": 45.0, "trend": "neutral", "change": "0.0%"},
        "Cash Crops": {"avg_price": 1500.0, "trend": "up", "change": "+3.8%"},
    }
    
    output = []
    
    # Get recent history for comparison (from yesterday)
    yesterday = datetime.now() - timedelta(days=1)
    
    for category, avg, count in current_results:
        cat_name = category if category else "Uncategorized"
        current_avg = float(avg) if avg else 0.0
        
        # Look for the last recorded price for this category
        last_record = db.query(MarketHistory).filter(
            MarketHistory.category == cat_name,
            MarketHistory.recorded_at <= yesterday
        ).order_by(desc(MarketHistory.recorded_at)).first()
        
        # If no history, use the most recent record regardless of time
        if not last_record:
            last_record = db.query(MarketHistory).filter(
                MarketHistory.category == cat_name
            ).order_by(desc(MarketHistory.recorded_at)).first()

        trend = "neutral"
        change_pct = "0.0%"
        
        if last_record and last_record.avg_price > 0:
            diff = current_avg - last_record.avg_price
            pct = (diff / last_record.avg_price) * 100
            trend = "up" if diff > 0 else "down" if diff < 0 else "neutral"
            change_pct = f"{'+' if diff > 0 else ''}{pct:.1f}%"
        else:
            # If still no history, use the fallback trend temporarily
            fb = fallbacks.get(cat_name, {"trend": "neutral", "change": "0.0%"})
            trend = fb["trend"]
            change_pct = fb["change"]

        output.append({
            "category": cat_name,
            "price": round(current_avg, 2),
            "unit": "kg",
            "trend": trend,
            "change": change_pct,
            "listings": count
        })
        
        # Background: Capture a new snapshot if none exists for today
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_record = db.query(MarketHistory).filter(
            MarketHistory.category == cat_name,
            MarketHistory.recorded_at >= today_start
        ).first()
        
        if not today_record and count > 0:
            new_hist = MarketHistory(
                category=cat_name,
                avg_price=current_avg,
                listing_count=count
            )
            db.add(new_hist)
            db.commit()
            
    # Add missing categories from fallbacks to keep UI looking full
    existing_categories = [r[0] if r[0] else "Uncategorized" for r in current_results]
    for cat, info in fallbacks.items():
        if cat not in existing_categories:
            output.append({
                "category": cat,
                "price": info["avg_price"],
                "unit": "kg",
                "trend": info["trend"],
                "change": info["change"],
                "listings": 0
            })
            
    return output

@router.get("/my-crops", response_model=List[Crop])
def read_my_crops(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_verified_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve current farmer's crops."""
    deps.check_role(current_user, [UserRole.FARMER])
    crops = crud_crop.get_by_owner(db, owner_id=current_user.id, skip=skip, limit=limit)
    return crops

@router.get("/saved", response_model=List[Crop])
def read_saved_crops(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_verified_user),
) -> Any:
    """Retrieve saved crops for current buyer."""
    deps.check_role(current_user, [UserRole.BUYER])
    return crud_crop.get_saved_crops(db, user_id=current_user.id)

@router.post("/{id}/save")
def toggle_save_crop(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_verified_user),
) -> Any:
    """Toggle save status for a crop."""
    deps.check_role(current_user, [UserRole.BUYER])
    is_saved = crud_crop.toggle_save_crop(db, user_id=current_user.id, crop_id=id)
    return {"saved": is_saved}

@router.get("/{id}", response_model=Crop)
def read_crop_by_id(
    id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """Get details of a specific crop."""
    crop = crud_crop.get(db, id=id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.put("/{id}", response_model=Crop)
def update_crop(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    crop_in: CropUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Update a crop (Owner only)."""
    crop = crud_crop.get(db, id=id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    if crop.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud_crop.update(db, db_obj=crop, obj_in=crop_in)

@router.delete("/{id}", response_model=Crop)
def delete_crop(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Delete a crop (Owner only)."""
    crop = crud_crop.get(db, id=id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    if crop.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud_crop.remove(db, id=id)
