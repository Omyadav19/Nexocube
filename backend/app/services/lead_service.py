import uuid
from datetime import datetime, timezone
from typing import Optional, List, Tuple
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

logger = logging.getLogger(__name__)

def _serialize(obj: dict) -> dict:
    if obj is None:
        return None
    d = dict(obj)
    if "_id" in d:
        d["id"] = str(d.pop("_id"))
    return d

async def create_lead(db: AsyncIOMotorDatabase, lead_data: dict) -> dict:
    lead_id = str(uuid.uuid4())
    doc = {
        "_id": lead_id,
        **lead_data,
        "status": "new",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.leads.insert_one(doc)
    return await get_lead_by_id(db, lead_id)

async def get_lead_by_id(db: AsyncIOMotorDatabase, lead_id: str) -> Optional[dict]:
    doc = await db.leads.find_one({"_id": lead_id})
    return _serialize(doc) if doc else None

async def get_leads(
    db: AsyncIOMotorDatabase,
    skip: int = 0,
    limit: int = 20,
    search: str = None,
    status: str = None,
    category: str = None,
) -> Tuple[List[dict], int]:
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"service": {"$regex": search, "$options": "i"}},
        ]
        
    if status:
        query["status"] = status
        
    if category:
        query["ai_category"] = category

    total = await db.leads.count_documents(query)
    
    cursor = db.leads.find(query).sort("created_at", -1).skip(skip).limit(limit)
    leads = await cursor.to_list(length=limit)
    
    return [_serialize(l) for l in leads], total

async def update_lead(db: AsyncIOMotorDatabase, lead_id: str, update_data: dict) -> Optional[dict]:
    update_data["updated_at"] = datetime.now(timezone.utc)
    await db.leads.update_one({"_id": lead_id}, {"$set": update_data})
    return await get_lead_by_id(db, lead_id)

async def update_lead_ai_analysis(db: AsyncIOMotorDatabase, lead_id: str, analysis: dict) -> Optional[dict]:
    update = {
        "ai_score": analysis.get("score"),
        "ai_category": analysis.get("category"),
        "ai_priority": analysis.get("priority"),
        "ai_summary": analysis.get("summary"),
        "ai_requirements": analysis.get("requirements", []),
        "ai_pain_points": analysis.get("pain_points", []),
        "ai_recommendation": analysis.get("recommended_action"),
        "ai_buying_intent": analysis.get("buying_intent"),
    }
    return await update_lead(db, lead_id, update)

async def update_lead_requirements(db: AsyncIOMotorDatabase, lead_id: str, requirements: dict) -> Optional[dict]:
    return await update_lead(db, lead_id, {"requirements_data": requirements})
