import asyncio
import os
import random
import uuid
from datetime import datetime, timedelta, timezone
from app.config import settings
from app.utils.auth import hash_password
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

# --------------------------------------------------------------------------------
# DUMMY DATA SEED
# --------------------------------------------------------------------------------

LEADS_DATA = [
    {
        "name": "Arjun Patel",
        "email": "arjun@healthtech.in",
        "phone": "+91 98765 12345",
        "company": "HealthTech Solutions",
        "service": "Web Application",
        "description": "We need a telemedicine web application connecting rural patients with doctors. Needs video call integration, prescription generation, and payment gateway (Razorpay). Looking to launch in 3 months.",
        "budget": "₹5,00,000–₹10,00,000",
        "timeline": "3-6 months",
        "status": "won",
        "ai_score": 95,
        "ai_category": "Hot",
        "ai_priority": "High",
        "ai_summary": "High-value telemedicine project with clear requirements and healthy budget.",
        "ai_requirements": ["Video Call Integration", "Prescription Gen", "Razorpay Payment"],
        "ai_recommendation": "Fast-track technical discovery call.",
        "ai_buying_intent": "High"
    },
    {
        "name": "Priya Sharma",
        "email": "priya@urbanstyle.com",
        "company": "Urban Style",
        "service": "E-commerce Development",
        "description": "Looking to upgrade our current Shopify store to a custom Next.js/Node.js e-commerce platform to handle higher traffic and custom product configurators.",
        "budget": "₹2,50,000–₹5,00,000",
        "timeline": "1-2 months",
        "status": "proposal",
        "ai_score": 82,
        "ai_category": "Hot",
        "ai_priority": "High",
        "ai_summary": "Strong e-commerce replatforming project. Client knows the tech stack they want.",
        "ai_requirements": ["Next.js Frontend", "Node.js Backend", "Product Configurator"],
        "ai_recommendation": "Send proposal focusing on performance metrics.",
        "ai_buying_intent": "High"
    },
    {
        "name": "Vikram Singh",
        "email": "vikram@logisticsplus.co",
        "company": "Logistics Plus",
        "service": "Mobile App Development",
        "description": "Need a fleet tracking mobile app for Android and iOS. Must track driver location in real-time, handle delivery proofs, and integrate with our existing ERP.",
        "budget": "Above ₹10,00,000",
        "timeline": "Flexible",
        "status": "qualified",
        "ai_score": 88,
        "ai_category": "Hot",
        "ai_priority": "High",
        "ai_summary": "Enterprise mobile app with complex ERP integration requirements.",
        "ai_requirements": ["Cross-platform App", "Real-time GPS Tracking", "ERP Integration API"],
        "ai_recommendation": "Schedule technical architecture discussion.",
        "ai_buying_intent": "High"
    },
    {
        "name": "Neha Gupta",
        "email": "neha@eduspark.in",
        "company": "EduSpark",
        "service": "SaaS Development",
        "description": "We want to build a SaaS platform for independent tutors to manage their classes, collect fees, and host recorded video lectures. Needs secure AWS hosting.",
        "budget": "₹5,00,000–₹10,00,000",
        "timeline": "2-3 months",
        "status": "contacted",
        "ai_score": 75,
        "ai_category": "Warm",
        "ai_priority": "Medium",
        "ai_summary": "Solid SaaS idea but timeline might be tight for the budget.",
        "ai_requirements": ["SaaS Multi-tenancy", "Video Hosting (AWS)", "Subscription Billing"],
        "ai_recommendation": "Clarify phase 1 MVP scope vs future phases.",
        "ai_buying_intent": "Medium"
    },
    {
        "name": "Rohan Desai",
        "email": "rohan.d@gmail.com",
        "service": "Other",
        "description": "I have an idea for a social media app for pet owners. I just need a quick prototype to show investors. How much will it cost?",
        "budget": "Under ₹50,000",
        "timeline": "ASAP (1-2 weeks)",
        "status": "new",
        "ai_score": 35,
        "ai_category": "Cold",
        "ai_priority": "Low",
        "ai_summary": "Low budget prototype request with unrealistic timeline.",
        "ai_requirements": ["Rapid Prototype", "Basic UI/UX"],
        "ai_recommendation": "Send standard pricing sheet and politely decline.",
        "ai_buying_intent": "Low"
    },
    {
        "name": "Ananya Reddy",
        "email": "ananya@finserve.co.in",
        "company": "FinServe API",
        "service": "API Development",
        "description": "We need to expose our core banking services via RESTful APIs for third-party fintech partners. Security and rate limiting are top priorities.",
        "budget": "₹5,00,000–₹10,00,000",
        "timeline": "1 month",
        "status": "new",
        "ai_score": 85,
        "ai_category": "Hot",
        "ai_priority": "High",
        "ai_summary": "High-value enterprise API project requiring strong security expertise.",
        "ai_requirements": ["RESTful API Design", "OAuth2 Security", "Rate Limiting Middleware"],
        "ai_recommendation": "Assign senior backend lead to the first call.",
        "ai_buying_intent": "High"
    },
    {
        "name": "Karan Malhotra",
        "email": "karan@foodie.com",
        "service": "WordPress Development",
        "description": "Need a simple WordPress blog for my food reviewing business. Just standard templates, nothing fancy.",
        "budget": "Under ₹50,000",
        "timeline": "1 month",
        "status": "lost",
        "ai_score": 45,
        "ai_category": "Cold",
        "ai_priority": "Low",
        "ai_summary": "Basic CMS request, falls below ideal project threshold.",
        "ai_requirements": ["WordPress Setup", "Theme Installation"],
        "ai_recommendation": "Refer to partner freelancer.",
        "ai_buying_intent": "Medium"
    },
    {
        "name": "Shruti Iyer",
        "email": "shruti.iyer@cloud9.in",
        "company": "Cloud9 Spa",
        "service": "CRM Development",
        "description": "Looking for a custom CRM to manage our spa bookings, customer loyalty points, and automated WhatsApp reminders for appointments.",
        "budget": "₹1,00,000–₹2,50,000",
        "timeline": "2-3 months",
        "status": "proposal",
        "ai_score": 72,
        "ai_category": "Warm",
        "ai_priority": "Medium",
        "ai_summary": "Standard custom CRM with WhatsApp integration. Good mid-tier project.",
        "ai_requirements": ["Booking System", "Loyalty Engine", "WhatsApp API Integration"],
        "ai_recommendation": "Demo existing CRM starter template.",
        "ai_buying_intent": "Medium"
    }
]

