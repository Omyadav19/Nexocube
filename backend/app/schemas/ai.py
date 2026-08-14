from typing import Optional, List
from pydantic import BaseModel, Field


class AIAnalysisResult(BaseModel):
    score: int = Field(..., ge=0, le=100)
    category: str
    priority: str
    buying_intent: str
    summary: str
    requirements: List[str]
    pain_points: List[str]
    recommended_action: str


class AIRequirementsResult(BaseModel):
    project_type: str
    features: List[str]
    integrations: List[str]
    user_roles: List[str]
    complexity: str
    recommended_stack: List[str]


class AIProposalResult(BaseModel):
    title: str
    executive_summary: str
    scope: str
    features: List[str]
    user_roles: List[str]
    integrations: List[str]
    technology: List[str]
    phases: List[dict]
    timeline: str
    cost_calculation_scratchpad: Optional[str] = None
    budget_range: str
    estimated_cost: str
    deliverables: List[str]
    next_steps: List[str]
    disclaimer: str = "AI-generated preliminary estimate — requires human review."
