from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.models.message import RequestStatus

class MessageBase(BaseModel):
    content: str
    receiver_id: int
    request_id: Optional[int] = None

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sender_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RequestCreate(BaseModel):
    crop_id: int
    quantity: float
    message: Optional[str] = None

class Request(BaseModel):
    id: int
    buyer_id: int
    buyer_name: Optional[str] = None
    crop_id: int
    crop_name: Optional[str] = None
    crop_price: Optional[float] = 0.0
    quantity: float
    message: Optional[str] = None
    status: RequestStatus
    created_at: datetime

    class Config:
        from_attributes = True

class Conversation(BaseModel):
    other_user_id: int
    other_user_name: str
    last_message: str
    last_message_time: datetime
    unread_count: int
    status: str # 'active'
    role: str # 'farmer' or 'buyer'