async def seed_database():
    print("Starting database seed process (MongoDB)...")
    
    mongodb_url = getattr(settings, "MONGODB_URL", "mongodb://localhost:27017/nexocube")
    
    if "mongodb+srv" in mongodb_url:
        client = AsyncIOMotorClient(mongodb_url, tlsCAFile=certifi.where())
    else:
        client = AsyncIOMotorClient(mongodb_url)
        
    db_name = "nexocube"
    if "/" in mongodb_url.split("mongodb://")[-1]:
        db_name = mongodb_url.split("/")[-1].split("?")[0]
        
    db = client[db_name]

    print("Clearing existing data...")
    await db.automation_logs.delete_many({})
    await db.proposals.delete_many({})
    await db.leads.delete_many({})
    await db.users.delete_many({})

    print("Creating admin user...")
    admin = {
        "_id": str(uuid.uuid4()),
        "email": settings.ADMIN_EMAIL,
        "password_hash": hash_password(settings.ADMIN_PASSWORD),
        "name": "Admin",
        "role": "admin",
        "created_at": datetime.now(timezone.utc)
    }
    await db.users.insert_one(admin)

    print(f"Inserting {len(LEADS_DATA)} leads...")
    now = datetime.now(timezone.utc)
    
    for l_data in LEADS_DATA:
        days_ago = random.randint(1, 28)
        created_at = now - timedelta(days=days_ago)
        
        lead_id = str(uuid.uuid4())
        lead = {
            "_id": lead_id,
            "name": l_data["name"],
            "email": l_data["email"],
            "phone": l_data.get("phone"),
            "company": l_data.get("company"),
            "service": l_data["service"],
            "description": l_data["description"],
            "budget": l_data["budget"],
            "timeline": l_data["timeline"],
            "status": l_data["status"],
            "ai_score": l_data.get("ai_score"),
            "ai_category": l_data.get("ai_category"),
            "ai_priority": l_data.get("ai_priority"),
            "ai_summary": l_data.get("ai_summary"),
            "ai_requirements": l_data.get("ai_requirements"),
            "ai_recommendation": l_data.get("ai_recommendation"),
            "ai_buying_intent": l_data.get("ai_buying_intent"),
            "created_at": created_at,
            "updated_at": created_at
        }
        await db.leads.insert_one(lead)
        
        # Generate dummy logs
        log1 = {
            "_id": str(uuid.uuid4()),
            "lead_id": lead_id,
            "event": "lead_received",
            "message": f"New lead from {lead['name']}",
            "created_at": created_at,
            "status": "success"
        }
        await db.automation_logs.insert_one(log1)
        
        if lead.get("ai_score"):
            log2 = {
                "_id": str(uuid.uuid4()),
                "lead_id": lead_id,
                "event": "ai_analysis_completed",
                "message": f"AI scored {lead['ai_score']}/100 — {lead['ai_category']}",
                "metadata": {"score": lead["ai_score"]},
                "created_at": created_at + timedelta(minutes=1),
                "status": "success"
            }
            await db.automation_logs.insert_one(log2)
        
        # Create proposals for specific statuses
        if lead["status"] in ["proposal", "won", "lost"]:
            prop_id = str(uuid.uuid4())
            prop = {
                "_id": prop_id,
                "lead_id": lead_id,
                "title": f"{lead['service']} Proposal",
                "summary": f"Custom proposal for {lead.get('company') or lead['name']}",
                "budget": lead["budget"],
                "timeline": lead["timeline"],
                "features": lead.get("ai_requirements", []),
                "status": "sent" if lead["status"] in ["won", "lost"] else "draft",
                "created_at": created_at + timedelta(days=1),
                "updated_at": created_at + timedelta(days=1)
            }
            await db.proposals.insert_one(prop)
            
            if prop["status"] == "sent":
                log3 = {
                    "_id": str(uuid.uuid4()),
                    "lead_id": lead_id,
                    "event": "email_sent",
                    "message": f"Proposal emailed to {lead['email']}",
                    "created_at": created_at + timedelta(days=1, hours=2),
                    "status": "success"
                }
                await db.automation_logs.insert_one(log3)

    print("Seed complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
