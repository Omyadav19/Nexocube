from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta, timezone
from app.utils.auth import get_current_user
from app.database import get_db
import logging

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])
logger = logging.getLogger(__name__)

@router.get("", summary="Get real-time analytics")
async def get_analytics(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        # Total leads
        total_leads = await db.leads.count_documents({})
        hot_leads = await db.leads.count_documents({"ai_category": "Hot"})
        qualified_leads = await db.leads.count_documents({"status": {"$in": ["qualified", "sent", "won"]}})
        won_leads = await db.leads.count_documents({"status": "won"})

        # Total proposals
        total_proposals = await db.proposals.count_documents({})
        sent_proposals = await db.proposals.count_documents({"status": "sent"})

        # Quality distribution
        warm_leads = await db.leads.count_documents({"ai_category": "Warm"})
        cold_leads = await db.leads.count_documents({"ai_category": "Cold"})
        unscored = await db.leads.count_documents({"ai_category": None})

        # Leads over time (last 30 days) - using MongoDB aggregation
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        pipeline_time = [
            {"$match": {"created_at": {"$gte": thirty_days_ago}}},
            {"$project": {"date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}}}},
            {"$group": {"_id": "$date", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        leads_by_date = await db.leads.aggregate(pipeline_time).to_list(None)
        leads_over_time = [{"date": r["_id"], "count": r["count"]} for r in leads_by_date]

        # Leads by service
        pipeline_service = [
            {"$group": {"_id": "$service", "count": {"$sum": 1}}}
        ]
        leads_by_service_raw = await db.leads.aggregate(pipeline_service).to_list(None)
        leads_by_service = [{"name": r["_id"], "value": r["count"]} for r in leads_by_service_raw if r["_id"]]

        # Proposal status
        pipeline_proposal = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        proposal_status_raw = await db.proposals.aggregate(pipeline_proposal).to_list(None)
        proposal_status = [{"name": r["_id"], "value": r["count"]} for r in proposal_status_raw if r["_id"]]

        # Recent scores
        recent_leads = await db.leads.find({"ai_score": {"$ne": None}}).sort("created_at", -1).limit(5).to_list(None)
        recent_scores = [
            {
                "name": l.get("name"),
                "score": l.get("ai_score"),
                "date": l.get("created_at").isoformat() if l.get("created_at") else None
            }
            for l in recent_leads
        ]

        # Email success rate
        email_total = await db.automation_logs.count_documents({"event": {"$in": ["email_sent", "email_failed"]}})
        email_success = await db.automation_logs.count_documents({"event": "email_sent"})

        summary = {
            "total_leads": total_leads,
            "hot_leads": hot_leads,
            "qualified_leads": qualified_leads,
            "won_leads": won_leads,
            "total_proposals": total_proposals,
            "sent_proposals": sent_proposals,
            "conversion_rate": round((won_leads / total_leads * 100) if total_leads > 0 else 0, 1),
            "email_success_rate": round((email_success / email_total * 100) if email_total > 0 else 0, 1),
        }

        return {
            "summary": summary,
            "lead_quality": [
                {"name": "Hot", "value": hot_leads, "color": "#ef4444"},
                {"name": "Warm", "value": warm_leads, "color": "#f59e0b"},
                {"name": "Cold", "value": cold_leads, "color": "#94a3b8"},
                {"name": "Unscored", "value": unscored, "color": "#e2e8f0"},
            ],
            "leads_over_time": leads_over_time,
            "leads_by_service": leads_by_service,
            "proposal_status": proposal_status,
            "recent_scores": recent_scores,
        }

    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return {"summary": {}, "error": str(e)}
