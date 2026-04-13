from fastapi import APIRouter
from app.api.v1 import auth, admin, crops, messages, ai, recommendations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(crops.router, prefix="/crops", tags=["crops"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
