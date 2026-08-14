from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum


class LeadStatus(str, Enum):
    new = "new"
    contacted = "contacted"
    qualified = "qualified"
    proposal = "proposal"
    won = "won"
    lost = "lost"


class LeadCategory(str, Enum):
    hot = "Hot"
    warm = "Warm"
    cold = "Cold"


class LeadPriority(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10, max_length=5000)
    budget: Optional[str] = Field(None, max_length=100)
    timeline: Optional[str] = Field(None, max_length=100)


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    status: Optional[LeadStatus] = None


class LeadResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    service: str
    description: str
    budget: Optional[str] = None
    timeline: Optional[str] = None
    ai_score: Optional[int] = None
    ai_category: Optional[str] = None
    ai_priority: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_requirements: Optional[List[str]] = None
    ai_pain_points: Optional[List[str]] = None
    ai_recommendation: Optional[str] = None
    status: str = "new"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class LeadListResponse(BaseModel):
    leads: List[LeadResponse]
    total: int
    page: int
    limit: int
