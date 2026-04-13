from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import message as crud_message
from app.schemas.message import Message, MessageCreate, Request, RequestCreate, Conversation
from app.models.user import User, UserRole

router = APIRouter()

@router.post("/requests", response_model=Request)
def create_buyer_request(
    *,
    db: Session = Depends(deps.get_db),
    request_in: RequestCreate,
    current_user: User = Depends(deps.get_current_verified_user),
) -> Any:
    """Create a new buyer request (Buyer only)."""
    deps.check_role(current_user, [UserRole.BUYER])
    return crud_message.create_request(db, obj_in=request_in, buyer_id=current_user.id)

@router.get("/requests/farmer", response_model=List[Request])
def read_farmer_requests(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_verified_user),
) -> Any:
    """Retrieve requests sent to a farmer's crops."""
    deps.check_role(current_user, [UserRole.FARMER])
    return crud_message.get_requests_for_farmer(db, farmer_id=current_user.id)

@router.get("/requests/buyer", response_model=List[Request])
def read_buyer_requests(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_verified_user),
) -> Any:
    """Retrieve requests sent by a buyer."""
    deps.check_role(current_user, [UserRole.BUYER])
    return crud_message.get_requests_for_buyer(db, buyer_id=current_user.id)

@router.patch("/requests/{request_id}/status", response_model=Request)
def update_request_status(
    *,
    db: Session = Depends(deps.get_db),
    request_id: int,
    status: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Update a buyer request status (Farmer only)."""
    deps.check_role(current_user, [UserRole.FARMER])
    request = crud_message.get_request(db, request_id=request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Check if this farmer owns the crop associated with the request
    from app.models.crop import Crop
    crop = db.query(Crop).filter(Crop.id == request.crop_id).first()
    if not crop or crop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return crud_message.update_request_status(db, db_obj=request, status=status)

@router.post("/chat", response_model=Message)
def send_message(
    *,
    db: Session = Depends(deps.get_db),
    message_in: MessageCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Send a message to another user."""
    return crud_message.create_message(db, obj_in=message_in, sender_id=current_user.id)

@router.get("/chat/{other_user_id}", response_model=List[Message])
def get_chat_history(
    other_user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve chat history between current user and another user."""
    return crud_message.get_messages_for_conversation(db, user1_id=current_user.id, user2_id=other_user_id)

@router.get("/conversations", response_model=List[Conversation])
def get_conversations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve all conversations for the current user."""
    return crud_message.get_conversations(db, user_id=current_user.id)
