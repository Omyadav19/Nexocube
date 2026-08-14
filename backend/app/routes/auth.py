from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.utils.auth import verify_password, create_access_token, get_current_user
from app.database import get_db
import logging

router = APIRouter(prefix="/api/auth", tags=["Auth"])
logger = logging.getLogger(__name__)


from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", summary="Login to get access token")
async def login(
    request: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await db.users.find_one({"email": request.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    if not verify_password(request.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    token = create_access_token({"sub": user["email"], "role": user.get("role", "user")})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.get("_id")),
            "email": user["email"],
            "name": user.get("name"),
            "role": user.get("role")
        }
    }


@router.get("/me", summary="Get current user info")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
