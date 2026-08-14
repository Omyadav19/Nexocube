import json
import logging
from typing import Optional
from app.config import settings
from app.schemas.ai import AIAnalysisResult, AIRequirementsResult, AIProposalResult

logger = logging.getLogger(__name__)

import asyncio
from groq import Groq

# Lazy client
_client = None

def _get_client():
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is not set. Please add it to backend/.env and restart the server."
            )
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client

async def _generate_content_with_retry(prompt: str, max_retries: int = 3):
    # We will use Groq's sync client inside asyncio, 
    # but for production you'd use AsyncGroq.
    # To keep it simple, we'll just run it synchronously in this async function.
    for attempt in range(max_retries):
        try:
            client = _get_client()
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
            )
            
            # Create a mock response object to match what the old code expected
            class MockResponse:
                def __init__(self, text):
                    self.text = text
                    
            return MockResponse(chat_completion.choices[0].message.content)
            
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                logger.warning(f"Groq API rate limit hit. Retrying in 30 seconds... (Attempt {attempt+1}/{max_retries})")
                await asyncio.sleep(30)
            else:
                raise



def _get_score_category(score: int) -> str:
    if score >= 80:
        return "Hot"
    elif score >= 50:
        return "Warm"
    else:
        return "Cold"


def _get_priority(score: int) -> str:
    if score >= 80:
        return "Very High"
    elif score >= 50:
        return "Medium"
    else:
        return "Low"


def _clean_json_response(content: str) -> str:
    content = content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    return content


async def analyze_lead(lead_data: dict) -> AIAnalysisResult:
    """Analyze lead quality and extract key insights using Gemini."""
    prompt = f"""You are an expert sales qualification AI for a software development company.

Analyze the following client inquiry and provide a structured JSON response.

Client Inquiry:
- Name: {lead_data.get('name', 'Unknown')}
- Company: {lead_data.get('company', 'Unknown')}
- Service Required: {lead_data.get('service', 'Unknown')}
- Description: {lead_data.get('description', '')}
- Budget: {lead_data.get('budget', 'Not specified')}
- Timeline: {lead_data.get('timeline', 'Not specified')}

Return a JSON object with this exact structure:
{{
  "score": <integer 0-100, based on clarity, budget fit, timeline realism, project complexity>,
  "category": "<Hot|Warm|Cold> (80-100=Hot, 50-79=Warm, 0-49=Cold)",
  "priority": "<Very High|Medium|Low>",
  "buying_intent": "<High|Medium|Low>",
  "summary": "<2-3 sentence assessment of this lead>",
  "requirements": ["<extracted requirement 1>", "<requirement 2>", ...],
  "pain_points": ["<pain point 1>", ...],
  "recommended_action": "<specific next step for sales team>"
}}

Scoring criteria (BE HIGHLY STRICT):
- Start at 0 points.
- Description clarity: 0 to 30 points (0 if vague/short, 15 if average, 30 if highly detailed)
- Budget fit: 0 to 30 points (0 if missing/low, 15 if medium, 30 if enterprise)
- Timeline realism: 0 to 20 points (0 if missing/unrealistic, 20 if well planned)
- Company identity: 0 to 10 points (0 if missing, 10 if provided)
- Service match: 0 to 10 points

CRITICAL ALIGNMENT INSTRUCTION:
Your "score", "category", and "priority" MUST mathematically align with absolute accuracy:
- If score is 80 to 100: category MUST be "Hot", priority MUST be "Very High".
- If score is 50 to 79: category MUST be "Warm", priority MUST be "Medium".
- If score is 0 to 49: category MUST be "Cold", priority MUST be "Low".
Do NOT just give 90 to every lead. Give 20-40 for basic/poor inquiries, 50-70 for average leads, and only 80-100 for perfect enterprise leads.

Return ONLY the JSON object, no additional text."""

    try:
        response = await _generate_content_with_retry(prompt)
        content = _clean_json_response(response.text)
        data = json.loads(content)
        
        # Override category and priority based on score for consistency
        score = int(data.get("score", 50))
        data["category"] = _get_score_category(score)
        data["priority"] = _get_priority(score)
        
        return AIAnalysisResult(**data)
    
    except Exception as e:
        logger.error(f"AI lead analysis failed: {e}")
        # Return a fallback analysis
        return AIAnalysisResult(
            score=50,
            category="Warm",
            priority="Medium",
            buying_intent="Medium",
            summary="AI analysis failed. Manual review required.",
            requirements=["Requirements extraction failed - please review manually"],
            pain_points=[],
            recommended_action="Review lead manually and schedule discovery call."
        )


