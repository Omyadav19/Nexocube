from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.routes import leads, proposals, analytics, automation, auth

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.database import connect_to_db, close_db_connection
    connect_to_db()
    await _ensure_admin_user()
    yield
    close_db_connection()


async def _ensure_admin_user():
    """Create default admin user if none exists."""
    from app.database import get_db
    from app.utils.auth import hash_password
    import uuid
    from datetime import datetime, timezone
    
    try:
        db = get_db()
        existing = await db.users.find_one({"email": settings.ADMIN_EMAIL})
        if not existing:
            new_user = {
                "_id": str(uuid.uuid4()),
                "email": settings.ADMIN_EMAIL,
                "password_hash": hash_password(settings.ADMIN_PASSWORD),
                "name": "Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc)
            }
            await db.users.insert_one(new_user)
            logger.info(f"Created default admin user: {settings.ADMIN_EMAIL}")
    except Exception as e:
        logger.warning(f"Could not create admin user: {e}")


app = FastAPI(
    title="ProposalAI API",
    description="""
# ProposalAI — AI Sales & Proposal Automation

A production-quality REST API for automating the sales and proposal process.

## Features
- **Lead Management**: Create, qualify, and track client inquiries
- **AI Analysis**: OpenAI-powered lead scoring and requirement extraction
- **Proposal Generation**: AI-generated project proposals with PDF export
- **Email Automation**: Send proposals via Resend API
- **Analytics**: Real-time dashboard metrics from MongoDB
- **Webhooks**: Accept leads from external systems (n8n, Zapier)

## Authentication
Most endpoints require JWT authentication. Use `/api/auth/login` to get a token.

## Demo Credentials
- Email: admin@proposalai.com
- Password: admin123
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(proposals.router)
app.include_router(analytics.router)
app.include_router(automation.router)


@app.get("/", tags=["Health"])
@app.get("/api", tags=["Health"])
async def root():
    return {
        "status": "healthy",
        "service": "ProposalAI API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "ProposalAI"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )
