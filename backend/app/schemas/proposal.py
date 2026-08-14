from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class ProposalStatus(str, Enum):
    draft = "draft"
    sent = "sent"
    accepted = "accepted"
    rejected = "rejected"


class ProposalCreate(BaseModel):
    lead_id: str


class ProposalUpdate(BaseModel):
    status: Optional[ProposalStatus] = None


class ProposalResponse(BaseModel):
    id: str
    lead_id: str
    title: Optional[str] = None
    summary: Optional[str] = None
    scope: Optional[str] = None
    features: Optional[List[str]] = None
    technology: Optional[List[str]] = None
    timeline: Optional[str] = None
    budget: Optional[str] = None
    content: Optional[str] = None
    pdf_path: Optional[str] = None
    status: str = "draft"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProposalListResponse(BaseModel):
    proposals: List[ProposalResponse]
    total: int
    page: int
    limit: int
