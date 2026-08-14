"""
Run AI analysis on all leads that are missing ai_score.
Run this script to backfill scores for existing leads.
"""
import asyncio
import sys
sys.path.insert(0, '.')

from app.config import settings
from app.services import lead_service, ai_service
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

async def backfill_ai_scores():
    if "mongodb+srv" in settings.MONGODB_URL:
        client = AsyncIOMotorClient(settings.MONGODB_URL, tlsCAFile=certifi.where())
    else:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    db = client['nexocube']
    
    # Find all leads without ai_score
    cursor = db.leads.find({"ai_score": {"$exists": False}})
    leads = await cursor.to_list(length=100)
    
    also_check = await db.leads.find({"ai_score": None}).to_list(length=100)
    leads = leads + also_check
    
    print(f"Found {len(leads)} leads missing AI scores")
    
    for lead_raw in leads:
        lead_raw["id"] = str(lead_raw.get("_id", ""))
        lead_id = lead_raw["id"]
        print(f"\nAnalyzing lead: {lead_raw.get('name')} ({lead_id[:8]}...)")
        
        try:
            analysis = await ai_service.analyze_lead(lead_raw)
            update = {
                "ai_score": analysis.score,
                "ai_category": analysis.category,
                "ai_priority": analysis.priority,
                "ai_summary": analysis.summary,
                "ai_requirements": analysis.requirements,
                "ai_recommendation": analysis.recommended_action,
                "ai_buying_intent": analysis.buying_intent,
            }
            await db.leads.update_one({"_id": lead_id}, {"$set": update})
            print(f"  OK Score: {analysis.score}/100 | {analysis.category} | {analysis.priority}")
        except Exception as e:
            print(f"  FAILED: {e}")
    
    print("\nDone!")
    client.close()

if __name__ == "__main__":
    asyncio.run(backfill_ai_scores())
