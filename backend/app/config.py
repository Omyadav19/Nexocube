import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017/nexocube"
    DATABASE_NAME: str = "proposal_ai"  # kept for compatibility

    # AI API Keys
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # SMTP Email (Gmail)
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = ""

    # JWT
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440  # 24 hours

    # App
    FRONTEND_URL: str = "http://localhost:5173"
    N8N_WEBHOOK_URL: Optional[str] = None
    PDF_DIR: str = "/tmp/generated_pdfs" if os.environ.get("VERCEL") else "generated_pdfs"

    # Admin defaults
    ADMIN_EMAIL: str = "admin@proposalai.com"
    ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
