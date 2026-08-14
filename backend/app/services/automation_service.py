import uuid
from datetime import datetime, timezone
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

async def log_automation_event(
    db: AsyncIOMotorDatabase,
    lead_id: str,
    event: str,
    status: str = "success",
    message: str = "",
    metadata: dict = None,
) -> dict:
    log_id = str(uuid.uuid4())
    doc = {
        "_id": log_id,
        "lead_id": lead_id,
        "event": event,
        "status": status,
        "message": message,
        "metadata_": metadata or {},
        "created_at": datetime.now(timezone.utc),
    }
    await db.automation_logs.insert_one(doc)
    doc["id"] = doc.pop("_id")
    doc["metadata"] = doc.pop("metadata_")
    return doc

async def get_automation_logs(db: AsyncIOMotorDatabase, lead_id: str = None, limit: int = 100) -> list:
    query = {}
    if lead_id:
        query["lead_id"] = lead_id
        
    cursor = db.automation_logs.find(query).sort("created_at", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    
    formatted_logs = []
    for l in logs:
        l["id"] = str(l.pop("_id"))
        l["metadata"] = l.pop("metadata_", {})
        formatted_logs.append(l)
    return formatted_logs

async def log_email_event(
    db: AsyncIOMotorDatabase,
    lead_id: str,
    proposal_id: str,
    recipient: str,
    subject: str,
    status: str,
    provider_message_id: str = None,
) -> dict:
    log_id = str(uuid.uuid4())
    doc = {
        "_id": log_id,
        "lead_id": lead_id,
        "proposal_id": proposal_id,
        "recipient": recipient,
        "subject": subject,
        "status": status,
        "provider_message_id": provider_message_id,
        "sent_at": datetime.now(timezone.utc),
    }
    await db.email_logs.insert_one(doc)
    return {"id": log_id, "status": status}

async def run_full_automation_pipeline(lead_id: str):
    """Background task to run the entire AI pipeline automatically."""
    from app.database import get_db
    from app.services import lead_service, ai_service, proposal_service
    from app.services.pdf_service import generate_proposal_pdf
    import os
    
    try:
        db = get_db()
        # 1. Analyze Lead
        lead = await lead_service.get_lead_by_id(db, lead_id)
        if not lead:
            return
            
        analysis = await ai_service.analyze_lead(lead)
        analysis_dict = analysis.model_dump()
        updated_lead = await lead_service.update_lead_ai_analysis(db, lead_id, analysis_dict)
        
        await log_automation_event(
            db=db, lead_id=lead_id, event="ai_analysis_completed", 
            status="success", message=f"AI scored {analysis.score}/100 — {analysis.category}",
            metadata={"score": analysis.score, "category": analysis.category}
        )
        
        # 1.5 Handle Cold Leads (Score < 50)
        if analysis.score < 50:
            await lead_service.update_lead(db, lead_id, {"status": "rejected"})
            await log_automation_event(
                db=db, lead_id=lead_id, event="lead_rejected", 
                status="success", message="Lead score below 50. Pipeline halted."
            )
            return

        # 2. Extract Requirements
        reqs = await ai_service.analyze_requirements(updated_lead)
        req_dict = reqs.model_dump()
        updated_lead = await lead_service.update_lead_requirements(db, lead_id, req_dict)
        
        await log_automation_event(
            db=db, lead_id=lead_id, event="requirements_extracted", 
            status="success", message=f"Extracted {len(req_dict.get('features', []))} features"
        )
        
        # 3. Generate Proposal
        proposal_result = await ai_service.generate_proposal(updated_lead, req_dict)
        proposal_dict = proposal_result.model_dump()
        
        # Generate PDF
        pdf_bytes = generate_proposal_pdf(proposal_dict, updated_lead)
        pdf_dir = "generated_pdfs"
        os.makedirs(pdf_dir, exist_ok=True)
        pdf_filename = f"proposal_{lead_id}.pdf"
        with open(os.path.join(pdf_dir, pdf_filename), "wb") as f:
            f.write(pdf_bytes)
            
        # Save proposal
        saved_proposal = await proposal_service.create_proposal(db, lead_id, {
            "title": proposal_dict.get("title"),
            "summary": proposal_dict.get("executive_summary"),
            "scope": proposal_dict.get("scope"),
            "features": proposal_dict.get("features"),
            "technology": proposal_dict.get("technology"),
            "timeline": proposal_dict.get("timeline"),
            "budget": proposal_dict.get("budget_range"),
            "content": proposal_dict,
            "pdf_path": pdf_filename,
        })
        
        # 4. Handle Hot/Warm Leads
        if analysis.score >= 80:
            # Hot Lead: Automatically send proposal
            from app.services.email_service import send_proposal_email
            
            await lead_service.update_lead(db, lead_id, {"status": "sent"})
            await log_automation_event(
                db=db, lead_id=lead_id, event="proposal_generated", 
                status="success", message=f"Proposal '{proposal_dict.get('title')}' generated automatically",
                metadata={"proposal_id": saved_proposal["id"]}
            )
            
            email_result = await send_proposal_email(
                to_email=updated_lead.get("email"),
                to_name=updated_lead.get("name"),
                company=updated_lead.get("company", "Your Company"),
                proposal_title=proposal_dict.get("title", "Project Proposal"),
                pdf_bytes=pdf_bytes,
                proposal_summary=proposal_dict.get("executive_summary", "")
            )
            
            if email_result.get("success"):
                await log_automation_event(
                    db=db, lead_id=lead_id, event="proposal_sent", 
                    status="success", message="Hot lead! Proposal sent automatically."
                )
            else:
                await log_automation_event(
                    db=db, lead_id=lead_id, event="email_failed", 
                    status="error", message=f"Failed to auto-send: {email_result.get('error')}"
                )
        else:
            # Warm Lead: Stop and wait for manual review
            await lead_service.update_lead(db, lead_id, {"status": "proposal"})
            await log_automation_event(
                db=db, lead_id=lead_id, event="proposal_generated", 
                status="success", message=f"Proposal '{proposal_dict.get('title')}' generated and awaiting manual review",
                metadata={"proposal_id": saved_proposal["id"]}
            )
        
    except Exception as e:
        logger.error(f"Automatic pipeline failed for lead {lead_id}: {e}")
        # Need to try to get DB to log error if possible
        try:
            db = get_db()
            await log_automation_event(
                db=db, lead_id=lead_id, event="pipeline_failed", 
                status="error", message=f"Pipeline error: {str(e)}"
            )
        except Exception:
            pass
