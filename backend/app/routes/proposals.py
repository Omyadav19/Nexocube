from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import FileResponse, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.services import proposal_service
from app.services.automation_service import log_automation_event, log_email_event
from app.services.email_service import send_proposal_email
from app.services.pdf_service import generate_proposal_pdf
from app.services import lead_service
from app.utils.auth import get_current_user
from app.database import get_db
from app.schemas.proposal import ProposalUpdate
import logging, os

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])
logger = logging.getLogger(__name__)


@router.get("", summary="List all proposals")
async def list_proposals(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    skip = (page - 1) * limit
    proposals, total = await proposal_service.get_proposals(db, skip=skip, limit=limit)
    return {"proposals": proposals, "total": total, "page": page, "limit": limit}


@router.get("/{proposal_id}", summary="Get proposal by ID")
async def get_proposal(
    proposal_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    proposal = await proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal


@router.get("/{proposal_id}/pdf", summary="Download proposal PDF")
async def download_pdf(
    proposal_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    proposal = await proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    pdf_path = proposal.get("pdf_path")
    pdf_dir = getattr(settings, "PDF_DIR", "/tmp/generated_pdfs" if os.environ.get("VERCEL") else "generated_pdfs")
    
    if pdf_path:
        for possible_dir in [pdf_dir, "/tmp", "generated_pdfs"]:
            full_path = os.path.join(possible_dir, pdf_path)
            if os.path.exists(full_path):
                return FileResponse(
                    full_path,
                    media_type="application/pdf",
                    filename=pdf_path,
                )

    # Regenerate PDF on the fly
    lead = await lead_service.get_lead_by_id(db, proposal["lead_id"])
    content = proposal.get("content") or {}
    pdf_bytes = generate_proposal_pdf(content, lead)
    return Response(content=pdf_bytes, media_type="application/pdf")


@router.post("/{proposal_id}/send", summary="Send proposal via email")
async def send_proposal(
    proposal_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    proposal = await proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    lead = await lead_service.get_lead_by_id(db, proposal["lead_id"])
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        content = proposal.get("content") or {}
        pdf_bytes = generate_proposal_pdf(content, lead)
        result = await send_proposal_email(
            to_email=lead.get("email"),
            to_name=lead.get("name"),
            company=lead.get("company", "Your Company"),
            proposal_title=proposal.get("title", "Project Proposal"),
            pdf_bytes=pdf_bytes,
            proposal_summary=proposal.get("summary", ""),
        )

        await proposal_service.update_proposal(db, proposal_id, {"status": "sent"})

        await log_email_event(
            db=db,
            lead_id=lead["id"],
            proposal_id=proposal_id,
            recipient=lead["email"],
            subject=f"Project Proposal: {proposal.get('title', 'Your Project')}",
            status="sent",
            provider_message_id=result.get("id"),
        )
        await log_automation_event(
            db=db,
            lead_id=lead["id"],
            event="email_sent",
            status="success",
            message=f"Proposal emailed to {lead['email']}",
        )
        return {"success": True, "message": "Proposal sent successfully", "email": lead["email"]}

    except Exception as e:
        logger.error(f"Email send failed: {e}")
        await log_automation_event(
            db=db,
            lead_id=lead["id"],
            event="email_failed",
            status="error",
            message=str(e),
        )
        raise HTTPException(status_code=502, detail=f"Email delivery failed: {str(e)}")


@router.patch("/{proposal_id}", summary="Update proposal")
async def update_proposal(
    proposal_id: str,
    update_data: ProposalUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    proposal = await proposal_service.get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_dict:
        return proposal
        
    updated = await proposal_service.update_proposal(db, proposal_id, update_dict)
    
    # If accepted, also mark the lead as won
    if update_dict.get("status") == "accepted":
        await lead_service.update_lead(db, proposal["lead_id"], {"status": "won"})
        await log_automation_event(
            db=db,
            lead_id=proposal["lead_id"],
            event="status_updated",
            status="success",
            message="Lead won because proposal was accepted",
        )
        
    return updated
