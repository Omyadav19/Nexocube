from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.services.automation_service import get_automation_logs
from app.utils.auth import get_current_user
from app.database import get_db
import logging

router = APIRouter(prefix="/api/automation", tags=["Automation"])
logger = logging.getLogger(__name__)


@router.get("/logs", summary="List automation logs")
async def list_automation_logs(
    lead_id: str = Query(None, description="Filter by lead ID"),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get chronological logs of all automation events (AI, emails, pipelines)."""
    logs = await get_automation_logs(db, lead_id=lead_id, limit=limit)
    return {"logs": logs}
