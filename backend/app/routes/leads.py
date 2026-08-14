from fastapi import APIRouter, HTTPException, Query, Depends, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse, LeadListResponse
from app.services import lead_service, ai_service
from app.services.automation_service import log_automation_event
from app.utils.auth import get_current_user
from app.database import get_db
from typing import Optional
import logging

router = APIRouter(prefix="/api/leads", tags=["Leads"])
logger = logging.getLogger(__name__)


@router.post("", response_model=LeadResponse, status_code=201, summary="Create a new lead")
async def create_lead(
    lead: LeadCreate,
    background_tasks: BackgroundTasks,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Create a new lead from a client inquiry and trigger background AI automation."""
    from app.services.automation_service import run_full_automation_pipeline

    lead_dict = lead.model_dump()
    created = await lead_service.create_lead(db, lead_dict)

    await log_automation_event(
        db=db,
        lead_id=created["id"],
        event="lead_received",
        status="success",
        message=f"New lead received from {created['name']}",
    )

    background_tasks.add_task(run_full_automation_pipeline, created["id"])
    return created


@router.get("", response_model=LeadListResponse, summary="List all leads")
async def list_leads(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    skip = (page - 1) * limit
    leads, total = await lead_service.get_leads(
        db, skip=skip, limit=limit, search=search, status=status, category=category
    )
    return LeadListResponse(leads=leads, total=total, page=page, limit=limit)


@router.get("/status/{lead_id}", summary="Public tracking for clients")
async def track_lead_status(
    lead_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Public endpoint to get limited status tracking for a lead."""
    lead = await lead_service.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Tracking ID not found")

    return {
        "id": lead["id"],
        "name": lead["name"],
        "company": lead.get("company", "Your Company"),
        "service": lead["service"],
        "status": lead["status"],
        "created_at": lead["created_at"]
    }


@router.get("/{lead_id}", response_model=LeadResponse, summary="Get lead by ID")
async def get_lead(
    lead_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    lead = await lead_service.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.patch("/{lead_id}", response_model=LeadResponse, summary="Update lead")
async def update_lead(
    lead_id: str,
    update: LeadUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    existing = await lead_service.get_lead_by_id(db, lead_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    updated = await lead_service.update_lead(db, lead_id, update_dict)

    if update_dict.get("status"):
        await log_automation_event(
            db=db,
            lead_id=lead_id,
            event="status_updated",
            status="success",
            message=f"Lead status changed to {update_dict['status']}",
        )
    return updated


@router.delete("/{lead_id}", summary="Delete a lead")
async def delete_lead(
    lead_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Permanently delete a lead and its associated proposals and automation logs."""
    result = await db.leads.delete_one({"_id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")

    await db.proposals.delete_many({"lead_id": lead_id})
    await db.automation_logs.delete_many({"lead_id": lead_id})

    return {"success": True, "message": "Lead deleted successfully"}


@router.post("/{lead_id}/analyze", summary="AI Lead Analysis")
async def analyze_lead(
    lead_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Run AI analysis on a lead using OpenAI."""
    lead = await lead_service.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        analysis = await ai_service.analyze_lead(lead)
        analysis_dict = analysis.model_dump()
        updated = await lead_service.update_lead_ai_analysis(db, lead_id, analysis_dict)

        await log_automation_event(
            db=db,
            lead_id=lead_id,
            event="ai_analysis_completed",
            status="success",
            message=f"AI scored {analysis.score}/100 — {analysis.category}",
            metadata={"score": analysis.score, "category": analysis.category},
        )

        # Automatic qualification for Hot leads
        if analysis.score >= 80:
            updated = await lead_service.update_lead(db, lead_id, {"status": "qualified"})
            await log_automation_event(
                db=db,
                lead_id=lead_id,
                event="status_updated",
                status="success",
                message="Lead automatically qualified due to high AI score",
            )

        return {"success": True, "analysis": analysis_dict, "lead": updated}

    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"AI analysis failed for lead {lead_id}: {e}")
        await log_automation_event(
            db=db, lead_id=lead_id, event="ai_analysis_failed", status="error", message=str(e)
        )
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")


@router.post("/{lead_id}/requirements", summary="AI Requirement Extraction")
async def extract_requirements(
    lead_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Extract technical requirements using AI."""
    lead = await lead_service.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        requirements = await ai_service.analyze_requirements(lead)
        req_dict = requirements.model_dump()
        updated = await lead_service.update_lead_requirements(db, lead_id, req_dict)

        await log_automation_event(
            db=db,
            lead_id=lead_id,
            event="requirements_extracted",
            status="success",
            message=f"Extracted {len(req_dict.get('features', []))} features",
            metadata=req_dict,
        )
        return {"success": True, "requirements": req_dict, "lead": updated}

    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Requirement extraction failed: {e}")
        await log_automation_event(
            db=db, lead_id=lead_id, event="requirements_failed", status="error", message=str(e)
        )
        raise HTTPException(status_code=502, detail=f"Requirement extraction failed: {str(e)}")


@router.post("/{lead_id}/proposal", summary="Generate AI Proposal")
async def generate_proposal_for_lead(
    lead_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Generate a full project proposal using AI."""
    from app.services import proposal_service
    from app.services.pdf_service import generate_proposal_pdf
    import os

    lead = await lead_service.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        requirements = lead.get("requirements_data")
        proposal_result = await ai_service.generate_proposal(lead, requirements)
        proposal_dict = proposal_result.model_dump()

        pdf_bytes = generate_proposal_pdf(proposal_dict, lead)
        pdf_dir = getattr(settings, "PDF_DIR", "/tmp/generated_pdfs" if os.environ.get("VERCEL") else "generated_pdfs")
        try:
            os.makedirs(pdf_dir, exist_ok=True)
        except Exception:
            pdf_dir = "/tmp"
            os.makedirs(pdf_dir, exist_ok=True)

        pdf_filename = f"proposal_{lead_id}.pdf"
        try:
            with open(os.path.join(pdf_dir, pdf_filename), "wb") as f:
                f.write(pdf_bytes)
        except Exception as write_err:
            logger.warning(f"Could not write PDF to filesystem: {write_err}")

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

        await lead_service.update_lead(db, lead_id, {"status": "proposal"})

        await log_automation_event(
            db=db,
            lead_id=lead_id,
            event="proposal_generated",
            status="success",
            message=f"Proposal '{proposal_dict.get('title')}' generated",
            metadata={"proposal_id": saved_proposal["id"]},
        )
        return {"success": True, "proposal": saved_proposal, "pdf_generated": True}

    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Proposal generation failed: {e}")
        await log_automation_event(
            db=db, lead_id=lead_id, event="proposal_failed", status="error", message=str(e)
        )
        raise HTTPException(status_code=502, detail=f"Proposal generation failed: {str(e)}")