async def analyze_requirements(lead_data: dict) -> AIRequirementsResult:
    """Extract detailed technical requirements from lead data."""
    prompt = f"""You are a senior software architect at a development agency.

Analyze this client inquiry and extract technical requirements.

Service: {lead_data.get('service', '')}
Description: {lead_data.get('description', '')}
Budget: {lead_data.get('budget', 'Not specified')}
Timeline: {lead_data.get('timeline', 'Not specified')}

Return a JSON object with this exact structure:
{{
  "project_type": "<specific project type>",
  "features": ["<feature 1>", "<feature 2>", ...],
  "integrations": ["<integration 1>", ...],
  "user_roles": ["<role 1>", "<role 2>", ...],
  "complexity": "<Low|Medium|Medium-High|High|Very High>",
  "recommended_stack": ["<technology 1>", "<technology 2>", ...]
}}

Be specific and technical. List all features mentioned or implied.
Return ONLY the JSON object."""

    try:
        response = await _generate_content_with_retry(prompt)
        content = _clean_json_response(response.text)
        data = json.loads(content)
        return AIRequirementsResult(**data)
    
    except Exception as e:
        logger.error(f"AI requirements analysis failed: {e}")
        raise


async def generate_proposal(lead_data: dict, requirements: Optional[dict] = None) -> AIProposalResult:
    """Generate a comprehensive project proposal using AI."""
    req_context = ""
    if requirements:
        req_context = f"""
Technical Requirements:
- Project Type: {requirements.get('project_type', '')}
- Features: {', '.join(requirements.get('features', []))}
- Integrations: {', '.join(requirements.get('integrations', []))}
- Complexity: {requirements.get('complexity', '')}
- Recommended Stack: {', '.join(requirements.get('recommended_stack', []))}
"""

    prompt = f"""You are a senior project manager at a software development company.

Create a detailed project proposal for this client inquiry.

Client: {lead_data.get('name', '')} from {lead_data.get('company', '')}
Service: {lead_data.get('service', '')}
Description: {lead_data.get('description', '')}
Budget: {lead_data.get('budget', 'Not specified')}
Timeline: {lead_data.get('timeline', 'Not specified')}
{req_context}

Return a JSON object with this exact structure:
{{
  "title": "<Professional project title>",
  "executive_summary": "<2-3 paragraph executive summary>",
  "scope": "<Detailed project scope description>",
  "features": ["<Feature 1 with brief description>", ...],
  "user_roles": ["<User Role 1>", ...],
  "integrations": ["<Integration 1>", ...],
  "technology": ["<Technology 1>", ...],
  "phases": [
    {{"phase": "Phase 1: Discovery & Planning", "duration": "1 week", "deliverables": ["Project roadmap", "Technical specifications"]}},
    {{"phase": "Phase 2: Design & Architecture", "duration": "1-2 weeks", "deliverables": ["UI/UX designs", "System architecture"]}},
    {{"phase": "Phase 3: Development", "duration": "4-6 weeks", "deliverables": ["Core features", "Backend APIs"]}},
    {{"phase": "Phase 4: Testing & QA", "duration": "1 week", "deliverables": ["Test reports", "Bug fixes"]}},
    {{"phase": "Phase 5: Deployment & Launch", "duration": "3-5 days", "deliverables": ["Live deployment", "Documentation"]}}
  ],
  "timeline": "<Total realistic timeline in weeks, e.g. 12 weeks>",
  "cost_calculation_scratchpad": "<Step-by-step math: 1. Convert weeks to months. 2. Multiply months by 400000. 3. Finalize exact number.>",
  "budget_range": "<Realistic budget range around the calculated cost in INR>",
  "estimated_cost": "<Final calculated cost, e.g. INR 12,00,000>",
  "deliverables": ["<Deliverable 1>", ...],
  "next_steps": ["<Step 1>", "<Step 2>", "<Step 3>"],
  "disclaimer": "AI-generated preliminary estimate — requires human review."
}}

CRITICAL COST INSTRUCTION: Do NOT guess the estimated_cost randomly. You MUST calculate it logically using the cost_calculation_scratchpad. 
Formula: 1 month of work = ~160 hours. At ₹2,500/hr, that is exactly ₹4,00,000 per month.
If your timeline is 12 weeks (3 months), the cost MUST be 3 * 400000 = ₹12,00,000. 
If 16 weeks (4 months), it MUST be 4 * 400000 = ₹16,00,000.
Write down the math step-by-step in the scratchpad, then output the final formatted currency in estimated_cost.

Make it professional, detailed and client-friendly.
Return ONLY the JSON object."""

    try:
        response = await _generate_content_with_retry(prompt)
        content = _clean_json_response(response.text)
        data = json.loads(content)
        return AIProposalResult(**data)
    
    except Exception as e:
        logger.error(f"AI proposal generation failed: {e}")
        raise
