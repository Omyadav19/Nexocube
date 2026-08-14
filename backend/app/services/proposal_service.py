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

async def create_proposal(db: AsyncIOMotorDatabase, lead_id: str, proposal_data: dict) -> dict:
    proposal_id = str(uuid.uuid4())
    doc = {
        "_id": proposal_id,
        "lead_id": lead_id,
        **proposal_data,
        "status": "draft",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.proposals.insert_one(doc)
    return await get_proposal_by_id(db, proposal_id)

async def get_proposal_by_id(db: AsyncIOMotorDatabase, proposal_id: str) -> Optional[dict]:
    doc = await db.proposals.find_one({"_id": proposal_id})
    return _serialize(doc) if doc else None

async def get_proposals(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 20) -> Tuple[List[dict], int]:
    total = await db.proposals.count_documents({})
    cursor = db.proposals.find().sort("created_at", -1).skip(skip).limit(limit)
    proposals = await cursor.to_list(length=limit)
    return [_serialize(p) for p in proposals], total

async def get_proposals_by_lead(db: AsyncIOMotorDatabase, lead_id: str) -> List[dict]:
    cursor = db.proposals.find({"lead_id": lead_id}).sort("created_at", -1)
    proposals = await cursor.to_list(length=100)
    return [_serialize(p) for p in proposals]

async def update_proposal(db: AsyncIOMotorDatabase, proposal_id: str, update_data: dict) -> Optional[dict]:
    update_data["updated_at"] = datetime.now(timezone.utc)
    await db.proposals.update_one({"_id": proposal_id}, {"$set": update_data})
    return await get_proposal_by_id(db, proposal_id)
