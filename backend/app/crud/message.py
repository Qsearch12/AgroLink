from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.message import BuyerRequest, Message, RequestStatus
from app.schemas.message import RequestCreate, MessageCreate

# Buyer Request CRUD
def create_request(db: Session, *, obj_in: RequestCreate, buyer_id: int) -> BuyerRequest:
    from app.models.crop import Crop
    from sqlalchemy.orm import joinedload
    db_obj = BuyerRequest(
        buyer_id=buyer_id,
        crop_id=obj_in.crop_id,
        quantity=obj_in.quantity,
        status=RequestStatus.PENDING,
        message=obj_in.message
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    # Create initial message if provided
    if obj_in.message:
        crop = db.query(Crop).filter(Crop.id == obj_in.crop_id).first()
        if crop:
            msg_obj = Message(
                sender_id=buyer_id,
                receiver_id=crop.owner_id,
                request_id=db_obj.id,
                content=obj_in.message
            )
            db.add(msg_obj)
            db.commit()
            
    return db.query(BuyerRequest).filter(BuyerRequest.id == db_obj.id).options(joinedload(BuyerRequest.buyer), joinedload(BuyerRequest.crop)).first()

def get_requests_for_farmer(db: Session, farmer_id: int) -> List[BuyerRequest]:
    from app.models.crop import Crop
    from sqlalchemy.orm import joinedload
    return db.query(BuyerRequest).join(Crop).filter(Crop.owner_id == farmer_id).options(joinedload(BuyerRequest.buyer), joinedload(BuyerRequest.crop)).all()

def get_requests_for_buyer(db: Session, buyer_id: int) -> List[BuyerRequest]:
    from sqlalchemy.orm import joinedload
    return db.query(BuyerRequest).filter(BuyerRequest.buyer_id == buyer_id).options(joinedload(BuyerRequest.buyer), joinedload(BuyerRequest.crop)).all()

def get_request(db: Session, request_id: int) -> Optional[BuyerRequest]:
    from sqlalchemy.orm import joinedload
    return db.query(BuyerRequest).filter(BuyerRequest.id == request_id).options(joinedload(BuyerRequest.buyer), joinedload(BuyerRequest.crop)).first()

def update_request_status(db: Session, db_obj: BuyerRequest, status: RequestStatus) -> BuyerRequest:
    from sqlalchemy.orm import joinedload
    db_obj.status = status
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db.query(BuyerRequest).filter(BuyerRequest.id == db_obj.id).options(joinedload(BuyerRequest.buyer), joinedload(BuyerRequest.crop)).first()

# Message CRUD
def create_message(db: Session, *, obj_in: MessageCreate, sender_id: int) -> Message:
    db_obj = Message(
        sender_id=sender_id,
        receiver_id=obj_in.receiver_id,
        request_id=obj_in.request_id,
        content=obj_in.content
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_messages_for_conversation(db: Session, user1_id: int, user2_id: int) -> List[Message]:
    # Mark messages as read when fetched
    unread = db.query(Message).filter(Message.sender_id == user2_id, Message.receiver_id == user1_id, Message.is_read == False).all()
    for m in unread:
        m.is_read = True
    if unread:
        db.commit()

    return db.query(Message).filter(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.created_at.asc()).all()

def get_conversations(db: Session, user_id: int) -> List[dict]:
    from app.models.user import User
    from sqlalchemy import desc
    
    # Get all unique contacts (senders or receivers)
    sent_to = db.query(Message.receiver_id).filter(Message.sender_id == user_id).distinct()
    received_from = db.query(Message.sender_id).filter(Message.receiver_id == user_id).distinct()
    
    contact_ids = set([r[0] for r in sent_to.all()] + [r[0] for r in received_from.all()])
    
    conversations = []
    for contact_id in contact_ids:
        contact = db.query(User).filter(User.id == contact_id).first()
        if not contact:
            continue
            
        last_msg = db.query(Message).filter(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == contact_id),
                and_(Message.sender_id == contact_id, Message.receiver_id == user_id)
            )
        ).order_by(desc(Message.created_at)).first()
        
        unread_count = db.query(Message).filter(
            Message.sender_id == contact_id,
            Message.receiver_id == user_id,
            Message.is_read == False
        ).count()
        
        conversations.append({
            "other_user_id": contact.id,
            "other_user_name": contact.full_name,
            "last_message": last_msg.content if last_msg else "",
            "last_message_time": last_msg.created_at if last_msg else contact.created_at,
            "unread_count": unread_count,
            "status": "active",
            "role": contact.role
        })
        
    # Sort by last message time
    conversations.sort(key=lambda x: x["last_message_time"], reverse=True)
    return conversations
