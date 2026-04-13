from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.crop import Crop
from app.schemas.crop import CropCreate, CropUpdate

def get(db: Session, id: int) -> Optional[Crop]:
    return db.query(Crop).filter(Crop.id == id).first()

def get_multi(
    db: Session, *, skip: int = 0, limit: int = 100
) -> List[Crop]:
    return db.query(Crop).filter(Crop.is_sold == False).offset(skip).limit(limit).all()

def create_with_owner(
    db: Session, *, obj_in: CropCreate, owner_id: int
) -> Crop:
    db_obj = Crop(
        **obj_in.model_dump(),
        owner_id=owner_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_by_owner(
    db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
) -> List[Crop]:
    return db.query(Crop).filter(Crop.owner_id == owner_id).offset(skip).limit(limit).all()

def update(
    db: Session, *, db_obj: Crop, obj_in: CropUpdate
) -> Crop:
    obj_data = db_obj.__dict__
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in obj_data:
        if field in update_data:
            setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def remove(db: Session, *, id: int) -> Crop:
    obj = db.query(Crop).get(id)
    db.delete(obj)
    db.commit()
    return obj

# Saved Crops CRUD
from app.models.crop import SavedCrop

def toggle_save_crop(db: Session, *, user_id: int, crop_id: int) -> bool:
    """Save or unsave a crop. Returns True if saved, False if unsaved."""
    existing = db.query(SavedCrop).filter(
        SavedCrop.user_id == user_id,
        SavedCrop.crop_id == crop_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return False
    
    db_obj = SavedCrop(user_id=user_id, crop_id=crop_id)
    db.add(db_obj)
    db.commit()
    return True

def get_saved_crops(db: Session, *, user_id: int) -> List[Crop]:
    return db.query(Crop).join(SavedCrop).filter(SavedCrop.user_id == user_id).all()
